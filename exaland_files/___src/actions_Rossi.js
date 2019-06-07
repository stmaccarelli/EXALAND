var actions_Rossi = function( ){


	HLR.registerCallback({
		name: 'FX_text_toggle',
		socket: true,
		permanent: false,
		callback: function(v) {
			HLR.textTrigger = !HLR.textTrigger;
			console.log('HLR.textTrigger', HLR.textTrigger);
		},
		context: HLR,
		keyAlternative: 'q',

	});

	HLR.registerCallback({
		name: 'FX_objects_toggle',
		socket: true,
		permanent: false,
		callback: function(v) {
			HLR.objectsTrigger = !HLR.objectsTrigger;
			console.log('HLR.objectsTrigger', HLR.objectsTrigger);
		},
		context: HLR,
		keyAlternative: 'w',
	});

	HLR.registerCallback({
    name: 'FX_randomixe_toggle',
    socket: true,
    permanent: false,
    callback: function(v) {
      HLR.randomizeTrigger = !HLR.randomizeTrigger;
      console.log('HLR.randomizeTrigger', HLR.randomizeTrigger);
    },
    context: HLR,
		keyAlternative: 'e',
  });


	HLR.registerCallback({
  //  midi: [10, 10],
    name: "FX_reset",
    callback: function(v) {
      // HLS.loadParams(HLSP['exaland']);
      HLS.startScene('exaland');
    },
    context: HLS,
    keyAlternative: 'r',
    socket: true
  });



	// FX MASTER TOGGLE
	HLR.registerCallback({
		midi: [10, 10],
		keyAlternative: 'g',
		name: "FX_toggle",
		socket: true,
		permanent: false,
		callback: function(v) {
			if( v == 127){
				HLR.glitchEffect = !HLR.glitchEffect;
				console.log('HLR.glitchEffect', HLR.glitchEffect);
			}
		},
		context: HLR,
	});


	HLR.registerCallback({
		midi: [10, 11],
    name: "FX_blackout_toggle",
    socket: true,
    permanent: false,
    callback: function(v) {
      if( HL.glitchPlane.material.materialShader !== undefined && v == 127 ){
        HL.glitchPlane.material.materialShader.uniforms._blackout.value = !HL.glitchPlane.material.materialShader.uniforms._blackout.value;
        console.log('_blackout ', HL.glitchPlane.material.materialShader.uniforms._blackout.value);

      }
    },
    context: HL,
    keyAlternative: 'a'
  });

	HLR.registerCallback({
		midi: [10, 12],
		name: "FX_posterize_toggle",
		socket: true,
		permanent: false,
		callback: function(v) {
			if( HL.glitchPlane.material.materialShader !== undefined && v == 127 ){
				HL.glitchPlane.material.materialShader.uniforms._posterize.value = !HL.glitchPlane.material.materialShader.uniforms._posterize.value;
				console.log('_posterize ', HL.glitchPlane.material.materialShader.uniforms._posterize.value );
			}
		},
		context: HL,
		keyAlternative: 's'
	});

	HLR.registerCallback({
    midi: [10, 13],
    name: "FX_glitchuv_toggle",
    socket: true,
    permanent: false,
    callback: function(v) {
      if( HL.glitchPlane.material.materialShader !== undefined && v == 127 ){
        HL.glitchPlane.material.materialShader.uniforms._glitchUV.value = !HL.glitchPlane.material.materialShader.uniforms._glitchUV.value;
        console.log('_glitchUV ', HL.glitchPlane.material.materialShader.uniforms._glitchUV.value);
      }
    },
    context: HL,
		keyAlternative: 'd'
  });

	HLR.registerCallback({
		midi: [10, 14],
		name: "FX_images_toggle",
		socket: true,
		permanent: false,
		callback: function(v) {
			if( HL.glitchPlane.material.materialShader !== undefined && v == 127 ){
				HL.glitchPlane.material.materialShader.uniforms._shitmage_on.value = !HL.glitchPlane.material.materialShader.uniforms._shitmage_on.value;
				console.log('_images ', HL.glitchPlane.material.materialShader.uniforms._shitmage_on.value);
			}
		},
		context: HL,
		keyAlternative: 'f'
	});


}
