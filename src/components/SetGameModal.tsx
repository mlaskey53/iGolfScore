import { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
   IonContent, IonList, IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/react';
import { Player } from '../State';
import { Game, GameType } from '../model/Game';

export const SetGameModal = (
  { modalTitle, players, onDismiss, onSave } : {
    modalTitle: string;
    players: Player[];
    onDismiss: () => void;
    onSave: ( arg: Game ) => void;
  }) => {

  // Track selected game(s) and select players prompt.
  const [game, setGame] = useState<Game>( new Game() );
  const [playerPrompt, setPlayerPrompt] = useState( '' );
  const [showSelectPlayers, setShowSelectPlayers] = useState( false );
  
  return(
  <IonPage>
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
          <IonLabel><h2>Select Game Type:</h2></IonLabel>
          <IonSelect slot="end" placeholder={Game.Types[0].name} interface="action-sheet"
              onIonChange={(e) => { game.setGame( e.detail.value ); setGame( game ); 
                 setPlayerPrompt( game.getSelectPlayersPrompt( players ) ); setShowSelectPlayers( game.getShouldSelectPlayers() ) } } >
            { Game.Types.map( (gameTyp: GameType, idx: number) => (
            <IonSelectOption key={idx} value={idx}>{ gameTyp.name }</IonSelectOption>
            ) )}
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonLabel><h2>{ playerPrompt }</h2></IonLabel>
          <IonSelect placeholder="" multiple={true} disabled={ !showSelectPlayers } 
              onIonChange={(e) => { game.setPlayers( e.detail.value ) }}>
            { players.map( (player: Player, idx: number) => (
            <IonSelectOption key={idx} value={idx}>{player.name}</IonSelectOption>
            ) )}
          </IonSelect>
        </IonItem>
        
      </IonList>
      <IonButton expand="block" onClick={() => onSave( game )}>Save</IonButton>
    </IonContent>
  </IonPage>
  );
};

export default SetGameModal
