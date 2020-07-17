import hub, utime
from spike import Motor, DistanceSensor, ColorSensor, ForceSensor

ports = hub.status()["port"]

portName = ["A", "B", "C", "D", "E", "F"]

colorSensor = forceSensor = distanceSensor = -1

lengths = [0,0,0,0,0,0]

portType = ["none", "none", "none", "none", "none", "none"]

for i in range(6):
    lengths[i] = len(ports[portName[i]])
    if (lengths[i] == 1):
        exec(portName[i] + " = DistanceSensor(portName[i])")
        portType[i] = "distance"
        distanceSensor = i
    elif (lengths[i] == 3):
        exec(portName[i] + " = ForceSensor(portName[i])")
        portType[i] = "force"
        forceSensor = i
    elif (lengths[i] == 4):
        exec(portName[i] + " = Motor(portName[i])")
        portType[i] = "motor"
    elif (lengths[i] > 4):
        exec(portName[i] + " = ColorSensor(portName[i])")
        portType[i] = "color"
        colorSensor = i

def read():
    if (colorSensor != -1):
        exec("print(" + portName[colorSensor] + ".get_color())")
    if (distanceSensor != -1):
        exec("print(" + portName[distanceSensor] + ".get_distance_cm())")
    if (forceSensor != -1):
        exec("print(" + portName[forceSensor] + ".get_force_percentage()/100)")
    exec("utime.sleep_ms(2)")
    exec("print(hub.motion.accelerometer())")

for i in range(10):
    print(portType)

#end