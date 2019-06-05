var actions_Ableton = function() {

  /* MIDI COMMANDS */


	// reset scene params
  HLR.registerCallback({
    midi: [5, 24],
    callback: function(v) {

      // HLS.loadParams(HLSP['exaland']);
      HLS.startScene('exaland');

    },
    context: HLS,
    isTrigger: true,
    keyAlternative: 'r'

  });



  HLR.registerAssign({
    midi: [5, 25],
    isTrigger: true,
    keyAlternative: 'e',
    property: 'randomizeTrigger',
    parent: HLR,
    value: null,
    permanent: true,
    callback: function(v) {
      HLR.randomizeTrigger = true;
      console.log('HLR.randomizeTrigger', HLR.randomizeTrigger);
    },
    context: HLR
  });
  // reset server assign on startup
  if (STATUS.ISVISUAL && !STATUS.NOSOCKET) HLR.socketInterface.emitResetAssign('e', false);

	HLR.registerAssign({
    midi: [5, 26],
    isTrigger: true,
    keyAlternative: 'e',
    property: 'randomizeTrigger',
    parent: HLR,
    value: null,
    permanent: true,
    callback: function(v) {
      HLR.randomizeTrigger = false;
      console.log('HLR.randomizeTrigger', HLR.randomizeTrigger);
    },
    context: HLR
  });
  // reset server assign on startup


  HLR.registerAssign({
    midi: [5, 27],
    isTrigger: true,
    keyAlternative: 'w',
    property: 'objectsTrigger',
    parent: HLR,
    value: null,
    permanent: true,
    callback: function(v) {
      HLR.objectsTrigger = true;
      console.log('HLR.objectsTrigger', HLR.objectsTrigger);
    },
    context: HLR,
  });
  if (STATUS.ISVISUAL && !STATUS.NOSOCKET) HLR.socketInterface.emitResetAssign('w', false);

	HLR.registerAssign({
    midi: [5, 28],
    isTrigger: true,
    keyAlternative: 'w',
    property: 'objectsTrigger',
    parent: HLR,
    value: null,
    permanent: true,
    callback: function(v) {
      HLR.objectsTrigger = false;
      console.log('HLR.objectsTrigger', HLR.objectsTrigger);
    },
    context: HLR,
  });




  HLR.registerAssign({
    midi: [5, 29],
    isTrigger: true,
    keyAlternative: 'q',
    property: 'textTrigger',
    parent: HLR,
    value: null,
    permanent: true,
    callback: function(v) {
      HLR.textTrigger = !HLR.textTrigger;
      console.log('HLR.textTrigger', HLR.textTrigger);
    },
    context: HLR,
  });
  if (STATUS.ISVISUAL && !STATUS.NOSOCKET) HLR.socketInterface.emitResetAssign('q', false);

	HLR.registerAssign({
    midi: [5, 30],
    isTrigger: true,
    keyAlternative: 'q',
    property: 'textTrigger',
    parent: HLR,
    value: null,
    permanent: true,
    callback: function(v) {
      HLR.textTrigger = false;
      console.log('HLR.textTrigger', HLR.textTrigger);
    },
    context: HLR,
  });


	HLR.registerCallback({
    midi: [5, 31],
    callback: function(v) {

			HLS.randomizeLand();
      console.log('randomizeLand');

    },
    context: HLS
  });


// FX MASTER ON OLD STYLE
  // HLR.registerAssign({
  //   midi: [5, 13],
  //   isTrigger: true,
  //   keyAlternative: 'g',
  //   property: 'glitchEffect',
  //   parent: HLR,
  //   value: null,
  //   permanent: true,
  //   callback: function(v) {
  //     HLR.glitchEffect = !HLR.glitchEffect;
  //     console.log('HLR.glitchEffect', HLR.glitchEffect);
  //   },
  //   context: HLR,
  // });
  // if (STATUS.ISVISUAL && !STATUS.NOSOCKET) HLR.socketInterface.emitResetAssign('g', false);
	//



  // FX MASTER ON
  HLR.registerCallback({
    midi: [5, 36],
    callback: function(v) {

      HLR.glitchEffect = true;
      console.log('HLR.glitchEffect', HLR.glitchEffect);

    },
    context: HLR,
    keyAlternative: 'k'

  });
  // FX MASTER OFF
  HLR.registerCallback({
    midi: [5, 37],
    callback: function(v) {
      HLR.glitchEffect = false;
      console.log('HLR.glitchEffect', HLR.glitchEffect);
    },
    context: HLR,
    keyAlternative: 'k'
  });

  // FX PARAMS
  HLR.registerCallback({
    midi: [5, 38],
    callback: function(v) {
      HL.glitchPlane.material.materialShader.uniforms._blackout.value = true;
    },
    context: HL,
    keyAlternative: 'j'
  });

  HLR.registerCallback({
    midi: [5, 39],
    callback: function(v) {
      HL.glitchPlane.material.materialShader.uniforms._blackout.value = false;
    },
    context: HL,
    keyAlternative: 'j'
  });

  HLR.registerCallback({
    midi: [5, 40],
    callback: function(v) {
      HL.glitchPlane.material.materialShader.uniforms._posterize.value = true;
    },
    context: HL,
    keyAlternative: 'j'
  });
  HLR.registerCallback({
    midi: [5, 41],
    callback: function(v) {
      HL.glitchPlane.material.materialShader.uniforms._posterize.value = false;
    },
    context: HL,
    keyAlternative: 'j'
  });


  HLR.registerCallback({
    midi: [5, 42],
    callback: function(v) {
      HL.glitchPlane.material.materialShader.uniforms._glitchUV.value = true;
    },
    context: HL,
    keyAlternative: 'j'
  });
  HLR.registerCallback({
    midi: [5, 43],
    callback: function(v) {
      HL.glitchPlane.material.materialShader.uniforms._glitchUV.value = false;
    },
    context: HL,
    keyAlternative: 'j'
  });



  HLR.registerCallback({
    midi: [5, 44],
    callback: function(v) {
      HL.glitchPlane.material.materialShader.uniforms._shitmage_on.value = true;
    },
    context: HL,
    keyAlternative: 'j'
  });
  HLR.registerCallback({
    midi: [5, 45],
    callback: function(v) {
      HL.glitchPlane.material.materialShader.uniforms._shitmage_on.value = false;
    },
    context: HL,
    keyAlternative: 'j'
  });






}
