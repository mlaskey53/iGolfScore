import { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { AppContext, Course, Player } from '../State';
import { IonButtons, IonContent, IonHeader, IonFooter, IonMenuButton, IonPage, IonTitle, IonToolbar,
    IonList, IonItem, IonLabel, IonButton, IonIcon,
	IonSelect, IonSelectOption, IonGrid, IonRow, IonCol, IonLoading, useIonModal, IonAlert } from '@ionic/react';
import { personAdd, personRemove, create, golf } from 'ionicons/icons';
import './Page.css';
import { Game } from "../model/Game";
import { Course18 } from "../model/Course18";
import SetPlayerModal from '../components/SetPlayerModal';
import SetGameModal from '../components/SetGameModal';

interface SetupData {
	courses: Course[];
	playerNames: string[];
}

const Setup: React.FC = () => {

  const { state, dispatch } = useContext(AppContext);
  
  const history = useHistory();

  // Local state to manage loading setup info.
  const [setupData, setSetupData] = 
    useState<SetupData>( { courses: [ { name: '<Add course>', pairedWith: '', pars: [], hdcps: [] } ], playerNames: [ '<Add player>' ] } );
  const [showWaiting, setShowWaiting] = useState(false);
  const [status, setStatus] = useState('');
  
  // Track selected players index for edit/remove.  
  const [playerIdx, setPlayerIdx] = useState(0);
  
  // Local state to manage various alert pop-ups.
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [showPlayerLimit, setShowPlayerLimit] = useState(false);
  const [showGameLimit, setShowGameLimit] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  // Get saved course, player names from setup data file.
  // Note: this useEffect is run only once on load due to the empty dependency array specifie as the second argument.
  // eslint-disable-next-line
  useEffect(() => {
	fetch( './assets/json/setup.json' )
	  .then((response) => response.json())
	  .then((respJSON) => { 
		  setSetupData(respJSON); setShowWaiting(false);
		})
	  .catch((error) => { setStatus( 'Could not retrieve setup data: ' + error ); setShowWaiting(false); });
  }, []);

  // Set courses info into global state.
  // Need to do this via useEffect since the above fetch is asynchronous.  We make it dependent on setupData
  // which will be set after the fetch completes.  
  useEffect(() => {
    dispatch( { type: 'setCourses', newval: setupData.courses.slice(0) } );	
// eslint-disable-next-line
  }, [setupData]);

  // Set course (front9/back9) from user selection of front 9.
  const setCourse = ( courseId: number ) => {
	const back9 = setupData.courses.findIndex( (crs:Course) => crs.name === setupData.courses[courseId].pairedWith );
	dispatch( {type: "setCourse18", newval: new Course18( state.courses, courseId, back9 )} );
	console.log( "Front/Back: " + courseId + " / " + back9 );
    //console.log( "Setup courses: " + JSON.stringify( setupData.courses ) );
    //console.log( "State courses: " + JSON.stringify( state.courses ) );
  }
    
  // Functions for Add Player modal:
  const handleAddPlayer = ( player: Player ) => {
	// Update state with new player
	player.score = [];
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
    player: { name: 'Select name', hdcp: 0, bonus: 0 },
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

  const handleAddGame = ( game: Game ) => {
	dismissAddGame();
    state.games.push( game );
	dispatch( { type: "setGames", newval: state.games } );
  }
  
  const handleAddGameDismiss = () => {
	dismissAddGame();
  }
  
  const [presentAddGame, dismissAddGame] = useIonModal( SetGameModal, {
    modalTitle: "Add Game",
    players: state.players,
    onDismiss: handleAddGameDismiss,
    onSave: handleAddGame
  } )
  
  const resetSetup = () => {
	//dispatch( { type: "setCourse18", newval: new Course18( [], 0, 0 )} );
	dispatch( { type: 'setPlayers', newval: [] } );
	dispatch( { type: 'setGames', newval: [] } );  
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonMenuButton /></IonButtons>
          <IonTitle>Setup</IonTitle>
          <IonButtons slot="end"><IonButton onClick={() => setShowResetConfirm(true) }>Reset</IonButton></IonButtons>
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
          <IonSelect placeholder="Select course" slot="end" interface="action-sheet"
              onIonChange={(e) => setCourse( e.detail.value)}>
            { setupData.courses.map( (course:Course, idx:number) => (
            <IonSelectOption key={idx} value={idx}>{ course.name }</IonSelectOption>
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
          <IonLabel><h2>Games:</h2></IonLabel>
           <IonButton slot='end' onClick={() => { if (state.games.length < 3) { presentAddGame() } else { setShowGameLimit(true) } }}>
             <IonIcon icon={golf} />
           </IonButton>
        </IonItem>
        <IonItem>
          <IonGrid>
            { state.games.map( (game: Game, idx: number) => (
	        <IonRow>
	          <IonCol size="3"><IonLabel><h3>Game {idx + 1}:</h3></IonLabel></IonCol>
              <IonCol size="5"><IonLabel><h2>{game.getName()}    ({ game.getPlayerNames(state.players) })</h2></IonLabel></IonCol>
            </IonRow>
            ) )}
          </IonGrid>
        </IonItem>
        </IonList>
        
        <IonLabel>{status}</IonLabel>

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
       <IonAlert isOpen={showGameLimit} onDidDismiss={() => setShowGameLimit(false)}
          header={'Game limit reached'} message={"Up to 3 games allowed."}
          buttons={[
            { text: 'OK', id: 'ok-button', handler: () => {} }
          ]}
       />
       <IonAlert isOpen={showResetConfirm} onDidDismiss={() => setShowResetConfirm(false)}
          header={'Reset setup?'} message={"Resets entire player/game setup."}
          buttons={[
            { text: 'Cancel', role: 'cancel', cssClass: 'secondary', id: 'cancel-button', handler: () => {} },
            { text: 'OK', id: 'confirm-button', handler: () => { resetSetup(); } }
          ]}
       />
       
      </IonContent>
      
      <IonFooter>
        <IonToolbar>
          <IonButton shape="round" expand="block" onClick={() => history.push("Round") }>
            { ((state.players.length > 0) && (state.players[0].score.length > 0) ? "Continue" : "Start") + " Round" }
          </IonButton>
        </IonToolbar>
      </IonFooter>      
    </IonPage>
  );
};

export default Setup;
