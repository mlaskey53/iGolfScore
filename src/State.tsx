import React, { createContext, useReducer } from "react";
import { Game } from "./model/Game";

// Holds course data for 9 holes (so we can handle 27-hole courses and play in reverse order.)  
export type Course = {
  name: string;
  pairedWith: string;
  pars: number[];
  hdcps: number[];
}

export type Player = {
  name: string;
  hdcp: number;
  bonus: number;
}

export type AppState = {
  course: Course;
  game1: Game;
  game2: Game;
  players: Player[];
}

const initialState: AppState = {
  course: { name: 'Not set', pairedWith: 'Not set', pars: [], hdcps: [] },
  game1: new Game(),
  game2: new Game(),
  players: []
}

let AppContext = createContext( {} as any );

let reducer = (state: AppState, action: { type: string; newval: any; }) => {
  console.log( "Dispatch: action=" + action.type + ", newval=" + action.newval );
  switch(action.type) {
    case "setCourse":
      return { ...state, course: action.newval }
    case "setGame1":
      return { ...state, game1: action.newval }
    case "setGame2":
      return { ...state, game2: action.newval}
	case "setPlayers":
	  return { ...state, players: action.newval}
  }
  return state;
};

function AppContextProvider(props: { children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }) {
  const fullInitialState = { ...initialState,  }

  let [state, dispatch] = useReducer(reducer, fullInitialState);
  let value = { state, dispatch };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
}

let AppContextConsumer = AppContext.Consumer;

export { AppContext, AppContextProvider, AppContextConsumer };
