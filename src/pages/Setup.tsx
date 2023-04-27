import { useContext, useState, useEffect } from 'react';
import { AppContext, Course } from '../State';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel,
	IonSelect, IonSelectOption, IonLoading } from '@ionic/react';
import './Page.css';
import NumInput from '../components/NumInput';

interface SetupData {
	courses: Course[];
	playerNames: string[];
}

const Setup: React.FC = () => {

//  const [ storedData, setStoredData ] = useState<StoredData>( { courses: [], playerNames: [] } );
  const [setupData, setSetupData] = useState<SetupData>( { courses: [ { name: '<Add course>', pairedWith: '', pars: [], hdcps: [] } ], playerNames: [ '<Add player>' ] } );
  const [showWaiting, setShowWaiting] = useState(false);
  const [status, setStatus] = useState('');
  
//  const { state, dispatch } = useContext(AppContext);

  // Get saved course, player names from setup data file.
  useEffect(() => {
	fetch( './assets/json/setup.json' )
	  .then((response) => response.json())
	  .then((respJSON) => { setSetupData(respJSON); setShowWaiting(false); })
	  .catch((error) => { setStatus( 'Could not retrieve setup data: ' + error ); setShowWaiting(false); });
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Setup</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {/* IonHeader/IonToolbar needed here to set page title on IOS. */}
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Setup</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        <IonList>
        <IonItem>
          <IonLabel>
            <h2>Select Course:</h2>
          </IonLabel>
        </IonItem>
        <IonItem>
          <IonSelect placeholder="Course">
            { setupData.courses.map( (course:Course, idx:number) => (
            <IonSelectOption key={idx} value={course}>{ course.name }</IonSelectOption>
            ) )}
          </IonSelect>
        </IonItem>
        </IonList>
        <IonList>
        <IonItem>
          <IonLabel>
            <h2>Select Players:</h2>
          </IonLabel>
        </IonItem>
        <IonItem>
          <IonSelect placeholder="Player 1">
            { setupData.playerNames.map( (name:string, idx:number) => (
            <IonSelectOption value={name}>{ name }</IonSelectOption>
            ) )}
          </IonSelect>
          <IonLabel>Hdcp:</IonLabel>
          <NumInput name="hdcp1"></NumInput>
        </IonItem>
        <IonItem>
          <IonSelect placeholder="Player 2">
            { setupData.playerNames.map( (name:string, idx:number) => (
            <IonSelectOption value={name}>{ name }</IonSelectOption>
            ) )}
          </IonSelect>
          <IonLabel>Hdcp:</IonLabel>
          <NumInput name="hdcp2"></NumInput>
        </IonItem>
        <IonItem>
          <IonLabel>{status}</IonLabel>
        </IonItem>
       </IonList>
       
       <IonLoading isOpen={showWaiting} onDidDismiss={() => setShowWaiting(false)} message={'Processing...'} duration={5000} />
       
      </IonContent>
    </IonPage>
  );
};

export default Setup;
