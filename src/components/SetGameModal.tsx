import { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
   IonContent, IonList, IonItem, IonSelect, IonSelectOption, IonAlert } from '@ionic/react';
import { Player } from '../State';
import { Game, GameType } from '../model/Game';

export const SetGameModal = (
  { modalTitle, players, onDismiss, onSave } : {
    modalTitle: string;
    players: Player[];
    onDismiss: () => void;
    onSave: ( arg: Game ) => void;
  }) => {

  // Track selected game and select players alert, prompt.
  const [game, setGame] = useState<Game>( new Game() );
  const [playerPrompt, setPlayerPrompt] = useState( '' );
  const [showSelectPlayers, setShowSelectPlayers] = useState(false);
  
  // Track team selection alert and selection.
  const [teamSelection, setTeamSelection] = useState<number[]>([]);
  const [showTeamSelect, setShowTeamSelect] = useState(false);

  function checkGame( game: Game ) {
	// See if we should select all players (i.e., if players.length = game.playersReqd)
	if ( game.getPlayers.length === 0 && players.length === game.getPlayersReqd() ) {
		game.setPlayers( Array.from({ length: players.length }, (val, idx) => idx) );
	}
	if ( game.getPlayers().length !== game.getPlayersReqd() ) {
	  setShowSelectPlayers(true);
	} else if ( game.shouldSelectTeams() ) {
      setShowTeamSelect(true);
	} else {
//	  console.log( "Game not added! all=" + players.length + ", game=" + game.getPlayers() + ", reqd=" + game.getPlayersReqd() ); 
      onSave( game );
    }
  }
  
  function handleTeamSelect( game: Game, team: number[], playerID: number, checked?: boolean ) {
    if ( checked ) {
      team.push(playerID);
      setTeamSelection( team );
      if ( team.length === 2 ) {
        setShowTeamSelect(false);
        game.setTeams( players, team );
        onSave( game );
      }
    } else {
      if ( team.length > 0 )  team.pop();
      setTeamSelection( team );
    }
  }
  
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
          {/*<IonLabel><h2>Select Game Type:</h2></IonLabel>*/}
          <IonSelect label="Select Game:" placeholder={Game.Types[0].name} interface="action-sheet"
              onIonChange={(e) => { game.setGame( e.detail.value ); setGame( game ); 
                 setPlayerPrompt( game.getSelectPlayersPrompt( players ) ); setShowSelectPlayers( game.shouldSelectPlayers() ) } } >
            { Game.Types.map( (gameTyp: GameType, idx: number) => (
            <IonSelectOption key={idx} value={idx}>{ gameTyp.name }</IonSelectOption>
            ) )}
          </IonSelect>
        </IonItem>
        <IonItem>
          {/*<IonLabel><h2>{ playerPrompt }</h2></IonLabel>*/}
          <IonSelect label={playerPrompt} multiple={true} disabled={ !showSelectPlayers } 
              onIonChange={(e) => { game.setPlayers( e.detail.value ) }}>
            { players.map( (player: Player, idx: number) => (
            <IonSelectOption key={idx} value={idx}>{player.name}</IonSelectOption>
            ) )}
          </IonSelect>
        </IonItem>        
      </IonList>
      
      <IonAlert isOpen={showTeamSelect} onDidDismiss={() => setShowTeamSelect(false)}
         header="Select 2 Players for Team"
         inputs={[
           { label: game.getPlayerName(players,0), type: 'checkbox', value: game.getPlayerID(0), checked: false,
            handler: (inp) => { handleTeamSelect( game, teamSelection, inp.value, inp.checked ) } },
           { label: game.getPlayerName(players,1), type: 'checkbox', value: game.getPlayerID(1), checked: false,
            handler: (inp) => { handleTeamSelect( game, teamSelection, inp.value, inp.checked ) } },
           { label: game.getPlayerName(players,2), type: 'checkbox', value: game.getPlayerID(2), checked: false,
            handler: (inp) => { handleTeamSelect( game, teamSelection, inp.value, inp.checked ) } },
           { label: game.getPlayerName(players,3), type: 'checkbox', value: game.getPlayerID(3), checked: false,
            handler: (inp) => { handleTeamSelect( game, teamSelection, inp.value, inp.checked ) } },
         ]}
      />
      
      <IonButton expand="block" onClick={() => checkGame( game )}>Save</IonButton>
    </IonContent>
  </IonPage>
  );
};

export default SetGameModal
