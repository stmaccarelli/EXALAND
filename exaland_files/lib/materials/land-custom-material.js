var LandMat = {
  //uniforms:{ baseColor : { type: c, value: new THREE.Color(0xff0000)} }
	// uniforms: { mirrorColor: { type: c, value: new THREE.Color( 0x7F7F7F ) },
	// 			mirrorSampler: { type: t, value: null },
	// 			textureMatrix : { type: m4, value: new THREE.Matrix4() }
	// },
  uniforms: THREE.UniformsUtils.merge( [

		// THREE.UniformsLib[ 'common' ],
		THREE.UniformsLib[ 'fog' ],
    {
      advance : {type:"f", value: 0},
      landMotion : {type:"v3", value: new THREE.Vector3(0,0,0) },
      worldWidth : {type:"f", value: 0},
      worldModuleWidth : {type:"f", value: 0},
      noiseFreq  : {type:"f", value: 2.0},
      noiseFreq2  : {type:"f", value: 2.0},
      landSeed  : {type:"f", value: 50.0},
      landHeight  : {type:"f", value: 1.0},
      landZeroPoint  : {type:"f", value: 1.0},
      withCenterPath  : {type:"b", value: false},
      map : {type:"t", value: null },
      map2 : {type:"t", value: null },
      mapSand : {type:"t", value: null },
      repeatUV : {type:"v2", value: new THREE.Vector2(1,1) },
      color : { type: "c", value: new THREE.Color( 0x00FF00 ) },
      worldColor : {type: "c", value: new THREE.Color( 0x00ff00 ) },
      skyColor : {type: "c", value: new THREE.Color( 0x0000ff ) },
      natural : { type: "f", value: 0},
      rainbow : { type: "f", value: 0},
      glowing : { type: "f", value: 0},
      bFactor : { type: "f", value: 0.5 },
      cFactor : { type: "f", value: 0.15 },
      squareness : {type: "f", value: 0.0001},
      transparent: {value: false},
      hardMix: {value: false}
    }]),

	vertexShader:
  fastGLSLNoise+
  // THREE.ShaderChunk['common']+
  THREE.ShaderChunk['fog_pars_vertex']+

  `
    varying highp vec2 vUv;
    varying vec3 noiseColor;

    uniform vec2 repeatUV;

    uniform float worldWidth;
    uniform float worldModuleWidth;
    uniform float advance;
    uniform vec3 landMotion;
    uniform float noiseFreq;
    uniform float noiseFreq2;
    uniform float landSeed;
    uniform float landHeight;
    uniform float landZeroPoint;
    uniform bool withCenterPath;

    uniform float bFactor;
    uniform float cFactor;
    uniform float squareness;

    varying float bbb;
    varying float ccc;
    varying float altitude;
    // varying float altitudeWithCenterPath;
    varying float noises[5];
    // varying vec3 pos;
    // varying vec3 cam;

    vec2 advanceUV;

    void main() {


      vec2 advanceMod = mod(landMotion.xz, worldModuleWidth);

      vec3 nPos = position;

      nPos.x+=advanceMod.x;
      nPos.z+=advanceMod.y;

      // parametric terrain fBM - like

      vec3 mPos = vec3( (nPos.x - landMotion.x ) / worldWidth, (nPos.z  - landMotion.z )/worldWidth, landSeed);

      noises[0] = fnoise( mPos * 1.8  ) ;
      noises[1] = fnoise( mPos * 10.0  ) ;
      noises[2] = fnoise( mPos * 100.0  ) ;
      noises[3] = fnoise( mPos * 0.8  ) ;
      noises[4] = fnoise( mPos * 0.28 ) ;

      vec2 factors = clamp( vec2(
        bFactor * .4 + noises[3] * .25 ,
        cFactor * .1 + noises[4] * .05 ), 0.0, .5
      );


    //  ccc = 1.0 - ccc;
     bbb = noises[1] * factors.x;
     ccc = noises[2] * factors.y;




    // if ABS bb e ccc got peaks
    nPos.y = ( ( noises[0] + bbb + ccc ) / ( 1.0 + factors.x + factors.y ) );
    // nPos.y = noises[0] * noises[1] * noises[2];// * noises[3] * noises[4];// * noises[5];
    // base altitude
    altitude = nPos.y;

    //add squareness calculations
    nPos.y = floor(nPos.y/squareness)*squareness;
    nPos.y += landZeroPoint/landHeight;
    // altitudeWithCenterPath = nPos.y;

    //distance attenuation
    nPos.y *= (cos( length( position.xz / worldWidth ) * 3.14) + 0.5) / 1.5;


    if(withCenterPath){

        float relativeCamHeight = clamp( cameraPosition.y, 0., landHeight ) / landHeight;
        //centerPath calculations
        float centerPath = abs(position.z/worldWidth) + abs(position.x/worldWidth);
        centerPath = centerPath *
          ( (2.5-relativeCamHeight*2.5) - centerPath) * (2.5-relativeCamHeight*2.5)
          + relativeCamHeight; // with this, when cam goes up, 1 is added to centerPath 0

        nPos.y *= ( nPos.y > 0.0 ? centerPath : 1.0 ) ;
    }


    //multiply normalized nPos.y per landHeight
    nPos.y *= landHeight;


    gl_Position = projectionMatrix * modelViewMatrix * vec4( nPos ,1.0);

    advanceUV = (landMotion.xz - advanceMod)/worldWidth;
    vUv = vec2( uv.x - advanceUV.x, uv.y + advanceUV.y ) * repeatUV;


    // noiseColor = vec3 ( noises[3]*0.9, noises[3]*1.3, noises[3]*0.8);
//
    noiseColor = vec3(

      .3 + noises[0] * .7,
      .3 + noises[3] * .7,
      .3 + noises[4] * .7 );


    #ifdef USE_FOG
    vec4 mvPosition = modelViewMatrix * vec4( nPos, 1.0);
    fogDepth = -mvPosition.z;
    #endif

    // 11: uniform mat4 modelMatrix;
    // 12: uniform mat4 modelViewMatrix;
    // 13: uniform mat4 projectionMatrix;
    // 14: uniform mat4 viewMatrix;
    // 15: uniform mat3 normalMatrix;

    //  pos = (modelViewMatrix * vec4( nPos, 1.0) ).rgb;
    //  cam = cameraPosition; //(viewMatrix * vec4( cameraPosition, 1.0) ).rgb;

    }
    `,

  fragmentShader:
  // fastGLSLNoise+
  // THREE.ShaderChunk['common']+
  THREE.ShaderChunk['fog_pars_fragment']+
  `

    varying highp vec2 vUv;
    varying vec3 noiseColor;
    varying vec3 nNormal;

    varying float bbb;
    varying float noises[5];
    varying float ccc;
    varying float altitude;
    // varying float altitudeWithCenterPath;

    uniform vec3 color;

    // varying vec3 pos;
    // varying vec3 cam;


    uniform bool transparent;
    uniform bool hardMix;
    uniform float worldWidth;
    uniform float worldModuleWidth;
    uniform float advance;
    uniform float noiseFreq;
    // uniform float landSeed;
    uniform float noiseFreq2;
    uniform float landHeight;
    uniform float landZeroPoint;
    // uniform vec3 landMotion;


    uniform sampler2D map;
    uniform sampler2D map2;
    uniform sampler2D mapSand;

    uniform float natural;
    uniform float rainbow;
    uniform float glowing;
    uniform vec3 worldColor;
    uniform vec3 skyColor;

    void main() {

    vec4 diffuseColor = vec4(color,1.0);
    float nAltitude = altitude + landZeroPoint/landHeight;

    float seaShore = clamp( nAltitude * 7.0, -1.0, 1.0);


    #ifdef TEXTURED
    vec4 texelColor;
    if( texture2D(map, vUv).r > -1. ){
      texelColor = texture2D(map, vUv);
    }

    if( texture2D(map2, vUv).r > -1. ){
      // texelColor = mix(texelColor, texture2D( map2, vUv ), noises[3]*0.5+0.5 );
       texelColor = mix(texelColor, texture2D( map2, vUv ), noises[1] * noises[1] * noises[1] * 0.5 + 0.5 );
    }

    if( texture2D(mapSand, vUv).r > -1. ){
      texelColor = mix( texture2D(mapSand, vUv), texelColor, clamp( seaShore , 0.0, 1.0) );
    }

    if(hardMix){
      if(texelColor.r > 0.5) texelColor.rgb = vec3(1.0);
      else texelColor.rgb = vec3(0.0);
    }
    // terrain coloring
    diffuseColor.rgb = texelColor.rgb * diffuseColor.rgb + vec3(0.05);

    #endif


    if(!hardMix){
      // terrain rainbow coloring
      diffuseColor.rgb += noiseColor * rainbow ;

      // sky light
       diffuseColor.rgb *= skyColor.rgb * 1.618;

      // seashore darkening
       diffuseColor.rgb *= clamp( abs( seaShore * 1.8 ) + 0.5, 0.0, 1.0);
    }

    // terrain fake occlusion
    diffuseColor.rgb *= vec3(1.0) - vec3( - ( ccc + bbb * 0.8)  ) ;





    // sea depth
   float seaDepth = pow( min(1.0 + nAltitude, 1.0), 6.0 );

    diffuseColor.rgb *= seaDepth ;

    //peaks

    float peaks = clamp(
     ( altitude > 0.0 ? ( bbb * 2.0 + 1.0 ) * ( ccc * 2.0 + 1.0 ) : 1.0 ) ,
    0.0, 1.0 );

    diffuseColor.rgb *= ( 1.0 - natural ) + ( peaks * natural);


    gl_FragColor = diffuseColor;


    #ifdef USE_FOG
    if( nAltitude > -0.01 ){

    	#ifdef FOG_EXP2

    		float fogFactor = whiteCompliment( exp2( - fogDensity * fogDensity * fogDepth * fogDepth * LOG2 ) );

    	#else

    		float fogFactor = smoothstep( fogNear, fogFar, fogDepth );

    	#endif

    	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );

    }
    #endif

    if(transparent == true) gl_FragColor.a = 1.0 - texelColor.r;

    gl_FragColor.rgb = toneMapping( gl_FragColor.rgb * gl_FragColor.rgb );

  }
    `
    //+THREE.ShaderChunk['fog_fragment']+"}"
};



THREE.LandShaderMaterial = function(_worldWidth,_worldModuleWidth, options){
  options = options || {};
  var s = this;

this.material = new THREE.ShaderMaterial( {
//  wireframe:true,
  fragmentShader: LandMat.fragmentShader,
  vertexShader: LandMat.vertexShader,
  uniforms: THREE.UniformsUtils.clone( LandMat.uniforms ),
  wireframe: options.wireframe||false,
  fog: options.fog|| false,
  side: options.side||THREE.FrontSide,
  transparent: options.transparent||false
} );

this.material.uniforms.worldWidth.value = _worldWidth;
this.material.uniforms.worldModuleWidth.value = _worldModuleWidth;
this.material.uniforms.withCenterPath.value = options.centerPath || false;
this.material.uniforms.transparent.value = options.transparent||false;
this.material.uniforms.hardMix.value = options.hardMix||false;

if(options.map!=null && options.map!==undefined){
  this.material.defines.TEXTURED = true;
  this.material.uniforms.map.value = options.map;
  if(options.repeatUV!==undefined){
    this.material.uniforms.repeatUV.value = options.repeatUV;
    this.material.uniforms.map.value.wrapS = THREE.RepeatWrapping;
    this.material.uniforms.map.value.wrapT = THREE.RepeatWrapping;
  }
}

this.material.uniforms.color.value = options.color || new THREE.Color(0,0,1);
this.material.uniforms.landHeight.value = options.landHeight || 1.0;


return this.material;
}
