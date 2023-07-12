import { useContext, useState, useEffect } from 'react';
import { AppContext, Course, Player } from '../State';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonIcon,
	IonSelect, IonSelectOption, IonGrid, IonRow, IonCol, IonLoading, useIonModal, IonAlert } from '@ionic/react';
import { personAdd, personRemove, create } from 'ionicons/icons';
import './Page.css';
import { Game, GameType } from "../model/Game";
import SetPlayerModal from '../components/SetPlayerModal';

interface SetupData {
	courses: Course[];
	playerNames: string[];
}

const Setup: React.FC = () => {

  const { state, dispatch } = useContext(AppContext);

  // Local state to manage loading setup info.
  const [setupData, setSetupData] = useState<SetupData>( { courses: [ { name: '<Add course>', pairedWith: '', pars: [], hdcps: [] } ], playerNames: [ '<Add player>' ] } );
  const [showWaiting, setShowWaiting] = useState(false);
  const [status, setStatus] = useState('');
  
  // Track selected players index for edit/remove.  
  const [playerIdx, setPlayerIdx] = useState(0);
  
  // Local state to manage various alert pop-ups.
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [showPlayerLimit, setShowPlayerLimit] = useState(false);
  
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
	dispatch( { type: 'setPlayers', newval: state.players } );
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
	dispatch( { type: 'setPlayers', newval: state.players } );
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
	dispatch( { type: 'setPlayers', newval: state.players } );
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
          <IonLabel><h2>Course:</h2></IonLabel>
          <IonSelect placeholder="Select course" slot="end" interface="action-sheet" onIonChange={(e) => dispatch( {type: "setCourse", newval: e.detail.value} )}>
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
           <IonButton slot='end' onClick={() => { if (state.players.length < 5) { presentAddPlayer() } else { setShowPlayerLimit(true) } }}>
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
       </IonList>
       
        <IonList>
        <IonItem>
          <IonLabel><h2>Game 1:</h2></IonLabel>
          <IonSelect slot="end" placeholder={Game.Types[0].name} interface="action-sheet"
              onIonChange={(e) => dispatch( {type: "setGame1", newval: new Game( e.detail.value )} )}>
            { Game.Types.map( (game: GameType, idx: number) => (
            <IonSelectOption key={idx} value={idx}>{ game.name }</IonSelectOption>
            ) )}
          </IonSelect>
        </IonItem>
        <IonItem>
          <IonLabel><h2>Game 2:</h2></IonLabel>
          <IonSelect slot="end" placeholder={Game.Types[0].name} interface="action-sheet"
              onIonChange={(e) => dispatch( {type: "setGame2", newval: new Game( e.detail.value )} )}>
            { Game.Types.map( (game: GameType, idx: number) => (
            <IonSelectOption key={idx} value={idx}>{ game.name }</IonSelectOption>
            ) )}
          </IonSelect>
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
       <IonAlert isOpen={showPlayerLimit} onDidDismiss={() => setShowPlayerLimit(false)}
          header={'Player limit reached'} message={"Up to 5 players allowed."}
          buttons={[
            { text: 'OK', id: 'ok-button', handler: () => {} }
          ]}
       />
       
      </IonContent>
    </IonPage>
  );
};

export default Setup;
