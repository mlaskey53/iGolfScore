import React, { createContext, useReducer } from "react";

export type Player = {
  name: string;
  hdcp: number;
  bonus: number;
}

export type AppState = {
  course: string;
  game1: string;
  game2: string;
  players: Player[];
}

const initialState: AppState = {
  course: '',
  game1: '',
  game2: '',
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
	case "setPlayer":
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
