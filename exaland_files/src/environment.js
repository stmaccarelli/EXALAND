/*
This file defines HYPERLAND elements, global settings

The HLEnvironment module inits scene, renderer, camera, effects, shaders, geometries, materials, meshes
*/

// HL Environment constants and parameters
var HLE = {
  WORLD_WIDTH:6000,
  WORLD_HEIGHT:400,
  WORLD_TILES: isMobile?128:512,
  TILE_SIZE:null,
  SEA_TILES:16,
  SEA_TILE_SIZE:null,

  PIXEL_RATIO_SCALE: 0.5,//isMobile?0.5:0.75, //.5,

  SCREEN_WIDTH_SCALE:1,
  SCREEN_HEIGHT_SCALE:isMobile?1:1,

  // TODO REVIEW
  DATE: new Date(),
  CURRENT_HOUR: Math.sin( new Date().getHours() / 23 * Math.PI ),
  // CURRENT_HOUR: Math.sin( 0 / 23 * Math.PI ),

  FOG:true,
  MIRROR: false,
  WATER: true,

  MAX_MOVE_SPEED: null,
  BASE_MOVE_SPEED: 1,
  CENTER_PATH:true, // true if you don't want terrain in the middle of the scene

  reactiveMoveSpeed:0, // changes programmatically - audio
  moveSpeed:0, // stores final computed move speed
  acceleration:0, // for GLSL land moving, build up with time
  landMotion: new THREE.Vector3(0,0,0), // for GLSL land moving, build up with time
  landSeed:50.0, //for GLSL land material

  BASE_SEA_SPEED:2.5,
  CLOUDS_SPEED:1,

  MAX_MODELS_OUT:100,
  PARTICLE_MODELS_OUT:100,

  reactiveSeaHeight:0, // changes programmatically - audio

  landZeroPoint:-20, //shift up or down the landscape
  landHeight:300,

  seaStepsCount:0,
  landStepsCount:0,

  CLOUDS_AMOUNT : 200,
  FLORA_AMOUNT : 1,
  MAX_FAUNA: 50,

  connectedUsers : 0, // this will represent mobile users, and will change live, so we set a MAX_FAUNA as top limit


  noiseSeed:0,
  noiseFrequency:1,
  noiseFrequency2:1,

  cameraHeight:0, // will change live
  smoothCameraHeight:10, // will change live
}


//HL Colors Library
var HLC = {
  palette: {
    colors: [
      new THREE.Color(0xf73400),
      new THREE.Color(0xEA583F),
      new THREE.Color(0xFFDC22),
      new THREE.Color(0x54b9d6),
      new THREE.Color(0xFEF2DA),
      new THREE.Color(0x889798)
      // new THREE.Color(0xff0000),
      // new THREE.Color(0x00ff00),
      // new THREE.Color(0x0000ff),
      // new THREE.Color(0xffffff)
    ],
    get: function(n){return this.colors[n];},
    getRandom: function(){return this.colors[ Math.floor(Math.random()*this.colors.length) ] }
  },

  horizon: new THREE.Color(0x111111),
  tempHorizon: new THREE.Color(0x111111),

  land: new THREE.Color(0x888888),
  sea: new THREE.Color(0x888888),

  // underHorizon: new THREE.Color(.0, .02, .02),
  // underLand: new THREE.Color(.1, .9, .9),
  // underSea: new THREE.Color(.1, .9, .9),

  flora: new THREE.Color(1,1,0),
  fauna: new THREE.Color(1,0,0),
  clouds: new THREE.Color(1,1,1),

  // gWhite: new THREE.Color(0xffffff),
  UI: new THREE.Color(0x00ff11)

}


// HL scene library
var HL = {

  audio: null,
  modelsLoadingManager:null,
  texturesLoadingManager:null,
  audioLoader:null,

  // modelsLoaded:0,
  // totalModels:0,
  // texturesLoaded:0,
  // totalTextures:0,

  scene:null,
  renderer:null,
  camera:null,
  stereoEffect:null,
  VREffect:null,
  controls:null,
  clock:null,
  noise:null,

  mappedRenderer:null,
  mappedScene:null,

  geometries: {
    sky:null,
    land:null,
    sea:null,
    seaHeights:null, // actually not a geometry, just an array of heights per row to be added to a sine motion
    clouds: null,
    fauna: null,
  },
  materials: {
    sky:null,
    land:null,
    sea:null,
    water:null,
    mirror:null,
    clouds:null,
    flora:null,
    fauna:null,
    models:null,
  },
  textures: {
    sky1:"assets/img/skybox2/sd1c_s.jpg",
    sky2:"assets/img/skybox2/sd2c_s.jpg",
    sky3:"assets/img/skybox2/nasa2.gif",

    land:"assets/img/white2x2.gif",
    sea:"assets/img/white2x2.gif",
    flora:"assets/img/white2x2.gif",
    fauna:"assets/img/white2x2.gif",
    water:"assets/img/waternormals5.jpg",//wn5

    land1:"assets/img/land/pattern/land_tex_1.png",//land_tex_1.jpg",
    land2:"assets/img/land/pattern/land_tex_2.png",//land_tex_2.jpg",
    land3:"assets/img/land/pattern/land_tex_3.png",//land_tex_3.jpg",
    land4:"assets/img/land/pattern/land_tex_4.png",//land_tex_4.jpg",
    land5:"assets/img/land/pattern/land_tex_5.png",//land_tex_5.jpg",
    landSand:"assets/img/land/pattern/land_tex_base.png",
    // landSand:"assets/img/land/2/6.jpg",

    // tomat:"assets/img/white2x2.gif",
    // ottino:"assets/img/white2x2.gif",

    //for models
    whale:"assets/3dm/whale.jpg",
    ducky:"assets/3dm/ducky.png",
    airbus:"assets/3dm/airbus.png",
    helicopter:"assets/3dm/aurora.png",
    aurora:"assets/3dm/aurora.png",
    heartbomb:"assets/3dm/heartbomb.png",
    // mercury:"assets/3dm/mercury/mercury.png",

    white:"assets/img/white2x2.gif",
    barrel: "assets/3dm/barrel.png",
    //building1: "assets/3dm/building-1.png",
    //building2: "assets/3dm/building-2.png",
    //building3: "assets/3dm/building-3.png",
    //building4: "assets/3dm/building-4.png",
    //building5: "assets/3dm/building-5.png",
    building5: "assets/img/white2x2.gif",
    building6: "assets/img/white2x2.gif",

    motorola: "assets/3dm/motorola.jpg",
    chainsaw: "assets/3dm/chainsaw.png",
    crocodile: "assets/3dm/crocodile.png",
    dolphin: "assets/3dm/dolphin.png",
    elephant: "assets/3dm/elephant.jpg",
    garbage: "assets/3dm/garbage.png",
    moab: "assets/3dm/moab.png",
    orca: "assets/3dm/orca.png",
    stingray: "assets/3dm/stingray.png",
    turtle: "assets/3dm/turtle.png",
    walrus: "assets/3dm/walrus.png",
  },
  dynamicTextures:{
    stars:null,
    textbox:null,
  },
  models: {
    whale:["assets/3dm/whale.obj",5],
    ducky:["assets/3dm/ducky.obj",10],
    airbus:["assets/3dm/airbus.obj",8],
    aurora:["assets/3dm/aurora.obj",5],
    helicopter:["assets/3dm/helicopter.obj",4],
    heartbomb:["assets/3dm/heartbomb.obj",4],
    cube:["assets/3dm/cube.obj",5],

    motorola:["assets/3dm/motorola.obj",15],
    barrel:["assets/3dm/barrel.obj",5],
    chainsaw:["assets/3dm/chainsaw.obj",2],
    garbage:["assets/3dm/garbage.obj",5],
    moab:["assets/3dm/moab.obj",5],
    //
    elephant:["assets/3dm/elephant.obj",20],
    crocodile:["assets/3dm/crocodile.obj",10],
    dolphin:["assets/3dm/dolphin.obj",10],
    orca:["assets/3dm/orca.obj",10],
    stingray:["assets/3dm/stingray.obj",15],
    turtle:["assets/3dm/turtle.obj",25],
    walrus:["assets/3dm/walrus.obj",20],
  },
  modelsKeys:null,
  mGroups:{
    space:['aurora','airbus', 'helicopter'],
    sea:['whale','crocodile', 'dolphin', 'orca', 'stingray', 'turtle', 'walrus'],
    bigfishes:['whale', 'dolphin', 'orca', 'walrus'],
    ducks:['ducky'],
    buildings:['building6'],
    waste:['barrel', 'garbage', 'moab'],
    civilization:['barrel', 'garbage', 'airbus', 'helicopter', 'aurora', 'ducky'],
    everything:["whale", "ducky", "airbus", "aurora", "helicopter", "heartbomb", "cube", "barrel", "chainsaw", "garbage", "moab", "elephant", "crocodile", "dolphin", "orca", "stingray", "turtle", "walrus"]
  },
  // object containing models dynamically cloned from originals, for animation.
  dynamicModelsClones:{length:0},
  // meshes
  sky:null,
  land:null,
  sea:null,
  clouds:true,
  flora:null,
  fauna:null,

  lights:{
    ambient:null,
    directional:null,
    sun:null,
  },
}


var HLEnvironment = function(){

  // CUSTOM STYLE FOR console.log
  var console = { log:function(){}, warn:function(){}, error:function(){} };
  if(isDebug)
  for(var k in console){
    console[k] =
      (function(_k){
        return function(message){
          window.console[_k]('%c  %cHLEnvironment:\n'+message,
            "background-image: url(\"https://isitchristmas.com/emojis/sunrise_over_mountains.png\"); background-size: cover",
            "color:black"
            );
        }
      })(k);
  }

  var loadableImagesCounter=0,imagesLoaded=0;

  function imageLoaded(){
    if(imagesLoaded==loadableImagesCounter) {
      //console.timeEnd('images');
      HL.textures['length'] = imagesLoaded;
      // initMaterials();
    }
  }

  function loadTextures(){
    //console.time('images');
    var loader = new THREE.TextureLoader(HL.texturesLoadingManager);
    for (var key in HL.textures)
      if(HL.textures[key]!=null){
        // console.log('loading image '+key);
        loadableImagesCounter++;
        HL.textures[key] = loader.load(
          HL.textures[key],
          (function(k) { return function() {
            // increment loaded Counter
            imagesLoaded++;
            // console.log("image "+k+" loaded, "+imagesLoaded+"/"+loadableImagesCounter);
              //set texture wrapping
            HL.textures[k].wrapS = THREE.RepeatWrapping;
            HL.textures[k].wrapT = THREE.RepeatWrapping;
            HL.textures[k].repeat.set( 1, 1);
            imageLoaded() } })(key)
          //   function(e){console.log(e.loaded+"/"+e.total)},
          // // (function(key){ return function(e){console.log(key+" "+e.loaded+ " on "+e.total)}})(key),
          // function(i){
          //   loadableImagesCounter--;
          //   console.error(i);
          //   loadingDiv.innerHTML += ('<p style="font-size:40px;"> LOADING ERROR ON IMAGE '+key+' PLEASE RELOAD</p>');
          //   //imageLoaded()
          // }
        );
      }
      else delete(HL.textures[key]);
  }

  function initDynamicTextures(){

    for(var k in HL.dynamicTextures){
      HL.dynamicTextures[k] = document.createElement('canvas');
      HL.dynamicTextures[k].width = 512;
      HL.dynamicTextures[k].height = 512;
      HL.dynamicTextures[k]['c'] = HL.dynamicTextures[k].getContext('2d');
      HL.dynamicTextures[k]['texture'] = new THREE.Texture(HL.dynamicTextures[k]);
      HL.dynamicTextures[k]['texture'].wrapS = THREE.RepeatWrapping;
      HL.dynamicTextures[k]['texture'].wrapT = THREE.RepeatWrapping;
      HL.dynamicTextures[k]['texture'].name = k;
      HL.dynamicTextures[k]['texture'].magFilter = THREE.NearestFilter;
      HL.dynamicTextures[k]['texture'].minFilter = THREE.NearestFilter;

    }

    // HL.cameraCompanion.material.map = HL.dynamicTextures.textbox.texture;
  }

  function init(){

    var HLAssetLoadEvent = new Event("HLAssetLoaded");

    HL.texturesLoadingManager = new THREE.LoadingManager();

    HL.texturesLoadingManager.onStart = function ( url, itemsLoaded, itemsTotal ) {

  	  console.log( 'Started loading textures');

    };

    HL.texturesLoadingManager.onLoad = function ( ) {

    	console.log( 'Textures loading complete!');
      // assign textures to materials
      for(var k in HL.models){
        HL.materials[k].map = HL.textures[k]!==undefined?HL.textures[k]:null;
      }
      HL.materials.sky.uniforms.map1.value = HL.textures.sky1;
      HL.materials.sky.uniforms.map2.value = HL.textures.sky2;
      HL.materials.sky.uniforms.map3.value = HL.textures.sky3;

      HL.materials.water.material.uniforms.normalSampler.value = HL.textures.water;


      console.log('Textures assigned to materials\ndispatching HLAssetLoaded event');
      window.dispatchEvent(HLAssetLoadEvent);

    };


    HL.texturesLoadingManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
      HL.texturesLoaded = itemsLoaded;
      HL.totalTextures = itemsTotal;

    	console.log( 'Completed loading texture: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
    };

    HL.texturesLoadingManager.onError = function ( url ) {

    	console.error( 'There was an error loading texture ' + url );
      alert("Textures: a loading error occurred. Please reload.");

    };


    // init models loader

    HL.modelsLoadingManager = new THREE.LoadingManager();

    HL.modelsLoadingManager.onStart = function ( url, itemsLoaded, itemsTotal ) {

      console.log( 'Started loading models');

    };

    HL.modelsLoadingManager.onLoad = function ( ) {

      console.log('Models Loading complete!\ndispatching HLAssetLoaded event');
      window.dispatchEvent(HLAssetLoadEvent);

    };


    HL.modelsLoadingManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
      HL.modelsLoaded = itemsLoaded;
      HL.totalModels = itemsTotal;

      console.log( 'Completed loading model: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );

    };

    HL.modelsLoadingManager.onError = function ( url ) {

      console.log( 'There was an error loading model ' + url );
      alert("Models: a loading error occurred. Please reload.");

    };

    // audio preload
    if(HL.audio !== null){
      HL.audioLoader = new THREE.FileLoader();
      HL.audioLoader.setResponseType('blob');

      HL.preloadDebounce = true;
      HL.audioLoader.load(
          // resource URL
          HL.audio,

          // Function when resource is loaded
          function ( data ) {
              // HL.audio = data;
              console.log('Audio Loading complete!\ndispatching HLAssetLoaded event');
              window.dispatchEvent(HLAssetLoadEvent);

          },

          // Function called when download progresses
          function ( xhr ) {
            var audioProgressEvent = new CustomEvent('audioProgress', {'detail':xhr});
            window.dispatchEvent( audioProgressEvent );
          },

          // Function called when download errors
          function ( xhr ) {
              console.error( 'Audio: An error happened '+ xhr );
              alert("Audio: a loading error occurred. Please reload.");
          }
      );
    }

    initEnvironment();
    initLights();

    initGeometries();
    initDynamicTextures();
    initMaterials();
    initMeshes();

    loadTextures();
    initModels();
    // TODO: when textures and models are loaded, dispatch HLEload event and start clock.
    // try this:

    window.addEventListener('HLAssetLoaded', assetLoadListener);
  }

  var assetTotal = 2, assetLoaded=0;

  function assetLoadListener(){
    if(++assetLoaded == assetTotal){
      // start clock;
      console.log('start HL.clock');
      HL.clock.start();
      //dispatch HLEload event
      var HLEload = new Event("HLEload");
      console.log("assetLoadListener dispatching HLEload");
      window.dispatchEvent(HLEload);
    }
  }

  function initEnvironment(){
    //console.time('environment');

    // SET CONSTANTS
    HLE.TILE_SIZE = HLE.WORLD_WIDTH / HLE.WORLD_TILES;
    HLE.SEA_TILE_SIZE = HLE.WORLD_WIDTH / HLE.SEA_TILES;
    // HLE.LAND_Y_SHIFT = -HLE.WORLD_HEIGHT*0.1;
    HLE.MAX_MOVE_SPEED = Math.min(20,HLE.TILE_SIZE);
    HLE.BASE_MOVE_SPEED = HLE.WORLD_WIDTH/HLE.WORLD_TILES/2 ;

    // init clock
    HL.clock = new THREE.Clock(false);

    //init noise
    HLE.noiseSeed = Math.random() * 1000;
    // HL.noise = new ImprovedNoise();

    // SCENE
    HL.scene = new THREE.Scene();

    if(HLE.FOG && !isWire){
      HL.scene.fog = new THREE.Fog(
        HLC.horizon,
        HLE.WORLD_WIDTH * 0.3,
        HLE.WORLD_WIDTH * 0.475
      );
      // HL.scene.fog = new THREE.FogExp2();
      // HL.scene.fog.density = 0.00025;//0.00025;

      HL.scene.fog.color = HLC.horizon;
    }


    // CAMERA
    if(isCardboard){
    HL.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, HLE.WORLD_WIDTH*100);
    }
    else{

      HL.camera = new THREE.PerspectiveCamera(
        40,
        (window.innerWidth) / (window.innerHeight),
        1.1,
        HLE.WORLD_WIDTH * 100
      );

    }

    // TODO check filmGauge and filmOffset effects
    // HL.camera.filmGauge = 1;
    // HL.camera.filmOffset = 100;
    // HL.camera.lookAt(new THREE.Vector3(0,0,-HLE.WORLD_WIDTH/6)); // camera looks at center point on horizon

    HL.cameraGroup = new THREE.Group();

    let vmax = Math.max(window.innerWidth, window.innerHeight )

    HL.cameraCompanion = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(vmax * .60, vmax * .60, 1, 1),
      new THREE.MeshLambertMaterial( { color: 0xffffff, emissive: 0xffffff, transparent: true, side:THREE.FrontSide } )
    );

    HL.cameraCompanion.regenerateGeometry = function(){
      HL.cameraCompanion.geometry = new THREE.PlaneBufferGeometry(vmax * .60, vmax * .60, 1, 1);
    }


    HL.cameraCompanion.position.z = -600;
    // needed to correctly sort transparency
    HL.cameraCompanion.renderOrder = 1;
    HL.cameraCompanion.visible = true;

    HL.cameraGroup.add(HL.camera);
    HL.cameraGroup.add(HL.cameraCompanion);

    HL.cameraGroup.position.y = 50;

    HL.scene.add(HL.cameraGroup);

    // RENDERER

    // CRITIC declare alpha:true to solve a bug in some chrome on osx setup
    HL.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true, preserveDrawingBuffer:true});
		// HL.renderer.setClearColor( 0x000000 );
    HL.renderer.setPixelRatio( HLE.PIXEL_RATIO_SCALE );// window.devicePixelRatio * HLE.PIXEL_RATIO_SCALE);
		HL.renderer.setSize( window.innerWidth, window.innerHeight );
    HL.renderer.autoClearColor = false;

    HL.renderer.domElement.style.imageRendering = 'pixelated';
    document.body.appendChild(HL.renderer.domElement);

//     /* Keyword values */
// image-rendering: auto;
// image-rendering: crisp-edges;
// image-rendering: pixelated;

    // HL.renderer.setSize(window.innerWidth, window.innerHeight, true);

    // if(HLE.PIXEL_RATIO_SCALE && HLE.PIXEL_RATIO_SCALE<1 && HLE.PIXEL_RATIO_SCALE>0){
    //
    //   HL.renderer.setPixelRatio(window.devicePixelRatio * HLE.PIXEL_RATIO_SCALE);
    //
    // } else {
    //
    //   HL.renderer.setPixelRatio(window.devicePixelRatio);
    //
    // }



    var renderTargetParameters = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBFormat,
      // depthBuffer: true,
      // stencilBuffer: false
    };

    HL.fbo = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, renderTargetParameters);



    HL.renderingScene = new THREE.Scene();

  	HL.renderingCamera = new THREE.OrthographicCamera( innerWidth / - 2, innerWidth / 2, innerHeight / 2, innerHeight / - 2, 1, 1000 );
  	HL.renderingCamera.position.z = 10;

  	HL.renderingPlane = new THREE.Mesh(
  		new THREE.PlaneBufferGeometry( innerWidth, innerHeight, 1, 1),
  		new THREE.MeshBasicMaterial({color: 0xffffff, map: HL.fbo.texture })
  	);

  	HL.renderingPlane.material.onBeforeCompile = function( shader ){

  			shader.uniforms.white = { value: 0 };

  			shader.fragmentShader = 'uniform float white;\n' + shader.fragmentShader;

  			shader.fragmentShader = shader.fragmentShader.replace(
  				'gl_FragColor = vec4( outgoingLight, diffuseColor.a );',
          'gl_FragColor = vec4( outgoingLight, 0.15 );'
  			);

  		HL.renderingPlane.material['materialShader'] = shader;
  	}

  	HL.renderingScene.add( HL.renderingPlane );



    if(isMapped){

      HL.mappingCoords = JSON.parse(localStorage.getItem('HYPERLAND_SCREEN_MAPPING_COORDS'));

      HL.mappingScreenGeometry = new THREE.PlaneGeometry(200,200,1,1);

      // load coords, and let's assume we have 4 corners
      for(var i=0; i<HL.mappingScreenGeometry.vertices.length;i++){
        HL.mappingScreenGeometry.vertices[i].x = HL.mappingCoords[i].x;
        HL.mappingScreenGeometry.vertices[i].y = HL.mappingCoords[i].y;
        HL.mappingScreenGeometry.vertices[i].z = HL.mappingCoords[i].z;
      }

      // flip Y, I don't know why but I guess it's a weird orthoCam / plane geometry positioning
      for(var f = 0; f<2; f++ )
        for(var v = 0; v<3; v++ )
          HL.mappingScreenGeometry.faceVertexUvs[0][f][v].y = 1 - HL.mappingScreenGeometry.faceVertexUvs[0][f][v].y;


      HL.mappingScreenGeometry.verticesNeedUpdate = true;
      HL.mappingScreenGeometry.uvsNeedUpdate = true;
      HL.mappingScreenGeometry.computeBoundingBox();


      // calculate mapped area width and height
      var width = HL.mappingScreenGeometry.boundingBox.max.x - HL.mappingScreenGeometry.boundingBox.min.x;
      var height = HL.mappingScreenGeometry.boundingBox.max.y - HL.mappingScreenGeometry.boundingBox.min.y;

      // TODO: VERIFY IF NECESSARY change aspect of HL.camera
      if(mappingCorrectAspect){

        HL.camera.aspect = width/height;
        HL.camera.updateProjectionMatrix();

      }


      var parameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };

      HL.mappingRenderTarget = new THREE.WebGLRenderTarget( width, height, parameters );
      HL.mappingScene = new THREE.Scene();
      HL.mappingScreen = new THREE.Mesh(
        HL.mappingScreenGeometry,
        new THREE.MeshBasicMaterial({color:0xffffff, side:THREE.DoubleSide, map: HL.mappingRenderTarget.texture})
      );

      HL.mappingScene.add(HL.mappingScreen);
      // HL.mappingCamera = new THREE.OrthographicCamera(-width/2, width/2, -height/2, height/2, 1, 10000);
      // HL.mappingCamera = new THREE.OrthographicCamera(-width/2, width/2, -height/2, height/2, 1, 10000);
      HL.mappingCamera = new THREE.OrthographicCamera(-window.innerWidth/2, window.innerWidth/2, -window.innerHeight/2, window.innerHeight/2, 1, 10000);
      HL.mappingCamera.position.z = 5000;
      // HL.mappingCamera.rotateY(Math.PI);

    }


    // EFFECTS
    console.error('effects para');
    if(isCardboard){
      HL.camera.fov = 50;//70;
      HL.camera.focus = HLE.WORLD_WIDTH*0.5;
      HL.camera.updateProjectionMatrix ();

      HL.stereoEffect = new THREE.StereoEffect(HL.renderer);
      HL.stereoEffect.setSize(window.innerWidth, window.innerHeight);

    }
    else if(isVR){
      HL.VREffect = new THREE.VREffect( HL.renderer );
      HL.VREffect.setSize(window.innerWidth, window.innerHeight);
    }

    // CONTROLS
    console.log('controls');
    if(isVR){
      HL.controls = new THREE.VRControls( HL.cameraGroup );
    }
    else if(isFPC){
      HL.controls = new THREE.FirstPersonControls(HL.cameraGroup, HL.renderer.domElement);
      HL.controls.invertY = true;
      HL.controls.movementSpeed = 0;
      HL.controls.lookSpeed = 0.045;
      HL.controls.dragToLook = false;

      HL.controls.constrainVertical = true;
      HL.controls.verticalMin = Math.PI/4;
      HL.controls.verticalMax = Math.PI/1.5;

    }
    else if (isMobile){

          HL.controls = new THREE.DeviceOrientationControls(HL.cameraGroup);

    }

    else if( remidi ){

      HL.controls = new THREE.RemidiControls( HL.cameraGroup );
      console.log('init RemidiControls');

    }

    //console.timeEnd('environment');
  }


  function initGeometries(){
    //console.time('geometries');

  //  HL.geometries.sky = new THREE.BoxGeometry(HLE.WORLD_WIDTH, HLE.WORLD_WIDTH, HLE.WORLD_WIDTH-HLE.TILE_SIZE);
  //  HL.geometries.sky.translate(0,0, HLE.TILE_SIZE*0.5);

   HL.geometries.sky = new THREE.SphereBufferGeometry(HLE.WORLD_WIDTH*.5-50,64,64);
    // HL.boundaries = new THREE.Mesh(
    //   new THREE.BoxBufferGeometry(HLE.WORLD_WIDTH-100,HLE.WORLD_WIDTH-100,HLE.WORLD_WIDTH-100),
    //   new THREE.MeshBasicMaterial({side:THREE.DoubleSide, transparent:true, opacity:0.025})
    // );
    // HL.scene.add(HL.boundaries);

    HL.geometries.land = new THREE.PlaneBufferGeometry(HLE.WORLD_WIDTH, HLE.WORLD_WIDTH,
      HLE.WORLD_TILES , HLE.WORLD_TILES);
    HL.geometries.land.rotateX(-Math.PI / 2);
    HL.geometries.land.name = 'land-geometry';

    if(HLE.WATER){
      HL.geometries.sea = new THREE.PlaneBufferGeometry(HLE.WORLD_WIDTH, HLE.WORLD_WIDTH,
      1,1);
      HL.geometries.sea.name = 'sea-water-geometry';
    }
    else{
      HL.geometries.sea = new THREE.PlaneBufferGeometry(HLE.WORLD_WIDTH, HLE.WORLD_WIDTH,
        HLE.SEA_TILES ,  HLE.SEA_TILES);
      HL.geometries.sea.name = 'sea-geometry';
    }

    HL.geometries.sea.rotateX(-Math.PI / 2); // gotta rotate because Planes in THREE are created vertical
    //HL.geometries.sea.dynamic = true;

    HL.geometries.seaHeights = [];
    for(var i=0; i<HLE.WORLD_TILES;i++)
      HL.geometries.seaHeights[i]=1;

    // init and set oarticle systems geometries
    HL.geometries.clouds = new THREE.BufferGeometry();
    HL.geometries.clouds.name = 'clouds-geometry';
    HLH.initBufParticleSystem(HL.geometries.clouds, HLE.WORLD_WIDTH*2, HLE.WORLD_HEIGHT, HLE.CLOUDS_AMOUNT, true, true);

    HL.geometries.flora = new THREE.BufferGeometry();
    HL.geometries.flora.name = 'flora-geometry';
    HLH.initBufParticleSystem(HL.geometries.flora , HLE.WORLD_WIDTH, HLE.WORLD_HEIGHT, HLE.FLORA_AMOUNT, false, true);

    HL.geometries.fauna = new THREE.BufferGeometry();
    HL.geometries.fauna.name = 'fauna-geometry';
    HLH.initBufParticleSystem(HL.geometries.fauna , HLE.WORLD_WIDTH, HLE.WORLD_HEIGHT*0.5, HLE.MAX_FAUNA, true, true);

    //console.timeEnd('geometries');
  }


  function initMaterials(){
    //console.time('materials');

    // HL.materials.sky = new THREE.MeshBasicMaterial({
    //   color: HLC.horizon,
    //   fog: false,
    //   side: THREE.BackSide,
    //   wireframe: false,//isWire,
    //   wireframeLinewidth: 2,
    //   //map:isWire?null:HL.textures.sky2,
    // });

    HL.materials.sky = new THREE.SkyShaderMaterial({
      wireframe: isWire,
      wireframeLinewidth: 2,
      map1:isWire?null:true,//HL.textures.sky2,
      map2:isWire?null:true,//HL.textures.sky3,
      map3:isWire?null:true,//HL.textures.sky5,
    });

    HL.materials.sky.uniforms.color.value = HLC.horizon;// set by reference
    // HL.textures.sky1.wrapS = HL.textures.sky1.wrapT = THREE.RepeatWrapping;
    // HL.textures.sky1.repeat.set( 3, 1);


    HL.materials.land = new THREE.LandShaderMaterial(
      HLE.WORLD_WIDTH,HLE.WORLD_TILES,
      {
      color:HLC.land,
      wireframe:isWire,
      // wireframeLinewidth:2,
      //map:isWire?null:HL.textures.land,
      map:isWire?null:new THREE.Texture(),
      fog:true,
      repeatUV: new THREE.Vector2(2,2),
      centerPath : HLE.CENTER_PATH,
      side:THREE.DoubleSide,
      flatShading: true,
      transparent: false,
      hardMix:true
   });

   HL.materials.land.uniforms.worldColor.value = HLC.horizon;
   HL.materials.land.uniforms.skyColor.value = HLC.horizon;
   HL.materials.land.uniforms.withCenterPath.value = HLE.CENTER_PATH;

   HL.materials.land.uniforms.advance.value = HLE.acceleration;
   HL.materials.land.uniforms.noiseFreq.value = HLE.noiseFrequency;
   HL.materials.land.uniforms.noiseFreq2.value = HLE.noiseFrequency2;
   HL.materials.land.uniforms.landHeight.value = HLE.landHeight * 1.3 ;
   HL.materials.land.uniforms.landZeroPoint.value = HLE.landZeroPoint;

    if(!HLE.WATER && !HLE.MIRROR){
      HL.materials.sea = new THREE.MeshBasicMaterial({
        color: HLC.sea,
        //side: THREE.DoubleSide,
        fog: true,
        wireframe: isWire,
        wireframeLinewidth: 2,
         transparent:false,
         opacity:0.9,
         alphaTest: 0.5,
         //map:isWire?null:HL.textures.sea
      });
      HL.materials.sea.color = HLC.sea; // set by reference

      // if(!isWire && HL.textures.sea!=null){
      //     HL.textures.sea.wrapS = THREE.RepeatWrapping;
      //     HL.textures.sea.wrapT = THREE.RepeatWrapping;
      //     HL.textures.sea.repeat.set( HLE.WORLD_TILES*4, 1);
      // }
    }

    if(HLE.MIRROR) {
      HL.materials.mirror = new THREE.Mirror( HL.renderer, HL.camera,
        { clipBias: 0,//0.0003,
          textureWidth: 512,
          textureHeight: 512,
          color: 0x000000,//666666,
          fog: true,
          side: THREE.DoubleSide,
          worldWidth: HLE.WORLD_WIDTH,
          transparent:false,
          opacity:1,//0.657,
          wireframe:isWire,
          wireframeLinewidth:2,
         }
      );
      HL.materials.mirror.rotateX( - Math.PI / 2 );
    }

   if(HLE.WATER) {

  		// Create the water effect
  		HL.materials.water = new THREE.Water(HL.renderer, HL.camera, HL.scene, {
  			textureWidth: isCardboard?200:512 ,
  			textureHeight: isCardboard?200:512 ,
  			// waterNormals: HL.textures.water,
        noiseScale: .5,
        distortionScale: 100,
  			sunDirection: HL.lights.sun.position.normalize(),
  		  color: HLC.sea,
        opacity: 0.90,
  			// betaVersion: 1,
        fog: true,
        side: THREE.DoubleSide,
        blur: true,
        wireframe:isWire,
        wireframeLinewidth:2,
  		});

      HL.materials.water.sunColor = HLC.horizon;
    }



    HL.materials.clouds = new THREE.PointsMaterial({
      color: HLC.clouds,
      side: THREE.DoubleSide,
      opacity:1,
      transparent: false,
      size: isCardboard||isVR?6:12,
      fog: true,
      sizeAttenuation: true,
      // alphaTest: -0.5,
      depthWrite: true,
      // map:isWire?null:HL.textures.cloud1,
    });
    HL.materials.clouds.color = HLC.clouds; // set by reference


    // HL.materials.flora = new THREE.PointsMaterial({
    //   color: HLC.flora,
    //   side: THREE.DoubleSide,
    //   opacity: 0.5,
    //   transparent: true,
    //   size: 100,
    //   fog: true,
    //   //blending:THREE.AdditiveBlending,
    //   sizeAttenuation: true,
    //   alphaTest: 0.1,
    //   map:isWire?null:HL.textures.flora,
    //   //depthTest:false,
    // });
    // HL.materials.flora.color = HLC.flora; // set by reference


    // HL.materials.fauna = new THREE.PointsMaterial({
    //   color: HLC.fauna,
    //   // side: THREE.DoubleSide,
    //   opacity: .6,
    //   transparent: false,
    //   size: 10,
    //   fog: true,
    //   sizeAttenuation: true,
    //   map:isWire?null:HL.textures.fauna,
    //   alphaTest: 0.5,
    //   //blending: THREE.AdditiveBlending,
    // });
    // HL.materials.fauna.color = HLC.fauna; // set by reference


    //create materials for 3d models
    for(var k in HL.models){
      HL.materials[k] = new THREE.MeshLambertMaterial({
        color: 0x000000,
        map:isWire?null:new THREE.Texture(),//(HL.textures[k]!==undefined?HL.textures[k]:null),
        fog:true,
        wireframe:isWire,
        wireframeLinewidth:2,
        side:THREE.DoubleSide,
        transparent:true,
        flatShading: false
      });
      HL.materials[k].color = new THREE.Color(0xffffff);

    }



  }



  function initModels(){

    var loader = new THREE.OBJLoader(HL.modelsLoadingManager, false), modelPath, modelScale;
    var keys = {};
    // load a resource
    for (var key in HL.models){
      if(HL.models[key]!==null){
        // loadableModelsCounter++;
        // console.log("loading model :"+ key );
        // console.log("loadableModelsCounter:"+ (loadableModelsCounter) );
        modelPath = HL.models[key][0];
        modelScale = HL.models[key][1];
        loader.load(
          // resource URL
          modelPath,
          // Function when resource is loaded
          // use the closure trick to dereference and pass key to the delayed out onLoad funtion
        //  (function(i) { return function() { alert( i ) } })(i);
          (function ( nK , modelScale) {
            return function( object ){
              HL.models[nK]= new THREE.Mesh(object.children[0].geometry);
              HL.models[nK].name = nK;
              HL.models[nK].geometry.scale(modelScale,modelScale,modelScale);
  //            HL.models[key].geometry.rotateX(Math.PI*0.5);
              HL.models[nK].geometry.computeBoundingBox();
              HL.models[nK]['size'] = new THREE.Vector3();
              HL.models[nK].geometry.boundingBox.getSize( HL.models[nK].size );
              HL.models[nK].material = HL.materials[nK];
              //HL.models[nK].material.color.set( HLC.palette.getRandom() ); // HLC.horizon; // set by reference

              HL.scene.add( HL.models[nK] );
              HLH.resetModel(HL.models[nK] );

              // modelsLoaded++;
              // // console.log("model "+nK+" loaded, "+modelsLoaded+"/"+loadableModelsCounter);
              // modelLoaded();
            }
          })(key, modelScale)
          // (function(key){ return function(e){console.log(key+" "+e.loaded+ " on "+e.total)}})(key),
          // (function(k){ return function(e){
          //     loadableModelsCounter--;
          //     console.error(e);
          //     loadingDiv.innerHTML += ('<p style="font-size:40px;"> LOADING ERROR ON MODEL'+k+' PLEASE RELOAD</p>');
          //     //modelLoaded();
          //   }
          // })(key)
        )
      }
    }
    HL.modelsKeys = Object.keys(HL.models);
  };


  function initLights(){

     HL.lights.sun = new THREE.DirectionalLight( 0xeeffcc, 4);
     HL.lights.sun.color = HLC.horizon;
     HL.lights.sun.position.set(0,1999,100);
     HL.scene.add( HL.lights.sun )


     HL.lights['land'] = new THREE.DirectionalLight( 0xffffff, 1);
     HL.lights.land.position.set(0,-100,0);
     HL.lights.land.color = HLC.land;
     HL.scene.add( HL.lights.land );

     // HL.lights['sea'] = new THREE.DirectionalLight( 0xffffff, 1);
     // HL.lights.sea.position.set(0,-100,0);
     // HL.lights.sea.color = HLC.sea;
     // HL.scene.add( HL.lights.sea );

     // HL.lights['hemisphere'] = new THREE.HemisphereLight( 0xffffff, HLC.land, .5 );
     // HL.lights.hemisphere.color = HLC.horizon;
     // HL.lights.hemisphere.groundColor = HLC.land;
     // HL.scene.add(HL.lights.hemisphere);

  }


  function initMeshes(){
    //console.time('meshes');

    HL.sky = new THREE.Mesh(HL.geometries.sky, HL.materials.sky);
    HL.sky.name = "sky";
    HL.scene.add(HL.sky);

    HL.land = new THREE.Mesh(HL.geometries.land, HL.materials.land);
    // HL.land.position.y = -HLE.LAND_Y_SHIFT; //hardset land at lower height, so we easily see sea
    HL.land.name = "land";
    HL.scene.add(HL.land);





    if(HLE.MIRROR) {
      HL.sea = new THREE.Mesh( HL.geometries.sea, HL.materials.mirror.material );
      HL.sea.add( HL.materials.mirror );
    }
    else if(HLE.WATER){
      HL.sea = new THREE.Mesh( new THREE.PlaneBufferGeometry(HLE.WORLD_WIDTH,HLE.WORLD_WIDTH,16,16), HL.materials.water.material );
      HL.sea.add(HL.materials.water);
      HL.sea.rotateX(-Math.PI * .5);
    } else {
      HL.sea = new THREE.Mesh(HL.geometries.sea, HL.materials.sea);
    }
    HL.sea.name = "sea";

    HL.scene.add(HL.sea);



    HL.clouds = new THREE.Points(HL.geometries.clouds, HL.materials.clouds);
    HL.clouds.name = "clouds";
    HL.clouds.frustumCulled = false;
    HL.scene.add(HL.clouds);

    // HL.flora = new THREE.Points(HL.geometries.flora, HL.materials.flora);
    // HL.flora.name = "flora";
    // HL.flora.frustumCulled = false;
    // HL.scene.add(HL.flora);

    // HL.fauna = new THREE.Points(HL.geometries.fauna, HL.materials.fauna);
    // HL.fauna.name = "fauna";
    // HL.scene.add(HL.fauna);
    //console.timeEnd('meshes');


    // initLights();
  }
  return{init:init}
}();
