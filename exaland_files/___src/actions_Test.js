var actions_Test = function() {

  /* MIDI COMMANDS */
  /*
  Evoluzione :

Exa 1 reset
Exa 2 reset + strobo a nero + txt
Exa 3 reset + scolarize
Exa VII random once + strobo
Exa V strobo + rabdom + obj + txt
Exa vi no rabdom + obj + strobo
Exa viii reset + glitch
Exa XI rabdom + strobo + txt + obj
Exa XII  glitch + foto + strobo
*/


	// reset scene params
  HLR.registerCallback({
    name: "reset",
    midi: [5, 24],
    callback: function(v) {

      // HLS.loadParams(HLSP['exaland']);
      HLS.startScene('exaland');

    },
    context: HLS,

    keyAlternative: 'r'

  });



  HLR.registerCallback({
    midi: [5, 25],
    name: 'randomizeTriggerON',
    permanent: true,
    callback: function(v) {
      HLR.randomizeTrigger = true;
      console.log('HLR.randomizeTrigger', HLR.randomizeTrigger);
    },
    context: HLR
  });


	HLR.registerCallback({
    midi: [5, 26],
    isTrigger: true,
    name: 'randomizeTriggerOFF',
    permanent: true,
    visualAutoLaunch: true,
    callback: function(v) {
      HLR.randomizeTrigger = false;
      console.log('HLR.randomizeTrigger', HLR.randomizeTrigger);
    },
    context: HLR
  });

  HLR.registerCallback({
    keyAlternative: 'e',
    name: 'randomizeTriggerTOGGLE',
    permanent: true,
    callback: function(v) {
      HLR.randomizeTrigger = !HLR.randomizeTrigger;
      console.log('HLR.randomizeTrigger', HLR.randomizeTrigger);
    },
    context: HLR
  });


  HLR.registerCallback({
    keyAlternative: 'w',
    name: 'objectsTriggerTOGGLE',
    permanent: true,
    callback: function(v) {
      HLR.objectsTrigger = !HLR.objectsTrigger;
      console.log('HLR.objectsTrigger', HLR.objectsTrigger);
    },
    context: HLR
  });


//
//   HLR.registerCallback({
//     midi: [5, 27],
//     isTrigger: true,
//     keyAlternative: 'w',
//     name: 'objectsTrigger',
//     parent: HLR,
//     value: null,
//     permanent: false,
//     callback: function(v) {
//       HLR.objectsTrigger = true;
//       console.log('HLR.objectsTrigger', HLR.objectsTrigger);
//     },
//     context: HLR,
//   });
//   if (STATUS.ISVISUAL && !STATUS.NOSOCKET) HLR.socketInterface.emitResetAssign('w', false);
//
// 	HLR.registerCallback({
//     midi: [5, 28],
//     isTrigger: true,
//     keyAlternative: 'w',
//     name: 'objectsTrigger',
//     parent: HLR,
//     value: null,
//     permanent: false,
//     callback: function(v) {
//       HLR.objectsTrigger = false;
//       console.log('HLR.objectsTrigger', HLR.objectsTrigger);
//     },
//     context: HLR,
//   });
//
//
//
//
//   HLR.registerCallback({
//     midi: [5, 29],
//     isTrigger: true,
//     keyAlternative: 'q',
//     name: 'textTrigger',
//     parent: HLR,
//     value: null,
//     permanent: false,
//     callback: function(v) {
//       HLR.textTrigger = !HLR.textTrigger;
//       console.log('HLR.textTrigger', HLR.textTrigger);
//     },
//     context: HLR,
//   });
//   if (STATUS.ISVISUAL && !STATUS.NOSOCKET) HLR.socketInterface.emitResetAssign('q', false);
//
// 	HLR.registerCallback({
//     midi: [5, 30],
//     isTrigger: true,
//     keyAlternative: 'q',
//     name: 'textTrigger',
//     parent: HLR,
//     value: null,
//     permanent: false,
//     callback: function(v) {
//       HLR.textTrigger = false;
//       console.log('HLR.textTrigger', HLR.textTrigger);
//     },
//     context: HLR,
//   });
//
//
// 	HLR.registerCallback({
//     midi: [5, 31],
//     callback: function(v) {
//
// 			HLS.randomizeLand();
//       console.log('randomizeLand');
//
//     },
//     context: HLS
//   });
//
//
// // FX MASTER ON OLD STYLE
//   // HLR.registerCallback({
//   //   midi: [5, 13],
//   //   isTrigger: true,
//   //   keyAlternative: 'g',
//   //   name: 'glitchEffect',
//   //   parent: HLR,
//   //   value: null,
//   //   permanent: false,
//   //   callback: function(v) {
//   //     HLR.glitchEffect = !HLR.glitchEffect;
//   //     console.log('HLR.glitchEffect', HLR.glitchEffect);
//   //   },
//   //   context: HLR,
//   // });
//   // if (STATUS.ISVISUAL && !STATUS.NOSOCKET) HLR.socketInterface.emitResetAssign('g', false);
// 	//
//
//
//
//   // FX MASTER ON
//   HLR.registerCallback({
//     midi: [5, 36],
//     callback: function(v) {
//
//       HLR.glitchEffect = true;
//       console.log('HLR.glitchEffect', HLR.glitchEffect);
//
//     },
//     context: HLR,
//     keyAlternative: 'k'
//
//   });
//   // FX MASTER OFF
//   HLR.registerCallback({
//     midi: [5, 37],
//     callback: function(v) {
//       HLR.glitchEffect = false;
//       console.log('HLR.glitchEffect', HLR.glitchEffect);
//     },
//     context: HLR,
//     keyAlternative: 'k'
//   });
//
//   // FX PARAMS
//   HLR.registerCallback({
//     midi: [5, 38],
//     callback: function(v) {
//       HL.glitchPlane.material.materialShader.uniforms._blackout.value = true;
//     },
//     context: HL,
//     keyAlternative: 'j'
//   });
//
//   HLR.registerCallback({
//     midi: [5, 39],
//     callback: function(v) {
//       HL.glitchPlane.material.materialShader.uniforms._blackout.value = false;
//     },
//     context: HL,
//     keyAlternative: 'j'
//   });
//
//   HLR.registerCallback({
//     midi: [5, 40],
//     callback: function(v) {
//       HL.glitchPlane.material.materialShader.uniforms._posterize.value = true;
//     },
//     context: HL,
//     keyAlternative: 'j'
//   });
//   HLR.registerCallback({
//     midi: [5, 41],
//     callback: function(v) {
//       HL.glitchPlane.material.materialShader.uniforms._posterize.value = false;
//     },
//     context: HL,
//     keyAlternative: 'j'
//   });
//
//
//   HLR.registerCallback({
//     midi: [5, 42],
//     callback: function(v) {
//       HL.glitchPlane.material.materialShader.uniforms._glitchUV.value = true;
//     },
//     context: HL,
//     keyAlternative: 'j'
//   });
//   HLR.registerCallback({
//     midi: [5, 43],
//     callback: function(v) {
//       HL.glitchPlane.material.materialShader.uniforms._glitchUV.value = false;
//     },
//     context: HL,
//     keyAlternative: 'j'
//   });
//
//
//
//   HLR.registerCallback({
//     midi: [5, 44],
//     callback: function(v) {
//       HL.glitchPlane.material.materialShader.uniforms._shitmage_on.value = true;
//     },
//     context: HL,
//     keyAlternative: 'j'
//   });
//
//
//   HLR.registerCallback({
//     midi: [5, 45],
//     callback: function(v) {
//       HL.glitchPlane.material.materialShader.uniforms._shitmage_on.value = false;
//     },
//     context: HL,
//     keyAlternative: 'j'
//   });
//
//
//



}
