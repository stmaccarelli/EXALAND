var socketVisual = function(){

  function init(){

    // var socket = io('http://pixelsmasher.io:1502'); // aaron 13.95.147.55
    var socket = io('http://52.232.46.152:1502'); // azure

    //chech if previously got a ID
    var local_mobi_id = window.localStorage.getItem('mobile_id');

    //send acknowledge
    if(isMobile) socket.emit('ack',{whoami:'mobi', mobi_id:local_mobi_id});
    else if(isVisual) socket.emit('ack',{whoami:'visual'});
    else socket.emit('ack',{whoami:'cli'});

    // hmmm
    socket.on('youare', function( id ){
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
        socket.emit('hidden',{hidden:document.hidden, id:local_mobi_id});
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
    socket.on('mobi_count', function(e) {
      // console.log(e);

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

      socket.on('mxr_fft', function(d){

        HLRemote.updateHLParams(

          d[0],
          d[1],
          d[2], //.msg.c

        );

      });

    }


    socket.on('mxr_push_to_cli_key', function(d){

      if (Number(d.msg.a) == 53) //5
          HLH.startGroup(HLS.modelsParams);

      if (Number(d.msg.a) == 54) //6
          HLS.logoChange('logo');
      if (Number(d.msg.a) == 56) //8
          HLS.logoChange('cube');
      if (Number(d.msg.a) == 48)//0
          HL.cameraCompanion.visible = !HL.cameraCompanion.visible;

      if (Number(d.msg.a) == 57){ //9
        HLE.CENTER_PATH=!HLE.CENTER_PATH;
        HL.materials.land.uniforms.withCenterPath.value = HLE.CENTER_PATH;
      }

    });



    // socket.on('cur_scene', function(d){
    //   HLS.startScene(d.curscene)
    //   //  console.log('cur_scene '+d.curscene);
    //  }
    // );



  }

  return{
    init:init
  }

}();

// TODO: init socket da main
