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
  score: number[];
  points: number[];
}

export type AppState = {
  courses: Course[];
  front9: number;
  back9: number;
  games: Game[];
  players: Player[];
}

const initialState: AppState = {
  courses: [],
  front9: 0,
  back9: 0,
  games: [],
  players: []
}

let AppContext = createContext( {} as any );

let reducer = (state: AppState, action: { type: string; newval: any; }) => {
  console.log( "Dispatch: action=" + action.type + ", newval=" + JSON.stringify( action.newval ) );
  switch(action.type) {
    case "setCourses":
      return { ...state, courses: action.newval }
    case "setFront9":
      return { ...state, front9: action.newval }
    case "setBack9":
      return { ...state, back9: action.newval }
    case "setGames":
      return { ...state, games: action.newval }
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
