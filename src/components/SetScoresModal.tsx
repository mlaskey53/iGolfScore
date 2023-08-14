import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
   IonContent, IonList, IonItem, IonLabel } from '@ionic/react';
import { Player } from '../State';
import NumInput from '../components/NumInput';

export const SetScoresModal: React.FC<{
  modalTitle: string;
  hole: number;
  players: Player[];
  onDismiss: () => void;
  onSave: ( arg: Player[] ) => void;
}> = ({ modalTitle, hole, players, onDismiss, onSave }) => (

  <>
    <IonHeader>
       <IonToolbar color="primary">
          <IonTitle>{modalTitle + " for Hole " + hole}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => onDismiss()}>Close</IonButton>
          </IonButtons>
       </IonToolbar>
    </IonHeader>

    <IonContent>
      <IonList>
          { players.map( (plyr: Player, idx: number) => (
          <IonItem>
 	        <IonLabel slot="start" position="fixed"><h2>{plyr.name}: </h2></IonLabel>
            <NumInput name="score" slot="start" init={ plyr.score[hole - 1] } min={1} max={9}
              setValue={ (val: number) => { plyr.score[hole - 1] = val } }></NumInput>
 	        <IonLabel slot="end"><h3>Bonus: </h3></IonLabel>
            <NumInput name="bonus" slot="end" init={ plyr.bonus } min={0} max={9}
              setValue={ (val: number) => { plyr.bonus = val } }></NumInput>
          </IonItem>
          ) )}
      
      </IonList>
      
      <IonButton expand="block" onClick={() => onSave( players )}>Save</IonButton>
      
    </IonContent>
  </>
);

export default SetScoresModal
