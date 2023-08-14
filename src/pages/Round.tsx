import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, useIonModal, IonButton,
  IonList, IonItem, IonLabel, IonGrid, IonRow, IonCol } from '@ionic/react';
import { useContext, useState } from 'react';
import { AppContext, Course, Player } from '../State';
import NumInput from '../components/NumInput';
import SetScoresModal from '../components/SetScoresModal';
import './Page.css';

const Round: React.FC = () => {

  const title = "Round";
  
  const { state, dispatch } = useContext(AppContext);
  
  const [hole, setHole] = useState(1);
  
  const handleHole = ( hle: number ) => {	
	setHole( hle );
  }

  // Functions for player scores modal:
  const handleSetScores = ( players: Player[] ) => {
	dismissSetScores();
	setHole( hole + 1 );
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
        
        <IonItem>
		  <IonLabel slot='start'> <h2>{state.course.name}</h2> </IonLabel>
          <IonLabel> <h2>Hole: </h2> </IonLabel>
          <NumInput name="hole" slot="end" init={1} min={1} max={18} setValue={ handleHole }></NumInput>
          <IonButton slot='end' onClick={() => { if ( hole <= 18 ) { presentSetScores() } }}>
             Score
          </IonButton>
        </IonItem>
          
        <IonList>
          { state.players.map( (plyr: Player, idx: number) => (
          <IonItem>
 	        <IonLabel slot="start" position="fixed"><h2>{plyr.name}: </h2></IonLabel>
 	        <IonLabel>{ plyr.score.toString() }</IonLabel>
          </IonItem>
          ) )}
        </IonList>
        
      </IonContent>
    </IonPage>
  );
};

export default Round;

