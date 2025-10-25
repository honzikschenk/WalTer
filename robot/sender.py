"""
Required installs on Raspberry Pi OS (headless):

sudo apt update && sudo apt install -y \
  python3-picamera2 \
  libcamera-apps \
  python3-requests

Command-line arguments:
- --server-url / -s (required): full URL to POST the image to, e.g. http://server:8000/upload
- --device-id / -d (optional): identifier sent alongside the image
- --auth-token / -a (optional): if set, sends Authorization: Bearer <token>
- --capture-interval / -i (optional, seconds): if set > 0, capture+send in a loop
"""

import os
import time
import tempfile

import requests
from picamera2 import Picamera2
import argparse

def main():
	parser = argparse.ArgumentParser(description="Capture and POST images from Picamera2")
	parser.add_argument(
		"--server-url", "-s",
		required=True,
		help="Full URL to POST the image to",
	)
	parser.add_argument(
		"--device-id", "-d",
		default=None,
		help="Device identifier"
	)
	parser.add_argument(
		"--auth-token", "-a",
		default=None,
		help="Bearer token for Authorization header"
	)
	parser.add_argument(
		"--capture-interval", "-i",
		type=float,
		default=None,
		help="Seconds between captures"
	)

	args = parser.parse_args()

	server_url = args.server_url
	device_id = args.device_id
	auth_token = args.auth_token
	interval_s = args.capture_interval

	# Configure and start camera once
	picam2 = Picamera2()
	still_config = picam2.create_still_configuration()
	picam2.configure(still_config)
	picam2.start()
	time.sleep(2)  # settle AE/AWB briefly

	def capture_to_tmp() -> str:
		with tempfile.NamedTemporaryFile(prefix="frame_", suffix=".jpg", delete=False) as tmp:
			path = tmp.name
		picam2.capture_file(path)
		return path

	def post_image(path: str) -> bool:
		headers = {"Authorization": f"Bearer {auth_token}"} if auth_token else {}
		data = {"deviceId": device_id} if device_id else {}
		try:
			with open(path, "rb") as f:
				files = {"image": (os.path.basename(path), f, "image/jpeg")}
				r = requests.post(server_url, files=files, data=data, headers=headers, timeout=30)
			return 200 <= r.status_code < 300
		except Exception as e:
			print(f"ERROR: post failed: {e}", flush=True)
			return False

	try:
		if interval_s and interval_s > 0:
			print(f"Loop: capture every {interval_s}s to {server_url}", flush=True)
			while True:
				tmp_path = capture_to_tmp()
				ok = post_image(tmp_path)
				try:
					os.remove(tmp_path)
				except Exception:
					pass
				time.sleep(interval_s)
		else:
			tmp_path = capture_to_tmp()
			ok = post_image(tmp_path)
			try:
				os.remove(tmp_path)
			except Exception:
				pass
			raise SystemExit(0 if ok else 1)
	finally:
		try:
			picam2.stop()
		except Exception:
			pass


if __name__ == "__main__":
	main()
