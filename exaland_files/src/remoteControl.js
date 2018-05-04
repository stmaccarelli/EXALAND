// this stores all data coming from websocket / any remote source we want to connect
// TODO socket here
var HLR = {
	//audio
	fft1: 0.0,
	fft2: 0.0,
	fft3: 0.0,
	fft4: 0.0,

	smoothFFT1: 0,
	smoothFFT2: 0,
	smoothFFT3: 0,

	// global game status
	GAMESTATUS: 0,
	PREVGAMESTATUS: null
}



HLR.initMIDI = function(){

	HLR.MIDIInterface = new MIDIInterface( );

	/* MIDI COMMANDS */

	console.error( SOCKETVISUAL );

	HLR.MIDIInterface.registerCallback({
		midi: [1, 41],
		callback: function(v) {
			HLS.randomizeTrigger = !HLS.randomizeTrigger;
			console.log('HLS.randomizeTrigger', HLS.randomizeTrigger);
		},
		context: HLS,
		isTrigger: true,
		keyAlternative: 'e'
	});


	HLR.MIDIInterface.registerCallback({
		midi: [1, 40],
		callback: function(v) {
			HLS.objectsTrigger = !HLS.objectsTrigger;
			console.log('HLS.objectsTrigger', HLS.objectsTrigger);
			if(SOCKETVISUAL!==null){
				console.log('midi fired SOCKETVISUAL');
			}
		},
		context: HLS,
		isTrigger: true,
		keyAlternative: 'w'
	});

	HLR.MIDIInterface.registerCallback({
		midi: [1, 39],
		callback: function(v) {
			HLS.textTrigger = !HLS.textTrigger;
			console.log('HLS.textTrigger', HLS.textTrigger);
			if(SOCKETVISUAL!==null){
				console.log('midi fired SOCKETVISUAL');
			}
		},
		context: HLS,
		isTrigger: true,
		keyAlternative: 'q'
	});


	// reset scene params
	HLR.MIDIInterface.registerCallback({
		midi: [1, 36],
		callback: function(v) {

			HLS.loadParams(HLSP['exaland']);

			if(SOCKETVISUAL!==null){
				console.log('midi fired SOCKETVISUAL');
			}

		},
		context: HLS,
		isTrigger: true,
		keyAlternative: 'r'

	});

}


var HLRemote = function() {

function HLRAuto(){
	requestAnimationFrame( HLRAuto );
	/* leveling down ffts, expecially in case websocket lose connection */
	HLR.fft1 *= 0.99;
	HLR.fft2 *= 0.99;
	HLR.fft3 *= 0.99;
	HLR.fft4 *= 0.99;
}
requestAnimationFrame( HLRAuto );


function updateFFT(a, b, c, d) {
	a = a || 0;
	b = b || 0;
	c = c || 0;
	d = d || 0;
	
	HLR.fft1 = Math.max(a, 0.0001);
	HLR.fft2 = Math.max(b, 0.0001);
	HLR.fft3 = Math.max(c, 0.0001);
	HLR.fft4 = Math.max(d, 0.0001);

	// compute smooths
	HLR.smoothFFT1 += (HLR.fft1 - HLR.smoothFFT1) * 0.04;
	HLR.smoothFFT2 += (HLR.fft2 - HLR.smoothFFT2) * 0.04;
	HLR.smoothFFT3 += (HLR.fft3 - HLR.smoothFFT3) * 0.04;
}


function updateHLParams(a, b, c, d) {
	// TODO: memory optimization

	updateFFT(a, b, c, d);


}


function keyboardControls(k) {

	// pause key available in game status 1 or 2 (running or paused)
	if (k.key == ' ' || k.keyCode == 32 || k.key == 'mP' || k.key == 'mP2') {

		k.preventDefault();

		if (HLR.GAMESTATUS > 0 && HLR.GAMESTATUS < 20) {
			HLMain.updateStatus(20);
		} else if (HLR.GAMESTATUS == 20)
			HLMain.updateStatus(-1);

	}

	if (HLR.GAMESTATUS > 0 && HLR.GAMESTATUS < 20) { // game running

		// shoot models
		if (k.key == 'h' || k.key == 'H' || k.keyCode == 72) {
			// HLH.startModel(HL.models['elephant'],
			// 	THREE.Math.randInt(-1000, 1000),
			// 	-20, 0, null, 10
			// );
			HLH.startGroup(['bigfishes', 2, 0, 'y', true, 0, true]);

		}

		if (k.key == 'y' || k.key == 'Y' || k.keyCode == 89) {
			HLH.startGroup(['band', 2, 0, 'xyz', true, 0, true]);
		}
		// group, scale, speed, rotations, floating, midpoint, towardsCamera
		if (k.key == 'p' || k.key == 'P' || k.keyCode == 80) {
			HLH.startGroup(['sea', 2, 1, 'xyz', false, HLE.WORLD_HEIGHT, true]);
		}
		// model,xPosition,y,speed,rotations, scale, isParticle, towardsCamera
		if (k.key == 'e' || k.key == 'E' || k.keyCode == 69) {
			HLH.startGroup(['civilization', 2, 0, null, true, 0, true]);
		}

		if (k.key == 'r' || k.key == 'R' || k.keyCode == 82) {
			HLH.startGroup(['waste', 2, 0, 'y', true, 0, true]);
		}

		// SECRETS
		if (k.key == 'd' || k.key == 'D' || k.keyCode == 68) {
			HLH.startModel(HL.models['ducky'],
				THREE.Math.randInt(-1000, 1000), -2, 0, 'xyz', 50, false, true
			);
		}
		if (k.key == 'c' || k.key == 'C' || k.keyCode == 67) {
			HLH.startModel(HL.models['chainsaw'],
				THREE.Math.randInt(-1000, 1000), -1, 0, 'xyz', 5, false, true
			);
		}
		//mobile shot
		if (k.keyCode == 53 || k.key == 'mX') { // 5
			//HLH.startGroup(['space', 1, 1, true, false, HLE.WORLD_HEIGHT / 3]);
			HLH.startAll();
		}

	}


	if (HLR.GAMESTATUS > 0) {
		if (k.keyCode == 13 || k.key == 'mS') { //'Enter'
			// HLE.acceleration = THREE.Math.clamp(HLE.acceleration+=0.009, 0, 2);
			screenshot();

		}
	}

	// DEV / EXTRA
	if (k.keyCode == 77 || k.key == 'm') {
		AA.connectMic();
	}

	if (k.keyCode == 70 || k.key == 'f') {
		AA.connectFile();
	}

} // END keyboardControls()

// listen keyboard TODO+ check final commands!
if (!isCardboard)
	window.addEventListener('keyup', keyboardControls);


function MIDIcontrols(){

	var	MIDIInter = new MIDIInterface();



	MIDIInter.registerCallback({
		midi: [1, 41],
		callback: function(v){
					HLS.randomizeTrigger = !HLS.randomizeTrigger;
					console.log('HLS.randomizeTrigger', HLS.randomizeTrigger);
		},
		context: HLS,
		isTrigger: true,
		keyAlternative: 'e'
	});


	MIDIInter.registerCallback({
		midi: [1, 40],
		callback: function(v){
					HLS.objectsTrigger = !HLS.objectsTrigger;
					console.log('HLS.objectsTrigger', HLS.objectsTrigger);
		},
		context: HLS,
		isTrigger: true,
		keyAlternative: 'w'
	});

	MIDIInter.registerCallback({
		midi: [1, 39],
		callback: function(v){
					HLS.textTrigger = !HLS.textTrigger;
					console.log('HLS.textTrigger', HLS.textTrigger);
		},
		context: HLS,
		isTrigger: true,
		keyAlternative: 'q'
	});


	// reset scene params
	MIDIInter.registerCallback({
		midi: [1, 36],
		callback: function(v){

					HLS.loadParams( HLSP[ 'exaland' ] );

		},
		context: HLS,
		isTrigger: true,
		keyAlternative: 'r'

	});

}


// if (isCardboard)
// 	window.addEventListener('keypress', iCadeControls, false);

// window.addEventListener('touchstart', function(){ HLC.land.set(0xffffff); });

// function iCadeControls(k) {
//
//
// 	// start button = pause
// 	if (k.keyCode == 118) {
// 		k.preventDefault();
// 		k.stopPropagation();
// 		if (HLR.GAMESTATUS == 10)
// 			HLMain.updateStatus(20);
// 		else if (HLR.GAMESTATUS == 20)
// 			HLMain.updateStatus(10);
// 	}
//
// 	switch (k.keyCode) {
// 		case 110: //
// 			k.preventDefault();
// 			k.stopPropagation();
// 			HLH.startGroup(['band', 20, 0, 'y', true, 0, true]);
// 			break;
// 		case 102:
// 			k.preventDefault();
// 			k.stopPropagation();
// 			HLH.startAll();
// 			break;
// 		case 114:
// 			k.preventDefault();
// 			k.stopPropagation();
// 			HLH.startModel(HL.models['whale'],
// 				THREE.Math.randInt(-1000, 1000),
// 				THREE.Math.randInt(HLE.WORLD_HEIGHT, HLE.WORLD_HEIGHT * 1.5), 20, 'xyz', 1
// 			);
// 			break;
// 		case 116:
// 			k.preventDefault();
// 			k.stopPropagation();
// 			HLH.startModel(HL.models['ducky'],
// 				THREE.Math.randInt(-1000, 1000),
// 				THREE.Math.randInt(HLE.WORLD_HEIGHT, HLE.WORLD_HEIGHT * 1.5), 20, 'xyz', 1
// 			);
// 			break;
// 	}
//
// }

// 106 j
// 110 n
// 117 u
// 102 f
// 104 h
// 114 r
// 121 y
// 116 t


// in mobile mode we have on-screen button
// so, send buttons ids to keyboard Callback (mX key value format)
// if (isMobile) {
// 	let mButtons = document.querySelectorAll('.mobileControlButton');
// 	for (let i = 0; i < mButtons.length; i++) {
// 		mButtons[i].addEventListener('touchstart', function(e) {
// 			e.preventDefault();
// 			e.stopPropagation();
// 			let fakeEvent = {
// 				'key': mButtons[i].id,
// 				'preventDefault': function() {},
// 				'stopPropagation': function() {}
// 			}
// 			keyboardControls(fakeEvent);
// 			return false;
// 		});
// 	}
// }
// buttonAccel.addEventListener('touchend', function(e){ e.preventDefault(); scope.moveForward = false; } );
// buttonAccel.addEventListener('touchcancel', function(e){ e.preventDefault(); scope.moveForward = false; } );


// function screenshot() {
// 	//console.log(screenshot);
// 	// save current renderer pixelRatio
// 	var pixelRatio = HL.renderer.getPixelRatio();
// 	// set high pixel ratio for bigegr image
// 	HL.renderer.setPixelRatio(1);
// 	// render bigger image
// 	HL.cameraCompanion.position.z = -400 - HL.cameraGroup.position.y * 0.25;
//
// 	// HLS.logoChange('logo');
// 	HL.renderer.render(HL.scene, HL.camera);
// 	var imgData = HL.renderer.domElement.toDataURL('image/jpeg');
// 	// set back working pixel ratio
// 	HL.renderer.setPixelRatio(pixelRatio);
// 	window.open(imgData);
// 	HL.cameraCompanion.visible = false;
//
// }

return {
	updateHLParams: function(a, b, c, d) {
		return updateHLParams(a, b, c, d)
	},
	// updateTrans: function(a, b, c) {
	// 	return updateTrans(a, b, c)
	// },
	// screensInit: screensInit,
	// setVisibility: function(a, b) {
	// 	return setVisibility(a, b)
	// },
}
}();
