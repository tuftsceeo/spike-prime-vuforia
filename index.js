//Carter Silvey
//Spike Prime Vuforia

// Variables
var serial = require('./serial.js');
var server = require('@libraries/hardwareInterfaces');
var settings = server.loadHardwareInterface(__dirname);
var noble = require('@abandonware/noble');

var colors = ["black", "violet", "blue", "cyan", "green", "yellow", "red", "white"]
var portLetters = ["A", "B", "C", "D", "E", "F"]
var ports = ["none", "none", "none", "none", "none", "none"]
var sensorData, arr
var distance, color, accel, accelArr
var [motor1, motor2, motor3, distanceSensor, colorSensor, forceSensor] = ports
var firstMotor, secondMotor, thirdMotor
var TOOL_NAME = "code"

exports.enabled = settings('enabled');
exports.configurable = true;

if (exports.enabled){
    
    // Code executed when your robotic addon is enabled
    setup();

    serial.openPort()
    serial.sendFile('initialize.py')
    initializePorts()

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

    // Adds sensor nodes to the object on the app
    server.addNode(objectName, TOOL_NAME, "stopRead", "node");
	server.addNode(objectName, TOOL_NAME, "color", "node");
    server.addNode(objectName, TOOL_NAME, "distance", "node");
    server.addNode(objectName, TOOL_NAME, "force", "node");
    server.addNode(objectName, TOOL_NAME, "accelerometerX", "node");
    server.addNode(objectName, TOOL_NAME, "accelerometerY", "node");
    server.addNode(objectName, TOOL_NAME, "accelerometerZ", "node");

    // Constantly sort the sensor data
    setInterval(() => { sortSensor(); }, 10);

    // Listens for the stopRead node
	server.addReadListener(objectName, TOOL_NAME, "stopRead", function(data){
		// When true, stop the Spike
        if(data.value == 1){
            console.log('switch on')
            stopSpike()
		}
		if(data.value == 0){
			console.log('switch off')
            continuousSensor()
		}	
	});

    // Will be added to listen for motor nodes, but currently not useful
    /*server.addReadListener(objectName, TOOL_NAME, "distance", function(data){
        // When true, print the distance sensor reading
        if(data.value == 1){
            console.log('distance on')
            serial.writePort('print(' + distanceSensor + '.get_distance_cm())\r\n')
            sortSensor()
        }
        if(data.value == 0){
            console.log('distance off')
        }   
    });

	updateEvery(0, 100);*/
}

// Gets the port ordering from the Spike Prime, which initialized itself
function initializePorts() {
    sensorData = readSensor()
    if (sensorData.includes('[')) {
        sensorData = sensorData.substring(1, sensorData.length - 2)
        sensorData = sensorData.replace(/'/g, '')
        sensorData = sensorData.replace(/ /g, '')
        sensorData = sensorData.split(',')
        for (i = 0; i < sensorData.length; i++) {
            ports[i] = sensorData[i]
        }
        console.log(ports)
        definePorts()
        continuousSensor()
    }
    else {
        setTimeout(() => { initializePorts(); }, 0);
    }
}

// Change the names of the motors and sensor to be their corresponding ports
function definePorts() {
    if (ports.indexOf('motor') != -1) {
        firstMotor = ports.indexOf('motor')
        motor1 = portLetters[firstMotor]
        if (ports.indexOf('motor', firstMotor + 1) != -1) {
            secondMotor = ports.indexOf('motor', motor1)
            motor2 = portLetters[secondMotor]
            if (ports.indexOf('motor', secondMotor + 1) != -1) {
                thirdMotor = ports.indexOf('motor', motor2)
                motor3 = portLetters[thirdMotor]
            }
        }
    }
    if (ports.indexOf('color') != -1) {
        colorSensor = portLetters[ports.indexOf('color')]
    }
    if (ports.indexOf('distance') != -1) {
        distanceSensor = portLetters[ports.indexOf('distance')]
    }
    if (ports.indexOf('force') != -1) {
        forceSensor = portLetters[ports.indexOf('force')]
    }
    console.log(motor1, motor2, motor3, colorSensor, distanceSensor, forceSensor)
}


// Read data from the Spike Prime
function readSensor() {
    sensorData = serial.getSensor()
    return sensorData
}

// Tells the Spike to continutiously print color, force, distance, and accelerometer data
function continuousSensor() {
    serial.writePort("while True:\r\n");
    if (colorSensor != "none") {
        serial.writePort("\tprint(" + colorSensor + ".get_color())\r\n")
    }
    if (distanceSensor != "none") {
        serial.writePort("\tprint(" + distanceSensor + ".get_distance_cm())\r\n")
    }
    if (forceSensor != "none") {
        serial.writePort("\tprint(" + forceSensor + ".get_force_percentage()/100)\r\n")
        serial.writePort("\tutime.sleep_ms(2)\r\n")
    }
    serial.writePort("\tprint(hub.motion.accelerometer())\r\n\r\n\r\n\r\n")
}

// Sorts the sensor data and sends it to the appropriate process function
async function sortSensor() {
    sensorData = readSensor()
    sensorData = sensorData.replace(/ /g, '')
    //console.log(sensorData)
    arr = sensorData.split(',')
    if (colors.includes(sensorData) && sensorData.toString().length > 0) {
        processColor(sensorData)
    }
    else if (parseInt(sensorData) <= 1 && sensorData.toString().length > 0) {
        processForce(sensorData)
    }
    else if (!isNaN(sensorData) && parseInt(sensorData) > 1 && sensorData.toString().length > 0) {
        processDistance(sensorData)
    }
    else if (arr.length == 3) {
        processAccelerometer(sensorData)
    }
}

// Processes distance data
function processDistance(sensorData) {
    distance = sensorData
    //console.log(distance)
    server.write(objectName, TOOL_NAME, "distance", server.map(distance, 0, 100, 0, 100), "f")
}

// Processes color data
function processColor(sensorData) {
    color = sensorData
    console.log(color)
    // Waiting for more functionality to be able to write strings
    //server.write(objectName, TOOL_NAME, "color", server.map(color, 0, 1000, 0, 1000), "f")
}

// Processes accelerometer data
function processAccelerometer(sensorData) {
    accel = sensorData
    accel = accel.replace(/\(/g, '')
    accel = accel.replace(/\)/g, '')
    accelArr = accel.split(',').map(x=>+x)
    //console.log(accelArr)
    server.write(objectName, TOOL_NAME, "accelerometerX", server.map(accelArr[0], -5000, 5000, -5000, 5000), "f")
    server.write(objectName, TOOL_NAME, "accelerometerY", server.map(accelArr[1], -5000, 5000, -5000, 5000), "f")
    server.write(objectName, TOOL_NAME, "accelerometerZ", server.map(accelArr[2], -5000, 5000, -5000, 5000), "f")
}

// Process force data
function processForce(sensorData) {
    force = sensorData * 10
    //console.log(force)
    server.write(objectName, TOOL_NAME, "force", server.map(force, 0, 10, 0, 10), "f")
}

// Send Control + C a few times to kill anything that is running
function stopSpike() {
    serial.writePort('\x03')
    serial.writePort('\x03')
    serial.writePort('\x03')
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
    stopSpike()
});