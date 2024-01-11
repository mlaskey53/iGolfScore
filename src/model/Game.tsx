// Model class for single game.
import { Player } from '../State';
import { Course18 } from './Course18';

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
	private playerPts: number[][];
	private shouldSelectPlayers: boolean;
	
	constructor() {
		this.gameType = Game.Types[ 0 ];
		this.playerIDs = [];
		this.playerPts = [];
		this.shouldSelectPlayers = true;
	}

	setGame( typ = 0 ) {
		this.gameType = Game.Types[ typ ];
	}

	setPlayers( ids: number[] ) {
		this.playerIDs = ids;
		for ( var i = 0;  i < ids.length;  i++ ) {
			this.playerPts[i] = [];
		}
	}

	getName() { return this.gameType.name }
	
	getPlayers() {
		return this.playerIDs;
	}
		
	getPlayerNames( players: Player[] ) {
		let names = '';
		this.playerIDs.map( (plyrId: number ) => ( names += ", " + players[plyrId].name ) );
		return names.slice(2);
	}
	
	getPlayersReqd() {
		return this.gameType.playersReqd;
	}
	
	getSelectPlayersPrompt( players: Player[] ) {
		if ( players.length < this.gameType.playersReqd ) {
			this.shouldSelectPlayers = false;
			return "At least " + this.gameType.playersReqd + " required for this game.";
		}
		if ( players.length === this.gameType.playersReqd || this.gameType.playersReqd === 0 ) {
			for ( var i = 0;  i < players.length;  i++ ) { this.playerIDs[i] = i; }
			this.shouldSelectPlayers = false;
			return "All players selected.";
		}
		this.shouldSelectPlayers = true;
		return "Select " + this.getPlayersReqd() + " players:";
	}
	
	getShouldSelectPlayers() { return this.shouldSelectPlayers; }

	determinePoints( players: Player[], course: Course18, holeNumber: number ) {
		const holeIdx = holeNumber - 1;
		
		// Determine points for players for current hole based on game type.
		switch ( this.gameType.name ) {
		
		case "Nassau":
			// SetGameModal ensures at least 2 players.
			let player1Score = this.getNetScore( course, holeNumber, players[ this.playerIDs[0] ] );
			let player2Score = this.getNetScore( course, holeNumber, players[ this.playerIDs[1] ] );
			if ( player1Score < player2Score ) {
				this.playerPts[0][holeIdx] = 1;
				this.playerPts[1][holeIdx] = -1;
			} else if ( player2Score < player1Score ) {
				this.playerPts[1][holeIdx] = 1;
				this.playerPts[0][holeIdx] = -1;
			} else {
				this.playerPts[0][holeIdx] = 0;
				this.playerPts[1][holeIdx] = 0;				
			}
			break;
		
		case "Total Points":
			let par = course.getPar( holeNumber );
			
			for ( let i = 0;  i < this.playerIDs.length;  i++ ) {
				let player = players[ this.playerIDs[i] ];
				let playerScore = this.getNetScore( course, holeNumber, player );
				
				this.playerPts[i][holeIdx] = this.getPointScore( playerScore, par );
			}
			break;
			
		case "9-Points":
			let p1Score = this.getNetScore( course, holeNumber, players[ this.playerIDs[0] ] );
			let p2Score = this.getNetScore( course, holeNumber, players[ this.playerIDs[1] ] );
			let p3Score = this.getNetScore( course, holeNumber, players[ this.playerIDs[2] ] );
			
			let p1 = 3, p2 = 3, p3 = 3;
			if ( !(p1Score === p2Score && p1Score === p3Score) ) {
				// See if anyone's a solo winner.
				if ( p1Score < p2Score && p1Score < p3Score ) {
					p1 = 5;
					if ( p2Score < p3Score ) { p2 = 3;  p3 = 1;	}
					else if ( p2Score > p3Score ) { p2 = 1;  p3 = 3; }
					else { p2 = 2;  p3 = 2;	}
				} else
				if ( p2Score < p1Score && p2Score < p3Score ) {
					p2 = 5;
					if ( p1Score < p3Score ) { p1 = 3;  p3 = 1;	}
					else if ( p1Score > p3Score ) { p1 = 1;  p3 = 3; }
					else { p1 = 2;  p3 = 2;	}
				} else
				if ( p3Score < p1Score && p3Score < p2Score ) {
					p3 = 5;
					if ( p1Score < p2Score ) { p1 = 3;  p2 = 1;	}
					else if ( p1Score > p2Score ) { p1 = 1;  p2 = 3; }
					else { p1 = 2;  p2 = 2;	}
				} else  // Must be a tie winner, see which one isn't.
				if ( p1Score > p2Score ) {
					p1 = 1; p2 = 4; p3 = 4;
				} else
				if ( p2Score > p1Score ) {
					p1 = 4; p2 = 1; p3 = 4;
				} else { p1 = 4;  p2 = 4;  p3 = 1; }
			}
			this.playerPts[0][holeIdx] = p1;
			this.playerPts[1][holeIdx] = p2;
			this.playerPts[2][holeIdx] = p3;			
			break;
			
		case "BestBall - Strokes":
		case "BestBall - Points":
			//teamGame();
			break;
		}
	}
	
	getNetScore( course:Course18, hole:number, player:Player ) {
		return ( course.isStrokeHole( hole, player.hdcp ) ) ? player.score[hole - 1] - 1 : player.score[hole - 1];
	}
	
	getPointScore( score:number, par:number ) {
		return ( score < 7 ) ? Game.PointValues[ (score - par) + 3 ] : 0;
	}

	renderScoreCard( players: Player[], course: Course18 ) {
	    var html = "<h4>Game: " + this.getName() + "</h4>";
		html += "<table><tr style=\"background-color:DodgerBlue;\"><td>Hole:</td>";
		html += "<td> 1</td><td> 2</td><td> 3</td><td> 4</td><td> 5</td><td> 6</td><td> 7</td><td> 8</td><td> 9</td><td></td><td></td>";
		html += "<td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td><td>17</td><td>18</td><td></td><td></td></tr>";
		html += "<tr style=\"background-color:MediumSeaGreen;\"> <td>Par:</td>";

	   	var ninePar = 0;
	   	for ( var h = 1;  h <= 18;  h++ ) {
	   		var p = course.getPar( h );  ninePar += p;
	   		html += "<td>" + p + "</td>";
	   		if ( h === 9 ) {
	   			html += "<td>" + ninePar + "</td><td></td>";
	   			ninePar = 0;
	   		}
	   	}
	   	html += "<td>" + ninePar + "</td><td></td></tr>";
	
	   	html += "<tr style=\"background-color:Yellow;\"> <td>Hdcp:</td>";
	   	for ( h = 1;  h <= 18;  h++ ) {
	   		html += "<td>" + course.getHdcp( h ) + "</td>";
	   		if ( h === 9 )
	   			html += "<td></td><td></td>";
	   	}
	   	html += "<td></td><td></td></tr>\n";

	    for ( var plyrId = 0;  plyrId < this.playerIDs.length;  plyrId++ ) {
		    const player = players[plyrId];
		    var frontScore = 0, backScore = 0, frontPts = 0, backPts = 0;
	        html += "<tr><th>" + player.name + "</th>";
	   	    for ( h = 1;  h <= 18;  h++ ) {
				let strokeHole = course.isStrokeHole( h, player.hdcp );
				let underPar = ( player.score[h - 1] < course.getPar(h) );
	            if ( h <= player.score.length ) {
	   	    	    html += "<th" + (strokeHole || underPar ? 
	   	    	        " style=\"" + (strokeHole ? "background-color:LightCoral; " : "") + (underPar ? "color:red;" : "") + "\"" : "") + ">"
	   	    	        + player.score[ h - 1 ] + "</th>";
	   	    	    if ( h <= 9 ) frontScore += player.score[h-1]; else backScore += player.score[h-1];
	            } else {
	                html += "<th" + (strokeHole ? " style=\"background-color:LightCoral;\"" : "") + "></th>";
	            }
	   	    	if ( h === 9 )
	   	    		html += "<th>" + frontScore + "</th><th></th>";
	   	    }
	   	    html += "<th>" + backScore + "</th><th>" + (frontScore + backScore) + "</th></tr>\n";
	   	    
	        html += "<tr><td></td>";
	   	    for ( h = 1;  h <= 18;  h++ ) {
	            if ( h <= this.playerPts[plyrId].length ) {
					const pts = this.playerPts[plyrId][ h - 1 ];
	   	    	    html += "<td>" + pts + "</td>";
	   	    	    if ( h <= 9 ) frontPts += pts; else backPts += pts;
	            } else {
	                html += "<td></td>";
	            }
	   	    	if ( h === 9 )
	   	    		html += "<td>" + frontPts + "</td><td></td>";
	   	    }
	   	    html += "<td>" + backPts + "</td><td>" + (frontPts + backPts) + "</td></tr>\n";
	    };

	    html += "</table>\n";

		return html;
	}
	
};

