'''
The user RGB LED capabilities of the hub is a pair of RGB LEDs on 
      either side of the center button.
'''
import hub,utime

# Change LED color to read
hub.led(255, 0, 0)

# Change LED color to green
hub.led(5)

# Rotate through the colors of the LED
for i in range(11):
    hub.led(i)
    utime.sleep(1)

    # Some fun if/else statements to make it obvious the code works
    if (i%2 == 1):
        hub.display.show(hub.Image.YES)
    else:
        if(i == 4):
            hub.port.A.motor.pwm(50)
            utime.sleep(1)
            hub.port.A.motor.float()
        else:
            hub.display.show(hub.Image.NO)

# Set the LED back to blue
hub.led(3)