"""
Ultra-simple image receiver for local testing.

No external dependencies. Accepts multipart/form-data POSTs with field 'image'
and writes the uploaded file to the current working directory.

Run:
  python3 robot/receiver.py --host 0.0.0.0 --port 8000

Sender should post to:
  http://<your-computer-ip>:8000/upload

Notes:
- Saves as '<timestamp>_<original-filename>' to avoid collisions.
- Also reads optional form field 'deviceId' (ignored for saving, echoed in response).
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import argparse
import cgi
import json
import os
import time
import shutil


class UploadHandler(BaseHTTPRequestHandler):
	server_version = "SimpleImageReceiver/1.0"

	def do_GET(self):
		message = (
			"OK. POST a multipart/form-data request with field 'image' to this URL.\n"
		)
		self.send_response(200)
		self.send_header("Content-Type", "text/plain; charset=utf-8")
		self.send_header("Content-Length", str(len(message)))
		self.end_headers()
		self.wfile.write(message.encode("utf-8"))

	def do_POST(self):
		ctype = self.headers.get("Content-Type", "")
		if not ctype.startswith("multipart/form-data"):
			return self._send_json(400, {"error": "Content-Type must be multipart/form-data"})

		form = cgi.FieldStorage(
			fp=self.rfile,
			headers=self.headers,
			environ={
				"REQUEST_METHOD": "POST",
				"CONTENT_TYPE": ctype,
			},
		)

		if "image" not in form:
			return self._send_json(400, {"error": "Missing field 'image'"})

		field = form["image"]
		if not getattr(field, "file", None):
			return self._send_json(400, {"error": "Field 'image' must be a file"})

		original_name = os.path.basename(field.filename or "upload.jpg")
		ts = time.strftime("%Y%m%d-%H%M%S")
		out_name = f"{ts}_{original_name}"
		out_path = os.path.join(os.getcwd(), out_name)

		try:
			with open(out_path, "wb") as dst:
				shutil.copyfileobj(field.file, dst)
		except Exception as e:
			return self._send_json(500, {"error": f"Failed to save: {e}"})

		device_id = None
		if "deviceId" in form:
			device_id = form.getvalue("deviceId")

		return self._send_json(200, {
			"ok": True,
			"saved": out_name,
			"cwd": os.getcwd(),
			"deviceId": device_id,
		})

	def log_message(self, format, *args):
		# Keep output minimal; override to standard print.
		print("[receiver]", self.address_string(), "-", format % args, flush=True)

	def _send_json(self, status: int, payload: dict):
		body = json.dumps(payload).encode("utf-8")
		self.send_response(status)
		self.send_header("Content-Type", "application/json; charset=utf-8")
		self.send_header("Content-Length", str(len(body)))
		self.end_headers()
		self.wfile.write(body)


def main():
	parser = argparse.ArgumentParser(description="Simple image upload receiver")
	parser.add_argument("--host", default="127.0.0.1", help="Bind host (default 127.0.0.1)")
	parser.add_argument("--port", type=int, default=8000, help="Bind port (default 8000)")
	args = parser.parse_args()

	httpd = HTTPServer((args.host, args.port), UploadHandler)
	print(f"Receiver running on http://{args.host}:{args.port} (saving to {os.getcwd()})", flush=True)
	try:
		httpd.serve_forever()
	except KeyboardInterrupt:
		print("Shutting down...", flush=True)
	finally:
		httpd.server_close()


if __name__ == "__main__":
	main()
