// Model class for single game.
import { Course, Player } from '../State';

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
	private shouldSelectPlayers: boolean;
	
	constructor() {
		this.gameType = Game.Types[ 0 ];
		this.playerIDs = [];
		this.shouldSelectPlayers = true;
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

	getCourseVal( hole: number, front9: number[], back9: number[] ) {
		var par = 0;
		if ( 1 <= hole && hole <= 9 )
			par = front9[ hole - 1 ];
		else if ( hole <= 18 ) 
			par = back9[ hole - 10 ];
		return par;
	}
	
	renderScoreCard( players: Player[], courses: Course[], front9: number, back9: number ) {
	    var html = '';
		html += "<table><tr style=\"background-color:DodgerBlue;\"><td>Hole:</td>";
		html += "<td> 1</td><td> 2</td><td> 3</td><td> 4</td><td> 5</td><td> 6</td><td> 7</td><td> 8</td><td> 9</td><td></td><td></td>";
		html += "<td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td><td>17</td><td>18</td><td></td><td></td></tr>";
		html += "<tr style=\"background-color:MediumSeaGreen;\"> <td>Par:</td>";

	   	var ninePar = 0;
	   	for ( var h = 1;  h <= 18;  h++ ) {
	   		var p = this.getCourseVal( h, courses[front9].pars, courses[back9].pars );  ninePar += p;
	   		html += "<td>" + p + "</td>";
	   		if ( h === 9 ) {
	   			html += "<td>" + ninePar + "</td><td></td>";
	   			ninePar = 0;
	   		}
	   	}
	   	html += "<td>" + ninePar + "</td><td></td></tr>";
	
	   	html += "<tr style=\"background-color:Yellow;\"> <td>Hdcp:</td>";
	   	for ( h = 1;  h <= 18;  h++ ) {
	   		html += "<td>" + this.getCourseVal( h, courses[front9].hdcps, courses[back9].hdcps ) + "</td>";
	   		if ( h === 9 )
	   			html += "<td></td><td></td>";
	   	}
	   	html += "<td></td><td></td><td></td></tr>\n";

	    players.forEach( player => {
	        html += "<tr><th>" + player.name + "</th>";
	   	    for ( h = 1;  h <= 18;  h++ ) {
	            if ( h <= player.score.length )
	   	    	    html += "<th>" + player.score[ h - 1 ] + "</th>";
	            else
	                html += "<th></th>";
	   	    	if ( h === 9 )
	   	    		html += "<th></th><th></th>";
	   	    }
	   	    html += "<th></th><th></th><th></th></tr>\n";
	    });

	    html += "</table>\n";

		return html;
	}
	
};

