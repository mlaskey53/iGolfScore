import { useContext, useState } from 'react';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar,
    IonList, IonItem, IonLabel, IonButton, IonIcon,	IonGrid, IonRow, IonCol, useIonModal, IonAlert } from '@ionic/react';
import { addCircle, removeCircle, create } from 'ionicons/icons';
import './Page.css';
import { AppContext, Course } from '../State';
import SetCourseModal from '../components/SetCourseModal';

const Configure: React.FC = () => {

  const { state, dispatch } = useContext(AppContext);
  
  // Track selected course index for edit/remove.  
  const [selectedCourse, setSelectedCourse] = useState(0);
  
  // Local state to manage various alert pop-ups.
  const [changedConfig, setChangedConfig] = useState(false);
  const [showEditPlayerNames, setShowEditPlayerNames] = useState(false);
//  const [playerNames, setPlayerNames] = useState<string>(state.playerNames.toString());
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Write setup data to local filesystem.  The data is written based on the platform:
  // Browser: Creates a 'file' in the IndexDB storage under localhost:8100/files.
  // Android/WebView: data/data/io.ionic.starter/files/setup.json
  const writeSetupFile = async () => {
    const setupData = { 'playerNames': state.playerNames, 'courses': state.courses };
    await Filesystem.writeFile( { path: 'setup.json', data: JSON.stringify( setupData ),
      directory: Directory.Data, encoding: Encoding.UTF8 } );
    console.log( "Wrote setup data to local file." );
    setChangedConfig(false);
  };

  // Validate and save entire configuration to local file.
  const handleSaveConfiguration = () => {
    // Ensure course 'pairedWith' names exist as 'name' value if non-blank.
    var arePaired = true;
    var coursesDefined = "";
    var orphans = "";
    state.courses.forEach( (course: Course, ids: number) => coursesDefined += (course.name + " ") );
    state.courses.forEach( (course: Course, ids: number) => {
      if ( course.pairedWith !== "" && coursesDefined.indexOf( course.pairedWith ) < 0 ) {
        arePaired = false;
        orphans += (course.pairedWith + " ");
      }
    } );
    if ( arePaired )
      writeSetupFile();
    else {
      setErrorMsg( "Course not defined for following 'Paired With' name(s): " + orphans );
      setShowError(true);
    }
  }
  
  const handleSavePlayerNames = ( namesStr: string ) => {
    var names = namesStr.split(',');
    if ( names.length > 0 ) {
      dispatch( { type: 'setPlayerNames', newval: names } );
      setChangedConfig(true);
    } else {
      setErrorMsg( "Please specify at least one Player name." );
      setShowError(true);
    }
  }

  const removeCourse = () => {
	state.courses.splice( selectedCourse, 1 );
	setSelectedCourse(0);
    setChangedConfig(true);
//	dispatch( { type: 'setCourses', newval: state.courses } );
  }

  const handleCourseChange = ( course: Course ) => {
	if ( selectedCourse >= state.courses.length )  dismissAddCourse(); else  dismissEditCourse();
    console.log( "Setting state.courses[" + selectedCourse + "] to: " + JSON.stringify( course ) );
    state.courses[selectedCourse] = course;
    setChangedConfig(true);
//    writeSetupFile();
//    console.log( "Setup data change written to file." );
  }
    
  const handleCourseDismiss = () => {
	// If user canceled adding a course, reset selectedCourse.
	if ( selectedCourse >= state.courses.length ) {
	  dismissAddCourse();
      setSelectedCourse(0);
    } else  dismissEditCourse();
  }
  
  const [presentAddCourse, dismissAddCourse] = useIonModal( SetCourseModal, {
    modalTitle: "Add Course",
    course: {name: "", pairedWith: "", pars: [], hdcps: [] },
    onDismiss: handleCourseDismiss,
    onSave: handleCourseChange
  } )
  
  const [presentEditCourse, dismissEditCourse] = useIonModal( SetCourseModal, {
    modalTitle: "Edit Course",
//    course: structuredClone(state.courses[selectedCourse]),  doesn't work on Android WebKit
//    course: JSON.parse( JSON.stringify(state.courses[selectedCourse]) ),
    course: { ...state.courses[selectedCourse] },
    onDismiss: handleCourseDismiss,
    onSave: handleCourseChange
  } )
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonMenuButton /></IonButtons>
          <IonTitle>Configure</IonTitle>
          <IonButtons slot="end">
            <IonButton disabled={! changedConfig} onClick={() => handleSaveConfiguration() }>Save</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {/* IonHeader/IonToolbar needed here to set page title on IOS. */}
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Configure</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        <IonList>
        <IonItem>
          <IonLabel><h2>Player Names:</h2></IonLabel>
          <IonButton slot='end' onClick={() => setShowEditPlayerNames(true) }>
            <IonIcon icon={create} />
          </IonButton>
        </IonItem>
        <IonItem>
          <IonLabel><h3>{state.playerNames.toString()}</h3></IonLabel>
        </IonItem>
        </IonList>
        
        <IonList>
        <IonItem>
           <IonLabel><h2>Courses:</h2></IonLabel>
           <IonButton slot='end' onClick={() => { setSelectedCourse(state.courses.length); presentAddCourse(); }}>
             <IonIcon icon={addCircle} />
           </IonButton>
        </IonItem>
        <IonItem>
          <IonGrid>
            { state.courses.map( (crs: Course, idx: number) => (
	        <IonRow>
	          <IonCol size="8"><IonLabel><h3>{crs.name} / {crs.pairedWith}</h3></IonLabel></IonCol>
              <IonCol><IonButton onClick={() => { setSelectedCourse(idx); presentEditCourse() }}><IonIcon icon={create} /></IonButton></IonCol>
              <IonCol><IonButton onClick={() => { setSelectedCourse(idx); setShowRemoveConfirm(true); }}><IonIcon icon={removeCircle} /></IonButton></IonCol>
            </IonRow>
            ) )}
          </IonGrid>
        </IonItem>
        </IonList>
       
       <IonAlert isOpen={showEditPlayerNames} onDidDismiss={() => setShowEditPlayerNames(false)}
         header={"Enter/Edit Player Names:"}
         buttons={[
           { text: 'Cancel', role: 'cancel', cssClass: 'secondary', id: 'cancel-button', handler: () => {} },
           { text: 'Done', id: 'confirm-button', handler: (data) => { handleSavePlayerNames(data.plyrnms); } }
         ]}
         inputs={[
           { name: "plyrnms", value: state.playerNames.toString() }
         ]}
       />
       
       <IonAlert isOpen={showError} onDidDismiss={() => setShowError(false)}
          header={"Input Error:"} message={errorMsg}
          buttons={[  { text: 'OK', id: 'ok-button', handler: () => {} } ]}
       />
       
       <IonAlert isOpen={showRemoveConfirm} onDidDismiss={() => setShowRemoveConfirm(false)}
          header={'Remove Course?'} message={"Remove course from saved configuration."}
          buttons={[
            { text: 'Cancel', role: 'cancel', cssClass: 'secondary', id: 'cancel-button', handler: () => {} },
            { text: 'OK', id: 'confirm-button', handler: () => { removeCourse(); } }
          ]}
       />
      </IonContent>
      
    </IonPage>
  );
};

export default Configure;
