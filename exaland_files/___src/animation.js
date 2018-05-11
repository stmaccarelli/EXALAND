/*
This module is for animations: moving objects, changing colors, etc
*/

var HLAnim = function(){


  function mirrorWaves(){
      HL.materials.mirror.material.uniforms.time.value += 0.01 + HLE.moveSpeed * .01;
//      HL.materials.mirror.material.uniforms.step.value = HLE.landStepsCount;
  }

  function seaGLSL(){
     HL.materials.water.material.uniforms.advance.value += 0.01 + HLE.moveSpeed * .005;
  }


  function landOrganicChange( ){

    HLC.land.r += (Math.random()-.5)*0.01;
    HLC.land.g += (Math.random()-.5)*0.01;
    HLC.land.b += (Math.random()-.5)*0.01;

    //HL.land.material.uniforms.worldTiles.value = params.tiles;

    //HL.land.material.uniforms.repeatUV.value = new THREE.Vector2(params.repeatUV, params.repeatUV);

    HL.land.material.uniforms.bFactor.value = THREE.Math.clamp(
      HL.land.material.uniforms.bFactor.value + (Math.random()-.5)*0.00005, 0.0001,1);

    HL.land.material.uniforms.cFactor.value = THREE.Math.clamp(
      HL.land.material.uniforms.cFactor.value + (Math.random()-.5)*0.00005, 0.0001,1);

    HL.land.material.uniforms.landSeed.value = THREE.Math.clamp(
      HL.land.material.uniforms.landSeed.value + (Math.random()-.5)*0.00005, 0,100000);

    //HL.land.material.uniforms.map.value = HL.textures[params.map];

    HL.land.material.uniforms.natural.value = THREE.Math.clamp(
      HL.land.material.uniforms.natural.value + (Math.random()-.5)*0.00005, 0.0001,1);

    HL.land.material.uniforms.rainbow.value = THREE.Math.clamp(
      HL.land.material.uniforms.rainbow.value + (Math.random()-.5)*0.00005, 0.0001,1);

    HL.land.material.uniforms.squareness.value = THREE.Math.clamp(
      HL.land.material.uniforms.squareness.value + (Math.random()-.5)*0.00001, 0.0001,1);

  }

  // rotation vector rv
  var rv = new THREE.Euler( 0, 0, 0, 'YXZ' );
  // var seaMotion = new THREE.Vector2(0,0);

  function landGLSL(){

    if(STATUS.FPC)
      HL.controls.lookSpeed = 0.045 + HLE.moveSpeed * 0.001;


    rv.setFromQuaternion(HL.cameraGroup.quaternion,'YXZ');
    // HLE.moveSpeed *= Math.cos(rv.x);
    //HLE.acceleration += HLE.moveSpeed; // advance is a master advance rate for the entire environment
    // HL.cameraGroup.position.y = THREE.Math.clamp(HL.cameraGroup.position.y + rv.x * HLE.moveSpeed, HLE.WORLD_HEIGHT, HLE.WORLD_HEIGHT*4);

    // HL.cameraGroup.position.y = THREE.Math.clamp(HL.cameraGroup.position.y + rv.x * HLE.moveSpeed, 20, HLE.WORLD_HEIGHT*4);

    // overwrite rv variable (it was rotation vector) for memory optimization
    rv.x = Math.sin(rv.y);
    rv.z = Math.cos(rv.y);

    HLE.landMotion.x += rv.x * (HLE.moveSpeed);
    HLE.landMotion.z += rv.z * (HLE.moveSpeed);


    // seaMotion.x += rv.x*HLE.moveSpeed*0.01;
    // seaMotion.y += rv.x*HLE.moveSpeed*0.01;
    //
    // HL.materials.water.material.uniforms.seaMotion.value = seaMotion;


    // HL.materials.land.uniforms.advance.value = HLE.acceleration;
    HL.materials.land.uniforms.landMotion.value = HLE.landMotion;

    HL.materials.land.uniforms.noiseFreq.value = HLE.noiseFrequency;
    HL.materials.land.uniforms.noiseFreq2.value = HLE.noiseFrequency2;
    HL.materials.land.uniforms.landHeight.value = HLE.WORLD_HEIGHT; //HLE.landHeight;
    HL.materials.land.uniforms.landZeroPoint.value = HLE.landZeroPoint;
    // HL.materials.land.uniforms.landSeed.value += HLE.moveSpeed * 0.001;

    // landOrganicChange( );
    // console.log( Math.sin(HL.cameraGroup.rotation.z) );
  }




  // FOR CLOUDS, FLORA AND FAUNA, I'd move this in HLS sceneManager
  function particles(){

   HLH.loopParticles(HL.geometries.clouds, HLE.WORLD_WIDTH, HLE.moveSpeed*2);

    // HLH.moveParticles(HL.geometries.flora, HLE.WORLD_WIDTH, HLE.moveSpeed);

    // HLH.bufSinMotion(HL.geometries.fauna,.1,.1);

  }

  function wind(){
    if(frameCount%10 == 0)
      HLH.startModel(
        HL.models.cube,
        (Math.random()-.5) * HLE.WORLD_WIDTH,
        HLE.WORLD_HEIGHT/2+Math.random()*HLE.WORLD_HEIGHT/2,
        HLE.moveSpeed*100, false, 1,1,100,true);
  }

  function models(){
    // for(var k in HL.models)
    //   if(HL.models[k].position){
    //     HLH.moveModel( HL.models[k], 'z' );
    //   }
    //
    for(var k in HL.dynamicModelsClones){
      if(HL.dynamicModelsClones[k] && HL.dynamicModelsClones[k].position){
       HLH.moveModel( HL.dynamicModelsClones[k] );
      }
    }

  }



  // COLORS ANIMATIONS for underwater
  var colorsDebounce = true;
  function colors(){
    if(HL.camera.position.y > 0 && colorsDebounce){
      HL.renderer.setClearColor(HLC.horizon);
      if(HLE.FOG && !STATUS.WIREFRAME) HL.scene.fog.color = HLC.horizon;
      HL.materials.skybox.color = HLC.horizon;
    //  HL.materials.land.color = HLC.land;
      HL.materials.sea.color = HLC.sea;
      colorsDebounce=false;
      console.log('colors above');
    }
    else if(HL.camera.position.y < 0 && !colorsDebounce){
      HL.renderer.setClearColor(HLC.underHorizon);
      if(HLE.FOG && !STATUS.WIREFRAME) HL.scene.fog.color = HLC.underHorizon;
      HL.materials.skybox.color = HLC.underHorizon;
    //  HL.materials.land.color = HLC.horizon;
      HL.materials.sea.color = HLC.underSea;
      colorsDebounce=true;
      console.log('colors below');

    }
  }

  return{
    mirrorWaves:mirrorWaves,
    seaGLSL:seaGLSL,
    particles:particles,
    wind:wind,
    models:models,
    colors:colors,
    landGLSL:landGLSL,
  }
}();
