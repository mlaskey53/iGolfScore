import { useContext, useState, useEffect } from 'react';
import { AppContext, Course, Player } from '../State';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonIcon,
	IonSelect, IonSelectOption, IonGrid, IonRow, IonCol, IonLoading, useIonModal, IonAlert } from '@ionic/react';
import { personAdd, personRemove, create } from 'ionicons/icons';
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

  // Track selected players index for edit/remove.  
  const [playerIdx, setPlayerIdx] = useState(0);
  
  // Local state to show remove player confirmation alert.
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  
  // Get saved course, player names from setup data file.
  useEffect(() => {
	fetch( './assets/json/setup.json' )
	  .then((response) => response.json())
	  .then((respJSON) => { setSetupData(respJSON); setShowWaiting(false); })
	  .catch((error) => { setStatus( 'Could not retrieve setup data: ' + error ); setShowWaiting(false); });
  }, []);
  
  // Functions for Add Player modal:
  const handleAddPlayer = ( player: Player ) => {
	// Update state with new player
	state.players.push( player );
	dismissAddPlayer();
  }
  
  const handleAddPlayerDismiss = () => {
	dismissAddPlayer();
  }
  
  const [presentAddPlayer, dismissAddPlayer] = useIonModal( SetPlayerModal, {
    modalTitle: "Add Player",
    playerNames: setupData.playerNames,
    player: { name: 'Select name', hdcp: 0 },
    onDismiss: handleAddPlayerDismiss,
    onSave: handleAddPlayer
  } )

  // Functions for Edit Player modal:
  const handleEditPlayer = ( player: Player ) => {
	// Update state with changed player
	state.players[ playerIdx ] = player;
	dismissEditPlayer();
  }
  
  const handleEditPlayerDismiss = () => {
	dismissEditPlayer();
  }
  
  const [presentEditPlayer, dismissEditPlayer] = useIonModal( SetPlayerModal, {
    modalTitle: "Edit Player",
    playerNames: setupData.playerNames,
    player: state.players[ playerIdx ],
    onDismiss: handleEditPlayerDismiss,
    onSave: handleEditPlayer
  } )
  
  const removePlayer = () => {
	state.players.splice( playerIdx, 1 );
  }

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
           <IonButton slot='end' onClick={() => { presentAddPlayer() }}>
             <IonIcon icon={personAdd} />
           </IonButton>
        </IonItem>
        <IonItem>
          <IonGrid>
            { state.players.map( (item: Player, idx: number) => (
	        <IonRow>
	          <IonCol size="3"><IonLabel><h3>Player {idx + 1}:</h3></IonLabel></IonCol>
              <IonCol size="5"><IonLabel><h2>{item.name}    (Hdcp = {item.hdcp})</h2></IonLabel></IonCol>
              <IonCol><IonButton onClick={() => { setPlayerIdx(idx); presentEditPlayer() }}><IonIcon icon={create} /></IonButton></IonCol>
              <IonCol><IonButton onClick={() => { setPlayerIdx(idx); setShowRemoveConfirm(true); }}><IonIcon icon={personRemove} /></IonButton></IonCol>
            </IonRow>
            ) )}
          </IonGrid>
        </IonItem>
        <IonItem>
          <IonLabel>{status}</IonLabel>
        </IonItem>
       </IonList>
       
       <IonLoading isOpen={showWaiting} onDidDismiss={() => setShowWaiting(false)} message={'Processing...'} duration={5000} />
       
       <IonAlert isOpen={showRemoveConfirm} onDidDismiss={() => setShowRemoveConfirm(false)}
          header={'Remove Player?'} message={"Remove player from Game."}
          buttons={[
            { text: 'Cancel', role: 'cancel', cssClass: 'secondary', id: 'cancel-button', handler: () => {} },
            { text: 'OK', id: 'confirm-button', handler: () => { removePlayer(); } }
          ]}
       />
      </IonContent>
    </IonPage>
  );
};

export default Setup;
