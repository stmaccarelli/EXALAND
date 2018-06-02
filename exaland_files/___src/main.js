// global vars
var STATUS = {}

STATUS.CARDBOARD = window.location.href.indexOf('?cardboard') > -1;
STATUS.VR = window.location.href.indexOf('?vr') > -1;
STATUS.FPC = window.location.href.indexOf('?fpc') > -1;
STATUS.WIREFRAME = window.location.href.indexOf('?wireframe') > -1;

STATUS.MAPPED = window.location.href.indexOf('?mapped') > -1;

STATUS.NOSOCKET = window.location.href.indexOf('?nosocket') > -1;
// var midiIn = window.location.href.indexOf('?midiin') > -1;
STATUS.REMIDI = window.location.href.indexOf('?remidi') > -1;
STATUS.FBO = window.location.href.indexOf('?fbo') > -1;

STATUS.ISVISUAL = window.location.href.indexOf('?visual') > -1;

STATUS.FORCEEFFECTS = window.location.href.indexOf('?forceefffects') > -1;

function getMobileOperatingSystem() {
	var userAgent = navigator.userAgent || navigator.vendor || window.opera;

	// Windows Phone must come first because its UA also contains "Android"
	if (/windows phone/i.test(userAgent)) {
		return "Windows Phone";
	}

	if (/android/i.test(userAgent)) {
		return "Android";
	}

	// iOS detection from: http://stackoverflow.com/a/9039885/177710
	if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
		return "iOS";
	}

	return "unknown";
}

STATUS.MOBILEOS = getMobileOperatingSystem();

STATUS.ISMOBILE = false;
if ( STATUS.MOBILEOS.indexOf("unknown") == -1) {
	STATUS.ISMOBILE = true;
}

// const SOCKETSERVER = 'http://192.168.1.153:1502';
const SOCKETSERVER = 'https://exalandsocket.spime.im';


var noSleep = new NoSleep();


HLMain = {};
var frameCount = 0;
var millis = 0;
var delta = 0;


function mainInit() {
	// init noScroll TODO do it according to broswer / os
	var noScroll = new NoScroll();
	noScroll.enable();

	// function setMouse(e){
	//   mouse.pX = mouse.x;
	//   mouse.pY = mouse.y;
	//
	//   mouse.x = e.pageX;
	//   mouse.y = e.pageY;
	//
	//   mouse.rX = e.pageX - window.innerWidth*0.5;
	//   mouse.rY = e.pageY - window.innerHeight*0.5;
	// }
	// window.addEventListener('mousemove',setMouse);
	// console.log('mouse var enabled');

	function onResized() {

		HL.camera.aspect = window.innerWidth / window.innerHeight;
		HL.camera.updateProjectionMatrix();
		HL.cameraCompanion.regenerateGeometry();

		HL.renderer.setSize(window.innerWidth, window.innerHeight);

		if (STATUS.CARDBOARD)
			HL.stereoEffect.setSize(window.innerWidth, window.innerHeight);

		if (HLE.WATER)
			HL.materials.water.renderer.setSize(window.innerWidth, window.innerHeight);

		if (HLE.MIRROR)
			HL.materials.mirror.renderer.setSize(window.innerWidth, window.innerHeight);

		if (STATUS.FPC)
			HL.controls.handleResize();

	}

	window.addEventListener("resize", onResized);


	// AUDIO ANALYSIS

	if(STATUS.ISVISUAL){
		AA = new AAMS();
	} else {
		AA = {};
	}
}


var performanceLow = 0,
	performanceHigh = 0;


function mainLoop() {

	if (STATUS.VR) HLMain.rafID = HL.VREffect.requestAnimationFrame( mainLoop );
	else HLMain.rafID = window.requestAnimationFrame( mainLoop );

	// Environment and animation
	frameCount++;
	millis = (frameCount / 60);
	delta = HL.clock.getDelta();


	// HLAnim.particles(); // moved in sceneManager
	if (!HLE.MIRROR && !HLE.WATER) HLAnim.sea();
	if (HLE.MIRROR) HLAnim.mirrorWaves();
	if (HLE.WATER) HLAnim.seaGLSL(); //just updates uniforms
	HLAnim.landGLSL(); //just updates uniforms
	HLAnim.models();
	HLAnim.particles();
	// HLAnim.colors();
	// HLAnim.wind();


	// camera controls
	if ( STATUS.ISMOBILE || STATUS.VR || STATUS.REMIDI )
		HL.controls.update(); //DeviceOrientationControls  mode
	else if ( STATUS.FPC ) {
		HL.controls.update(delta); //FPC mode
	}

	// force effects on
	if (STATUS.FORCEEFFECTS){
		HLR.randomizeTrigger = true;
		HLR.textTrigger = true;
		HLR.objectsTrigger = true;
		HLR.glitchEffect = true;
	}



	// Rendering
	// HL.renderer.autoClear = false;
	//  HL.renderer.clear();

	if (HLE.WATER)
		HL.materials.water.render();

	if (HLE.MIRROR)
		HL.materials.mirror.render();

	// let tScene = HL.scene, tCamera = HL.camera;


	if( STATUS.FBO || HLR.glitchEffect == true ){

		if (STATUS.CARDBOARD) {

			HL.stereoEffect.render( HL.scene, HL.camera, HL.glitchFBO );

			HL.renderer.crop(0, 0, window.innerWidth*.5, window.innerHeight);
			HL.renderer.render(HL.glitchScene, HL.glitchCamera);

			HL.renderer.crop(window.innerWidth*.5, 0, window.innerWidth*.5, window.innerHeight);
			HL.renderer.render(HL.glitchScene, HL.glitchCamera);

		} else {

			HL.renderer.render( HL.scene, HL.camera, HL.glitchFBO );
			HL.renderer.render( HL.glitchScene, HL.glitchCamera );

		}




	} else {

		if (STATUS.CARDBOARD) {

			HL.stereoEffect.render( HL.scene, HL.camera );

		} else

		HL.renderer.render( HL.scene, HL.camera );


	}







	// // FINAL RENDER PASS
	// if (STATUS.CARDBOARD || STATUS.VR) {
	//
	// 	if (HLE.MIRROR || HLE.WATER) {
	//
	// 		// HL.renderer.setRenderTarget(null);
	//
	// 	}
	//
	// 	if (STATUS.CARDBOARD) {
	//
	// 		HL.stereoEffect.render( tScene, tCamera );
	//
	// 	}
	//
	// 	if (STATUS.VR) {
	//
	// 		HL.VREffect.render( tScene, tCamera );
	//
	// 	}
	//
	// } else { // no stereo
	//
	// 	HL.renderer.render( tScene, tCamera );
	//
	// }


	// TODO: improve detection. take account of browser cpu time, models shooting time, etc
	//CPU GPU POWER DETECTION BY CLOCK
	// if (frameCount > 2) {
	// 	if (delta > 0.03333 && delta < 1) {
	// 		if (++performanceLow == 30) {
	// 			HLE.PIXEL_RATIO_SCALE *= 0.85;
	// 			HL.renderer.setPixelRatio(window.devicePixelRatio * HLE.PIXEL_RATIO_SCALE);
	//
	// 			var tiles = Math.round(HL.land.geometry.parameters.widthSegments * 0.85);
	// 			HL.land.geometry = new THREE.PlaneBufferGeometry(HLE.WORLD_WIDTH, HLE.WORLD_WIDTH, tiles, tiles);
	// 			HL.land.geometry.rotateX(-Math.PI / 2);
	// 			HL.land.material.uniforms.worldModuleWidth.value = HLE.WORLD_WIDTH/tiles;
	// 			//HL.land.material.uniforms.repeatUV.value = new THREE.Vector2(1,HLE.WORLD_TILES*1);
	// 			console.log(delta + " reducing tiles: " + tiles);
	// 			performanceLow = 0;
	// 		}
	// 	} else if (delta < 0.01666) {
	// 		if (++performanceHigh == 60) {
	// 			HLE.PIXEL_RATIO_SCALE *= 1.15;
	// 			HL.renderer.setPixelRatio(window.devicePixelRatio * HLE.PIXEL_RATIO_SCALE);
	//
	// 			var tiles = Math.round(HL.land.geometry.parameters.widthSegments * 1.15);
	// 			HL.land.geometry = new THREE.PlaneBufferGeometry(HLE.WORLD_WIDTH, HLE.WORLD_WIDTH, tiles, tiles);
	// 			HL.land.geometry.rotateX(-Math.PI / 2);
	// 			HL.land.material.uniforms.worldModuleWidth.value = HLE.WORLD_WIDTH/tiles;
	// 			//HL.land.material.uniforms.repeatUV.value = new THREE.Vector2(1,HLE.WORLD_TILES*1);
	// 			console.log(delta + " growing tiles: " + tiles);
	// 			performanceHigh = 0;
	// 		}
	// 	} else {
	// 		performanceHigh--;
	// 		performanceLow--;
	// 	}
	// }


	delta = null;
}




// SCREENS MANAGEMENT

// show/hide html element by selector
var setVisibility = (function(selector, visible) {
	var elements = document.querySelectorAll(selector);
	for (var i = 0; i < elements.length; i++) {
		elements[i].style.opacity = visible ? 1 : 0;
		elements[i].style.display = visible ? 'block' : 'none';
		// console.log('visible: selector: ' + selector + ' visibile: ' + visible);
	}
});

HLMain.updateStatus = function(gameStatus) {

	//console.log("gameStatus "+ gameStatus);
	// set status
	if (gameStatus == 20) HLR.PREVGAMESTATUS = HLR.GAMESTATUS;

	if (gameStatus == -1) {
		HLR.GAMESTATUS = HLR.PREVGAMESTATUS;
	} else {
		HLR.GAMESTATUS = gameStatus;
	}

	//console.log('updateStatus: ' + HLR.GAMESTATUS);

	// handle screens visibility
	switch (HLR.GAMESTATUS) {
		case 0: // loading screen
			setVisibility('.screens', false);
			setVisibility('#loading', true);
			if(STATUS.ISVISUAL) AA.pause();
			// AAK.pause();
			break;
		case 10: // game running
			if(STATUS.ISVISUAL) if (AA.getSelectedSource() != AA.FILE) AA.connectMic();

			HLMain.play();
			if(STATUS.ISVISUAL) AA.play();
			setVisibility('.screens', false);
			// AAK.play();
			break;
		case 11: // game running in mic mode
			if(STATUS.ISVISUAL) if (AA.getSelectedSource() != AA.MIC) AA.connectMic();
			HLMain.play();
			if(STATUS.ISVISUAL) AA.play();
			setVisibility('.screens', false);
			break;
		case 12: // game running in flat mode
			// AA.pauseAnalysis o TODO flat mode (no analysis, set array to 0);
			HLMain.play();
			setVisibility('.screens', false);
			break;
		case 20: // game paused
			HLMain.pause();
			setVisibility('.screens', false);
			setVisibility('#paused', true);
			if(STATUS.ISVISUAL) AA.pause();
			// AAK.pause();
			break;
		case 30: // audio analysis ended
			setVisibility('.screens', false);
			setVisibility('#ended', true);
			break;
	}
	// AA.filePlayPause();
}

// MASTER SCENES ROUTINE

HLMain.screensInit = function() {
	var totalLoading = 0;
	HL.modelsLoadingManager.onProgress = function(url, itemsLoaded, itemsTotal) {
		let loadString = '';
		for(var i = 0; i < (100 / itemsTotal) * itemsLoaded; i++){
			loadString += '#';
		}
		document.getElementById('modelsLoading').innerHTML = loadString;

	};

	HL.texturesLoadingManager.onProgress = function(url, itemsLoaded, itemsTotal) {

		let loadString = '';
		for(var i = 0; i < (100 / itemsTotal) * itemsLoaded; i++){
			loadString += '#';
		}
		document.getElementById('texturesLoading').innerHTML = loadString;
	};

}

var noSleepEnabled = false;

// once HL environment and assets fully load
window.addEventListener('HLEload', function() {

	// document.getElementById('loading').style.display = 'none';
	// noSleep.enable();
	// HLMain.updateStatus(11);

	var startButton = document.getElementById('startButton');
	startButton.disabled = false;
	startButton.addEventListener('click', function() {
		noSleep.enable();
		HLMain.updateStatus(11);
	}, false);


	HL.renderer.domElement.addEventListener('touchstart', function(){
		noSleep.enable();
	});


	// pause audio file if window not in focus
	// analysis is rAF based, so it will pause anyway if window in background
	// document.addEventListener("visibilitychange", function(e) {
  //   if (HLR.GAMESTATUS > 0 && HLR.GAMESTATUS < 20)
  //     HLMain.updateStatus(20);
  // }, false);

	// TODO: orientation change pauses game
	// window.addEventListener("orientationchange", function(){
	// 	 if(window.screen.orientation.angle == 90 ){
	// 		 updateStatus(2);
	// 	 }
	// });


});




function loadRoutine() {
	HLR.init();
	mainInit();
	// init HyperLand Environment
	HLEnvironment.init();
	// init remoteControl screens manager
	HLMain.screensInit();





	// mainLoop is called when it's all loaded
	window.addEventListener('HLEload', function() {

		console.log("event HLEload received");


		// let's rock - start game
		// EDIT: play will be triggered by START button click - HLMain.updateStatus();
		// HLMain.play();

	});


	if (STATUS.VR && WEBVR.isAvailable() === true) {
		document.body.appendChild(WEBVR.getButton(HL.VREffect));
	}

	window.removeEventListener('load', loadRoutine);

}
window.addEventListener('load', loadRoutine, false);


HLMain.rafID = null;

// PAUSE ANALYSIS
HLMain.pause = function() {
	HL.clock.stop();
	window.cancelAnimationFrame(HLMain.rafID);
	HLMain.rafID = null;
}

// start
HLMain.play = function() {
	if (HLMain.rafID === null) {
		HL.clock.start();
		mainLoop();
	}
}



//fullscreen API TODO
// Find the right method, call on correct element
// function launchIntoFullscreen(element) {
//   screen.orientation.lock ('landscape');
//
//   if(element.requestFullscreen) {
//     element.requestFullscreen();
//   } else if(element.mozRequestFullScreen) {
//     element.mozRequestFullScreen();
//   } else if(element.webkitRequestFullscreen) {
//     element.webkitRequestFullscreen();
//   } else if(element.msRequestFullscreen) {
//     element.msRequestFullscreen();
//   }
//
// }
//
//
// function androFullscreenLandscape(){
//   launchIntoFullscreen(document.documentElement);
//   window.removeEventListener("orientationchange", androFullscreenLandscape);
// }

// Launch fullscreen for browsers that support it!
//if(STATUS.ISMOBILE) launchIntoFullscreen(document.documentElement); // the whole page
//  window.addEventListener("orientationchange", androFullscreenLandscape); //test resize too

// alert('eh');
// screen.orientation.lock ('landscape');
// window.scrollTo(0, 0);

// android stock
// window.addEventListener('load', function() {
//   screen.lockOrientation('landscape-primary');
//   window.scrollTo(0, -10);
//   alert("chrome is fullscreen");
// });
//  document.addEventListener("touchmove", function(e) { e.preventDefault() });

// //chrome (android)
// var body = document.documentElement;
// screen.orientation.lock ('landscape');
// if (body.requestFullscreen) {
//   body.requestFullscreen();
// } else if (body.webkitrequestFullscreen) {
//   body.webkitrequestFullscreen();
// } else if (body.mozrequestFullscreen) {
//   body.mozrequestFullscreen();
// } else if (body.msrequestFullscreen) {
//   body.msrequestFullscreen();
// }
