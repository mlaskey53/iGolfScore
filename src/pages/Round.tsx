import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, useIonModal, IonButton,
  IonItem, IonGrid, IonRow, IonCol } from '@ionic/react';
import { useContext, useState } from 'react';
import { AppContext, Player } from '../State';
import SetScoresModal from '../components/SetScoresModal';
import './Page.css';

const Round: React.FC = () => {

  const title = "Round";
  
  const { state, dispatch } = useContext(AppContext);
  
  const [hole, setHole] = useState(1);
  
  const changeHole = (val: number) => {
	if ( val >= 1 && val <= 18) {
	  setHole( val );
	}
  };
  
  // Functions for player scores modal:
  const displaySetScores = () => {
	// Determine par for current hole, if players score is not already set, set it to par initially so it will be the default score.
	state.players.map( (plyr: Player) => {
		if ( plyr.score[hole - 1] === undefined ) { plyr.score[hole - 1] = state.course18.getPar(hole); }
	} );
	presentSetScores();
  }
  
  const handleSetScores = ( players: Player[] ) => {
//	dismissSetScores();
	for ( var i = 0;  i < state.games.length;  i++ ) {
		state.games[i].determinePoints( players, state.course18, hole );
	}
	dismissSetScores();
	changeHole( hole + 1 );
  }
  
  const handleScoresDismiss = () => {
	dismissSetScores();
  }
  
  const [presentSetScores, dismissSetScores] = useIonModal( SetScoresModal, {
    modalTitle: "Enter Player Scores",
    hole: hole,
    players: state.players,
    onDismiss: handleScoresDismiss,
    onSave: handleSetScores
  } )

  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{title}</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        <IonGrid>
          <IonRow>
		  <IonCol size='4'> <h3>{state.course18.getName(hole)}</h3> </IonCol>
          <IonCol> <h2>Hole: </h2> </IonCol>
          <IonCol><IonButton onClick={() => changeHole( hole - 1 )}>-</IonButton></IonCol>
          <IonCol> <h2>{ hole }</h2> </IonCol>
          <IonCol><IonButton onClick={() => changeHole( hole + 1 )}>+</IonButton></IonCol>
		  <IonCol>
            <IonButton onClick={() => { if ( hole <= 18 ) { displaySetScores() } }}>
               Score
            </IonButton>
          </IonCol>
          </IonRow>
        </IonGrid>
          
{/*       <IonList>
          { state.players.map( (plyr: Player, idx: number) => (
          <IonItem>
 	        <IonLabel slot="start" position="fixed"><h2>{plyr.name}: </h2></IonLabel>
 	        <IonLabel>{ plyr.score.toString() }</IonLabel>
          </IonItem>
          ) )}
        </IonList>
*/}
		<IonItem>
			<div dangerouslySetInnerHTML={{ __html: state.games[0].renderScoreCard( state.players, state.course18 )} }></div>
		</IonItem>
		        
      </IonContent>
    </IonPage>
  );
};

export default Round;

