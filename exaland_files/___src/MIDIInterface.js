/*
      usage example
      var M = new MIDIInterface( [{verbose:true/false}] );

      var variable = null;
      var channel = 0, note = 29;

      M.registerCallback( channel, note, callback, context } );

      */
MIDIInterface = function() {

	var t = this;

	// console.warn('MIDIInterface called by ', MIDIInterface.caller );

	var verbose = false; // TODO DEV put back to false as default

	/*
	 ** the register stores all the registered callbacks associated to note events
	 **
	 ** every record is an array like
	 ** [ channel, note, callback, context ]
	 */

	// actions register
	var register = [];
	/* this is a public function to register the callbacks */
	function registerCallback(params) {

		// reformat callbacks
		if( params.callbacks === undefined){

			if( params.callback === undefined || params.context === undefined ){
				console.error('you must provide callback and context in params');
				return;
			}

			params.callbacks = [ { func: params.callback, ctx: params.context, isTrigger: params.isTrigger } ];

		} else {

			for( let callback of params.callbacks){

				if( callback.func === undefined || callback.ctx === undefined){
					console.error('you must provide func and ctx for every callback in callbacks you want register');
					return;
				}

			}

		}

		register.push(params);

		if (verbose) console.log('MIDI listener added', params);

	}

	/* Start MIDI / WebMIDI */
	if (navigator.requestMIDIAccess) {
		navigator.requestMIDIAccess().then(
			onMIDIInit,
			onMIDISystemError
		)
	} else {
		console.error(" WebMIDI API is not supported by this browser", "every registered action will be ignored");
		// return;
	}

	function onMIDIInit(midi) {
		console.log('MIDI init', midi);

		// ENABLE CONNECTED MIDI DEVICES
		for (var input of midi.inputs.values()) {
			// Print information about detected inputs
			if (verbose) console.log('detected MIDI input', input);

			input.onmidimessage = onMidiMessageReceived;
		}

		// LISTEN FOR STATE CHANGES
		midi.onstatechange = function(e) {
			// Print information about the (dis)connected MIDI controller
			if (verbose) console.log(e.port.manufacturer, e.port.name, e.port.state);

			if (e.port.connection !== 'pending' && e.port.connection !== 'closed') {
				e.port.onmidimessage = onMidiMessageReceived;
			} else {
				e.port.onmidimessage = null;
			}

		};

	}

	function onMIDISystemError(e) {
		console.error(e);
	}

	function onMidiMessageReceived(m) {

		var parsedMessage = parseMidiMessage(m);


		if (verbose){
			// if ( parsedMessage.command != 11)
			  console.log(parsedMessage);
		}

		for (let record of register) {

			if ( parsedMessage.channel == record.midi[0] && parsedMessage.note == record.midi[1]) {

				if (verbose) {
					console.log('detected registered value on channel ' + parsedMessage.channel + " note " + parsedMessage.note + " velocity "+ parsedMessage.velocity);
					console.log("record:", record, parsedMessage);
				}
        // call callback passing it the parsed velocity
				for( let callback of record.callbacks){

				//	if( !callback.isTrigger ){
				if( parsedMessage.command !== 8 ){
						callback.func.call( callback.ctx, parsedMessage.velocity, parsedMessage.command );

						if (verbose) console.log('executed without debounce' + callback.func );
					}

						// aggiustare sto controllo ... ignorare il canale, prendere solo command noteOn? why?!!
				/*	} else if ( callback.isTrigger && parsedMessage.rCommand == 145 || parsedMessage.rCommand == 176 ){

						if (verbose) console.log('parsedMessage.rCommand is ' + parsedMessage.rCommand);

						callback.func.call( callback.ctx, parsedMessage.velocity, parsedMessage.command  );
						if (verbose) console.log('executed registered callback ' + callback.func );

						// if(callback.debounce === undefined) callback['debounce'] = 0;
						//
						// if( callback.debounce == 0 ){
						// 	callback.func.call( callback.ctx, parsedMessage.velocity );
						// 	if (verbose) console.log('executed registered callback ' + callback.func );
						// }
						//
						// callback.debounce = (callback.debounce+1)%2;

					}*/

				}


			}

		}

		// if (e.data[0] < 240) {          // channel-specific message
		//   console.log( 'channel message' );
		// } else if (e.data[0] <= 255) {  // system message
		//   console.log( 'system message' );
		// }
	}

	function parseMidiMessage(m) {
		// console.log(m);
		return {
			target: {
				id: m.target.id,
				name: m.target.name
			},
			command: m.data[0] >> 4,
			rCommand: m.data[0],
			channel: m.data[0] & 0xf,
			note: m.data[1],
			velocity: m.data[2]

		}
	}

	// ES6
	// function debounced_( fn, delay ) {
	// 	console.log(fn, delay);
	//   let timerId;
	//   return function () {
	//     if (timerId) {
	//       clearTimeout(timerId);
	//     }
	//     timerId = setTimeout( () => {
	//       fn();
	//       timerId = null;
	//     }, delay);
	//   }
	// }

	function debounced( fn ) {
		let t = this;
		t.timer;
		if (t.timer) {
			clearTimeout(t.timer);
		}
		t.timer = setTimeout( function(){ fn(); t.timer = null;}, 300);

	}



	return {
		registerCallback: function(_params) {
			registerCallback(_params)
		},
		// expose the register for dev purposes
		register: register
	}

}
