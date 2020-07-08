# spike-prime-vuforia
Connecting Spike Prime to Vuforia

Download the JS and HTML files and add them to their own folder (I named mine Spike-Prime) under vuforia-spatial-robotic-addon/interfaces/. To run the code, run the file vuforia-spatial-edge-server/server.js. NOTE: The initialize.py file should be in the vuforia-spatial-edge-server folder to properly be seen by this folder's server.js.

Requires readline-sync and serialport to be npm installed in the vuforia-spatial-edge-server folder.

Personal Edits:
* On line 23 of the serial.js file, change the /dev/tty. string to the one corresponding to the Bluetooth serial port on your Spike Prime. This can be found by connecting the Spike Prime over bluetooth, going into terminal and typing cd /dev/tty. (don't forget the dot) and hitting tab twice. The port should have "/dev/tty.LEGOHub" at the beginning.
* Make your objects according to https://spatialtoolbox.vuforia.com/docs/use/connect-to-the-physical-world/create-object with the ObjectName: "fileSender" and tool name "code"
* In the Vuforia app, just add a switch (or something else that will give a value of true) to the button attached to the object. 

Interpreting the Data:
* The force node returns force in Newtons
* The distance node returns distance in centimeters
* The accelerometer nodes return the data received. Gravity is around 980.
* The color node currently cannot return anything because Vuforia does not currently support writing strings to nodes. Instead, if you are running the server in your terminal, the color will be logged there.

Known errors:
* Sometimes the console will log a EIO error with writing. That means the Spike Prime is not executing the commands quick enough, usually because it is busy processing something else. Often times I have fixed this by connecting it over bluetooth normally and making sure the REPL can be seen. A reboot of the Spike Prime may also be helpful.
* Sometimes the console will log an error saying the port is busy. This is also usually due to the Spike Prime processing something else. A reboot or two of the Spike Prime usually solves this.
