/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author paulirish / http://paulirish.com/
 */

THREE.RossiControls = function ( object, _IOInterface) {

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



	if( _IOInterface === undefined ){
		_IOInterface = new IOInterface();
	}
	// ROLL
	_IOInterface.registerCallback({
		midi: [10, 23],
		name: "CMD_roll",
		callback: function(v){
				if( t.midiData.on ){
					t.midiData.roll = v / 63.5 - 1;
				}
			},
		context: t
	});

	// PITCH
	_IOInterface.registerCallback({
		midi: [10, 22],
		name: "CMD_pitch",
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
	// _IOInterface.registerCallback({
	// 	midi: [1, 42],
	// 	callback: function(v){
	// 			midiData.w = v / 128
	// 		},
	// 	context: t
	// });

	//SPEED
	_IOInterface.registerCallback({
		midi: [10, 20],
		name: "CMD_speed",
		callback: function(v){
				t.midiData.s = v / 63.5 - 1;
			},
		context: t
	});

	HLR.registerCallback({
		midi: [10, 24],
		name: "CMD_sound_sens",
		callback: function(v) {

			// HLS.loadParams(HLSP['hyperland']);
			HLR.soundSensibility = Math.max( v / 128, 0 );

		},
		context: HLR
	});

	//
	HLR.registerCallback({
		midi: [10, 25],
		name: "CMD_land_morph_speed",
		callback: function(v) {

			// HLS.loadParams(HLSP['hyperland']);
			HLR.landMorphSpeed = Math.max( ( v - 1 ) / 60000, 0 );

		},
		context: HLR
	});

	//SPEED sMultiplier
	_IOInterface.registerCallback({
		midi: [10, 26],
		name: "CMD_speed_multiplier",
		callback: function(v){
				t.midiData.sMultiplier = ( v / 127 - 0.015 ) * 1.016;
			},
		context: t
	});


	// strafe
	// _IOInterface.registerCallback({
	// 	midi: [1, 21],
	// 	callback: function(v){
	// 			if ( v > 63.5 )
	// 				midiData.strafe = true;
	// 			else
	// 				midiData.strafe = false;
	// 		},
	// 	context: t
	// });

	// _IOInterface.registerCallback({
	// 	midi: [10, 21],
	// 	callback: function(v){
	// 			t.midiData.height = ( v / 63.5 - 1 ) * .5;
	// 		},
	// 	context: t
	// });



	// on / pause cam CONTROLS
	_IOInterface.registerCallback({
		midi: [10, 66],
		name: "CMD_lock_toggle",
		callback: function(v){
					t.midiData.on = !t.midiData.on;
					console.log('t.midiData.on', t.midiData.on);
		},
		context: t
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
