from rest import RestEndpoint, GettableState
from camera import Camera
from uart import UartDrivetrain, DriveTrainRequest, DriveTrainResponse

from time import sleep

SERVER_URL = "http://walterbot.tech/upload"

GAIN = 4
LOOP_INTERVAL = 0.5
SHUTTER_US = 8000

def main():
    endpoint = RestEndpoint(SERVER_URL)
    camera = Camera(GAIN, SHUTTER_US)
    uart = UartDrivetrain()

    capturing = True

    uart.send_signal(DriveTrainRequest.START_SWEEPING)

    while True:
        # command = endpoint.get()
        # print(command)
        # match command:
        #     case GettableState.NONE:
        #         pass
        #     case GettableState.START_SWEEPING:
        #         uart.send_signal(DriveTrainRequest.START_SWEEPING)
        #         capturing = True
        #     case GettableState.STOP_SWEEPING:
        #         uart.send_signal(DriveTrainRequest.STOP_SWEEPING)
        #         capturing = False
        
        if capturing:
            response = uart.get_signal()

            match response:
                case DriveTrainResponse.TAKE_PICTURE:
                    print("Attempting to capture image")
                    try:
                        pass
                        img = camera.capture()

                        if endpoint.post_image(img):
                            print("Successfully posted image")
                        else:
                            print("WARN: recieved error code after posing image")
                    except Exception as e:
                        print("WARN: failed to capture image {e}", flush=True)
                        if not endpoint.post_error(str(e)):
                            print("WARN: recieved error code after posing error")

                    

                case DriveTrainResponse.NONE:
                    pass  

        if (LOOP_INTERVAL > 0):
            print(f"Waiting {LOOP_INTERVAL} seconds")
            sleep(LOOP_INTERVAL)
        else:
            print("done")
            return



if __name__ == "__main__":
    main()
