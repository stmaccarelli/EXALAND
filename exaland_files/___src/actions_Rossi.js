var actions_Rossi = function( ){

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
		midi: [9, 10],
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
	if( STATUS.ISVISUAL && !STATUS.NOSOCKET ) HLR.socketInterface.emitResetAssign( 'e', false );


	HLR.registerAssign({
		midi: [9, 11],
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
	if( STATUS.ISVISUAL && !STATUS.NOSOCKET ) HLR.socketInterface.emitResetAssign( 'w', false );



	HLR.registerAssign({
		midi: [9, 12],
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
	if( STATUS.ISVISUAL && !STATUS.NOSOCKET ) HLR.socketInterface.emitResetAssign( 'q', false );



	HLR.registerAssign({
		midi: [9, 13],
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
	if( STATUS.ISVISUAL && !STATUS.NOSOCKET ) HLR.socketInterface.emitResetAssign( 'g', false );



	// reset scene params
	HLR.registerCallback({
		midi: [9, 14],
		callback: function(v) {

			// HLS.loadParams(HLSP['exaland']);
			HLS.startScene('exaland');

		},
		context: HLS,
		isTrigger: true,
		keyAlternative: 'r'

	});


	// HLR.registerAssign({
	// 	midi: [9, 24],
	// 	isTrigger: false,
	// 	keyAlternative: 'l',
	// 	property: 'landMorphSpeed',
	// 	parent: HLR,
	// 	value: null,
	// 	permanent: false,
	// 	callback: function(v) {
	// 		HLR.landMorphSpeed = v;
	// 		console.log('HLR.landMorphSpeed', HLR.landMorphSpeed);
	// 	},
	// 	context: HLR
	// });
	// reset server assign on startup





	// HYPERLAND
	HLR.registerCallback({
		midi: [9, 15],
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
		midi: [9, 16],
		callback: function(v) {

			// HLS.loadParams(HLSP['hyperland']);
			HLS.startScene('blackscene');

		},
		context: HLS,
		isTrigger: true,
		keyAlternative: 'b'

	});


}
