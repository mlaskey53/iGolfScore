// Model class for single game.

export class Game {
	
	static Types = [ "(None)", "Nassau", "Total Points", "9-Points", "Best Ball - Strokes", "Best Ball - Points" ];
	
	public static NoGame = 0;
	public static Nassau = 1;
	public static Points = 2;
	public static NinePoints = 3;
	public static TeamGame = 4;  // Index of first team game, define all team games after this.
	public static BestBallStrokes = 4;
	public static BestBallPoints = 5;
	
	public static PointValues = [ 5, 4, 3, 2, 1, 0, 0 ];
	
	private gameType:number;
	
	constructor( typ = 0 ) {
		this.gameType = typ;
	}

};

