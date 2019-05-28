function socketInterface( socketServer ){

  const SOCKETIN = 1, SOCKETOUT = 2;

  var socket = io( socketServer,
      {
        reconnectionDelay: 1000,
        reconnection:true,
        reconnectionAttempts: 10,
        transports: ['websocket'],
        agent: false, // [2] Please don't set this to true
        upgrade: false,
        rejectUnauthorized: false
      }
    );

  // actions register
  assignRegister = {};

  // simple callbacks register
  callbacksRegister = {};

  // keys register
  keysRegister = {};



  function emitReady(){
    socket.emit( 'ready' );
  }

  function registerReceivedAssign( params ){
    assignRegister[ params.keyAlternative ] = params;
    console.log('registered assign in assignRegister', assignRegister);
  }

  function registerReceivedCallback( params ){
    callbacksRegister[ params.keyAlternative ] = params;
    console.log('registered callback in callbackRegister', callbacksRegister );
  }

  function registerReceivedKey( params ){
    keysRegister[ params.keyAlternative ] = params;
    console.log('registered key in keysRegister', keysRegister );
  }




  function onAssignReceived( m ){
    console.log('assign received', m);
    for(let id in assignRegister){
      if( m[0] === id){
        assignRegister[id].parent[ assignRegister[id].property ] = m[1];
      }
    }
  }
  socket.on('assign', onAssignReceived );


  // GENERIC EMIT
  function emit( id, msg){
    socket.emit( id, msg);
  }

  function emitAssign( params ){
    socket.emit( 'assign', [ params.keyAlternative, params.parent[params.property], params.permanent] );
  }
  function emitResetAssign( keyAlternative, value ){
    socket.emit( 'assign', [ keyAlternative, value, true] );
  }

  function registerKey( params ){
  }

  function registerStream( params ){
  }

   function sendStream( streamData ){
     socket.emit('stream', streamData );
   }

   function sendKey( key, permanent ){
     if ( permanent === true ){
       socket.emit('perm', key );
       console.log("sent perm "+key);
     } else {
       socket.emit('key', key );
       console.log("sent key "+key);
     }
   }


   function gotClientsCount(m){
     console.log('gotClientsCount: ',m);

     try{
          HLH.startModel(
            HL.models['motorola'],
           THREE.Math.randInt(-1000, 1000),
           THREE.Math.randInt(HLE.WORLD_HEIGHT,HLE.WORLD_HEIGHT * 1.5),
            0, 'xyz', 10, true, true
         );
       } catch(e){}

   }
   socket.on('clientsCount', gotClientsCount );

   function gotStream(){}
   socket.on('stream', gotStream );



   function gotKey( m ){

     console.log('gotKey: ', m);
     window.dispatchEvent(new KeyboardEvent('keyup',{'key':m}));

   }

   socket.on('s_key', gotKey );

   console.log('socketInterface init', socket );


  return {
    SOCKETIN: SOCKETIN,
    SOCKETOUT: SOCKETOUT,
    socket: socket,
    registerKey: registerKey,
    registerReceivedAssign: registerReceivedAssign,
    registerReceivedCallback: registerReceivedCallback,
    emit: emit,
    emitAssign: emitAssign,
    emitResetAssign: emitResetAssign,
    emitReady: emitReady,
    sendKey: sendKey,
  }


}
