/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author paulirish / http://paulirish.com/
 */

THREE.RemidiControls = function ( object, _MIDIInterface) {

	console.log('THREE.RemidiControls init');

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
		// d: false,
		strafe: false,
		on: true
	}



	if( _MIDIInterface === undefined ){
		_MIDIInterface = new MIDIInterface();
	}
	// ROLL
	_MIDIInterface.registerCallback({
		midi: [1, 24],
		callback: function(v){
				if( t.midiData.on ){
					t.midiData.roll = v / 64 - 1;
				}
			},
		context: t
	});

	// PITCH
	_MIDIInterface.registerCallback({
		midi: [1, 22],
		callback: function(v){
				if( t.midiData.on ){
					t.midiData.pitch = v / 64 - 1; //Math.min( v, 64 ) / 32 - 1;
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

	//S
	_MIDIInterface.registerCallback({
		midi: [1, 42],
		callback: function(v){
				t.midiData.s = v / 128
			},
		context: t
	});

	// strafe
	// _MIDIInterface.registerCallback({
	// 	midi: [1, 41],
	// 	callback: function(v){
	// 			if ( v > 1 )
	// 				midiData.strafe = true;
	// 			else
	// 				midiData.strafe = false;
	// 		},
	// 	context: t
	// });

	// on / pause cam CONTROLS
	_MIDIInterface.registerCallback({
		midi: [1, 43],
		callback: function(v){
					t.midiData.on = !t.midiData.on;
					console.log('t.midiData.on', t.midiData.on);
		},
		context: t,
		isTrigger: true
	});


	// SAFETY KEY COMMANDS
	var remidiCamOn = true;

	function keyup(e){

		if( e.key == 'c'){
			remidiCamOn = !remidiCamOn;

			if(!remidiCamOn){
				t.midiData.on = false;
				t.euler.set( -.1, 0, 0);
				object.quaternion.setFromEuler( t.euler );
			}
			else {
				t.midiData.on = true;
			}
		}

	}

	window.addEventListener('keyup', keyup );


	this.update = function(){

	  // if ( t.midiData.on ){

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

		// }

		HLE.acceleration = 1 - t.midiData.s * 4;

	}


};
