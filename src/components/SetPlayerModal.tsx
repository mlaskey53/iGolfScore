import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
   IonContent, IonList, IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/react';
import { Player } from '../State';
import NumInput from '../components/NumInput';

export const SetPlayerModal: React.FC<{
  modalTitle: string;
  playerNames: [];
  player: Player;
  onDismiss: () => void;
  onSave: ( arg: Player ) => void;
}> = ({ modalTitle, playerNames, player, onDismiss, onSave }) => (

  <>
    <IonHeader>
       <IonToolbar color="primary">
          <IonTitle>{modalTitle}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => onDismiss()}>Close</IonButton>
          </IonButtons>
       </IonToolbar>
    </IonHeader>

    <IonContent>
      <IonList>
        <IonItem>
          <IonSelect placeholder={player.name} interface="action-sheet" onIonChange={(e) => { player.name = e.detail.value }}>
            { playerNames.map( (name:string, idx:number) => (
            <IonSelectOption key={idx} value={name}>{name}</IonSelectOption>
            ) )}
          </IonSelect>
        </IonItem>
        <IonItem>
          {/*<IonLabel>Hdcp: </IonLabel>*/}
          <NumInput name="Hdcp" init={player.hdcp} min={-5} max={30} 
              setValue={ (val: number) => { player.hdcp = val } }></NumInput>
        </IonItem>
      
      </IonList>
      <IonButton expand="block" onClick={() => onSave( player )}>Save</IonButton>
    </IonContent>
  </>
);

export default SetPlayerModal
