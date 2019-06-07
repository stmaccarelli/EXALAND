
KeyboardInterface = function(){


  function registerEvent( params ){
    console.log("key registered params ", params);


  window.addEventListener('keyup',
      (function( id, key) { return function( e ) {

        if( e.key == key){
          let ce = new CustomEvent( id, { detail: 127 } )
          //console.log("dispatching custom event", ce );
          window.dispatchEvent( ce );
        }

      } } )( params.id, params.keyAlternative )
  );


  }


  return {
    registerEvent: registerEvent
  }


}
