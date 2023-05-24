import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar,
  IonList, IonItem, IonLabel, IonGrid, IonRow, IonCol } from '@ionic/react';
import { useContext, useState } from 'react';
import { AppContext, Course, Player } from '../State';
import './Page.css';

const Page: React.FC = () => {

  const title = "Game";
  
  const { state, dispatch } = useContext(AppContext);
  
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
            <IonLabel> <h2>Course:  {state.course.name}</h2> </IonLabel>
          </IonItem>
          <IonItem>
          <IonGrid>
            { state.players.map( (item: Player, idx: number) => (
	        <IonRow>
	          <IonCol size="3"><IonLabel><h3>Player {idx + 1}: {item.name}</h3></IonLabel></IonCol>
            </IonRow>
            ) )}
          </IonGrid>

          </IonItem>
        </IonList>
        
      </IonContent>
    </IonPage>
  );
};

export default Page;
