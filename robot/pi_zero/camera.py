import tempfile

from picamera2 import Picamera2

class Camera:
    def __init__(self, gain, shutter_us):
        self.picam = Picamera2()
        still_config = self.picam.create_still_configuration(main={"size": (1280, 720)})
        self.picam.configure(still_config)

        self.picam.start()

        try:
            self.picam.set_controls({
                "AeEnable": False,
                "ExposureTime": int(shutter_us),
                "AnalogueGain": float(gain),
                "AwbEnable": True,
            })
        except Exception as e:
            print(f"WARN: failed to set manual exposure controls: {e}", flush=True)

    def capture(self) -> str:
        """
            Returns a path to a temporary file containing the captured image
        """
        with tempfile.NamedTemporaryFile(prefix="frame_", suffix=".jpg", delete=False) as tmp:
            path = tmp.name
        self.picam.capture_file(path)
        return path

    def __del__(self):
        try:
            self.picam.stop()
        except Exception:
            pass
