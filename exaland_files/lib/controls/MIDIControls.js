/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author paulirish / http://paulirish.com/
 */

THREE.MIDIControls = function(object, domElement, params) {

	this.object = object;
	this.target = new THREE.Vector3(0, 0, 0);

	this.domElement = (domElement !== undefined) ? domElement : window;

	params = params || {};
	params.floor = params.floor !== undefined ? params.floor : 20;
	params.ceiling = params.ceiling !== undefined ? params.ceiling : HLE.WORLD_HEIGHT * 4;


	this.enabled = true;

	this.movementSpeed = 1.0;
	this.lookSpeed = 0.005;

	this.lookVertical = true;
	this.autoForward = false;

	this.activeLook = true;
	this.dragToLook = false;


	this.invertY = false;

	this.heightSpeed = false;
	this.heightCoef = 1.0;
	this.heightMin = 0.0;
	this.heightMax = 1.0;

	this.constrainVertical = false;
	this.verticalMin = 0;
	this.verticalMax = Math.PI;

	this.autoSpeedFactor = 0.0;

	this.mouseX = 0;
	this.mouseY = 0;
	this.tempMouseX = 0;
	this.tempMouseY = 0;

	this.lat = 0;
	this.lon = 0;
	this.phi = 0;
	this.theta = 0;

	this.moveForward = false;
	this.moveBackward = false;
	this.moveLeft = false;
	this.moveRight = false;

	this.mouseDragOn = false;

	this.viewHalfX = 0;
	this.viewHalfY = 0;


	//remidi mapping
	const POLLICE = 43;
	const INDICE = 42;
	const MEDIO = 41;
	const ANULARE = 40;
	const MIGNOLO = 39;
	const PALM_MIGNOLO = 38;
	const PALM_INDICE = 37;
	const PALM_POLSO = 36;

	const KNOB_L = 1;
	const KNOB_R = 2;
	const KNOB_PUSH = 3;

	const L_BUTTON = 4;
	const R_BUTTON = 5;

  this.Yaxis = 0;
	this.nYaxis = 0;

	navigator.requestMIDIAccess().then(
		this.onMIDIInit,
		this.onMIDISystemError);

	this.onMIDISystemError = function(e) {
		console.log(e);
		return;
	}

	this.onMIDIInit = function( midi ) {
		console.log('MIDIcontrols init');
		for (var input of midi.inputs.values())
			input.onmidimessage = this.midiMessageReceived;
	}



	function parseMidiMessage(m) {
		return {
			command: m.data[0] >> 4,
			channel: m.data[0] & 0xf,
			note: m.data[1],
			velocity: m.data[2]
		}
	}


	this.midiMessageReceived = function(ev) {

		let m = parseMidiMessage(ev);

		// if(note!=22 && note!=24){
		// 	console.log(ev);
		// } else
		if (m.note == 24) {
			this.nYaxis = ((1 - m.velocity / 127) - 0.5);
			this.Yaxis += (this.nYaxis - this.Yaxis) * 0.2;

      this.mouseY = this.Yaxis;
		}

		// 			if(note == 22 ){
		// 				let nVal = HL.cameraGroup.rotation.x + ( ( ev.data[2] / 127 ) - 0.5 ) / 2;
		// 				HL.cameraGroup.rotation.x += ( nVal - HL.cameraGroup.rotation.x ) * 0.051;
		// //				HL.cameraGroup.rotateY( (0.1 - ev.data[2] / 1270) - 0.05 );
		// 			}

		if (note == INDICE) {
			let val = ev.data[2] / 127;
			val *= val * val * val * val * val;
			HL.camera.zoom = 1 + val;
			HL.camera.updateProjectionMatrix();
		}

		if (note == MEDIO) {
			let val = ev.data[2] / 127;
			val *= val * val * val * val * val;
			HL.materials.land.uniforms.landSeed.value += val * 0.01;
		}

		if (note == ANULARE) {
			let val = ev.data[2] / 127;
			val *= val * val * val * val * val;
			HLE.acceleration = THREE.Math.clamp(val * 3, 0, 3);
		}
	}



	if (this.domElement !== document) {

		this.domElement.setAttribute('tabindex', -1);

	}

	//

	this.handleResize = function() {

		if (this.domElement === document) {

			this.viewHalfX = window.innerWidth / 2;
			this.viewHalfY = window.innerHeight / 2;

		} else {

			this.viewHalfX = this.domElement.offsetWidth / 2;
			this.viewHalfY = this.domElement.offsetHeight / 2;

		}

	};


	// this.onMouseMove = function(event) {
  //
	// 	if (!this.dragToLook || (this.dragToLook && this.mouseDragOn)) {
  //
	// 		if (this.domElement === document) {
  //
	// 			this.mouseX = event.pageX - this.viewHalfX;
	// 			this.mouseY = event.pageY - this.viewHalfY;
  //
	// 		} else {
  //
	// 			this.mouseX = (event.pageX - this.domElement.offsetLeft - this.viewHalfX);
	// 			this.mouseY = (event.pageY - this.domElement.offsetTop - this.viewHalfY);
  //
	// 		}
  //
	// 		if (this.dragToLook) {
	// 			this.mouseX -= this.tempMouseX;
	// 			this.mouseY -= this.tempMouseY;
	// 		}
	// 	}
	// };

	this.onKeyDown = function(event) {

		//event.preventDefault();

		switch (event.keyCode) {

			case 38:
				/*up*/
			case 87:
				/*W*/ this.moveForward = true;
				break;

			case 37:
				/*left*/
			case 65:
				/*A*/ this.moveLeft = true;
				break;

			case 40:
				/*down*/
			case 83:
				/*S*/ this.moveBackward = true;
				break;

			case 39:
				/*right*/
			case 68:
				/*D*/ this.moveRight = true;
				break;

			case 82:
				/*R*/ this.moveUp = true;
				break;
			case 70:
				/*F*/ this.moveDown = true;
				break;

		}

	};

	this.onKeyUp = function(event) {

		switch (event.keyCode) {

			case 38:
				/*up*/
			case 87:
				/*W*/ this.moveForward = false;
				break;

			case 37:
				/*left*/
			case 65:
				/*A*/ this.moveLeft = false;
				break;

			case 40:
				/*down*/
			case 83:
				/*S*/ this.moveBackward = false;
				break;

			case 39:
				/*right*/
			case 68:
				/*D*/ this.moveRight = false;
				break;

			case 82:
				/*R*/ this.moveUp = false;
				break;
			case 70:
				/*F*/ this.moveDown = false;
				break;

		}

	};

	this.update = function(delta) {

		// if( this.dragToLook && !this.mouseDragOn ){
		// 	return;
		// }

		if (this.enabled === false) return;

		if (this.heightSpeed) {

			var y = THREE.Math.clamp(this.object.position.y, this.heightMin, this.heightMax);
			var heightDelta = y - this.heightMin;

			this.autoSpeedFactor = delta * (heightDelta * this.heightCoef);

		} else {

			this.autoSpeedFactor = 0.0;

		}

		var actualMoveSpeed = delta * this.movementSpeed;

		if (this.moveForward || (this.autoForward && !this.moveBackward))
		// this.object.translateZ( - ( actualMoveSpeed + this.autoSpeedFactor ) );
			HLE.acceleration = THREE.Math.clamp(HLE.acceleration += 0.0045, 0, 1);

		else if (!this.moveForward && !this.autoForward) {

			HLE.acceleration = THREE.Math.clamp(HLE.acceleration -= 0.016, 0, 1);

		}

		// if ( this.moveBackward )
		// 	// this.object.translateZ( actualMoveSpeed );
		// 	HLE.acceleration = THREE.Math.clamp(HLE.acceleration-=1, 0, HLE.MAX_MOVE_SPEED);


		// if ( this.moveLeft ) this.object.translateX( - actualMoveSpeed );
		// if ( this.moveRight ) this.object.translateX( actualMoveSpeed );

		// if ( this.moveUp ) this.object.translateY( actualMoveSpeed );
		// if ( this.moveDown ) this.object.translateY( - actualMoveSpeed );

		var actualLookSpeed = delta * this.lookSpeed * (HLE.acceleration + 1) * 0.5;

		if (!this.activeLook) {

			actualLookSpeed = 0;

		}

		var verticalLookRatio = 1;

		if (this.constrainVertical) {

			verticalLookRatio = Math.PI / (this.verticalMax - this.verticalMin);

		}

		this.lon += this.mouseX * actualLookSpeed;
		if (this.lookVertical) this.lat -= this.mouseY * actualLookSpeed * verticalLookRatio * (this.invertY ? -1 : 1);

		this.lat = Math.max(-85, Math.min(85, this.lat));
		this.phi = THREE.Math.degToRad(90 - this.lat);

		this.theta = THREE.Math.degToRad(this.lon - 90) - Math.PI;

		if (this.constrainVertical) {

			this.phi = THREE.Math.mapLinear(this.phi, 0, Math.PI, this.verticalMin, this.verticalMax);

		}

		var targetPosition = this.target,
			position = this.object.position;

		targetPosition.x = position.x + 100 * Math.sin(this.phi) * Math.cos(this.theta);
		targetPosition.y = position.y + 100 * Math.cos(this.phi);
		targetPosition.z = position.z + 100 * Math.sin(this.phi) * Math.sin(this.theta);

		this.object.lookAt(targetPosition);


		// camera  up / down
		if (this.mouseDragOn) {
			this.rv.setFromQuaternion(this.object.quaternion, 'YXZ');
		}
		if (HLE.acceleration > 0.01) {
			this.object.position.y =
				THREE.Math.clamp(this.object.position.y +
					this.rv.x * HLE.MAX_MOVE_SPEED * HLE.acceleration * .5,
					params.floor, params.ceiling
				);
		}

		// if(frameCount%60==0)
		// 	console.log(this.object.position.y);
	}

	this.rv = new THREE.Euler(0, 0, 0, 'YXZ');


	function contextmenu(event) {

		event.preventDefault();

	}

	this.dispose = function() {

		this.domElement.removeEventListener('contextmenu', contextmenu, false);
		this.domElement.removeEventListener('mousemove', _onMouseMove, false);
		this.domElement.removeEventListener('mousedown', _onMouseDown, false);
		this.domElement.removeEventListener('mouseup', _onMouseUp, false);
		//
		// window.removeEventListener( 'keydown', _onKeyDown, false );
		// window.removeEventListener( 'keyup', _onKeyUp, false );

	}

	var _onMouseMove = bind(this, this.onMouseMove);
	var _onMouseDown = bind(this, this.onMouseDown);
	var _onMouseUp = bind(this, this.onMouseUp);
	// var _onKeyDown = bind( this, this.onKeyDown );
	// var _onKeyUp = bind( this, this.onKeyUp );
	var _midiMessageReceived = bind(this, this.midiMessageReceived);


	this.domElement.addEventListener('contextmenu', contextmenu, false);
	this.domElement.addEventListener('mousemove', _onMouseMove, false);
	this.domElement.addEventListener('mousedown', _onMouseDown, false);
	this.domElement.addEventListener('mouseup', _onMouseUp, false);
	//
	// window.addEventListener( 'keydown', _onKeyDown, false );
	// window.addEventListener( 'keyup', _onKeyUp, false );

	function bind(scope, fn) {

		return function() {

			fn.apply(scope, arguments);

		};

	}

	this.handleResize();

};
