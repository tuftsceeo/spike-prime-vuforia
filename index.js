//Carter Silvey

// Variables
var serial = require('./serial.js');
var server = require('@libraries/hardwareInterfaces');
var settings = server.loadHardwareInterface(__dirname);
var noble = require('@abandonware/noble');

exports.enabled = settings('enabled');
exports.configurable = true;

if (exports.enabled){
    
    // Code executed when your robotic addon is enabled
    setup();

    console.log("Spike is connected");

    function setup() {
    	exports.settings = {
    		// Object that sends the file when true
            objectName: {
    			value: settings('objectName'),
    			type: 'text',
    			default: 'fileSender',
    			disabled: false,
    			helpText: 'The name of the object that connects to this hardware interface.'
    		}
    	};
    }

    objectName = exports.settings.objectName.value;

    server.addEventListener('reset', function () {
    	settings = server.loadHardwareInterface(__dirname);
    	setup();

    	console.log('Spike: Settings loaded: ', objectName);
	});
}

// Starts the interface with the hardware
function startHardwareInterface() {
	console.log('Spike: Starting up')

	server.enableDeveloperUI(true)

    // Adds a button node to the object on the app
	server.addNode(objectName, "code", "button", "node");

    // Listens for the button node
	server.addReadListener(objectName, "code", "button", function(data){
		// When true, sends the test.py file to the Spike Prime
        if(data.value == 1){
            console.log('on')
			serial.writePort('\r\n');
			serial.readFile('test.py');
		}
		if(data.value == 0){
			console.log('off')
		}	
	});

	updateEvery(0, 100);
}

function updateEvery(i, time){
	setTimeout(() => {
		updateEvery(++i, time);
	}, time)
}

server.addEventListener("initialize", function () {
    if (exports.enabled) startHardwareInterface();
});

server.addEventListener("shutdown", function () {
});