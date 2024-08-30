import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
   IonContent, IonList, IonItem } from '@ionic/react';
import { Player } from '../State';
import NumInput from '../components/NumInput';

export const SetScoresModal: React.FC<{
  modalTitle: string;
  hole: number;
  players: Player[];
  onClose: () => void;
  onSave: ( arg: Player[] ) => void;
}> = ({ modalTitle, hole, players, onClose, onSave }) => (

  <>
    <IonHeader>
       <IonToolbar color="primary">
          <IonTitle>{modalTitle + " for Hole " + hole}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => onClose()}>Close</IonButton>
          </IonButtons>
       </IonToolbar>
    </IonHeader>

    <IonContent>
      <IonList>
          { players.map( (plyr: Player, idx: number) => (
          <IonItem>
            <NumInput name={plyr.name} init={ plyr.score[hole - 1] } min={1} max={9}
              setValue={ (val: number) => { plyr.score[hole - 1] = val } }></NumInput>
            <NumInput name="Junk" init={ plyr.bonus } min={0} max={9}
              setValue={ (val: number) => { plyr.bonus = val } }></NumInput>
          </IonItem>
          ) )}
      
      </IonList>
      
      <IonButton expand="block" onClick={() => onSave( players )}>Save</IonButton>
      
    </IonContent>
  </>
);

export default SetScoresModal
