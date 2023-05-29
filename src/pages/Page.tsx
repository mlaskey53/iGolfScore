import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonLabel } from '@ionic/react';
import { useParams } from 'react-router';
import './Page.css';

const Page: React.FC = () => {

  const { name } = useParams<{ name: string; }>();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonLabel><h1>Page Template</h1></IonLabel>
      </IonContent>
    </IonPage>
  );
};

export default Page;
