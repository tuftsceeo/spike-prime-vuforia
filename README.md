# spike-prime-vuforia
Connecting Spike Prime to Vuforia

Download these files and add them to their own folder (I named mine Spike-Prime) under interfaces of the vuforia-spatial-robotic-addon folder. To run the code, run the
index.js file in the vuforia-spatial-edge-server folder. THE TEST.PY FILE SHOULD BE IN THIS FOLDER TO BE SEEN.

Personal Edits:
* On line 21 of the serial.js file, change the /dev/tty. string to the one corresponding to the Bluetooth serial port on your Spike Prime.
* test.py can be editted just like any normal micropython file that would be uploaded to Spike Prime. Make sure that you use 4 spaces instead of a tab
