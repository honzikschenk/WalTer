from machine import Pin
import utime

class DriveCellControl:
    def __init__(self, motor_number=0):
        pass
        
    def control_drive_cell(self, direction, speed):
        print(f"Driving {direction} at speed {speed}")

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
