// Model class for single game.
import { Player } from '../State';

export 	interface GameType { name: string; playersReqd: number; team?: boolean };	

export class Game {

	static Types: GameType[] = [ 
		{ name: "(None)", playersReqd: -1 },
		{ name: "Nassau", playersReqd: 2, team: false },
		{ name: "Total Points", playersReqd: 0, team: false },
		{ name: "9-Points", playersReqd: 3, team: false },
		{ name: "Best Ball - Strokes", playersReqd: 4, team: true },
		{ name: "Best Ball - Points", playersReqd: 4, team: true }
	];
	
	public static PointValues = [ 5, 4, 3, 2, 1, 0, 0, 0, 0, 0 ];  // Points for hole-in-one, eagle, birdie, etc.
	
	private gameType: GameType;
	private playerIDs: number[];
	
	constructor() {
		this.gameType = Game.Types[ 0 ];
		this.playerIDs = [];
	}

	setGame( typ = 0 ) {
		this.gameType = Game.Types[ typ ];
	}

	setPlayers( ids: [] ) {
		this.playerIDs = ids;
	}

	getName() { return this.gameType.name }
	
	getPlayers() {
		return this.playerIDs;
	}
		
	getPlayerNames( players: Player[] ) {
		let names = '';
		this.playerIDs.map( (plyrId: number ) => ( names += "," + players[plyrId].name ) );
		return names.slice(1);
	}
	
	getPlayersReqd() {
		return this.gameType.playersReqd;
	}
};

