
MIDIInterface = function() {

	var t = this;

	var verbose = true; // TODO DEV put back to false as default

	// actions register
	var register = [];

	/* this is a public function to register the events associated with notes and channels */
	function registerEvent(params) {

		register.push({
			channel: params.midi[0],
			note: params.midi[1],
			id: params.id
		});

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
			  console.log(parsedMessage);
		}

		for (let record of register) {

			if ( parsedMessage.channel == record.channel && parsedMessage.note == record.note) {

				if (verbose) {
					console.log("detected registered value:", record, parsedMessage);
				}
        // fire custom event
				window.dispatchEvent( new CustomEvent( record.id, { detail: parsedMessage.velocity } ) );

			}

		}

	}


	function parseMidiMessage(m) {
		// console.log(m);
		return {
			target: {
				id: m.target.id,
				name: m.target.name
			},
			command: m.data[0] >> 4,
			//rCommand: m.data[0],
			channel: ( m.data[0] & 0xf ) + 0x1,
			note: m.data[1],
			velocity: m.data[2]

		}
	}

	// function debounced( fn ) {
	// 	let t = this;
	// 	t.timer;
	// 	if (t.timer) {
	// 		clearTimeout(t.timer);
	// 	}
	// 	t.timer = setTimeout( function(){ fn(); t.timer = null;}, 300);
	//
	// }

	return {
		registerEvent: function(_params) {
			registerEvent(_params)
		},
		// expose the register for dev purposes
		register: register
	}

}
