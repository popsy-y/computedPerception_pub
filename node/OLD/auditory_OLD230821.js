const osc = require('node-osc');

let speed = 1;

// setup listener
const listener = new osc.Server(2020, '0.0.0.0', () => {
    console.log('listening');
});

listener.on("bundle", function (msg, rinfo){
    console.log(`\nMsg received:\n${JSON.stringify(msg)}`);
    if (Math.floor(msg.elements[0][6])%2 == 0) {
        sendOsc("speed", 1);
    }else{
        sendOsc("speed", 4);
    }
    // listener.close();
});

// setup sender
const client = new osc.Client('127.0.0.1', 6010);

// setInterval(() => {
//     client.send('/ctrl', ['test', 2]);
// }, 500);


function sendOsc(controller, value){
    let loop = 0;
    const intervalId = setInterval(() => {
        console.log("sent, " + controller + " => " + value);
        client.send('/ctrl', [controller, value]);

        loop++;

        if (loop > 1) {
            clearInterval(intervalId);
        }
    }, 20);
}