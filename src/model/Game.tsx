// Model class for single game.
import { Player } from '../State';
import { Course18 } from './Course18';

export 	interface GameType { name: string; playersReqd: number; team?: boolean; begHole?: number; endHole?: number };

export interface Team { name: string, ids: number[], pts: number[] }	

export class Game {

	static Types: GameType[] = [ 
		{ name: "(None)", playersReqd: -1 },
		{ name: "Nassau", playersReqd: 2, team: false },
		{ name: "Total Points", playersReqd: 0, team: false },
		{ name: "9-Points", playersReqd: 3, team: false },
		{ name: "Best Ball - Strokes", playersReqd: 4, team: true },
		{ name: "Best Ball - Points", playersReqd: 4, team: true },
		{ name: "Best Ball - Sixes (1-6)", playersReqd: 4, team: true, begHole: 1, endHole: 6 },
		{ name: "Best Ball - Sixes (7-12)", playersReqd: 4, team: true, begHole: 7, endHole: 12 },
		{ name: "Best Ball - Sixes (13-18)", playersReqd: 4, team: true, begHole: 13, endHole: 18 }
	];
	
	public static PointValues = [ 5, 4, 3, 2, 1, 0, 0, 0, 0, 0 ];  // Points for hole-in-one, eagle, birdie, etc.
	
	private gameType: GameType;
	private selectPlayers: boolean;
	private playerIDs: number[];
	private playerPts: number[][];
	private team1: Team;
	private team2: Team;
	
	constructor() {
		this.gameType = Game.Types[ 0 ];
		this.selectPlayers = true;
		this.playerIDs = [];
		this.playerPts = [];
		this.team1 = { name: "", ids: [], pts: [] };
		this.team2 = { name: "", ids: [], pts: [] };
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
		
    getPlayerName( players: Player[], idx: number ) {
      return (this.playerIDs.length > idx) ? players[this.playerIDs[idx]].name : "(None)";
    }
  
    getPlayerID( idx: number ) {
      return (this.playerIDs.length > idx) ? this.playerIDs[idx] : -1;
    }
  
	getPlayerNames( players: Player[] ) {
		var result = "";
		if ( this.gameType.team && this.team1.ids.length > 0 && this.team2.ids.length > 0 ) {
			// Return "P1/P2 v. P3/P4"
			let teamNms = "";
			this.team1.ids.map( (plyrId: number ) => ( teamNms += "/" + players[plyrId].name ) );
			result = teamNms.slice(1);
			teamNms = "";
			this.team2.ids.map( (plyrId: number ) => ( teamNms += "/" + players[plyrId].name ) );
			result += " v. " + teamNms.slice(1);
		} else {
			// Return "P1, P2, P3, P4"
			let names = '';
			this.playerIDs.map( (plyrId: number ) => ( names += ", " + players[plyrId].name ) );
			result = names.slice(2);
		}
		return result;
	}
	
	getPlayerNamesArray( players: Player[] ) {
		let names: string[] = [];
		this.playerIDs.map( (plyrId: number ) => ( names.push( players[plyrId].name ) ) );
		return names;
	}
	
	getPlayersReqd() {
		return this.gameType.playersReqd;
	}
	
	getSelectPlayersPrompt( players: Player[] ) {
		if ( players.length < this.gameType.playersReqd ) {
			this.selectPlayers = false;
			return "At least " + this.gameType.playersReqd + " required for this game.";
		}
		if ( players.length === this.gameType.playersReqd || this.gameType.playersReqd === 0 ) {
			for ( var i = 0;  i < players.length;  i++ ) { this.playerIDs[i] = i; }
			this.selectPlayers = false;
			return "All players selected.";
		}
		this.selectPlayers = true;
		return "Select " + this.getPlayersReqd() + " players:";
	}
	
	shouldSelectPlayers() { return this.selectPlayers; }
	
	isTeamGame() { return this.gameType.team; }
	
    setTeams( players: Player[], team: number[] ) {
        // Set team1 player indicies from given array, team2 indices are player indicies not in given array.
        // (Assumes team.length = 2 and setPlayers invoked.)
        this.team1.ids = team;
        for ( let i = 0;  i < this.playerIDs.length;  i++ ) {
            let playerIdx = this.playerIDs[i];
            if ( playerIdx !== team[0] && playerIdx !== team[1] )  this.team2.ids.push( playerIdx );
        }
        this.team1.name = players[ team[0] ].name + "/" + players[ team[1] ].name;
        this.team2.name = players[ this.team2.ids[0] ].name + "/" + players[ this.team2.ids[1] ].name;
    }	
	
	shouldSelectTeams() {
        return (this.gameType.team && this.team1.ids.length === 0) ? true : false;	
	}
	
	shouldShowPoints( hole:number ) {
		// Determine if game points should be displayed on score card.  True for all games except Sixes,
		// where it's true only if hole is between begHole and endHole.
		var shouldShow = true;
		if ( Object.hasOwn(this.gameType, 'begHole') ) {
			shouldShow = ( hole < this.gameType.begHole! || hole > this.gameType.endHole! ) ? false : true;
		}
		return shouldShow;
	}

	getNetScore( course:Course18, hole:number, player:Player ) {
		return ( course.isStrokeHole( hole, player.hdcp ) ) ? player.score[hole - 1] - 1 : player.score[hole - 1];
	}
	
	getPointScore( score:number, par:number ) {
		return ( score < 7 ) ? Game.PointValues[ (score - par) + 3 ] : 0;
	}

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
			
		}
	}
	
    determineTeamPoints( players: Player[], course: Course18, holeNumber: number ) {
        const holeIdx = holeNumber - 1;
		// Handle team games...  get scores for all players in game and determine team scores.
		// Here we set player1, player2 from team1, player3, player4 from team2.
		const player1 = players[ this.team1.ids[0] ];
		let p1Score = this.getNetScore( course, holeNumber, player1 );
		const player2 = players[ this.team1.ids[1] ];
		let p2Score = this.getNetScore( course, holeNumber, player2 );
		const player3 = players[ this.team2.ids[0] ];
		let p3Score = this.getNetScore( course, holeNumber, player3 );
		const player4 = players[ this.team2.ids[1] ];
		let p4Score = this.getNetScore( course, holeNumber, player4 );

		// Find best ball for each team.
		var team1Score = ( p1Score <= p2Score ) ? p1Score : p2Score;
		var team2Score = ( p3Score <= p4Score ) ? p3Score : p4Score;
		
		if ( this.gameType.name.indexOf("Points" ) < 0 ) {
			if ( team1Score < team2Score ) {
				team1Score = 1;  team2Score = -1;
			} else if ( team2Score < team1Score ) {
				team1Score = -1;  team2Score = 1;
			} else {
				team1Score = team2Score = 0;
			}
			
			// Set the team points based on the best ball.
			this.team1.pts[ holeIdx ] = team1Score;
			this.team2.pts[ holeIdx ] = team2Score;				
		} else {
			const par = course.getPar( holeNumber );
			
			// Set each player's points.
			this.playerPts[0][holeIdx] = this.getPointScore( p1Score, par);
			this.playerPts[1][holeIdx] = this.getPointScore( p2Score, par);
			this.playerPts[2][holeIdx] = this.getPointScore( p3Score, par);
			this.playerPts[3][holeIdx] = this.getPointScore( p4Score, par);
			
			// Set the team points based on the best ball.
			this.team1.pts[ holeIdx ] = this.getPointScore( team1Score, par );
			this.team2.pts[ holeIdx ] = this.getPointScore( team2Score, par );
		}
	}
	
	getTeamPoints( theTeam: number, theHole: number ) {
		// Return total points for theTeam (1 or 2) up to and including theHole.
		var total = 0;
		for ( let h = 0;  h < theHole && h < 18;  h++ )
			total += ( theTeam === 1 ) ? this.team1.pts[ h ] : this.team2.pts[ h ];
			
		return total;
	}
	
	renderScoreCard( players: Player[], course: Course18 ) {
	    //var html = "<h4>Game: " + this.getName() + "</h4>";
		var html = "<table><tr style=\"background-color:DodgerBlue;\"><td>Hole:</td>";
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
		    
		    // Table row for player scores
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
	   	    
	   	    // Table row for player points, unless team game.
	   	    if ( ! this.isTeamGame() ) {
		        html += "<tr><td></td>";
		   	    for ( h = 1;  h <= 18;  h++ ) {
		            if ( h <= player.score.length ) {
		                this.determinePoints( players, course, h );
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
	   	    }
	    };

        // If team game, add rows showing team scores.	    
	    if ( this.isTeamGame() ) {
	      for ( let i = 0;  i < 2;  i++ ) {
	        let team = (i === 0) ? this.team1 : this.team2;
		    frontPts = 0; backPts = 0;
	        html += "<tr><th>" + team.name + "</th>";
	   	    for ( h = 1;  h <= 18;  h++ ) {
	            if ( this.shouldShowPoints(h) && h <= players[0].score.length ) {
	                this.determineTeamPoints( players, course, h );
					const pts = team.pts[ h - 1 ];
	   	    	    html += "<td>" + pts + "</td>";
	   	    	    if ( h <= 9 ) frontPts += pts; else backPts += pts;
	            } else {
	                html += "<td></td>";
	            }
	   	    	if ( h === 9 )
	   	    		html += "<td>" + frontPts + "</td><td></td>";	      
	        }
    	    html += "<td>" + backPts + "</td><td>" + (frontPts + backPts) + "</td></tr>\n";
	      }
	    }

	    html += "</table>\n";

		return html;
	}
	
};

