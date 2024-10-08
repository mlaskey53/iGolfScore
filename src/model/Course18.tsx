// Model class for 18-hole course played in Round.
import { Course } from '../State';

export class Course18 {
	// Indicies into Course array.
	private courses: Course[];
	private front9: number;
	private back9: number;

	// Hole handicaps, 18-hole values.
	private frontHdcps: number[];
	private backHdcps: number[];


	constructor(courses: Course[], front: number, back: number) {
		this.courses = courses;
		this.front9 = front; this.back9 = back;

		if ( this.courses.length >= 2 ) {
			this.frontHdcps = this.convertHdcps(this.courses[this.front9].hdcps, 1);
			this.backHdcps = this.convertHdcps(this.courses[this.back9].hdcps, 10);
		} else {
			this.frontHdcps = [];
			this.backHdcps = [];
		}
	}
	
	isDefined() { return this.courses.length > 0; }

	getName(hole: number) {
	    if ( !this.isDefined() ) return "No course selected";
		return (hole <= 9) ? this.courses[this.front9].name : this.courses[this.back9].name;
	}
	//public String getFront9()  {  return courseNames[ front9 ];  }
	//public String getBack9()  {  return courseNames[ back9 ];  }

   	// Allow back nine course to be changed mid-round.
   	setBack9(back: number) {
   		this.back9 = back;
		this.backHdcps = this.convertHdcps(this.courses[this.back9].hdcps, 10);
   	}

	getPar(hole: number) {
		let par = 0;
		if (1 <= hole && hole <= 9)
			par = this.courses[this.front9].pars[hole - 1];
		else if (hole <= 18)
			par = this.courses[this.back9].pars[hole - 10];
		return par;
	}

	getHdcp(hole: number) {
		// Return Hdcp for given hole as originally specified (not converted).
		let hdcp = 0;
		if (1 <= hole && hole <= 9)
			hdcp = this.courses[this.front9].hdcps[hole - 1];
		else if (hole <= 18)
			hdcp = this.courses[this.back9].hdcps[hole - 10];
		return hdcp;
	}

	getStrokesForHole(hole: number, playerHdcp: number) {
		/**
		 * Determines stokes deducted for given hole based on player's handicap.
		 * The player's handicap is assumed to be based on 18 holes (and at most 36).
		 * 
		 * The course hole handicaps are given per 9 holes via holeHdcps,
		 * and are assumed to be in terms of 18 holes (values from 1-18).
		 * (If hole is > 9, then the back nine course handicaps are assumed given.)
		 */
		let strokes = 0;

		if (1 <= hole && hole <= 18) {
			let holeHdcps = (hole <= 9) ? this.frontHdcps : this.backHdcps;
			let holeIdx = (hole - 1) % 9;
			
			strokes = (playerHdcp >= holeHdcps[holeIdx]) ? 1 : 0;
			strokes += (playerHdcp >= holeHdcps[holeIdx] + 18) ? 1 : 0;
		}
		return strokes;
	}

	convertHdcps(origHdcps: number[], startHole: number) {
		/**
		 * Determines the need to convert a set of 9 hole handicaps from ones based
		 * on 9 holes to ones based on 18 holes. Course handicaps can be based on 
		 * just 9 holes (so values from 1-9) or on 18 holes (values from 1-18).
		 * Also startHole indicates whether the handicaps should be converted to odd
		 * numbers (startHole = 1) or evens (startHole = 10).  
		 */
		let hdcps = origHdcps;
		if (hdcps.length !== 9) return hdcps;

		// If any of the given values are > 9, we assume they are already 18 hole based.
		for (let i = 0; i < hdcps.length; i++) {
			if (hdcps[i] > 9) return hdcps;
		}

		// If not, convert them to odds or evens based on startHole.
		// The conversion is (2*hdcp - 1) for odds and 2*hdcp for evens.
		let oneOrZero = (startHole < 10) ? 1 : 0;
		hdcps = [];
		for (let i = 0; i < origHdcps.length; i++) {
			hdcps[i] = (origHdcps[i] * 2) - oneOrZero;
		}
		return hdcps;
	}

};
