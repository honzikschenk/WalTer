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

			uartSendCommand("capture_image");

			delay(500);
			state = TURNING;
			break;
		}

		case TURNING: {
			if (!uartGetActivated()) {
				state = IDLE;
				break;
			}

			tankDrive(-0.4f, 0.4f);

			delay(1000);

			state = DRIVING;
			break;
		}
	}
}

void loopBasicRun() {
	runStateMachineOnce();
	delay(10); // small loop delay
}

