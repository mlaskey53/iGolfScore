// Model class for single game.

export 	interface GameType { name: string; playersReqd?: number; team?: boolean };	

export class Game {

	static Types: GameType[] = [ 
		{ name: "(None)"},
		{ name: "Nassau", playersReqd: 2, team: false },
		{ name: "Total Points", playersReqd: 0, team: false },
		{ name: "9-Points", playersReqd: 3, team: false },
		{ name: "Best Ball - Strokes", playersReqd: 4, team: true },
		{ name: "Best Ball - Points", playersReqd: 4, team: true }
	];
	
	public static PointValues = [ 5, 4, 3, 2, 1, 0, 0, 0, 0, 0 ];  // Points for hole-in-one, eagle, birdie, etc.
	
	private gameType: GameType;
	
	constructor( typ = 0 ) {
		this.gameType = Game.Types[ typ ];
	}

};

