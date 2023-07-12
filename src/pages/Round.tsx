import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar,
  IonList, IonItem, IonLabel, IonGrid, IonRow, IonCol } from '@ionic/react';
import { useContext, useState } from 'react';
import { AppContext, Course, Player } from '../State';
import NumInput from '../components/NumInput';
import './Page.css';

const Round: React.FC = () => {

  const title = "Round";
  
  const { state, dispatch } = useContext(AppContext);
  
  const [hole, setHole] = useState(1);
  const [score, setScore] = useState(1);
  const [bonus, setBonus] = useState(0);
  
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
        
        <IonList>
          <IonItem>
    	    <IonLabel> <h2>{state.course.name}</h2> </IonLabel>
            <IonLabel slot="end"> <h2>Hole: </h2> </IonLabel>
            <NumInput name="hole" slot="end" init={1} min={1} max={18} setValue={ (val: number) => { setHole(val) }}></NumInput>
          </IonItem>
          { state.players.map( (item: Player, idx: number) => (
          <IonItem>
 	        <IonLabel slot="start" position="fixed"><h2>{item.name}: </h2></IonLabel>
            <NumInput name="score" slot="start" init={4} min={1} max={9} setValue={ setScore }></NumInput>
 	        <IonLabel slot="end"><h3>Bonus: </h3></IonLabel>
            <NumInput name="bonus" slot="end" init={item.bonus} min={0} max={9} setValue={ setBonus }></NumInput>
          </IonItem>
          ) )}
        </IonList>
        
      </IonContent>
    </IonPage>
  );
};

export default Round;

