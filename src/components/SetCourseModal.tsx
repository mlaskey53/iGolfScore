import { useState } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent,
   IonList, IonItem, IonInput, IonLabel, IonAlert } from '@ionic/react';
import { Course } from '../State';

export const SetCourseModal: React.FC<{
  modalTitle: string;
  course: Course;
  onDismiss: () => void;
  onSave: ( arg: Course ) => void;
}> = ({ modalTitle, course, onDismiss, onSave }) => {

  const [inpPars, setInpPars] = useState(course.pars.toString());
  const [inpHdcps, setInpHdcps] = useState(course.hdcps.toString());
  const [showError, setShowError] = useState(false);
  const [errorHdr, setErrorHdr] = useState("Input Error");
  const [errorMsg, setErrorMsg] = useState("");
  
  // Validate a string field.  Returns value or "", calls passed setter function.
  function validateString( value: string|null|undefined, setter: ( arg: string ) => void ) {
    var result = ( value === undefined || value === null ) ? "" : value;
    setter( result );
  }
  
  // Validate a number array field.  Returns true/false, calls passed setter function if true, sets error message if false.  
  function validateNumberArray( value: string|null|undefined, setter: ( arg: number[] ) => void ) {
    if ( value === undefined || value === null || value === "" ) {
      setErrorMsg( "Value required." );
      return false;
    }  
    var result = value.split(',');
    if ( result.length !== 9 ) {
      setErrorMsg( "Exactly 9 numbers required." );
      return false;
    } else {
      result.forEach( (val: any, idx: number) => {
        if ( typeof val !== 'number' ) {
          setErrorMsg( "Value(s) must be numbers." );
          return false;
        } else if ( val > 18 ) {
          setErrorMsg( "Value(s) too big." );
          return false;
        }
      } );
    }

    setter( result.map(Number) );  
    return true;
  }

  // Perform various validations on course data fields as set below.
  // Returns true/false.  If error, sets error header/message.
  function validate() {
    if ( course.name.length > 30 || course.pairedWith.length > 30 ) {
      setErrorHdr( "Course Name / Paired With field error" );
      setErrorMsg( "Please keep names less than 30 characters." );
      return false;
    } else if ( ! validateNumberArray( inpPars, (arg) => course.pars = arg ) ) {
      setErrorHdr( "Pars field error" );
      return false;
    } else if ( ! validateNumberArray( inpHdcps, (arg) => course.hdcps = arg ) ) {
      setErrorHdr( "Handicaps field error" );
      return false;
    }
    return true;
  }
  
  return(
  <>
    <IonHeader>
       <IonToolbar color="primary">
          <IonTitle>{modalTitle}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => onDismiss()}>Close</IonButton>
          </IonButtons>
       </IonToolbar>
    </IonHeader>

    <IonContent>
      <IonList>
        <IonItem>
          <IonLabel>
            Enter/Edit fields below for one 9-hole course.  (So that rounds can be started on back 9, or for 27-hole courses.)
            The "Paired With" name must match another "Course Name" field.
            Hole handicaps can be either relative to 9 or 18 holes.
          </IonLabel>
        </IonItem>
        <IonItem>
          <IonInput label="Add/Edit Course Name:" labelPlacement="stacked"
            onIonChange={(e) => validateString( e.detail.value, (arg) => course.name = arg ) }
            value={course.name}>
          </IonInput>
        </IonItem>
        <IonItem>
          <IonInput label="Add/Edit Course Paired With Name:" labelPlacement="stacked"
            onIonChange={(e) => validateString( e.detail.value, (arg) => course.pairedWith = arg ) }
            value={course.pairedWith}>
          </IonInput>
        </IonItem>
        <IonItem>
          <IonInput label="Add/Edit Course Pars (e.g., 4,4,5,3,4,5,4,3,4):" labelPlacement="stacked"
            onIonChange={(e) => validateString( e.detail.value, (arg) => setInpPars(arg) )}
            value={inpPars}>
          </IonInput>
        </IonItem>
        <IonItem>
          <IonInput label="Add/Edit Course Hole Handicaps:" labelPlacement="stacked"
            onIonChange={(e) => validateString( e.detail.value, (arg) => setInpHdcps(arg) )}
            value={inpHdcps}>
          </IonInput>
        </IonItem>
      
      </IonList>

      <IonAlert isOpen={showError} onDidDismiss={() => setShowError(false)}
         header={errorHdr} message={errorMsg}
         buttons={[  { text: 'OK', id: 'ok-button', handler: () => {} } ]}
      />

      <IonButton expand="block" onClick={() => validate() ? onSave(course) : setShowError(true)}>Save</IonButton>
    </IonContent>
  </>
  );
};

export default SetCourseModal
