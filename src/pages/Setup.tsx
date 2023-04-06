import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel,
	IonSelect, IonSelectOption, IonInput } from '@ionic/react';
import './Page.css';
import NumInput from '../components/NumInput';

const Setup: React.FC = () => {

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
          <IonLabel>
            <h2>Select Course:</h2>
          </IonLabel>
        </IonItem>
        <IonItem>
          <IonSelect placeholder="Course">
            <IonSelectOption value="ccc-bay">Countryside - BayHead</IonSelectOption>
            <IonSelectOption value="ccc-lake">Countryside - Lake</IonSelectOption>
            <IonSelectOption value="ccc-pine">Countryside - Pine</IonSelectOption>
          </IonSelect>
        </IonItem>
        </IonList>
        <IonList>
        <IonItem>
          <IonLabel>
            <h2>Select Players:</h2>
          </IonLabel>
        </IonItem>
        <IonItem>
          <IonSelect placeholder="Player 1">
            <IonSelectOption value="p1">Mike</IonSelectOption>
            <IonSelectOption value="p2">Larry</IonSelectOption>
            <IonSelectOption value="p3">Steve</IonSelectOption>
          </IonSelect>
          <IonLabel>Hdcp:</IonLabel>
          <NumInput name="hdcp1"></NumInput>
        </IonItem>
         <IonItem>
          <IonSelect placeholder="Player 2">
            <IonSelectOption value="p1">Mike</IonSelectOption>
            <IonSelectOption value="p2">Larry</IonSelectOption>
            <IonSelectOption value="p3">Steve</IonSelectOption>
          </IonSelect>
          <IonLabel>Hdcp:</IonLabel>
          <NumInput name="hdcp2"></NumInput>
        </IonItem>
       </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Setup;
