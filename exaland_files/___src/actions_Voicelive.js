var actions_Voicelive = function( ) {
  /* MIDI COMMANDS */

  // HLR.registerAssign({
  // 	midi: [1, 37],
  // 	isTrigger: true,
  // 	keyAlternative: 'x',
  // 	property: 'randomizeTrigger',
  // 	parent: HLR,
  // 	value: null,
  // 	permanent: true,
  // 	callback: function(v) {
  // 		HLR.randomizeTrigger = !HLR.randomizeTrigger;
  // 		console.log('HLR.randomizeTrigger', HLR.randomizeTrigger);
  // 	},
  // });


  // console.log( SOCKETINTERFACE );

  HLR.registerAssign({
    midi: [0, 110],
    isTrigger: true,
    keyAlternative: 'e',
    property: 'randomizeTrigger',
    parent: HLR,
    value: null,
    permanent: true,
    callback: function(v) {
      HLR.randomizeTrigger = !HLR.randomizeTrigger;
      console.log('HLR.randomizeTrigger', HLR.randomizeTrigger);
    },
    context: HLR
  });
  // reset server assign on startup
  if (STATUS.ISVISUAL && !STATUS.NOSOCKET) HLR.socketInterface.emitResetAssign('e', false);


  HLR.registerAssign({
    midi: [0, 111],
    isTrigger: true,
    keyAlternative: 'w',
    property: 'objectsTrigger',
    parent: HLR,
    value: null,
    permanent: true,
    callback: function(v) {
      HLR.objectsTrigger = !HLR.objectsTrigger;
      console.log('HLR.objectsTrigger', HLR.objectsTrigger);
    },
    context: HLR,
  });
  if (STATUS.ISVISUAL && !STATUS.NOSOCKET) HLR.socketInterface.emitResetAssign('w', false);



  HLR.registerAssign({
    midi: [0, 112],
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
    midi: [0, 104],
    isTrigger: true,
    keyAlternative: 'g',
    property: 'glitchEffect',
    parent: HLR,
    value: null,
    permanent: true,
    callback: function(v) {
      HLR.glitchEffect = !HLR.glitchEffect;
      console.log('HLR.glitchEffect', HLR.glitchEffect);
    },
    context: HLR,
  });
  if (STATUS.ISVISUAL && !STATUS.NOSOCKET) HLR.socketInterface.emitResetAssign('g', false);



  // reset scene params
  HLR.registerCallback({
    midi: [0, 116],
    callback: function(v) {

      // HLS.loadParams(HLSP['exaland']);
      HLS.startScene('exaland');

    },
    context: HLS,
    isTrigger: true,
    keyAlternative: 'r'

  });


  // HYPERLAND
  HLR.registerCallback({
    midi: [0, 106],
    callback: function(v) {

      // HLS.loadParams(HLSP['hyperland']);
      HLS.startScene('hyperland');

    },
    context: HLS,
    isTrigger: true,
    keyAlternative: 'h'

  });


  // BLACKSCENE
  HLR.registerCallback({
    midi: [0, 117],
    callback: function(v) {

      // HLS.loadParams(HLSP['hyperland']);
      HLS.startScene('blackscene');

    },
    context: HLS,
    isTrigger: true,
    keyAlternative: 'b'

  });

	console.log("ACTIONS VOICELIVE|!");

}
