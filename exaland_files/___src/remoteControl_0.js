// this stores all data coming from websocket / any remote source we want to connect
// TODO socket here
var HLR = {
	//audio
	fft: [0,0,0],
	smoothFft: [0,0,0],
	soundSensibility: 1,

	// TRIGGERS FOR SCENE ACTIONS
	randomizeTrigger: false,
	textTrigger: false,
	objectsTrigger: false,
	glitchEffect: false,
	landMorphSpeed: .00034,

	// global game status
	GAMESTATUS: 0,
	PREVGAMESTATUS: null,

	MIDIInterface: new MIDIInterface(),
	socketInterface: STATUS.NOSOCKET ? null : new socketInterface( SOCKETSERVER ),
	SOCKET_STREAMS_PER_SECOND: 15
}


HLR.registerAssign = function( params ){

	// register MIDI callback
	if( STATUS.ISVISUAL ){

		// add key event listener
		window.addEventListener('keyup', function(e){

			if( e.key == params.keyAlternative ){
				// assign value
				params.parent[params.property] = params.isTrigger? !params.parent[params.property] : params.value;
				// send socket message
				if( STATUS.ISVISUAL && !STATUS.NOSOCKET) HLR.socketInterface.emitAssign( params );

			}

		});


		// reformat callbacks
		if( params.callbacks === undefined){
			params.callbacks = [ { func: params.callback, ctx: params.context, isTrigger: params.isTrigger } ];
		}


		// else if( SOCKET && socketOut ){
    //   params.callbacks.push( { func: function(){ SOCKET.emitAction( params.keyCode, params.permanentId ); }, ctx: SOCKET } );
    // }

		if( !STATUS.NOSOCKET ){
			params.callbacks.push({
				func: function() { HLR.socketInterface.emitAssign( params ); },
				ctx: HLR,
				isTrigger: params.isTrigger
			});
		}


		// register midi callback
		HLR.MIDIInterface.registerCallback( params );
	}

	// register socket listener
	if( !STATUS.ISVISUAL && !STATUS.NOSOCKET ) HLR.socketInterface.registerReceivedAssign( params );

}


HLR.registerCallback = function( params ){

	if( params.callback === undefined || params.context === undefined){
		console.error('HLR.registerCallback error: you must provide a callback and a context');
	}

	// reformat callbacks
	if( params.callbacks === undefined){
		params.callbacks = [ { func: params.callback, ctx: params.context, isTrigger: params.isTrigger } ];
	}


	// IF VISUAL add socket emitter to callbacks for midi
	if( STATUS.ISVISUAL && !STATUS.NOSOCKET){
		let socketOut = function(){
			HLR.socketInterface.sendKey( params.keyAlternative, params.permanent || false  );
			console.log("sent key on socket");
		};
		params.callbacks.push( { func: socketOut, ctx: HLR.socketInterface, isTrigger: params.isTrigger } );
	}


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


// KEYS ARE JUST MIRRORED BY THE SERVER
// WHEN socketInterface receives a s_key, fires a KEYOP event that should trigger the key listener


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




// INIT ACTIONS, FROM SEPARATE FILES
HLR.actions_Remidi = actions_Remidi;
HLR.actions_Voicelive = actions_Voicelive;
HLR.actions_Rossi = actions_Rossi;



HLR.init = function(){

//HLR.registerAssignRemidi();
// HLR.actions_Remidi( );
actions_Rossi();
actions_Ableton();

	if( !STATUS.ISVISUAL && !STATUS.NOSOCKET){

		function onFFTStream(s){
			HLRemote.updateFFT( s );
		}

		HLR.socketInterface.socket.on('s_stream', onFFTStream );

	}

	if( STATUS.ISVISUAL && !STATUS.NOSOCKET){

		function socketSendFFT() {

			window.setTimeout(function() {
				window.requestAnimationFrame(socketSendFFT)
			}, 1000 / HLR.SOCKET_STREAMS_PER_SECOND);

			try{
				HLR.socketInterface.emit('stream', [ AA.getFreq(2), AA.getFreq(0), AA.getFreq(200) ] );
			} catch(e){ }

		}

		socketSendFFT();
	}


	if( !STATUS.NOSOCKET ) HLR.socketInterface.emitReady();

}



var HLRemote = function() {

function HLRAuto(){
	requestAnimationFrame( HLRAuto );

	// remote control / audioreactive
	// TODO: updateParams dritto solo se sei visual, per tutti gli altri usi socketInterface
	if( STATUS.ISVISUAL ){

		try{
			updateFFT( [ AA.getFreq(2) , AA.getFreq(0), AA.getFreq(200) ] );//), AA.getFreq(64), AA.getFreq(200));
			// if(!STATUS.NOSOCKET) {
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
		HLR.fft[a] = Math.max( array[a] * HLR.soundSensibility, 0.000111 );
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


		// 	space:['auror
		// sea:['whale',
		// bigfishes:['w
		// ducks:['ducky
		// buildings:['b
		// waste:['barre
		// civilization:
		//
		// shoot models
		if (k.key == 'a' || k.key == 'A' ) {
			// HLH.startModel(HL.models['elephant'],
			// 	THREE.Math.randInt(-1000, 1000),
			// 	-20, 0, null, 10
			// );
			HLH.startGroup(['sea', 2, 0, 'y', true, 0, true]);

		}

		if (k.key == 's' || k.key == 'S' ) {
			HLH.startGroup(['bigfishes', 2, 0, null, false, 0, true]);
		}
		// group, scale, speed, rotations, floating, midpoint, towardsCamera
		if (k.key == 'd' || k.key == 'D' ) {
			HLH.startGroup(['waste', 2, 1, 'xyz', false, HLE.WORLD_HEIGHT, true]);
		}
		// model,xPosition,y,speed,rotations, scale, isParticle, towardsCamera
		if (k.key == 'f' || k.key == 'F' || k.keyCode == 69) {
			HLH.startGroup(['civilization', 2, 0, null, true, 0, true]);
		}


		// SECRETS
		if (k.key == 't' || k.key == 'T' ) {
			HLH.startModel(HL.models['trex'],
			// THREE.Math.randInt(-1000, 1000), -2, 0, 'xyz', 50, false, true
			THREE.Math.randInt(-1000, 1000), -5, 0, null, 10, false, true
			);
		}

		if (k.key == 'c' || k.key == 'C' ) {
			HLH.startModel(HL.models['chainsaw'],
				THREE.Math.randInt(-1000, 1000), -1, 0, 'xyz', 5, false, true
			);
		}

		//mobile shot
		// if (k.keyCode == 53 || k.key == 'mX') { // 5
		// 	//HLH.startGroup(['space', 1, 1, true, false, HLE.WORLD_HEIGHT / 3]);
		// 	HLH.startAll();
		// }

	}


	// if (HLR.GAMESTATUS > 0) {
	// 	if (k.keyCode == 13 || k.key == 'mS') { //'Enter'
	// 		// HLE.acceleration = THREE.Math.clamp(HLE.acceleration+=0.009, 0, 2);
	// 		screenshot();
	//
	// 	}
	// }

	// DEV / EXTRA
	// if (k.keyCode == 77 || k.key == 'm') {
	// 	AA.connectMic();
	// }
	//
	// if (k.keyCode == 70 || k.key == 'f') {
	// 	AA.connectFile();
	// }

} // END keyboardControls()

// listen keyboard TODO+ check final commands!
if (!STATUS.CARDBOARD)
	window.addEventListener('keyup', keyboardControls);



// if (STATUS.CARDBOARD)
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
// if (STATUS.ISMOBILE) {
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
