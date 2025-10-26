from machine import Pin

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
