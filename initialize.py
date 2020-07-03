import hub, utime
from spike import Motor, DistanceSensor, ColorSensor, ForceSensor

ports = hub.status()["port"]

portName = ["A", "B", "C", "D", "E", "F"]

lengths = [0,0,0,0,0,0]

portType = ["none", "none", "none", "none", "none", "none"]

for i in range(6):
    lengths[i] = len(ports[portName[i]])
    if (lengths[i] == 1):
        exec(portName[i] + " = DistanceSensor(portName[i])")
        portType[i] = "distance"
    elif (lengths[i] == 3):
        exec(portName[i] + " = ForceSensor(portName[i])")
        portType[i] = "force"
    elif (lengths[i] == 4):
        exec(portName[i] + " = Motor(portName[i])")
        portType[i] = "motor"
    elif (lengths[i] > 4):
        exec(portName[i] + " = ColorSensor(portName[i])")
        portType[i] = "color"

for i in range(10):
    print(portType)

#end