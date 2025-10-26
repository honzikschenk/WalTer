import serial
from enum import Enum

SERIAL_PATH = "/dev/ttyS0"

class DriveTrainResponse(Enum):
    NONE = 0
    TAKE_PICTURE = 1

class DriveTrainRequest(Enum):
    NONE = 0
    START_SWEEPING = 1
    STOP_SWEEPING = 2

class UartDrivetrain:
    def __init__(self):
        self.serial = serial.Serial(SERIAL_PATH, 115200, timeout=0.2)

    def get_signal(self) -> DriveTrainResponse:
        try:
            response = self.serial.read(1)

            print(f"Recieved: {response}")

            if len(response) == 0:
                return DriveTrainResponse.NONE
            elif response[0] == 0:
                return DriveTrainResponse.TAKE_PICTURE
            else:
                print(f"WARN: invalid UART response: {response}")
                return DriveTrainResponse.NONE
        
        except serial.SerialTimeoutException as e:
            return DriveTrainResponse.NONE
            
        except Exception as e:
            print(f"WARN: error reading from UART: {e}")
            return DriveTrainResponse.NONE
        
    def send_signal(self, request: DriveTrainRequest):
        try:
            match request:
                case DriveTrainRequest.NONE:
                    return
                case DriveTrainRequest.START_SWEEPING:
                    self.serial.write(bytearray(b'\x01'))
                case DriveTrainRequest.STOP_SWEEPING:
                    self.serial.write(bytearray(b'\x02'))
        except Exception as e:
            print(f"WARN: error writing to UART: {e}")

