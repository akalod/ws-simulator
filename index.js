const WebSocket = require('ws');
const fs = require('fs')

var args = process.argv.slice(2); 

let PORT = 8080;

if(args[0]){
    PORT = args[0];
}

const wss = new WebSocket.Server({ port: PORT });
const stdin = process.stdin;
const __basePath = __dirname + '/packages/';

stdin.setRawMode( true );
stdin.resume();
stdin.setEncoding( 'utf8' );

readJsonFileSync = (key, encoding) => {

    if (typeof (encoding) == 'undefined'){
        encoding = 'utf8';
    }
    var file = __basePath + key + '.json';
    if (fs.existsSync(file)){
        return fs.readFileSync(file, encoding);
    } else {
        console.log('%s is not defined', file);
        return false;
    }
    
}

stdin.on( 'data', ( key ) => {
  // ctrl-c ( end of text )
  if ( key === '\u0003' ) {
    process.exit();
  }
  var data = readJsonFileSync(key);
  if(data){
      wss.broadcast(data);   
      console.log('%s.json sended', key);
  }
      
});

wss.broadcast = (msg) => {
    wss.clients.forEach(function each(client) {
        client.send(msg);
     });
 };

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
      console.log('received: %s', message);
    });
    ws.send(readJsonFileSync('connected'));
});   
  