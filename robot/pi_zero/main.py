from rest import RestEndpoint, GettableState
from .camera import Camera
from time import sleep

SERVER_URL = ""

GAIN = 4
LOOP_INTERVAL = 0.1
SHUTTER_US = 8000

def main():
    endpoint = RestEndpoint(SERVER_URL)
    camera = Camera(GAIN, SHUTTER_US)

    capturing = True

    while True:
        command = endpoint.get()
        print(command)
        match command:
            case GettableState.NONE:
                continue
            case GettableState.START_CAPTURING:
                capturing = True
            case GettableState.STOP_CAPTURING:
                capturing = False
        
        if capturing:
            try:
                img = camera.capture()
            except Exception as e:
                print("WARN: failed to capture image {e}", flush=True)
                endpoint.post_error(str(e))
                continue

            endpoint.post_image(img)

        sleep(LOOP_INTERVAL)



if __name__ == "__main__":
    main()
