// global vars
var isCardboard = window.location.href.indexOf('?cardboard') > -1;
var isVR = window.location.href.indexOf('?webvr') > -1;
var isDebug = window.location.href.indexOf('?debug') > -1;
var isFPC = window.location.href.indexOf('?fpc') > -1;
var isOrbit = window.location.href.indexOf('?orbit') > -1;
var isNoiseCam = window.location.href.indexOf('?noisecam') > -1;
var isWire = window.location.href.indexOf('?wire') > -1;
var hasShadows = false;
var noHUD = window.location.href.indexOf('?noHUD') > -1;
var isMapped = window.location.href.indexOf('?mapped') > -1;
var mappingCorrectAspect = window.location.href.indexOf('?mappedB') > -1;
var staticAudio = window.location.href.indexOf('?staticaudio') > -1;

var noSocket = window.location.href.indexOf('?nosocket') > -1;
var partSocket = window.location.href.indexOf('?partsocket') > -1;
var hasGUI = window.location.href.indexOf('?gui') > -1;
var midiIn = window.location.href.indexOf('?midiin') > -1;
var remidi = window.location.href.indexOf('?remidi') > -1;
var useFBO = window.location.href.indexOf('?fbo') > -1;

var noSleep = new NoSleep();

var isVisual = window.location.href.indexOf('?visual') > -1;

// const SOCKETSERVER = 'http://192.168.1.153:1502';
const SOCKETSERVER = 'https://exalandsocket.spime.im';


var mobileOS = ( function() {
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
})();

var isMobile = false;
if (mobileOS.indexOf("unknown") == -1) {
	isMobile = true;
}

var frameCount = 0;
var millis = 0;
var delta = 0;
// var mouse = {
// 	x: null,
// 	y: null,
// 	// coords relative to center
// 	rX: null,
// 	rY: null,
// 	// coords in the prev frame
// 	prevX: null,
// 	prevY: null
// };

HLMain = {};

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

		if (isCardboard)
			HL.stereoEffect.setSize(window.innerWidth, window.innerHeight);

		if (HLE.WATER)
			HL.materials.water.renderer.setSize(window.innerWidth, window.innerHeight);

		if (HLE.MIRROR)
			HL.materials.mirror.renderer.setSize(window.innerWidth, window.innerHeight);

		if (isFPC)
			HL.controls.handleResize();

	}

	window.addEventListener("resize", onResized);


	// AUDIO ANALYSIS
	// if((noSocket || partSocket) && !isMobile && !staticAudio) { AA = AudioAnalyzer(); AA.initGetUserMedia();}

	// AA = new AAMS( HL.audio );
	if(isVisual){
		AA = new AAMS();
	} else {
		AA = {};
	}
}


var performanceLow = 0,
	performanceHigh = 0;

function mainLoop() {
	if (isVR) HLMain.rafID = HL.VREffect.requestAnimationFrame(mainLoop);
	else HLMain.rafID = window.requestAnimationFrame(mainLoop);

	// Environment and animation
	frameCount++;
	millis = (frameCount / 60);
	delta = HL.clock.getDelta();

	// if (frameCount>10) return;


	// // remote control / audioreactive
  // // TODO: updateParams dritto solo se sei visual, per tutti gli altri usi socketInterface
  // if( ( noSocket || partSocket ) || isVisual ){
  //   HLRemote.updateHLParams( [ AA.getFreq(2), AA.getFreq(0), AA.getFreq(200) ] );//), AA.getFreq(64), AA.getFreq(200));
  // }

	// HLAnim.particles(); // moved in sceneManager
	if (!HLE.MIRROR && !HLE.WATER) HLAnim.sea();
	if (HLE.MIRROR) HLAnim.mirrorWaves();
	if (HLE.WATER) HLAnim.seaGLSL(); //just updates uniforms
	HLAnim.landGLSL(); //just updates uniforms
	HLAnim.models();
	HLAnim.particles();
	// HLAnim.wind();



	// camera controls
	if (isMobile || isOrbit || isVR || remidi)
		HL.controls.update(); //DeviceOrientationControls  mode
	else if (isFPC || isNoiseCam) {
		HL.controls.update(delta); //FPC mode
	}



	// Rendering
	// HL.renderer.autoClear = false;
	//  HL.renderer.clear();

	if (HLE.WATER)
		HL.materials.water.render();

	if (HLE.MIRROR)
		HL.materials.mirror.render();

	if (isCardboard || isVR) {

		if (HLE.MIRROR || HLE.WATER) {

			HL.renderer.setRenderTarget(null);

		}

		if (isCardboard) {

			HL.stereoEffect.render(HL.scene, HL.camera);

		}

		if (isVR) {

			HL.VREffect.render(HL.scene, HL.camera);

		}

	} else { // no stereo

		if (isMapped) {

			HL.renderer.render(HL.scene, HL.camera, HL.mappingRenderTarget);
			HL.renderer.render(HL.mappingScene, HL.mappingCamera);

		}
		else if( useFBO || HLR.glitchEffect == true){
			// render on FBO for glitch
			HL.renderer.render(HL.scene, HL.camera, HL.glitchFBO);

			// render rendering material
			HL.renderer.render( HL.glitchScene, HL.glitchCamera );

		}

		else {

			HL.renderer.render(HL.scene, HL.camera);

		}

	}


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
			if(isVisual) AA.pause();
			// AAK.pause();
			break;
		case 10: // game running
			if(isVisual) if (AA.getSelectedSource() != AA.FILE) AA.connectMic();

			HLMain.play();
			if(isVisual) AA.play();
			setVisibility('.screens', false);
			// AAK.play();
			break;
		case 11: // game running in mic mode
			if(isVisual) if (AA.getSelectedSource() != AA.MIC) AA.connectMic();
			HLMain.play();
			if(isVisual) AA.play();
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
			if(isVisual) AA.pause();
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
		// DEV
		if (hasGUI) {
			G = GUI();
			G.guiInit();
		}

		// let's rock - start game
		// EDIT: play will be triggered by START button click - HLMain.updateStatus();
		// HLMain.play();
	});

	if (isVR && WEBVR.isAvailable() === true) {
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
//if(isMobile) launchIntoFullscreen(document.documentElement); // the whole page
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