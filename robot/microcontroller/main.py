from machine import Pin
import utime
from enum import Enum
import time

class DriveCellControl:
    MOTOR_PINS = {0: (0, 1), 1: (2, 3)}

    def __init__(self, motor_number=0):
        self.number = motor_number
        (p1, p2) = DriveCellControl.MOTOR_PINS[motor_number]

        self.pwm1 = PWM(Pin(p1))
        self.pwm2 = PWM(Pin(p2))

        self.pwm1.freq(1000)
        self.pwm2.freq(1000)
        
        # default to coast mode
        self.pwm1.duty_u16(0)
        self.pwm2.duty_u16(0)
        
    def control_drive_cell(self, speed):
        print(f"Driving motor {self.number} at speed {speed}")

        if speed > 0:
            self.pwm1.duty_u16(int(speed * 65535))
            self.pwm2.duty_u16(0)
        if speed < 0:
            self.pwm1.duty_u16(0)
            self.pwm2.duty_u16(int(-1 * speed * 65535))
        else:
            self.pwm1.duty_u16(0)
            self.pwm2.duty_u16(0)

class Drivetrain:
    def __init__(self):
        self.left_motor = DriveCellControl(0)
        self.right_motor = DriveCellControl(1)

    def drive(self, direction: int, speed: float):
        self.left_motor.control_drive_cell(speed if direction == 1 else -speed)
        self.right_motor.control_drive_cell(speed if direction == 1 else -speed)

    def turn(self, direction: str, speed: float):
        if direction == "left":
            self.left_motor.control_drive_cell(-speed)
            self.right_motor.control_drive_cell(speed)
        elif direction == "right":
            self.left_motor.control_drive_cell(speed)
            self.right_motor.control_drive_cell(-speed)

class OLEDDisplay:
    def __init__(self):
        pass


class UltrasonicSensor:

    def __init__(self):
        self.TRIG = Pin(17, Pin.OUT)
        self.ECHO = Pin(16, Pin.IN)
        
    def get_distance(self):
        self.TRIG.low()
        utime.sleep_us(2)

        self.TRIG.high()
        utime.sleep_us(10)
        self.TRIG.low()

        while self.ECHO.value() == 0:
            pass
        start_time = utime.ticks_us()

        while self.ECHO.value() == 1:
            pass
        end_time = utime.ticks_us()

        duration = utime.ticks_diff(end_time, start_time)

        distance = (duration * 0.343)/2
        return distance
        
    
    
class UARTComms:
    def __init__(self):
        self.activated = True
        
    def send_data(self, data):
        print(f"Sending data over UART: {data}")

    def get_activated(self):
        return self.activated

class BasicRun:
    OBJECT_DETECTION_THRESHOLD = 5
    EDGE_DETECTION_THRESHOLD = 20

    class State(Enum):
        IDLE = 0
        DRIVING = 1
        CAPTURING = 2
        TURNING = 3

    def __init__(self, drivetrain: Drivetrain, ultrasonic_sensor: UltrasonicSensor, uart_comms: UARTComms):
        self.state = self.State.IDLE

        self.drivetrain = drivetrain
        self.ultrasonic_sensor = ultrasonic_sensor
        self.uart_comms = uart_comms

    def run(self):
        match self.state:
            case self.State.IDLE:
                if self.uart_comms.get_activated():
                    self.state = self.State.DRIVING

                self.drivetrain.drive(0, 0)

            case self.State.DRIVING:
                if not self.uart_comms.get_activated():
                    self.state = self.State.IDLE

                if self.ultrasonic_sensor.get_distance() < self.OBJECT_DETECTION_THRESHOLD:
                    self.state = self.State.CAPTURING
                elif self.ultrasonic_sensor.get_distance() > self.EDGE_DETECTION_THRESHOLD:
                    self.state = self.State.TURNING

                self.drivetrain.drive(1, 50)

            case self.State.CAPTURING:
                if not self.uart_comms.get_activated():
                    self.state = self.State.IDLE
                
                self.drivetrain.drive(0, 0)

                time.sleep(0.5)

                self.uart_comms.send_data("capture_image")

                time.sleep(0.5)

                self.state = self.State.TURNING

            case self.State.TURNING:
                if not self.uart_comms.get_activated():
                    self.state = self.State.IDLE

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
