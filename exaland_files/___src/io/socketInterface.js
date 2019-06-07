function socketInterface( socketServer ){

  const SOCKETIN = 1, SOCKETOUT = 2;
  const SOCKETSERVER = 'https://exalandsocket.spime.im';

  var socket = io( SOCKETSERVER,
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


  // simple callbacks register
  eventsRegister = [];

  function registerEvent( params ){
    eventsRegister.push( params );
  }

  // EMIT

  function emit( id, msg){
    socket.emit( id, msg);
  }

  function emitReady(){
    socket.emit( 'ready' );
  }

  // emit event
  function emitEvent( id, value, permanent ){
    console.log("emitEvent", id, value, permanent );
    socket.emit( 'assign', [ id, value, permanent ] );
  }


  window.setTimeout(function(){
    window.dispatchEvent( new CustomEvent("merda") );
  }, 2000);


  // RECEIVE

  function onAssignReceived( m ){
    console.log('assign received', m);
    //console.log( typeof m[0] );

    if (!STATUS.ISVISUAL){
      window.dispatchEvent( new CustomEvent( m[0], { detail: m[1] } ) );
    }



    // window.dispatchEvent( new CustomEvent( "sa"+m[0] ) );


    // for( let record of eventsRegister){
    //   console.log( record.id , m[0]);
    //
    //   if( m[0] === record.id ){
    //
    //     for (let callback of callbacks) {
    //       callback.func.call( callback.ctx, m[1] );
    //     }
    //   }
    //
    //
    // }



  }
  socket.on('assign', onAssignReceived );



   function gotClientsCount(m){
     console.log('gotClientsCount: ', m );

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



   // function gotKey( m ){
   //
   //   console.log('gotKey: ', m);
   //   window.dispatchEvent(new KeyboardEvent('keyup',{'key':m}));
   //
   // }
   //
   // socket.on('s_key', gotKey );

   function flushServerPermanents(){
     socket.emit('flush');
   }

   console.log('socketInterface init', socket );


  return {
    SOCKETIN: SOCKETIN,
    SOCKETOUT: SOCKETOUT,
    socket: socket,

    registerEvent: registerEvent,

    emit: emit,
    emitEvent: emitEvent,

    emitReady: emitReady,

    flushServerPermanents: flushServerPermanents

  }


}
