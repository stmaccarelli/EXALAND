/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author paulirish / http://paulirish.com/
 */

THREE.RemidiControls = function ( object, _MIDIInterface) {

	var t = this;

	this.object = object;

	// this.target = new THREE.Vector3( 0, 0, 0 );

	this.sensibility = 1;
	this.smoothing = 0.93;


	function log(){
		console.log.apply(this, arguments);
	}



	this.localData = {}

	midiData = {
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
				midiData.roll = v / 64 - 1;
			},
		context: t
	});

	// PITCH
	_MIDIInterface.registerCallback({
		midi: [1, 22],
		callback: function(v){
				midiData.pitch = v / 64 - 1; //Math.min( v, 64 ) / 32 - 1;
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
	// _MIDIInterface.registerCallback({
	// 	midi: [1, 43],
	// 	callback: function(v){
	// 			midiData.s = v / 128
	// 		},
	// 	context: t
	// });

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

	_MIDIInterface.registerCallback({
		midi: [1, 43],
		callback: function(v){
					midiData.on = !midiData.on;
					console.log('midiData.on', midiData.on);
		},
		context: t,
		isTrigger: true
	});


	var setObjectQuaternion = function () {

		var zee = new THREE.Vector3( 0, 0, 1 );

		var euler = new THREE.Euler();

		var q0 = new THREE.Quaternion();

		var q1 = new THREE.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis

		return function ( quaternion, alpha, beta, gamma, orient ) {

			euler.set( beta, alpha, - gamma, 'YXZ' );                       // 'ZXY' for the device, but 'YXZ' for us

			quaternion.setFromEuler( euler );                               // orient the device

			// quaternion.multiply( q1 );                                      // camera looks out the back of the device, not the top

			// quaternion.multiply( q0.setFromAxisAngle( zee, - orient ) );    // adjust for screen orientation

		}

	}();


	// this.update = function( ){
	//
	// 	// add or lerp values
  //   for(let key in midiData){
	// 		if( this.localData[key]===undefined || typeof midiData[key] == 'boolean') this.localData[key] = midiData[key];
	// 		else {
	// 			this.localData[key] = THREE.Math.lerp( midiData[key] * Math.abs(midiData[key]), this.localData[key], 0.95);
	// 		}
	// 	}
	//
	// 	if( this.localData.strafe ){
	// 		object.translateX( -  this.localData.roll  * this.sensibility * 5.0 );
	// 		object.translateY(  this.localData.pitch * this.sensibility * 5.0 ); //pitch is hacky
	// 	}
	// 	else{
	//
	// 		object.translateX(   - this.localData.roll  * this.sensibility * 0.25 );
	// 		object.translateY(   - this.localData.pitch * this.sensibility * 0.25 ); //pitch is hacky
	//
	// 		object.rotateY( - this.localData.roll * this.sensibility);
	// 		object.rotateX( this.localData.pitch * ( this.sensibility * 0.75) ); //pitch is hacky
	// 	}
	//
	// 	object.translateZ( - this.localData.w * 0.25 + this.localData.s * 0.25);
	// }

	var vec = new THREE.Vector2();
	var euler = new THREE.Euler(0,0,0,'YXZ');


	this.update = function(){

	  if ( midiData.on ){

			// add or lerp values
			for(let key in midiData){
				if( this.localData[key]===undefined || typeof midiData[key] == 'boolean') this.localData[key] = midiData[key];
				else {
					this.localData[key] = THREE.Math.lerp( midiData[key] * Math.abs(midiData[key]), this.localData[key], this.smoothing);
				}
			}

			euler.x += t.localData.pitch * this.sensibility * 0.012;
			euler.y -= this.localData.roll * this.sensibility * 0.018;
			euler.z = -this.localData.roll * this.sensibility * 0.40;



			object.quaternion.setFromEuler( euler );

		}

	}


	// SAFETY KEY COMMANDS
	var remidiCamOn = true;

	function keyup(e){

		if( e.key == 'c'){
			remidiCamOn = !remidiCamOn;

			if(!remidiCamOn){
				midiData.on = false;
				euler.set( -.1, 0, 0);
				object.quaternion.setFromEuler( euler );
			}
			else {
				midiData.on = true;
			}
		}

	}
	
	window.addEventListener('keyup', keyup );





};
