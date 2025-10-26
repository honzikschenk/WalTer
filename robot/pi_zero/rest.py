from enum import Enum
import requests
import os

class GettableState(Enum):
    NONE = 0
    START_SWEEPING = 1
    STOP_SWEEPING = 2

class RestEndpoint:
    def __init__(self, server_url):
        self.server_url = server_url

    def post_image(self, image_path: str) -> bool:
        data = [("type", "image")]

        with open(image_path, "rb") as f:
            files = {"image": (os.path.basename(image_path), f, "image/jpeg")}
            try:
                r = requests.post(self.server_url, files=files, data=data, timeout=30)
            except Exception as e:
                print(f"WARN: failed to send post: {e}", flush=True)

        return 200 <= r.status_code < 300

    def post_error(self, error_string: str) -> bool:
        data = [("type", "error"), ("error_string", error_string)]

        try:
            r = requests.post(self.server_url, data=data, timeout=30)
        except Exception as e:
            print(f"WARN: failed to send post: {e}", flush=True)

        return 200 <= r.status_code < 300

    def get(self) -> GettableState:
        try:
            response = requests.get(self.server_url)

            match response.text:
                case "none":
                    return GettableState.NONE
                case "start_sweeping":
                    return GettableState.START_SWEEPING
                case "stop_sweeping":
                    return GettableState.STOP_SWEEPING
                case _:
                    print(f"WARN: invalid HTTP response: {response.text}")
                    return GettableState.NONE
            
        except Exception as e:
            print(f"WARN: failed to get: {e}")
            return GettableState.NONE


        
