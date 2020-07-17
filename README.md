# spike-prime-vuforia
Connecting Spike Prime to Vuforia

Download the JS and HTML files and add them to their own folder (I named mine Spike-Prime) under vuforia-spatial-robotic-addon/interfaces/. To run the code, run the file vuforia-spatial-edge-server/server.js. NOTE: The initialize.py file should be in the vuforia-spatial-edge-server folder to properly be seen by this folder's server.js.

Requires readline-sync and serialport to be npm installed in the vuforia-spatial-edge-server folder.

Personal Edits:
* For Mac users, on line 23 of the serial.js file, change the /dev/tty. string to the one corresponding to the Bluetooth serial port on your Spike Prime. This can be found by connecting the Spike Prime over bluetooth, going into terminal and typing cd /dev/tty. (don't forget the dot) and hitting tab twice. The port should have "/dev/tty.LEGOHub" at the beginning.
* For PC users, go to bluetooth devices, select devices and printers, and find the device that starts with "LEGOHub@". Then right click on that device and select Properties. In this window, click the tab for hardware. Here there should be a row that says "Standard Serial over Bluetooth link". The COM port is the bluetooth serial port for the Spike Prime. On line 23 of the serial.js file, change the /dev/tty. string to your COM port.
* Make your objects according to https://spatialtoolbox.vuforia.com/docs/use/connect-to-the-physical-world/create-object. Make an ObjectName that matches the one in the settings of Spike-Prime under the Manage Hardware Interfaces tab. If done correctly, you should be able to restart the server and a tool named "code" will appear under that object.
* In the Vuforia app, just add a switch (or something else that will give a value of true) to the button attached to the object. 

Interpreting the Data:
* The force node returns force in Newtons
* The distance node returns distance in centimeters
* The accelerometer and gyroscope nodes return the data received. Gravity is around 980.
* The color node returns the color seen by the sensor.
* Motors run at the speed input to the node.

Modes:
* Beginner: one node to control all motors at the same speed, one to read distance sensors, one to send data to to LED screen, one to change the LED color, and one to stop all motors.
* Intermediate: All sensor and all individual motor nodes as well as one node to stop all motors.
* Sensor: All sensor nodes as well as accelerometer/gyroscope nodes. Sensor refresh rate is decreased from 50ms to 10ms.
* Advanced: All sensor nodes, all accelerometer/gyroscope nodes, all individual motor nodes as well as one node to stop all motors.

Known errors:
* Sometimes the console will log a EIO error with writing. That means the Spike Prime is not executing the commands quick enough, usually because it is busy processing something else. Often times I have fixed this by connecting it over bluetooth normally and making sure the REPL can be seen. A reboot of the Spike Prime may also be helpful.
* Sometimes the console will log an error saying the port is busy. This is also usually due to the Spike Prime processing something else. A reboot or two of the Spike Prime usually solves this.
