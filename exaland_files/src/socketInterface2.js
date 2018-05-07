function socketInterface(){

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


    tipo MIXER
    - invia FFT come STREAM a server
    - invia KEY a server
    - invia PERMANENT a server
    - riceve CLIENTSCOUNT


   function sendStream( streamData ){
     socket.emit('stream', streamData );
   }

   function sendKey( key ){
     socket.emit('key', key );
   }

   function sendPermanent( key ){
     socket.emit('perm')
   }

   function gotClientsCount(){}
   socket.on('clientsCount', gotClientsCount );

   function gotStream(){}
   socket.on('stream', gotStream );

   function gotKey(){}
   socket.on('key', gotKey );


}


/*

SERVER BEHAVIOUR

tipi di messaggi IN

  - STREAM (FFT)
  - KEY
  - PERMANENT

tipi di messaggi OUT

  - STREAM
  - KEY (anche i permanent escono come KEY)
  - CLIENTSCOUNT


azioni

on STREAM received
  - volatile broadcast a tutti tranne sender come STREAM

on KEY received
  - broadcast a tutti tranne sender come KEY

on PERMANENT received
  - se quel PERMANENT esiste settalo, else crealo
  - broadcast a tutti tranne sender come KEY

on NEW CLIENT CONNECTION
  - emit di tutte le PERMANENT registrate, come KEY
  - broadcast del clientsCount come CLIENTSCOUNT a tutti

on CLIENT DISCONNECTION
  - broadcast del clientsCount come CLIENTSCOUNT a tutti




CLIENT BEHAVIOUR

tipo MIXER
- invia FFT come STREAM a server
- invia KEY a server
- invia PERMANENT a server
- riceve CLIENTSCOUNT

tipo SCREEN
- riceve STREAM e setta corrispondente
- riceve KEY e lancia evento corrispondente
- riceve CLIENTSCOUNT e lancia evento corrispondente
*/
