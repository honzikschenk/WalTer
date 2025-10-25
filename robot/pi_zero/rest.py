from enum import Enum
import requests
import os

class GettableState(Enum):
    NONE = 0
    TAKE_PICTURE = 1

class RestEndpoint:
    def __init__(self, server_url):
        self.server_url = server_url

    def post_image(self, image_path: str) -> bool:
        data = [("type", "image")]

        with open(image_path, "rb") as f:
            files = {"image": (os.path.basename(image_path), f, "image/jpeg")}
            r = requests.post(self.server_url, files=files, data=data)

        return 200 <= r.status_code < 300

    def post_error(self, error_string: str) -> bool:
        data = [("type", "error"), ("error_string", error_string)]

        r = requests.post(self.server_url, data=data)
        return 200 <= r.status_code < 300

    def get(self) -> GettableState:
        response = requests.get(self.server_url)

        return GettableState.NONE
