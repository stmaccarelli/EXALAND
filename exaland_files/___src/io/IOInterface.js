var IOInterface = function() {

  var callbacksRegister = [];
  var t = this;

  var MIDI = null;
  var KEYBOARD = null;
  var SOCKET = null;

  var idCounter = 0;


  if (STATUS.ISVISUAL) {
    MIDI = new MIDIInterface();
    KEYBOARD = new KeyboardInterface();
  }
  if (!STATUS.NOSOCKET) {
    SOCKET = new socketInterface();
  }

  function fletcher32(string) {

    string = string.toString();

    let charArray = [];
    for (let i = 0; i < string.length; i++) {
      charArray.push(string.charCodeAt(i));
    }

    let data = charArray;

    var _sum1 = 0xffff,
      _sum2 = 0xffff;
    var words = data.length;
    var dataIndex = 0;
    while (words) {
      var tlen = words > 359 ? 359 : words;
      words -= tlen;
      do {
        _sum2 += _sum1 += data[dataIndex++];
      } while (--tlen);
      _sum1 = ((_sum1 & 0xffff) >>> 0) + (_sum1 >>> 16);
      _sum2 = ((_sum2 & 0xffff) >>> 0) + (_sum2 >>> 16);
    }
    _sum1 = ((_sum1 & 0xffff) >>> 0) + (_sum1 >>> 16);
    _sum2 = ((_sum2 & 0xffff) >>> 0) + (_sum2 >>> 16);
    return ((_sum2 << 16) >>> 0 | _sum1) >>> 0;
  }


  function registerCallback(params) {

    if (params.name === undefined) {
      console.error('you must provide an event name');
      return;
    }

    // calculate id\
    let id = fletcher32( params.name );

    // check conflicts
    for (let record of callbacksRegister) {
      if (record.id == id) {
        console.error("can't register Callback, name '" + params.name + "' must me unique.", params );
        return;
      }
    }
    // else
    params['id'] = id;


    // reformat callbacks
    if (params.callbacks === undefined) {
      if (params.callback === undefined || params.context === undefined) {
        console.error('you must provide callback and context in params');
        return;
      }
      params.callbacks = [{
        func: params.callback,
        ctx: params.context
      }];
    } else {
      for (let callback of params.callbacks) {
        if (callback.func === undefined || callback.ctx === undefined) {
          console.error('you must provide func and ctx for every callback in callbacks you want register');
          return;
        }
      }
    }


    // assign unique ID / event
    // params['id'] = ( idCounter++ ); //"CB" + ( Math.random().toString(36).substr(2, 9) ); //new Date().getTime() + eventCounter++;

    //  socket in ( only for clients, not for visual )
    //  if s_key is received, with weird keycode = id, socket has to fire the custom event named id, with detail
    // if( !STATUS.VISUAL && !STATUS.NOSOCKET ){
    //   SOCKET.registerEvent( params );
    // }

    // socket out (if we re visual and nosocket is off)
    // add a socket out callback, so when midi or key is received, also fire a key event (keyCode = callback id)
    // if( STATUS.ISVISUAL && !STATUS.NOSOCKET ){
    //   params.socketEmit = {
    //     func: (function( id, permanent ){ return function( value ) {
    //       console.log("socket emit event ", [ id, value, permanent ] );
    //       SOCKET.emitEvent( id, value, permanent );
    //     }})( params.id, params.permanent  ),
    //     ctx: this
    //   };
    // }



    // add custom event listener
    // WILL CALL THE ACTUAL CALLBACK(S)
    window.addEventListener(params.id,
      (function(params) {
        return function(e) {

        //  console.log("received the custom event, start callbacks", e, params);
          for (let record of params.callbacks) {
            record.func.call(record.ctx, e.detail);
          }
          if (STATUS.ISVISUAL && !STATUS.NOSOCKET && params.socket == true ) {
            // console.log("emit socketEvent");
            SOCKET.emitEvent(params.id, e.detail, params.permanent || false);
          }
        }
      })(params)
    );



    // console.log("sa"+params.id);
    // window.addEventListener( "sa"+params.id, function(e){ console.log("saEvent received", e) } );
    // window.addEventListener("socketAssign", function(){alert("stocazzo");});


    // push params to register, for debug purposes
    callbacksRegister.push(params);



    // ATTUATORI
    if (STATUS.ISVISUAL) {

      // MIDI
      // if note + channel is received, midi has to file a custon event with detail (velocity)
      if (params.midi !== undefined && params.midi.length >= 2) {
        MIDI.registerEvent(params);
      }


      // key
      // if alternateKey is received, with weird keycode = id, key has to fire a custom event with detail velocity = null
      if (params.keyAlternative !== undefined) {
        KEYBOARD.registerEvent(params);
        // when alternateKey is received, fire custom event
      }


      // auto launch callback at init
      if( params.visualAutoLaunch === true ){
        for (let record of params.callbacks) {
          record.func.call(record.ctx, 64);
        }
        if ( !STATUS.NOSOCKET ) {
          SOCKET.emitEvent(params.id, 64, params.permanent || false);
        }
      }

    }

    // socket in ( only for clients, not for visual )
    // if s_key is received, with weird keycode = id, socket has to fire the custom event named id, with detail
    // if( !STATUS.VISUAL && !STATUS.NOSOCKET ){
    //   SOCKET.registerEvent( params );
    // }



  }


  // to be called after the registerEvent, so the socket can update the permanents
  function ready() {
    if ( !STATUS.NOSOCKET ) {
      if( STATUS.ISVISUAL ){ SOCKET.flushServerPermanents(); }
      else { SOCKET.emitReady(); }
    }
  }



  return {
    registerCallback: registerCallback,
    callbacksRegister: callbacksRegister,
    ready: ready,
    SOCKET: SOCKET,
    MIDI: MIDI,
    KEYBOARD: KEYBOARD,
  }

};
