var HLS = {

	// just a local for requestAnimationFrame
	raf: null,
	sceneStart: 0,
	sceneProgress: 0,
	modelsParams: null,
	sceneId: null, //stores current scene id
	defaultScene: 'exaland',

	//local debouncers
	shotFlora: true,

	// varie
	tempColor: 0,

	//hud
	//  hud: null,

	color: new THREE.Vector3(),
	lumi: 0,

	landColorChange: false,

	// TRIGGERS FOR SCENE ACTIONS
	randomizeTrigger: false,
	textTrigger : false,
	objectsTrigger : false,

	MIDIInterface: new MIDIInterface(),

}

// custom scene init (follows standard init)
HLS.initScenes =   {};
// holds standard, can be extended to custom scenes, called by rAF
HLS.scenes = {};
// custom scenes addons, follow scenes, called in scenes
HLS.scenesAddons = {};


// function initHUD(){
//   HLS.hud = new HUD(true);
//   window.removeEventListerer(load);
// }
// var load = window.addEventListener('HLEload',initHUD);



HLS.loadParams = function(params) {

	if (params.speed !== undefined)
		HLE.BASE_MOVE_SPEED = ((isVR || isCardboard) ? (params.speed * 1) : params.speed);

	if (params.cameraPositionY !== undefined)
		HL.cameraGroup.position.y = params.cameraPositionY;
	else HL.cameraGroup.position.y = 50;
	HL.cameraGroup.updateMatrix();
	HL.cameraGroup.updateMatrixWorld();

	if (params.seaLevel !== undefined)
		HL.sea.position.y = params.seaLevel;
	else
		HL.sea.position.y = 0;

	if (HL.scene.fog !== null) {
		if (params.fogDeensity !== undefined)
			HL.scene.fog.density = params.fogDensity;
		else HL.scene.fog.density = 0.00015;
	}

	if (params.modelsParams !== undefined)
		HLS.modelsParams = params.modelsParams;
	else
		HLS.modelsParams = null;

	if (params.tiles !== undefined) {
		HL.land.geometry = new THREE.PlaneBufferGeometry(
			HLE.WORLD_WIDTH, HLE.WORLD_WIDTH,
			params.tiles, params.tiles);
		HL.land.geometry.rotateX(-Math.PI / 2);
		HL.land.material.uniforms.worldModuleWidth.value = HLE.WORLD_WIDTH / params.tiles;
	}
	if (params.repeatUV !== undefined)
		HL.land.material.uniforms.repeatUV.value = new THREE.Vector2(params.repeatUV, params.repeatUV);
	if (params.bFactor !== undefined)
		HL.land.material.uniforms.bFactor.value = params.bFactor;
	if (params.cFactor !== undefined)
		HL.land.material.uniforms.cFactor.value = params.cFactor;
	if (params.landSeed !== undefined)
		HL.land.material.uniforms.landSeed.value = params.landSeed;
	else
		HL.land.material.uniforms.landSeed = 1000;
	if (params.map !== undefined)
		HL.land.material.uniforms.map.value = HL.textures[params.map];
	if (params.map2 !== undefined)
		HL.land.material.uniforms.map2.value = HL.textures[params.map2];
	if (params.mapSand !== undefined)
		HL.land.material.uniforms.mapSand.value = HL.textures[params.mapSand];
	if (params.natural !== undefined)
		HL.land.material.uniforms.natural.value = params.natural;
	if (params.rainbow !== undefined)
		HL.land.material.uniforms.rainbow.value = params.rainbow;
	if (params.squareness !== undefined)
		HL.land.material.uniforms.squareness.value = params.squareness;
	if (params.landRGB !== undefined)
		HLC.land.set(params.landRGB);
	if (params.horizonRGB !== undefined) {
		HLC.horizon.set(params.horizonRGB);
		HLC.tempHorizon.set(params.horizonRGB);
		// chiaro o scuro in base a orario
		// HLC.tempHorizon.multiplyScalar(HLE.CURRENT_HOUR * 0.9 + 0.1);

	}
	if (params.skyMap !== undefined)
		HL.materials.sky.map = HL.textures[params.skyMap];

	if (params.landColorChange !== undefined)
		HLS.landColorChange = params.landColorChange;

	if (params.centerPath !== undefined) {
		HL.materials.land.uniforms.withCenterPath.value =
			HLE.CENTER_PATH =
			params.centerPath;
	}

	// THIS SETS UP DYNAMIC TEXTURE FOR CUBE

	HL.cameraCompanion.material.map = HL.dynamicTextures.textbox.texture;
	HL.cameraCompanion.material.needsUpdate = true;
}

HLS.startScene = function(sceneId) {
	HLS.sceneId = sceneId;
	// cancel previous animation
	if (isVR) HL.VREffect.cancelAnimationFrame(HLS.raf);
	else window.cancelAnimationFrame(HLS.raf);

	//reset motion params
	HLE.acceleration = HLE.reactiveMoveSpeed = HLE.moveSpeed = 0;

	if (HLSP[sceneId] !== undefined) {

		//start hud display
		//if (HLS.hud !== undefined && !noHUD) HLS.hud.display((isMobile||isVR)?'':(HLSP[sceneId].displayText || sceneId), 8, false);

		//load scene parameters
		HLS.loadParams(HLSP[sceneId]);

	}


	//reset fog
	if (HL.scene.fog !== null)
		HL.scene.fog.density = 0.00025;

	//destroy all running models
	HLH.destroyAllModels();

	// reset camera rotations etc
	HL.cameraGroup.rotation.x = 0;
	HL.cameraGroup.rotation.y = 0;
	HL.cameraGroup.rotation.z = 0;
	HL.cameraCompanion.visible = false;


	//init custom scene, in case any
	// TODO try to remove and parametrize everything in scenesParams
	if (HLS.initScenes[sceneId] !== undefined)
		HLS.initScenes[sceneId]();

	// scene timer, useful for timed scene events
	// eg:  if(frameCount-HLS.sceneStart>=600) HLR.startScene('scene2');
	HLS.sceneStart = frameCount;


	//start new sceneI
	if (isVR) HLS.raf = HL.VREffect.requestAnimationFrame(HLS.scenes[sceneId] || HLS.scenes.standard);
	else HLS.raf = window.requestAnimationFrame(HLS.scenes[sceneId] || HLS.scenes.standard);
}




HLS.scenes.standard = function() {

	if (isVR) HLS.raf = HL.VREffect.requestAnimationFrame(HLS.scenes.standard);
	else HLS.raf = window.requestAnimationFrame(HLS.scenes.standard);

	// HLS.raf = window.requestAnimationFrame(HLS.scenes.standard);

	// shake landSeed
	// if(HLR.fft1>0.97)
	//   HL.materials.land.uniforms.landSeed.value += Math.max(0, (HLR.fft1 - 0.97)) * 1.6 * (Math.random()*2-1);

	// compute auto movement  moveSpeed
	HLE.reactiveMoveSpeed = HLE.BASE_MOVE_SPEED * 0.15 + (HLR.smoothFFT1 + HLR.smoothFFT2 + HLR.smoothFFT3 * 20 ) * HLE.BASE_MOVE_SPEED;
	// HLE.moveSpeed += (HLE.reactiveMoveSpeed - HLE.moveSpeed) * 0.25;
	HLE.moveSpeed = HLE.reactiveMoveSpeed * ((isCardboard || isVR) ? 0.75 : 1);

	HLE.moveSpeed += HLE.MAX_MOVE_SPEED * HLE.acceleration;

	// HLE.moveSpeed = HLE.MAX_MOVE_SPEED * HLE.acceleration;




	// compute noiseFrequency (used in land for rainbow etc)
	HLR.tempNoiseFreq = 7 - (HLR.fft3) * 3;
	// HLE.noiseFrequency += (HLR.tempNoiseFreq - HLE.noiseFrequency) * 0.3;
	HLE.noiseFrequency = HLR.tempNoiseFreq;

	HLE.noiseFrequency2 += Math.min(0, (HLR.fft2 - HLR.fft3)) * .3;

	// HL.materials.land.uniforms.landSeed.value += (HLR.fft2 + HLR.fft3) * 0.0001;


	// thunderbolts
	HLS.lumi = HLR.fft3 * 5;
	HLC.horizon.setRGB(
		HLC.tempHorizon.r + HLS.lumi,
		HLC.tempHorizon.g + HLS.lumi,
		HLC.tempHorizon.b + HLS.lumi
	);

	// if( HLS.landColorChange && HLR.fft1>0.98) {
	//   HLS.color.set(Math.random()*2-1,Math.random()*2-1,Math.random()*2-1).multiplyScalar(0.075);
	//   HLC.land.r = THREE.Math.clamp(HLC.land.r + HLS.color.x,0,1);
	//   HLC.land.g = THREE.Math.clamp(HLC.land.g + HLS.color.y,0,1);
	//   HLC.land.b = THREE.Math.clamp(HLC.land.b + HLS.color.z,0,1);
	// }


	//camera motion
	// if (!isMobile && !isVR && HLS.sceneId!='firefly' )
	//   HLS.cameraMotion(HLS.sceneId.indexOf('solar_valley')>-1 && HLS.sceneId.indexOf('intro')>-1);
	// HLS.cameraMotion();




	if (HLS.scenesAddons[HLS.sceneId] || undefined)
		HLS.scenesAddons[HLS.sceneId]();


}


// HLS.scenesAddons.intro = function(){
//   // cameraCompanion move
//   HL.cameraCompanion.rotation.y = ( Math.sin(frameCount*.0013)*0.252) ;
//   HL.cameraCompanion.rotation.x = ( Math.cos(frameCount*.00125)*0.35) ;
// }

// HLS.initScenes.firefly = function() {
//     HLS.logoChange('cube');
//     HL.cameraCompanion.visible = true;
// }

// HLS.scenes.firefly = function() {
//     // HLS.raf = window.requestAnimationFrame(HLS.scenes.static);
//     if(isVR) HLS.raf = HL.VREffect.requestAnimationFrame(HLS.scenes.firefly);
//     else HLS.raf = window.requestAnimationFrame(HLS.scenes.firefly);
//     // compute move speed
//     HLE.reactiveMoveSpeed = 1 + HLR.fft1 * HLE.BASE_MOVE_SPEED;
//     HLE.moveSpeed += (HLE.reactiveMoveSpeed - HLE.moveSpeed) * 0.015;
//
//     // cameraCompanion move
//     HL.cameraCompanion.rotation.y = ( (frameCount*.0055)*0.252);
//     HL.cameraCompanion.rotation.x = ( (frameCount*.005)*0.25);
//
// }

// scene addons are executed after standard scene

// THIS SETS UP DYNAMIC TEXTURE FOR CUBE
// HL.dynamicTextures.stars.c.clearRect(0,0,HL.dynamicTextures.stars.width,HL.dynamicTextures.stars.height);
// HL.dynamicTextures.stars.c.font="200px Arial";
// HL.dynamicTextures.stars.c.fillStyle = 'white';
// HL.dynamicTextures.stars.c.fillText("XXXXX",256, 256);
// HL.dynamicTextures.stars.texture.needsUpdate=true;
//
// HL.cameraGroup.children[1].material.map = HL.dynamicTextures.stars.texture;
// HL.cameraGroup.children[1].material.needsUpdate = true;


HLS.initScenes.exaland = function(){

	console.log(' exaland scene init');

	HLS.MIDIInterface.registerCallback({
		midi: [1, 41],
		callback: function(v){
					HLS.randomizeTrigger = !HLS.randomizeTrigger;
					console.log('HLS.randomizeTrigger', HLS.randomizeTrigger);
		},
		context: HLS,
		isTrigger: true,
		keyAlternative: 'e'
	});


	HLS.MIDIInterface.registerCallback({
		midi: [1, 40],
		callback: function(v){
					HLS.objectsTrigger = !HLS.objectsTrigger;
					console.log('HLS.objectsTrigger', HLS.objectsTrigger);
		},
		context: HLS,
		isTrigger: true,
		keyAlternative: 'w'
	});

	HLS.MIDIInterface.registerCallback({
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
	HLS.MIDIInterface.registerCallback({
		midi: [1, 36],
		callback: function(v){

					HLS.loadParams( HLSP[ 'exaland' ] );

		},
		context: HLS,
		isTrigger: true,
		keyAlternative: 'r'

	});


}

var randomDebounce1 = true,
	randomDebounce2 = true;

function isRegisteredKick() {
	return false
}

var elephantDebounce = true;

HLS.scenesAddons.exaland = function() {

	HL.land.material.uniforms.landSeed.value += HLR.fft1 * .0001;

	// if(HLR.fft1>0.97){
	if (HLR.fft1 > 0.985) { //TODO 0.975
		if (randomDebounce1) {

			if( HLS.randomizeTrigger ){
				HLS.randomizeLand();
			}

			if( HLS.textTrigger ){
				HLS.textGlitch();
			}

			if( HLS.objectsTrigger ){

				if(Math.random()<.5)
					HLH.startGroup(['everything', 1, 0, false, false, -5, true]);

				if(Math.random()<.005)
					HLH.startGroup(['everything', 20, 1, false, true, 0, true]);
			}

			// HLH.startAll();
			// HLH.startModel(HL.models['moab'],
			// 	THREE.Math.randInt(-1000, 1000),
			// 	THREE.Math.randInt(HLE.WORLD_HEIGHT, HLE.WORLD_HEIGHT * 1.5), 80, null, 10, false, false
			// );
			randomDebounce1 = false;
		}
	} else {
		randomDebounce1 = true;
	}

	if (HLR.fft3 > 0.42 && HLS.objectsTrigger ) {
		HLH.startGroup(['space', 1, 40, true, false, HLE.WORLD_HEIGHT / 3, false]);
		if(Math.random()<.5)
			HLH.startGroup(['everything', 1, 0, 'xyz', true, -1, true]);
	}


	//launch objects times
	// if (HLE.DATE.getHours() <= 1) {
	// 	//launch objects at coordinates
	// 	if (HLE.landMotion.x > 2000 && HLE.landMotion.x < 2100) {
  //
	// 		if (elephantDebounce) {
	// 			HLH.startModel(HLE.DATE.getHours() == 0 ? HL.models['elephant'] : HL.models['chainsaw'],
	// 				THREE.Math.randInt(-1000, 1000), -20, 0, null, 11
	// 			);
	// 		}
	// 		elephantDebounce = false;
  //
	// 	} else elephantDebounce = true;
  //
	// }

	/* GLITCH S*/

	// sky glitch
	if (HLR.fft2 > .5) {
		HL.sky.visible = false;
	} else {
		HL.sky.visible = true;
	}

	// land glitch
	if (HLR.fft1 > .9) {
		// HL.land.material.uniforms.transparent.value = true;
		// HL.land.material.uniforms.hardMix.value = !HL.land.material.uniforms.hardMix.value;
	} else {
		// HL.land.material.uniforms.transparent.value = false;
		// HL.land.material.uniforms.hardMix.value = !HL.land.material.uniforms.hardMix.value;
	}

	// text glitch
	if (HLR.fft1 > .95) {
		HL.cameraCompanion.visible = true;
	} else {
		HL.cameraCompanion.visible = false;
	}


	HLS.lumi = Math.min(HLR.fft3 + HLR.fft1 * 0.2, 1);
	HLC.horizon.setRGB(
		HLC.tempHorizon.r + HLS.lumi,
		HLC.tempHorizon.g + HLS.lumi,
		HLC.tempHorizon.b + HLS.lumi
	);

}


function pickRandomProperty(obj) {
	var result;
	var count = 0;
	for (var prop in obj)
		if (prop.substr(0, 2) == 'HL' && Math.random() < 1 / ++count)
			result = prop;
	return result;
}

var cartello;


HLS.textGlitch = function(){

		let p = window[pickRandomProperty(window)];
		try {
			cartello = JSON.stringify(p);
			cartello = cartello.split(",");
		} catch (e) {
			cartello = e.toString();
			// cartello = cartello.split(",");
		}

		var fontSize = (16 + Math.random() * 64);
		// HL.dynamicTextures.textbox.c.save();
		// HL.dynamicTextures.textbox.c.scale(window.innerHeight / window.innerWidth, 1);
		HL.dynamicTextures.textbox.c.clearRect(0, 0, HL.dynamicTextures.textbox.width, HL.dynamicTextures.textbox.height);
		HL.dynamicTextures.textbox.c.font = fontSize + "px 'Space Mono'";
		HL.dynamicTextures.textbox.c.fillStyle = 'white';
		for (var i = Math.floor(Math.random() * cartello.length); i < cartello.length; i++) {
			HL.dynamicTextures.textbox.c.fillText(cartello[i], 20, 10 + fontSize * 1.2 * i);
		}
		// HL.dynamicTextures.textbox.c.restore();
		HL.dynamicTextures.textbox.texture.needsUpdate = true;


		// this will be used as land texture
		fontSize = (24 + Math.random() * 64);
		// HL.dynamicTextures.textbox.c.save();
		// HL.dynamicTextures.textbox.c.scale(window.innerHeight / window.innerWidth, 1);
		HL.dynamicTextures.stars.c.fillStyle = 'white';
		HL.dynamicTextures.stars.c.fillRect(0, 0, HL.dynamicTextures.stars.width, HL.dynamicTextures.stars.height);
		HL.dynamicTextures.stars.c.font = fontSize + "px 'Space Mono'";
		HL.dynamicTextures.stars.c.fillStyle = 'black';
		for (var i = Math.floor(Math.random() * cartello.length); i < cartello.length; i++) {
			HL.dynamicTextures.stars.c.fillText(cartello[i], 20, 10 + fontSize * 1.2 * i);
		}
		// HL.dynamicTextures.stars.c.restore();
		HL.dynamicTextures.stars.texture.needsUpdate = true;

}

HLS.randomizeLand = function() {


	var tilen = 2 + Math.round( Math.random() * 6);

	// HL.land.geometry = new THREE.PlaneBufferGeometry(HLE.WORLD_WIDTH, HLE.WORLD_WIDTH, tilen,tilen);

	HL.land.material.uniforms.repeatUV.value = new THREE.Vector2(tilen, tilen);

	HL.land.material.uniforms.bFactor.value = Math.random();
	HL.land.material.uniforms.cFactor.value = Math.random();
	HL.land.material.uniforms.landSeed.value = Math.random() * 100.0;


	// random Renderer Pixelation pixelated
	// HL.renderer.setPixelRatio((0.25 + Math.random() * .75));

	if(HL.stereoEffect!==null) {
		HL.stereoEffect = new THREE.StereoEffect(HL.renderer);
		HL.stereoEffect.setSize(window.innerWidth, window.innerHeight);
	}


	if (Math.random() < .3) {
		HL.land.material.uniforms.map.value = HL.dynamicTextures.stars.texture;
		HL.land.material.uniforms.map2.value = HL.dynamicTextures.stars.texture;
	} else {
		var landPat = Math.random();
		HL.land.material.uniforms.map.value = HL.textures[landPat > .5 ? 'land' + (1 + Math.round(Math.random() * 4)) : 'white']; // null;//HL.textures[Math.round(Math.random()*10)];
		HL.land.material.uniforms.map2.value = HL.textures['land' + (1 + Math.round(Math.random() * 4))]; // null;//HL.textures[Math.round(Math.random()*10)];
	}

	// HL.land.material.uniforms.map.value = HL.textures['land'+(1+Math.round(Math.random()*4))];
	// HL.land.material.uniforms.map2.value = HL.textures['land'+(1+Math.round(Math.random()*4))];

	HL.land.material.uniforms.natural.value = 0.5 + Math.random() * 0.5;
	HL.land.material.uniforms.rainbow.value = Math.random();
	HL.land.material.uniforms.glowing.value = Math.round(Math.random() * 1.1);

	HL.land.material.uniforms.squareness.value = Math.random() * 0.05;

	// HL.sky.material.map = HL.textures['sky'+(1+Math.round(Math.random()*4))];// null;//HL.textures[Math.round(Math.random()*10)];
	HL.sky.material.uniforms.mixFactor.value = Math.random();
	HL.sky.geometry.rotateY(Math.random() * Math.PI);


	// HLC.land.setRGB(0.5+Math.random()*0.5, 0.5+Math.random()*0.5, 0.5+Math.random()*0.5);
	// HLC.land.setRGB( Math.random(), Math.random(), Math.random() );
	// HLC.land.setHSL( Math.random(), 1.0, .5 + Math.random()*.5 );
	HLC.land.set(HLC.palette.getRandom());
	// let gray = Math.random();

	// HLC.horizon.setRGB(1.5 * Math.random() * 0.6, 1.5 * Math.random() * 0.6, 1.5 * Math.random() * 0.6);
	HLC.horizon.set(HLC.palette.getRandom());
	// HLC.horizon.setRGB(Math.random()*.0001, Math.random()*.0001, Math.random()*.0001);
	// HLC.horizon.multiplyScalar(HLE.CURRENT_HOUR * 0.9 + 0.1);

	HLC.tempHorizon.set(HLC.horizon);

	// HLC.land.setHSL(Math.random(), 0.6, 0.9);

	// HL.sea.material.uniforms.color.value.setRGB(Math.random() * 0.6, Math.random() * 0.6, Math.random() * 0.6);
	HLC.sea.set( HLC.palette.getRandom() * 0.5);


};


// HLS.logoChange = function(model) {
//
// 	if (typeof model === 'string') {
//
// 		model = HL.models[model];
//
// 	}
//
// 	if (model instanceof THREE.Mesh) {
//
// 		model = model.geometry;
//
// 	}
//
// 	HL.cameraCompanion.geometry = model.clone().scale(30, 30, 30);
// 	HL.cameraCompanion.visible = true;
// }

window.addEventListener('HLEload', function() {
	HLS.startScene(HLS.defaultScene);


	/* raycaster test */

	var raycaster = new THREE.Raycaster();
	var mouse = new THREE.Vector2();

	function switchObject( event ) {

		if( event.targetTouches ){
			mouse.x = event.targetTouches[0].clientX;
			mouse.y = event.targetTouches[0].clientY;
		} else {
			mouse.x = event.clientX;
			mouse.y = event.clientY;
		}

		// calculate mouse position in normalized device coordinates
		// (-1 to +1) for both components

		mouse.x = ( mouse.x / window.innerWidth ) * 2 - 1;
		mouse.y = - ( mouse.y / window.innerHeight ) * 2 + 1;

		function pickRandomProperty(obj) {
			var result;
			var count = 0;
			for (var prop in obj)
				if ( Math.random() < 1 / ++count )
					result = prop;
			return result;
		}

		// update the picking ray with the camera and mouse position
		raycaster.setFromCamera( mouse, HL.camera );

		// calculate objects intersecting the picking ray
		var intersects = raycaster.intersectObjects( HL.scene.children );

		if( intersects[0] !== undefined){
			if( intersects[0].object.key !== undefined){
				let randomObject = pickRandomProperty(HL.models);

				intersects[ 0 ].object.geometry = HL.models[randomObject].geometry;
				intersects[ 0 ].object.material = HL.models[randomObject].material;
				// intersects[ 0 ].object.needsUpdate = true;

			}
		}
		// for ( var i = 0; i < intersects.length; i++ ) {
		// 	console.log(intersects[i]);
		// 	intersects[ i ].object.material.color.set( Math.random() * 0xffffff );
	  //
		// }

	}

	window.addEventListener( 'click', switchObject, false );
	window.addEventListener( 'touchstart', switchObject, false );


});
