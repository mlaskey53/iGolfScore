import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, useIonModal, IonButton,
  IonItem, IonGrid, IonRow, IonCol, IonLabel, IonSelect, IonSelectOption } from '@ionic/react';
import { useContext, useState } from 'react';
import { AppContext, Player, Course } from '../State';
import SetScoresModal from '../components/SetScoresModal';
import { Game } from "../model/Game";
import './Page.css';

const Round: React.FC = () => {

  //const title = "Round";  Use course name as title instead.
// eslint-disable-next-line  
  const { state, dispatch } = useContext(AppContext);

  // Local state for hole number being scored.  We use the length of the players.score array to determine the number of holes played.  
  const [hole, setHole] = useState(1);
  
  const changeHole = (val: number) => {
    // Only allow current hole to be incremented to the number of holes played + 1 up to 18.
	if ( val >= 1 && val <= ( state.players[0].score.length + 1) && val <= 18 ) {
	  setHole( val );
	}
  };
  
  // Functions for player scores modal:
  const displaySetScores = () => {
    // Ensure local state hole number is still in sync with players.score - Setup could have been reset.
    if ( hole > state.players[0].score.length + 1 ) setHole( state.players[0].score.length + 1 );
    
	// Determine par for current hole, if players score is not already set, set it to par initially so it will be the default score.
	state.players.forEach( (plyr: Player) => {
		if ( plyr.score.length < hole )  plyr.score.push( state.course18.getPar(hole) );
	} );
	presentSetScores();
  }
  
  const handleSetScores = ( players: Player[] ) => {
	dismissSetScores();
	changeHole( hole + 1 );
  }
  
  const handleCloseScores = () => {
    // If modal closed without saving on unscored hole, remove the players scores set as defaults above.
    if ( hole === state.players[0].score.length ) {
      state.players.forEach( (plyr: Player) => { plyr.score.pop(); } );
    }
	dismissSetScores();
  }
  
  const [presentSetScores, dismissSetScores] = useIonModal( SetScoresModal, {
    modalTitle: "Enter Scores",
    hole: hole,
    players: state.players,
    onClose: handleCloseScores,
    onSave: handleSetScores
  } );
  
  // Local state for tracking the game to be displayed via the selection drop-down.
  const [gameDisplay, setGameDisplay] = useState(0);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{state.course18.getName(hole)}</IonTitle>
{ hole === 10 ? (          
          <IonButtons slot="end">
            <IonSelect aria-label="Change" placeholder="Change" interface="popover"
                onIonChange={(e) => state.course18.setBack9( e.detail.value )}>
              { state.courses.map( (course:Course, idx:number) => (
              <IonSelectOption key={idx} value={idx}>{ course.name }</IonSelectOption>
              ) )}
            </IonSelect>
          </IonButtons>
) : (
          <></>
) }                    
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle>{state.course18.getName(hole)}</IonTitle>
          </IonToolbar>
        </IonHeader>

{ state.course18.isDefined() && (state.games.length > 0) && (state.players.length > 0) ? (        
        <>
        <IonGrid>
          <IonRow>
          <IonCol> <h3>Hole: </h3> </IonCol>
          <IonCol><IonButton onClick={() => changeHole( hole - 1 )}>-</IonButton></IonCol>
          <IonCol> <h3>{ (hole > state.players[0].score.length + 1) ? state.players[0].score.length + 1 : hole }</h3> </IonCol>
          <IonCol><IonButton onClick={() => changeHole( hole + 1 )}>+</IonButton></IonCol>
		  <IonCol size="4">
            <IonButton onClick={() => { if ( hole <= 18 ) { displaySetScores() } }}>
               Score
            </IonButton>
          </IonCol>
          </IonRow>
        </IonGrid>
          
        <IonItem>
        { (state.games.length === 1) ? (
          <IonLabel>{state.games[0].getName()}</IonLabel>        
        ) : (
          <IonSelect aria-label={state.games[gameDisplay].getName()} interface="popover"
              placeholder={state.games[0].getName()}
              onIonChange={(e) => setGameDisplay( e.detail.value ) }>
            { state.games.map( (game:Game, idx:number) => (
            <IonSelectOption key={idx} value={idx}>{game.getName()}</IonSelectOption>
            ) )}
          </IonSelect>
        ) }
        </IonItem>
		<IonItem>
			<div dangerouslySetInnerHTML={{ __html: state.games[gameDisplay].renderScoreCard( state.players, state.course18 )} }></div>
		</IonItem>
		</>
) : (
		<>
		<IonItem>
			<IonLabel color="danger"><h2>Please complete game setup!</h2></IonLabel>
		</IonItem>
		<IonItem>
			<IonLabel>Select:</IonLabel>
			{ state.course18.isDefined() ? ("") : (
				<IonLabel>Course</IonLabel> )}
			{ state.players.length > 0 ? ("") : (
				<IonLabel>Players</IonLabel> )}
			{ state.games.length > 0 ? ("") : (
				<IonLabel>Game(s)</IonLabel> )}
		</IonItem>
		</>
) }
      </IonContent>
    </IonPage>
  );
};

export default Round;

