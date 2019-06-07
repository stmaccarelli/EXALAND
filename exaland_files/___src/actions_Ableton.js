var actions_Ableton = function() {

  /* MIDI COMMANDS */


	// reset scene params
  HLR.registerCallback({
    midi: [6, 24],
    name: "FX_reset",
    callback: function(v) {
      // HLS.loadParams(HLSP['exaland']);
      HLS.startScene('exaland');
    },
    context: HLS,
    socket: true
  });


  HLR.registerCallback({
    midi: [6, 25],
    name: 'FX_randomixe_on',
    socket: true,
    permanent: true,
    callback: function(v) {
      HLR.randomizeTrigger = true;
      console.log('HLR.randomizeTrigger', HLR.randomizeTrigger);
    },
    context: HLR
  });

	HLR.registerCallback({
    midi: [6, 26],
    name: 'FX_randomixe_off',
    socket: true,
    permanent: true,
    callback: function(v) {
      HLR.randomizeTrigger = false;
      console.log('HLR.randomizeTrigger', HLR.randomizeTrigger);
    },
    context: HLR,
    visualAutoLaunch: false
  });




  HLR.registerCallback({
    midi: [6, 27],
    name: 'FX_objects_on',
    socket: true,
    permanent: true,
    callback: function(v) {
      HLR.objectsTrigger = true;
      console.log('HLR.objectsTrigger', HLR.objectsTrigger);
    },
    context: HLR,
  });

	HLR.registerCallback({
    midi: [6, 28],
    name: 'FX_objects_off',
    socket: true,
    permanent: true,
    callback: function(v) {
      HLR.objectsTrigger = false;
      console.log('HLR.objectsTrigger', HLR.objectsTrigger);
    },
    context: HLR,
    visualAutoLaunch: false
  });




  HLR.registerCallback({
    midi: [6, 29],
    name: 'FX_text_on',
    socket: true,
    permanent: true,
    callback: function(v) {
      HLR.textTrigger = true;
      console.log('HLR.textTrigger', HLR.textTrigger);
    },
    context: HLR,
  });

	HLR.registerCallback({
    midi: [6, 30],
    name: 'FX_text_off',
    socket: true,
    permanent: true,
    callback: function(v) {
      HLR.textTrigger = false;
      console.log('HLR.textTrigger', HLR.textTrigger);
    },
    context: HLR,
    visualAutoLaunch: false
  });


	HLR.registerCallback({
    midi: [6, 31],
    socket: true,
    name: "FX_shot_random",
    callback: function(v) {
			HLS.randomizeLand();
      console.log('randomizeLand');
    },
    context: HLS
  });




  // FX MASTER ON
  HLR.registerCallback({
    midi: [6, 36],
    name: "FX_on",
    socket: true,
    permanent: true,
    callback: function(v) {

      HLR.glitchEffect = true;
      console.log('HLR.glitchEffect', HLR.glitchEffect);

    },
    context: HLR

  });

  // FX MASTER OFF
  HLR.registerCallback({
    midi: [6, 37],
    name: "FX_off",
    socket: true,
    permanent: true,
    callback: function(v) {
      HLR.glitchEffect = false;
      console.log('HLR.glitchEffect', HLR.glitchEffect);
    },
    context: HLR,
    visualAutoLaunch: false
  });



  // FX PARAMS
  HLR.registerCallback({
    midi: [6, 38],
    name: "FX_blackout_on",
    socket: true,
    permanent: true,
    callback: function(v) {
      if( HL.glitchPlane.material.materialShader !== undefined){
        HL.glitchPlane.material.materialShader.uniforms._blackout.value = true;
        console.log('_blackout on');
      }
    },
    context: HL
  });
  HLR.registerCallback({
    midi: [6, 39],
    name: "FX_blackout_off",
    socket: true,
    permanent: true,
    callback: function(v) {
      if( HL.glitchPlane.material.materialShader !== undefined){
        HL.glitchPlane.material.materialShader.uniforms._blackout.value = false;
        console.log('_blackout off');

      }
    },
    context: HL,
    visualAutoLaunch: false
  });

  HLR.registerCallback({
    midi: [6, 40],
    name: "FX_posterize_on",
    socket: true,
    permanent: true,
    callback: function(v) {
      if( HL.glitchPlane.material.materialShader !== undefined){
        HL.glitchPlane.material.materialShader.uniforms._posterize.value = true;
        console.log('_posterize on');

      }
    },
    context: HL
  });
  HLR.registerCallback({
    midi: [6, 41],
    name: "FX_posterize_off",
    socket: true,
    permanent: true,
    callback: function(v) {
      if( HL.glitchPlane.material.materialShader !== undefined){
        HL.glitchPlane.material.materialShader.uniforms._posterize.value = false;
        console.log('_posterize off');
      }
    },
    context: HL,
    visualAutoLaunch: false
  });




  HLR.registerCallback({
    midi: [6, 42],
    name: "FX_glitchuv_on",
    socket: true,
    permanent: true,
    callback: function(v) {
      if( HL.glitchPlane.material.materialShader !== undefined){
        HL.glitchPlane.material.materialShader.uniforms._glitchUV.value = true;
        console.log('_glitchUV on');

      }
    },
    context: HL
  });
  HLR.registerCallback({
    midi: [6, 43],
    name: "FX_glitchuv_off",
    socket: true,
    permanent: true,
    callback: function(v) {
      if( HL.glitchPlane.material.materialShader !== undefined){
        HL.glitchPlane.material.materialShader.uniforms._glitchUV.value = false;
        console.log('_glitchUV off');

      }
    },
    context: HL,
    visualAutoLaunch: false
  });



  HLR.registerCallback({
    midi: [6, 44],
    name: "FX_images_on",
    socket: true,
    permanent: true,
    callback: function(v) {
      if( HL.glitchPlane.material.materialShader !== undefined){
        HL.glitchPlane.material.materialShader.uniforms._shitmage_on.value = true;
        console.log('_shitmages on');
      }
    },
    context: HL,
  });

  HLR.registerCallback({
    midi: [6, 45],
    name: "FX_images_off",
    socket: true,
    permanent: true,
    callback: function(v) {
      if( HL.glitchPlane.material.materialShader !== undefined){
        HL.glitchPlane.material.materialShader.uniforms._shitmage_on.value = false;
        console.log('_shitmages off');
      }
    },
    context: HL,
  });






}
