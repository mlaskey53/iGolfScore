import React, { createContext, useReducer } from "react";
import { Game } from "./model/Game";
import { Course18 } from "./model/Course18";

// Manages 'global' state for app.  Based on https://ionic.io/blog/a-state-management-pattern-for-ionic-react-with-react-hooks. 

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
}

export type AppState = {
  playerNames: string[];
  courses: Course[];
  course18: Course18;
  games: Game[];
  players: Player[];
}

const initialState: AppState = {
  playerNames: [],
  courses: [],
  course18: new Course18( [], 0, 0 ),
  games: [],
  players: []
}

let AppContext = createContext( {} as any );

let reducer = (state: AppState, action: { type: string; newval: any; }) => {
  console.log( "Dispatch: action=" + action.type + ", newval=" + JSON.stringify( action.newval ) );
  switch(action.type) {
    case "setPlayerNames":
      return { ...state, playerNames: action.newval }
    case "setCourses":
      return { ...state, courses: action.newval }
    case "setCourse18":
      return { ...state, course18: action.newval }
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
