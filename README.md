# spike-prime-vuforia
Connecting Spike Prime to Vuforia

Download the JS and HTML files and add them to their own folder (I named mine Spike-Prime) under vuforia-spatial-robotic-addon/interfaces/. To run the code, run the file vuforia-spatial-edge-server/index.js. NOTE: The test.py file should be in the vuforia-spatial-edge-server folder to properly be seen by this folder's server.js.

Personal Edits:
* On line 21 of the serial.js file, change the /dev/tty. string to the one corresponding to the Bluetooth serial port on your Spike Prime.
* test.py can be editted just like any normal micropython file that would be uploaded to Spike Prime. Make sure that you use 4 spaces instead of a tab. The way serial.js sends files to the REPL of the Spike Prime currently depends on there being 4 characters per tab instead of 1.
* Make your objects according to https://spatialtoolbox.vuforia.com/docs/use/connect-to-the-physical-world/create-object with the ObjectName: "fileSender" and tool name "code"
* In the Vuforia app, just add a switch (or something else that will give a value of true) to the button attached to the object. 
