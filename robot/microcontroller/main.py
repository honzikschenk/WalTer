from machine import Pin
from enum import Enum

class DriveCellControl:
    def __init__(self, motor_number=0):
        pass
        
    def control_drive_cell(self, direction, speed):
        print(f"Driving {direction} at speed {speed}")

class OLEDDisplay:
    def __init__(self):
        pass
        
    def display_message(self, message):
        print(f"OLED Display: {message}")

class UltrasonicSensor:
    def __init__(self):
        pass
        
    def get_distance(self):
        distance = 42  # Dummy distance value
        print(f"Ultrasonic Sensor Distance: {distance} cm")
        return distance
    
class UARTComms:
    def __init__(self):
        pass
        
    def send_data(self, data):
        print(f"Sending data over UART: {data}")

class BasicRun:
    class State(Enum):
        IDLE = 0
        DRIVING = 1
        CAPTURING = 2
        TURNING = 3
    
    def __init__(self, drivetrain: Drivetrain, ultrasonic_sensor: UltrasonicSensor):
        self.state = self.State.IDLE

        self.drivetrain = drivetrain
        self.ultrasonic_sensor = ultrasonic_sensor

    def run(self):
        match self.state:
            case self.State.IDLE:
                print("Robot is idle.")
            case self.State.DRIVING:
                print("Robot is driving.")
            case self.State.CAPTURING:
                print("Robot is capturing data.")
            case self.State.TURNING:
                print("Robot is turning.")

class Main:
    def __init__(self):
        self.drive_cells = [DriveCellControl(i) for i in range(0, 1)]
        self.oled_display = OLEDDisplay()
        self.ultrasonic_sensor = UltrasonicSensor()
        self.uart_comms = UARTComms()
        
    def run(self):
        self.drive_cells[0].control_drive_cell("forward", 100)
        self.oled_display.display_message("Robot Started")
        distance = self.ultrasonic_sensor.get_distance()
        self.uart_comms.send_data(f"Distance: {distance} cm")

if __name__ == "__main__":
    main_app = Main()
    main_app.run()
