import { useContext, useState, useEffect } from 'react';
import { AppContext, Course, Player } from '../State';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonIcon,
	IonSelect, IonSelectOption, IonLoading, useIonModal } from '@ionic/react';
import { add } from 'ionicons/icons';
import './Page.css';
import SetPlayerModal from '../components/SetPlayerModal';

interface SetupData {
	courses: Course[];
	playerNames: string[];
}

const Setup: React.FC = () => {

  const { state, dispatch } = useContext(AppContext);

//  const [ storedData, setStoredData ] = useState<StoredData>( { courses: [], playerNames: [] } );
  const [setupData, setSetupData] = useState<SetupData>( { courses: [ { name: '<Add course>', pairedWith: '', pars: [], hdcps: [] } ], playerNames: [ '<Add player>' ] } );
  const [showWaiting, setShowWaiting] = useState(false);
  const [status, setStatus] = useState('');
  
  // Get saved course, player names from setup data file.
  useEffect(() => {
	fetch( './assets/json/setup.json' )
	  .then((response) => response.json())
	  .then((respJSON) => { setSetupData(respJSON); setShowWaiting(false); })
	  .catch((error) => { setStatus( 'Could not retrieve setup data: ' + error ); setShowWaiting(false); });
  }, []);
  
  // Functions for Add/Edit Player modal:
  const handleSavePlayer = ( player: Player ) => {
	// Update state with new/changed player
	state.players.push( player );
	dismissSetPlayer();
  }
  
  const handleSetPlayerDismiss = () => {
	dismissSetPlayer();
  }
  
  const [presentSetPlayer, dismissSetPlayer] = useIonModal( SetPlayerModal, {
    modalTitle: "Add Player",
    playerNames: setupData.playerNames,
    player: { name: '', hdcp: 0 },
    onDismiss: handleSetPlayerDismiss,
    onSave: handleSavePlayer
  } )

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
          <IonSelect placeholder="Course" interface="action-sheet" onIonChange={(e) => dispatch( {type: "setCourse", newval: e.detail.value} )}>
            { setupData.courses.map( (course:Course, idx:number) => (
            <IonSelectOption key={idx} value={course}>{ course.name }</IonSelectOption>
            ) )}
          </IonSelect>
        </IonItem>
        </IonList>
        
        <IonList>
        <IonItem>
           <IonLabel>
             <h2>Players:</h2>
           </IonLabel>
           <IonButton slot='end' onClick={() => { presentSetPlayer() }}>
             <IonIcon icon={add} />
           </IonButton>
        </IonItem>
        <IonItem>
          <IonList>
            { state.players.map( (item: Player, idx:number) => (
	        <IonItem>
              <IonLabel>Player {idx + 1}: {item.name}    (Hdcp = {item.hdcp})</IonLabel>
            </IonItem>
            ) )}
          </IonList>
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
