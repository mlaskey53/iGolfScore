import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, useIonModal, IonButton,
  IonItem, IonGrid, IonRow, IonCol, IonLabel } from '@ionic/react';
import { useContext, useState } from 'react';
import { AppContext, Player } from '../State';
import SetScoresModal from '../components/SetScoresModal';
import './Page.css';

const Round: React.FC = () => {

  const title = "Round";
  
  const { state, dispatch } = useContext(AppContext);

  // Hole number being scored.  We use the length of the players.score array to determine the number of holes played.  
  const [hole, setHole] = useState(1);
  
  const changeHole = (val: number) => {
    // Only allow current hole to be incremented to the number of holes played + 1.
	if ( val >= 1 && val <= ( state.players[0].score.length + 1) ) {
	  setHole( val );
	}
  };
  
  // Functions for player scores modal:
  const displaySetScores = () => {
	// Determine par for current hole, if players score is not already set, set it to par initially so it will be the default score.
	state.players.forEach( (plyr: Player) => {
		//if ( plyr.score[hole - 1] === undefined ) { plyr.score[hole - 1] = state.course18.getPar(hole); }
		if ( plyr.score.length < hole )  plyr.score.push( state.course18.getPar(hole) );
	} );
	presentSetScores();
  }
  
  const handleSetScores = ( players: Player[] ) => {
	for ( var i = 0;  i < state.games.length;  i++ ) {
		state.games[i].determinePoints( players, state.course18, hole );
	}
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
    modalTitle: "Enter Player Scores",
    hole: hole,
    players: state.players,
    onClose: handleCloseScores,
    onSave: handleSetScores
  } )

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{state.course18.getName(hole)}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{title}</IonTitle>
          </IonToolbar>
        </IonHeader>

{ state.course18.isDefined() && (state.games.length > 0) && (state.players.length > 0) ? (        
        <>
        <IonGrid>
          <IonRow>
          <IonCol> <h3>Hole: </h3> </IonCol>
          <IonCol><IonButton onClick={() => changeHole( hole - 1 )}>-</IonButton></IonCol>
          <IonCol> <h3>{ hole }</h3> </IonCol>
          <IonCol><IonButton onClick={() => changeHole( hole + 1 )}>+</IonButton></IonCol>
		  <IonCol size="4">
            <IonButton onClick={() => { if ( hole <= 18 ) { displaySetScores() } }}>
               Score
            </IonButton>
          </IonCol>
          </IonRow>
        </IonGrid>
          
		<IonItem>
			<div dangerouslySetInnerHTML={{ __html: state.games[0].renderScoreCard( state.players, state.course18 )} }></div>
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

