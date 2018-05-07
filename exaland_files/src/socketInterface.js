var socketInterface = function(){

  this.socket = io(SOCKETSERVER,
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

  var t = this;

  init = function() {

    //this.socket = io(SOCKETSERVER); // SOCKETSERVER is defined in system.html

    if(isVisual){
      //socket.io status management
     t.socket.on('connecting', function(e) {
        console.log("socket.io Connecting ", e);
      });
     t.socket.on('connection', function(e) {
        console.log("socket.io Connection ", e);
      });
     t.socket.on('disconnect', function(e) {
        console.warn("socket.io Disconnect ", e);
      });
     t.socket.on('connect_failed', function(e) {
        console.error("socket.io Connection failed ", e);
      });
     t.socket.on('error', function(e) {
        console.error("socket.io Socket Error ", e);
      });
     t.socket.on('reconnect', function(e) {
        console.log("socket.io Reconnect ",e);
      });
     t.socket.on('reconnecting', function() {
        console.warn("socket.io Reconnecting ");
      });
     t.socket.on('reconnect_failed', function(e) {
        console.error("socket.io Reconnect Failed ",e);
      });
    }

    //chech if previously got a ID
    var local_mobi_id = window.localStorage.getItem('mobile_id');

    //send acknowledge
    if(isMobile) t.socket.emit('ack',{whoami:'mobi', mobi_id:local_mobi_id});
    else if(isVisual) t.socket.emit('ack',{whoami:'visual'});
    else t.socket.emit('ack',{whoami:'cli'});

    // hmmm
   t.socket.on('youare', function( id ){
      console.log('connected to HYPERLAND network, you are client ' + id );
      try{
        window.localStorage.setItem('mobile_id', id );
      } catch(b) {
        // alert(b);
      }
    });



    var hidden, visibilityChange;
    if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
      hidden = "hidden";
      visibilityChange = "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
      hidden = "msHidden";
      visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
      hidden = "webkitHidden";
      visibilityChange = "webkitvisibilitychange";
    }

    function handleVisibilityChange() {
       t.socket.emit('hidden',{hidden:document.hidden, id:local_mobi_id});
        console.log('handleVisibilityChange: '+document.hidden);
    }

    // Warn if the browser doesn't support addEventListener or the Page Visibility API
    if (typeof document.addEventListener === "undefined" || typeof document[hidden] === "undefined") {
      console.log("Your browser does not support the Page Visibility API.");
    } else {
      // Handle page visibility change
      document.addEventListener(visibilityChange, handleVisibilityChange, false);
    }




    // // socket.on('mobi_keypush',function(e){console.log('mobi keypush '+e)});
    // // socket.on('mobi_count',function(e){console.log('mobi count'); console.log(e)});
    //
    // console.log('socket event listeners set');

    //reset HLRemote params
    // HLRemote.updateHLParams(0,0,0,0,0);

// model,xPosition,y,speed,rotations, scale, isParticle, towardsCamera
   t.socket.on('mobi_count', function(e) {
      console.log('socket.io mobi_count',e);

      if( e.clients > HL.connectedUsers ){

        HLH.startModel(
          HL.models['motorola'],
  				THREE.Math.randInt(-1000, 1000),
  				THREE.Math.randInt(HLE.WORLD_HEIGHT,HLE.WORLD_HEIGHT * 1.5),
          0, 'xyz', 10, true, true
  			);

      }
      HL.connectedUsers = e.clients;

    });


    if(!partSocket && !isVisual){

     t.socket.on('mxr_fft', function(d){

        HLRemote.updateHLParams(

          d.msg[0],
          d.msg[1],
          d.msg[2],

        );

        // console.log( d );

      });

    }


   t.socket.on('mxr_push_to_cli_key', function(d){

      // if (Number(d.msg.a) == 53) //5
      //     HLH.startGroup(HLS.modelsParams);
      //
      // if (Number(d.msg.a) == 54) //6
      //     HLS.logoChange('logo');
      // if (Number(d.msg.a) == 56) //8
      //     HLS.logoChange('cube');
      // if (Number(d.msg.a) == 48)//0
      //     HL.cameraCompanion.visible = !HL.cameraCompanion.visible;
      //
      // if (Number(d.msg.a) == 57){ //9
      //   HLE.CENTER_PATH=!HLE.CENTER_PATH;
      //   HL.materials.land.uniforms.withCenterPath.value = HLE.CENTER_PATH;
      // }

    });



    // socket.on('cur_scene', function(d){
    //   HLS.startScene(d.curscene)
    //   //  console.log('cur_scene '+d.curscene);
    //  }
    // );


    // 02-05-2018
    //AGGIUNTA DA AUDIOMONITOR. ora visual fa anche da mxr

    var socketOn = true;

    if( isVisual ){

      /* invio FFT a server */

      function socketSendFFT() {

        window.setTimeout(function() {
          window.requestAnimationFrame(socketSendFFT)
        }, 1000 / 30);

        if (socketOn) {

         t.socket.emit('mxr_push_fft', [
            HLR.fft[0],
          	HLR.fft[1],
          	HLR.fft[2]
          ]);

        }

      }

      socketSendFFT();


    }



  }();

};

// TODO: init socket da main
