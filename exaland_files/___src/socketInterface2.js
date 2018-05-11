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
  assignRegister = {}

  function emitReady(){
    socket.emit( 'ready' );
  }

  function registerReceivedAssign( params ){
    assignRegister[ params.keyAlternative ] = params;
    console.log('registered assign in assignRegister', assignRegister);
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
     } else {
       socket.emit('key', key );
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
     for(let i=0; i<keysRegister.length; i++){
       if( m == keysRegister[i].keyAlternative ){
         keysRegister.callbacks[0].func.call( keysRegister.callbacks[0].ctx, 1 );
       }
     }

   }

   socket.on('key', gotKey );

   console.log('socketInterface init', socket );


  return {
    SOCKETIN: SOCKETIN,
    SOCKETOUT: SOCKETOUT,
    socket: socket,
    registerKey: registerKey,
    registerReceivedAssign: registerReceivedAssign,
    emit: emit,
    emitAssign: emitAssign,
    emitResetAssign: emitResetAssign,
    emitReady: emitReady
  }


}
