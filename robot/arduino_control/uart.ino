#include <Arduino.h>

enum class UartCommand : uint8_t {
	CAPTURE_IMAGE = 0,
	ACTIVATE      = 1,
	DEACTIVATE    = 2,
};

static volatile bool g_uartActivated = false;
static volatile bool g_hasPendingCmd = false;
static volatile UartCommand g_lastCmd = UartCommand::DEACTIVATE;

void initUart(unsigned long baud) {
	Serial1.begin(baud);
	delay(10);
}

void uartPoll() {
	while (Serial1.available() > 0) {
		int b = Serial1.read();
		if (b < 0) break;
		uint8_t code = static_cast<uint8_t>(b);
		if (code <= static_cast<uint8_t>(UartCommand::DEACTIVATE)) {
			g_lastCmd = static_cast<UartCommand>(code);
			g_hasPendingCmd = true;
			if (g_lastCmd == UartCommand::ACTIVATE) {
				g_uartActivated = true;
			} else if (g_lastCmd == UartCommand::DEACTIVATE) {
				g_uartActivated = false;
			}
		}
	}
}

bool uartTryReadCommand(uint8_t &outCode) {
	if (g_hasPendingCmd) {
		noInterrupts();
		outCode = static_cast<uint8_t>(g_lastCmd);
		g_hasPendingCmd = false;
		interrupts();
		return true;
	}
	return false;
}

void uartSendCommand(uint8_t code) {
	Serial1.write(code);
	Serial1.flush();
}

void uartSendCommand(const char* msg) {
	if (!msg) return;
	if (strcmp(msg, "capture_image") == 0) {
		uartSendCommand(static_cast<uint8_t>(UartCommand::CAPTURE_IMAGE));
	} else {
	}
}

bool uartGetActivated() {
	return g_uartActivated;
}

void loopUart() {
    uartPoll();
}
