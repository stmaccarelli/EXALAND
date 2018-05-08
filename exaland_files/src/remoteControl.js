// this stores all data coming from websocket / any remote source we want to connect
// TODO socket here
var HLR = {
	//audio
	fft: [0,0,0],
	smoothFft: [0,0,0],

	// TRIGGERS FOR SCENE ACTIONS
	randomizeTrigger: false,
	textTrigger: false,
	objectsTrigger: false,
	glitchEffect: false,

	// global game status
	GAMESTATUS: 0,
	PREVGAMESTATUS: null,

	MIDIInterface: new MIDIInterface(),
	socketInterface: noSocket ? null : new socketInterface( SOCKETSERVER )
}


HLR.registerAssign = function( params ){

	// register MIDI callback
	if( isVisual ){

		// add key event listener
		window.addEventListener('keyup', function(e){

			if( e.key == params.keyAlternative ){
				// assign value
				params.parent[params.property] = params.isTrigger? !params.parent[params.property] : params.value;
				// send socket message
				if( isVisual && !noSocket) HLR.socketInterface.emitAssign( params );

			}

		});


		// reformat callbacks
		if( params.callbacks === undefined){
			params.callbacks = [ { func: params.callback, ctx: params.context, isTrigger: params.isTrigger } ];
		}


		// else if( SOCKET && socketOut ){
    //   params.callbacks.push( { func: function(){ SOCKET.emitAction( params.keyCode, params.permanentId ); }, ctx: SOCKET } );
    // }

		params.callbacks.push({
			func: function() { HLR.socketInterface.emitAssign( params ); },
			ctx: HLR,
			isTrigger: params.isTrigger
		});


		// register midi callback
		HLR.MIDIInterface.registerCallback( params );
	}

	// register socket listener
	if( !isVisual && !noSocket ) HLR.socketInterface.registerReceivedAssign( params );

}


HLR.registerCallback = function( params ){

	if( params.callback === undefined || params.context === undefined){
		console.error('HLR.registerCallback error: you must provide a callback and a context');
	}

	// reformat callbacks
	if( params.callbacks === undefined){
		params.callbacks = [ { func: params.callback, ctx: params.context, isTrigger: params.isTrigger } ];
	}

	// add socket emitter to callbacks
	// if( isVisual ){
	// 	let socketOut = function(){
	// 		HLR.socketInterface.emit( params.keyAlternative, params.permanent || false  );
	// 	};
	// 	params.callbacks.push( { func: socketOut, ctx: HLR.socketInterface, isTrigger: params.isTrigger } );
	// }

	// REGISTER MIDI callback
	HLR.MIDIInterface.registerCallback( params );

	// register keyboard event
	if( params.keyAlternative !== undefined){
		window.addEventListener('keyup', function(e){
			if( e.key == params.keyAlternative ){
				for( let callback of params.callbacks){
						callback.func.call( callback.ctx );
				}
			}
		});
	}


	// register SOCKET key (incoming)
	// if( true == true ){
	// 	let _params = params;
	// 	// remove socket emitter from callbacks
	// 	_params.callbacks = _params.callbacks.slice(1);
	//
	// 	HLR.socketInterface.registerKey( _params );
	//
	// 	console.log('register socket');
	//
	// }

	// register socket emitter


}


HLR.init = function(){

	/* MIDI COMMANDS */

	// HLR.registerAssign({
	// 	midi: [1, 37],
	// 	isTrigger: true,
	// 	keyAlternative: 'x',
	// 	property: 'randomizeTrigger',
	// 	parent: HLR,
	// 	value: null,
	// 	permanent: true,
	// 	callback: function(v) {
	// 		HLR.randomizeTrigger = !HLR.randomizeTrigger;
	// 		console.log('HLR.randomizeTrigger', HLR.randomizeTrigger);
	// 	},
	// });


	// console.log( SOCKETINTERFACE );

	HLR.registerAssign({
		midi: [1, 41],
		isTrigger: true,
		keyAlternative: 'e',
		property: 'randomizeTrigger',
		parent: HLR,
		value: null,
		permanent: true,
		callback: function(v) {
			HLR.randomizeTrigger = !HLR.randomizeTrigger;
			console.log('HLR.randomizeTrigger', HLR.randomizeTrigger);
		},
		context: HLR
	});
	// reset server assign on startup
	if( !noSocket ) HLR.socketInterface.emitResetAssign( 'e', false );


	HLR.registerAssign({
		midi: [1, 40],
		isTrigger: true,
		keyAlternative: 'w',
		property: 'objectsTrigger',
		parent: HLR,
		value: null,
		permanent: true,
		callback: function(v) {
			HLR.objectsTrigger = !HLR.objectsTrigger;
			console.log('HLR.objectsTrigger', HLR.objectsTrigger);
		},
		context: HLR,
	});
	if( !noSocket ) HLR.socketInterface.emitResetAssign( 'w', false );



	HLR.registerAssign({
		midi: [1, 39],
		isTrigger: true,
		keyAlternative: 'q',
		property: 'textTrigger',
		parent: HLR,
		value: null,
		permanent: true,
		callback: function(v) {
			HLR.textTrigger = !HLR.textTrigger;
			console.log('HLR.textTrigger', HLR.textTrigger);
		},
		context: HLR,
	});
	if( !noSocket ) HLR.socketInterface.emitResetAssign( 'q', false );



	HLR.registerAssign({
		midi: [1, 37],
		isTrigger: true,
		keyAlternative: 'g',
		property: 'glitchEffect',
		parent: HLR,
		value: null,
		permanent: true,
		callback: function(v) {
			HLR.glitchEffect = !HLR.glitchEffect;
			console.log('HLR.glitchEffect', HLR.glitchEffect);
		},
		context: HLR,
	});
	if( !noSocket ) HLR.socketInterface.emitResetAssign( 'g', false );



	// reset scene params
	HLR.registerCallback({
		midi: [1, 36],
		callback: function(v) {

			HLS.loadParams(HLSP['exaland']);

		},
		context: HLS,
		isTrigger: true,
		keyAlternative: 'r'

	});


	if( !isVisual && !noSocket){

		function onFFTStream(s){
			HLRemote.updateFFT( s );
		}

		HLR.socketInterface.socket.on('s_stream', onFFTStream );

	}

	if( isVisual && !noSocket){

		function socketSendFFT() {

			window.setTimeout(function() {
				window.requestAnimationFrame(socketSendFFT)
			}, 1000 / 15);

			try{
				HLR.socketInterface.socket.emit('stream', [ AA.getFreq(2), AA.getFreq(0), AA.getFreq(200) ] );
			} catch(e){ }

		}

		socketSendFFT();
	}

}

var HLRemote = function() {

function HLRAuto(){
	requestAnimationFrame( HLRAuto );

	// remote control / audioreactive
	// TODO: updateParams dritto solo se sei visual, per tutti gli altri usi socketInterface
	if( isVisual ){

		try{
			updateFFT( [ AA.getFreq(2), AA.getFreq(0), AA.getFreq(200) ] );//), AA.getFreq(64), AA.getFreq(200));
			// if(!noSocket) {
			// 	HLR.socketInterface.socket.emit('stream', [ AA.getFreq(2), AA.getFreq(0), AA.getFreq(200) ] );
			// }
		} catch(e){}

	}


	/* leveling down ffts, expecially in case websocket lose connection */
	for(let f=0; f<HLR.fft.length; f++){
		HLR.fft[f] *= 0.99;
	}

}
requestAnimationFrame( HLRAuto );


function updateFFT( array ) {

	for( let a = 0; a<array.length; a++){
		HLR.fft[a] = Math.max( array[a], 0.000111 );
		HLR.smoothFft[a] += (HLR.fft[a] - HLR.smoothFft[a]) * 0.04;

	}

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
	updateHLParams: updateHLParams,
	updateFFT: updateFFT
}

}();
