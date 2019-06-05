/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author paulirish / http://paulirish.com/
 */

THREE.RossiControls = function ( object, _MIDIInterface) {

	console.log('THREE.RossiControls init');

	var t = this;

	this.object = object;

	// this.vec = new THREE.Vector2();
	this.euler = new THREE.Euler(0,0,0,'YXZ');


	this.sensibility = 1;
	this.smoothing = 0.93;


	function log(){
		console.log.apply(this, arguments);
	}



	this.localData = {}

	this.midiData = {
		pitch: 0,
		roll: 0,
		w: false,
		// a: false,
		s: false,
		sMultiplier: 1,
		// d: false,
		strafe: false,
		on: true,
		height: 0,
	}



	if( _MIDIInterface === undefined ){
		_MIDIInterface = new MIDIInterface();
	}
	// ROLL
	_MIDIInterface.registerCallback({
		midi: [9, 23],
		callback: function(v){
				if( t.midiData.on ){
					t.midiData.roll = v / 63.5 - 1;
				}
			},
		context: t
	});

	// PITCH
	_MIDIInterface.registerCallback({
		midi: [9, 22],
		callback: function(v){
				if( t.midiData.on ){
					t.midiData.pitch = v / 63.5 - 1; //Math.min( v, 64 ) / 32 - 1;
				} else {
					t.midiData.pitch *= 0.85;
				}
			},
		context: t
	});

	//W
	// _MIDIInterface.registerCallback({
	// 	midi: [1, 42],
	// 	callback: function(v){
	// 			midiData.w = v / 128
	// 		},
	// 	context: t
	// });

	//SPEED
	_MIDIInterface.registerCallback({
		midi: [9, 20],
		callback: function(v){
				t.midiData.s = v / 63.5 - 1;
			},
		context: t
	});

	HLR.registerCallback({
		midi: [9, 24],
		callback: function(v) {

			// HLS.loadParams(HLSP['hyperland']);
			HLR.soundSensibility = Math.max( v / 128, 0 );

		},
		context: HLR,
	//	isTrigger: false,
//		keyAlternative: 'l'
	});

	//
	HLR.registerCallback({
		midi: [9, 25],
		callback: function(v) {

			// HLS.loadParams(HLSP['hyperland']);
			HLR.landMorphSpeed = Math.max( ( v - 1 ) / 60000, 0 );

		},
		context: HLR,
	//	isTrigger: false,
//		keyAlternative: 'l'
	});

	//SPEED sMultiplier
	_MIDIInterface.registerCallback({
		midi: [9, 26],
		callback: function(v){
				t.midiData.sMultiplier = ( v / 127 - 0.015 ) * 1.016;
			},
		context: t
	});


	// strafe
	// _MIDIInterface.registerCallback({
	// 	midi: [1, 21],
	// 	callback: function(v){
	// 			if ( v > 63.5 )
	// 				midiData.strafe = true;
	// 			else
	// 				midiData.strafe = false;
	// 		},
	// 	context: t
	// });

	// _MIDIInterface.registerCallback({
	// 	midi: [9, 21],
	// 	callback: function(v){
	// 			t.midiData.height = ( v / 63.5 - 1 ) * .5;
	// 		},
	// 	context: t
	// });



	// on / pause cam CONTROLS
	_MIDIInterface.registerCallback({
		midi: [9, 66],
		callback: function(v){
					t.midiData.on = !t.midiData.on;
					console.log('t.midiData.on', t.midiData.on);
		},
		context: t,
		isTrigger: true
	});


	// SAFETY KEY COMMANDS
	this.remidiCamOn = true;

	function keyup(e){

		if( e.key == '-'){
			t.remidiCamOn = !t.remidiCamOn;

			if(!t.remidiCamOn){
				t.midiData.on = false;
				t.midiData.s = false;
				t.euler.set( -.1, 0, 0);
				object.quaternion.setFromEuler( t.euler );
				HLR.soundSensibility = 1;
				HLR.landMorphSpeed = 0.00034;
			}
			else {
				t.midiData.on = true;
			}
		}

	}

	window.addEventListener('keyup', keyup );


	this.update = function(){

	  if ( t.remidiCamOn ){

			// add or lerp values
			for(let key in t.midiData){
				if( t.localData[key]===undefined || typeof t.midiData[key] == 'boolean') t.localData[key] = t.midiData[key];
				else {
					t.localData[key] = THREE.Math.lerp( t.midiData[key] * Math.abs( t.midiData[key] ), t.localData[key], t.smoothing );
				}
			}

			t.euler.x += t.localData.pitch * t.sensibility * 0.012;
			t.euler.y -= t.localData.roll * t.sensibility * 0.018;
			t.euler.z = -t.localData.roll * t.sensibility * 0.40;

			object.quaternion.setFromEuler( t.euler );

			HLE.acceleration =  - ( t.midiData.s * 4 * t.midiData.sMultiplier );
			// if( frameCount % 30 == 0){
			// 	console.log("spe ", (t.midiData.s * 4 * t.midiData.sMultiplier), t.midiData.s, t.midiData.sMultiplier);
			// }

			object.position.y += t.midiData.height;

		} else {
			HLE.acceleration = 1;

		}



	}


};
