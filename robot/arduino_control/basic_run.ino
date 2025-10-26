#include <Arduino.h>

const float OBJECT_DETECTION_THRESHOLD = 5.0f;
const float EDGE_DETECTION_THRESHOLD   = 20.0f;

enum State {
	IDLE = 0,
	DRIVING = 1,
	CAPTURING = 2,
	TURNING = 3,
};

static State state = IDLE;

// --- Placeholders (implement these for your hardware) ---

// Returns whether the system is "activated" (e.g., via UART command or switch)
bool uartGetActivated() {
	// TODO: Implement UARTComms.get_activated()
	// Example: read from a shared flag set by serial input or a digital input pin
	return false;
}

// Sends a command string over UART
void uartSendData(const char* msg) {
	// TODO: Implement UARTComms.send_data(msg)
	// Example: Serial.println(msg);
	(void)msg;
}

// --- State machine implementation ---

void runStateMachineOnce() {
	switch (state) {
		case IDLE: {
			if (uartGetActivated()) {
				state = DRIVING;
			}
			tankDrive(0.0f, 0.0f);
			break;
		}

		case DRIVING: {
			if (!uartGetActivated()) {
				state = IDLE;
				break;
			}

			float dist = getDistance();
			if (dist < OBJECT_DETECTION_THRESHOLD) {
				state = CAPTURING;
			} else if (dist > EDGE_DETECTION_THRESHOLD) {
				state = TURNING;
			}

			// Python example did drivetrain.drive(1, 50) — semantics unclear.
			// Here we just drive forward with moderate power.
			// TODO: Adjust speeds/steering based on your drivetrain implementation.
			tankDrive(0.5f, 0.5f);
			break;
		}

		case CAPTURING: {
			if (!uartGetActivated()) {
				state = IDLE;
				break;
			}

			tankDrive(0.0f, 0.0f);
			delay(500);

			// Trigger image capture via UART
			// Python: uart_comms.send_data("capture_image")
			// TODO: Implement actual UART command
			uartSendData("capture_image");

			delay(500);
			state = TURNING;
			break;
		}

		case TURNING: {
			if (!uartGetActivated()) {
				state = IDLE;
				break;
			}

			// Placeholder: indicate turning
			// TODO: Implement an actual turn (e.g., leftNorm = -0.4, rightNorm = 0.4 for N ms)
			Serial.println(F("Robot is turning."));

			// Optional: remain in TURNING like the Python example, or transition back to DRIVING
			// state = DRIVING;
			break;
		}
	}
}

void setup() {
	Serial.begin(115200);
	// TODO: Initialize drivetrain, ultrasonic, UART as needed
	// e.g., pinMode for motors, set up UART, etc.
}

void loop() {
	runStateMachineOnce();
	delay(10); // small loop delay
}

