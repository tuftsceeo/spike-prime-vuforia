//Carter Silvey

// Constants
const SerialPort = require('serialport')
const parsers = SerialPort.parsers
const reader = require('readline')
const syncReader = require('readline-sync')
const fs = require("fs");

// Variables
var name = "test.py"
var tabs = 0
var backspaces = '\b'
var sensorReading = 'Nothing'
var i = 1

// Use a `\r\n` as a line terminator
const parser = new parsers.Readline({
	delimiter: '\r\n',
})

// The port to connect to (CHANGE TO YOUR SERAIL PORT)
const port = new SerialPort('/dev/tty.LEGOHub40BD3248762A-Ser', {
	baudRate: 115200,
})

port.pipe(parser)

// Connected to the serial port
function openPort() {
	port.on('open', () => console.log('Port open'))
	// Use the below line to see what the REPL outputs
	//parser.on('data', console.log)
	writePort('\x03')
	setInterval(() => { readMessage(); }, 0);
}

// Reads in from the port and sets sensorReading to be the most recent non-empty line
function readMessage() {
	port.on('readable', function() {
		raw = port.read()
		if (raw != null) {
			sensorReading = raw.toString('utf8')
			// Checks to see if there is exactly one enter line
			if (((sensorReading.match(/\n/g) || []).length) == 1)  {
				//Do nothing
			}
			// If there is not exactly one enter line, then split at the enters, and take the most recent line that has data
			else {
				arr = sensorReading.split('\n')
				i = 1
				while (i < arr.length) {
					// Eliminates lines that are either empty or were code that we excuted
					if (arr[arr.length-i].includes(">") || arr[arr.length-i].includes("...") || arr[arr.length-i] === "") {
						i = i + 1
					}
					else {
						break;
					}
				}
				sensorReading = arr[arr.length - i]
			}
			sensorReading = sensorReading.replace(/>>>/g, '')
			sensorReading = sensorReading.replace(/\n/g, '')
			sensorReading = sensorReading.replace(/\r/g, '')
		}
	})
	//console.log(sensorReading)
}

// Write a message to the connected device
function writePort(msg) {
	port.write(msg)
}

// Get the name of the file that is to be sent over the serial port (not used in index.js)
function getFileName() {
	name = syncReader.question('What file would you like to send?', {
		});
	console.log('Sending the file');
	sendFile(name)
}

// Read in the file line by line and send each line to the Spike Prime
async function sendFile(name) {
	const fileStream = fs.createReadStream(name);

	const rl = reader.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	// Each line will be successively available here as `line`.
	for await (const line of rl) {
		//console.log(`Line from file: ${line}`);

		// Send a line terminator to make sure we are on a fresh line
		//writePort('\r\n')

		// Compare the tab spacing to the last lines tab spacing
		lastTabs = tabs

		// Find out how many indents the current line is on (up to 3 currently)
		if (line[0] != ' ') {
			tabs = 0
		}
		else if (line[0] == ' ' && line[4] != ' '){
			tabs = 1
		}
		else if (line[0] == ' ' && line[4] == ' ' && line[8] != ' '){
			tabs = 2
		}
		else{
			tabs = 3
		}
		//console.log(tabs)

		// If we have unindented, then make sure the repl knows
		if (tabs < lastTabs) {
			// If we are back at the bottom, send multiple fresh lines to execute the previous lines
			if (tabs == 0) {
				setTimeout(() => { writePort('\r\n\r\n\r\n'); }, 1000);
			}
			// Otherwise just send the amount of backspaces as tabs we unindented
			else{
				backspaces = '\b'.repeat(lastTabs-tabs)
				setTimeout(() => { writePort(backspaces); }, 1000);
			}
		}

		//Send the line that we read from the file while trimming off the excess spaces/tabs and adding a delimiter
		setTimeout(() => { writePort(line.trim().concat('\r\n')); }, 1000);
	}
}

// Open the port
//openPort();

// Get the file name, which in turn reads and sends the file
//setTimeout(() => { getFileName(); }, 10000);

// Functions to export to other files (right now, only index.js uses these)
module.exports = {
	getSensor: function() {
		return sensorReading;
	},
	openPort : openPort,
	sendFile : sendFile,
	writePort : writePort,
	readMessage : readMessage
};