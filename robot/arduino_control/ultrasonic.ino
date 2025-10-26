#include <Arduino.h>

// Pins (change if you wired differently)
const uint8_t TRIG_PIN = 3;
const uint8_t ECHO_PIN = 4;

// Max measurable distance (affects pulseIn timeout)
const unsigned int MAX_DISTANCE_CM = 400; // ~4 meters
const unsigned long PULSE_TIMEOUT_US = 25000UL; // ~25 ms, ~4.3 m; safe default

// Take multiple readings and return a median for stability
float readDistanceCmOnce() {
	// Ensure trigger is LOW
	digitalWrite(TRIG_PIN, LOW);
	delayMicroseconds(2);

	// 10µs HIGH pulse to trigger measurement
	digitalWrite(TRIG_PIN, HIGH);
	delayMicroseconds(10);
	digitalWrite(TRIG_PIN, LOW);

	// Measure echo HIGH pulse width (µs)
	unsigned long duration = pulseIn(ECHO_PIN, HIGH, PULSE_TIMEOUT_US);
	if (duration == 0) {
		return -1.0f; // timeout / out of range
	}
	// Convert to cm
	float cm = duration / 58.0f;
	if (cm <= 0 || cm > MAX_DISTANCE_CM + 20) {
		return -1.0f;
	}
	return cm;
}

static float median3(float a, float b, float c) {
	// Handle invalids (-1) by replacing with large sentinel
	if (a < 0) a = 1e9;
	if (b < 0) b = 1e9;
	if (c < 0) c = 1e9;
	// Simple median-of-three
	if (a > b) { float t = a; a = b; b = t; }
	if (b > c) { float t = b; b = c; c = t; }
	if (a > b) { float t = a; a = b; b = t; }
	// If all invalid => b will be large; treat as invalid
	if (b >= 1e8) return -1.0f;
	return b;
}

float getDistance() {
	// Take 3 quick samples and median
	float d1 = readDistanceCmOnce();
	delay(10);
	float d2 = readDistanceCmOnce();
	delay(10);
	float d3 = readDistanceCmOnce();
	return median3(d1, d2, d3);
}

void initUltrasonic() {
	pinMode(TRIG_PIN, OUTPUT);
	pinMode(ECHO_PIN, INPUT);
	digitalWrite(TRIG_PIN, LOW);
	delay(50);
}
