import { Course, Player } from '../State';
import { Game } from "../model/Game";
import { Course18 } from "../model/Course18";
import * as setup from "../../public/assets/json/setup.json";

type TestState = {
  course18: Course18;
  games: Game[];
  players: Player[];
}

var testState: TestState = {
  course18: new Course18( [], 0, 0 ),
  games: [],
  players: []
}

// Bay hdcps: [2,5,1,9,8,4,7,6,3], Lake hdcps: [7,2,6,5,9,4,3,8,1]
const hdcpsBayLake = [3,9,1,17,15,7,13,11,5,14,4,12,10,18,8,6,16,2];
const parsBayLake = [4,5,4,4,4,3,4,3,5,4,4,5,3,4,5,4,3,4];

function scoresPerHdcp( hdcp: number, pars: number[], hdcps: number[] ) {
  return pars.map( (p, i) => p + (hdcp >= hdcps[i] ? 1 : 0) );
}

beforeAll( () => {
  const back9 = setup.courses.findIndex( (crs:Course) => crs.name === setup.courses[0].pairedWith );
  testState.course18 = new Course18( setup.courses, 0, back9 );
  
  testState.players.push( { name: 'Mike', hdcp: 0, bonus: 0, score: [] } );
  testState.players.push( { name: 'Ray', hdcp: 0, bonus: 0, score: [] } );
  testState.players.push( { name: 'Steve', hdcp: 0, bonus: 0, score: [] } );
  
//  console.log( scoresPerHdcp( 11, parsBayLake, hdcpsBayLake ) );
//  console.log( "[5,6,5,4,4,4,4,4,6,4,5,5,4,4,6,5,3,5]" );
} );

test( 'Nassau - even w/hdcp', () => {
  const game = new Game();
  game.setType( 1 );
  game.setPlayers( [ 0, 1 ] );
  // Set Mike's hdcp and score to even par.
  testState.players[0].hdcp = 0; testState.players[0].score = parsBayLake;
  // Set Ray's hdcp and score to match hdcp.
  testState.players[1].hdcp = 11; testState.players[1].score = scoresPerHdcp( 11, parsBayLake, hdcpsBayLake );
  
  for ( var i = 1;  i <= 18;  i++ ) game.determinePoints( testState.players, testState.course18, i );  
  expect( game.getPlayerPts(0) ).toEqual( game.getPlayerPts(1) );
//  console.log( testState.players[0].name + " points: " + game.getPlayerPts( 0 ) );
//  console.log( testState.players[1].name + " points: " + game.getPlayerPts( 1 ) );
} );

test( 'Total Points - even w/relative hdcp', () => {
  const game = new Game();
  game.setType( 2 );
  game.setPlayers( [ 0, 1 ] );
  // Set Mike's hdcp and score to even par.
  testState.players[0].hdcp = 0; testState.players[0].score = parsBayLake;
  // Set Ray's hdcp and score to match hdcp.
  testState.players[1].hdcp = 11; testState.players[1].score = scoresPerHdcp( 11, parsBayLake, hdcpsBayLake );
  
  for ( var i = 1;  i <= 18;  i++ ) game.determinePoints( testState.players, testState.course18, i );  
  expect( game.getPlayerPts(0) ).toEqual( game.getPlayerPts(1) );
} );

test( 'Total Points - even w/full hdcp', () => {
  const game = new Game();
  game.setType( 2 );
  game.setPlayers( [ 0, 1 ] );
  // Set Mike's full hdcp and score to even par.
  testState.players[0].hdcp = 8; testState.players[0].score = parsBayLake;
  // Set Ray's full hdcp and score to match Mike's.
  testState.players[1].hdcp = 19; testState.players[1].score = scoresPerHdcp( 11, parsBayLake, hdcpsBayLake );
  
  for ( var i = 1;  i <= 18;  i++ ) game.determinePoints( testState.players, testState.course18, i );  
  expect( game.getPlayerPts(0) ).toEqual( game.getPlayerPts(1) );
} );

test( '9-Points - even w/relative hdcp', () => {
  const game = new Game();
  game.setType( 3 );
  game.setPlayers( [ 0, 1, 2 ] );
  // Set players score to even par + hdcp relative to low player.
  testState.players[0].hdcp = 3; testState.players[0].score = scoresPerHdcp( 3, parsBayLake, hdcpsBayLake );
  testState.players[1].hdcp = 14; testState.players[1].score = scoresPerHdcp( 14, parsBayLake, hdcpsBayLake );
  testState.players[2].hdcp = 0; testState.players[2].score = parsBayLake;
  
  for ( var i = 1;  i <= 18;  i++ ) game.determinePoints( testState.players, testState.course18, i ); 
  
  expect( game.getPlayerPts(0)[0] ).toEqual( 3 ); 
  expect( game.getPlayerPts(0) ).toEqual( game.getPlayerPts(1) );
  expect( game.getPlayerPts(0) ).toEqual( game.getPlayerPts(2) );
//  console.log( testState.players[0].name + ": " +game.getPlayerPts(0) );
//  console.log( testState.players[1].name + ": " +game.getPlayerPts(1) );
//  console.log( testState.players[2].name + ": " +game.getPlayerPts(2) );
} );

test( '9-Points - even w/full hdcp', () => {
  const game = new Game();
  game.setType( 3 );
  game.setPlayers( [ 0, 1, 2 ] );
  // Set players score to even par + full hdcp.
  testState.players[0].hdcp = 10; testState.players[0].score = scoresPerHdcp( 3, parsBayLake, hdcpsBayLake );
  testState.players[1].hdcp = 21; testState.players[1].score = scoresPerHdcp( 14, parsBayLake, hdcpsBayLake );
  testState.players[2].hdcp = 7; testState.players[2].score = parsBayLake;
  
  for ( var i = 1;  i <= 18;  i++ ) game.determinePoints( testState.players, testState.course18, i ); 
  
  expect( game.getPlayerPts(0)[0] ).toEqual( 3 ); 
  expect( game.getPlayerPts(0) ).toEqual( game.getPlayerPts(1) );
  expect( game.getPlayerPts(0) ).toEqual( game.getPlayerPts(2) );
//  console.log( testState.players[0].name + ": " +game.getPlayerPts(0) );
//  console.log( testState.players[1].name + ": " +game.getPlayerPts(1) );
//  console.log( testState.players[2].name + ": " +game.getPlayerPts(2) );
} );


