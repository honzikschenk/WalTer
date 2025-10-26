#include <Arduino.h>

const int motor1in1Pin = 10;
const int motor1in2Pin = 11;

const int motor2in1Pin = 6;
const int motor2in2Pin = 5;

// Edge-sensitive COAST fix: only insert a brief neutral (both IN pins LOW)
// when the direction actually changes, and use COAST (not brake) at zero
// speed. This avoids tripping driver protections without reducing effective
// power during steady motion.
static const uint8_t COAST_DELAY_MS = 20; // tune 10–50 ms if needed
static const uint8_t RAMP_INTERVAL_MS = 10; // how often to adjust speed
static const float   RAMP_STEP = 0.10f;     // max change in speedNorm per step

// Track last applied direction per motor: -1 reverse, 0 stop, +1 forward
static int8_t g_lastDir1 = 0;
static int8_t g_lastDir2 = 0;
static float  g_currSpeed1 = 0.0f; // current applied speed [-1..1]
static float  g_currSpeed2 = 0.0f;
static unsigned long g_nextRampAt1 = 0;
static unsigned long g_nextRampAt2 = 0;

static inline int8_t signWithDeadband(float v, float db = 0.02f) {
  if (v > db) return 1;
  if (v < -db) return -1;
  return 0;
}

static void applyMotorDrive(int in1Pin, int in2Pin, float targetSpeed, int8_t &lastDir, float &currSpeed, unsigned long &nextRampAt) {
  // Clamp
  if (targetSpeed > 1.0f) targetSpeed = 1.0f;
  if (targetSpeed < -1.0f) targetSpeed = -1.0f;

  // Slew-rate limit: step the current speed toward target at a fixed cadence
  unsigned long now = millis();
  if ((long)(now - nextRampAt) >= 0) {
    float delta = targetSpeed - currSpeed;
    if (fabs(delta) > RAMP_STEP) {
      currSpeed += (delta > 0 ? RAMP_STEP : -RAMP_STEP);
    } else {
      currSpeed = targetSpeed;
    }
    nextRampAt = now + RAMP_INTERVAL_MS;
  }

  int8_t dir = signWithDeadband(currSpeed);

  // Zero speed => COAST (both LOW). No delay loops.
  if (dir == 0) {
    digitalWrite(in1Pin, LOW);
    digitalWrite(in2Pin, LOW);
    lastDir = 0;
    return;
  }

  // If changing direction (and we weren't stopped), insert a one-time neutral delay
  if (lastDir != 0 && dir != lastDir) {
    digitalWrite(in1Pin, LOW);
    digitalWrite(in2Pin, LOW);
    delay(COAST_DELAY_MS);
  }

  // Apply PWM on the active side only; keep the other LOW
  int pwm = (int)(fabs(currSpeed) * 255.0f + 0.5f);
  if (dir > 0) {
    analogWrite(in1Pin, pwm);
    digitalWrite(in2Pin, LOW);
  } else {
    digitalWrite(in1Pin, LOW);
    analogWrite(in2Pin, pwm);
  }

  lastDir = dir;
}

void driveMotorNormalized(int in1Pin, int in2Pin, float speedNorm) {
  if (speedNorm > 1.0f) speedNorm = 1.0f;
  if (speedNorm < -1.0f) speedNorm = -1.0f;

  int pwm = (int)(fabs(speedNorm) * 255.0f + 0.5f);

  if (speedNorm > 0.0f) {
    // Neutral first (coast), then apply forward
    digitalWrite(in1Pin, LOW);
    digitalWrite(in2Pin, LOW);
    delay(COAST_DELAY_MS);

    analogWrite(in1Pin, pwm);
    digitalWrite(in2Pin, LOW);
  } else if (speedNorm < 0.0f) {
    // Neutral first (coast), then apply reverse
    digitalWrite(in1Pin, LOW);
    digitalWrite(in2Pin, LOW);
    delay(COAST_DELAY_MS);

    digitalWrite(in1Pin, LOW);
    analogWrite(in2Pin, pwm);
  } else {
    // Zero speed: COAST (do not brake). Keep both LOW.
    digitalWrite(in1Pin, LOW);
    digitalWrite(in2Pin, LOW);
  }
}

inline void driveLeft(float speedNorm) { applyMotorDrive(motor1in1Pin, motor1in2Pin, speedNorm, g_lastDir1, g_currSpeed1, g_nextRampAt1); }
inline void driveRight(float speedNorm) { applyMotorDrive(motor2in1Pin, motor2in2Pin, speedNorm, g_lastDir2, g_currSpeed2, g_nextRampAt2); }

void tankDrive(float speedLeft, float speedRight) {
  driveLeft(speedLeft);
  driveRight(speedRight);
}

void initDrivetrain() {
  pinMode(motor1in1Pin, OUTPUT);
  pinMode(motor1in2Pin, OUTPUT);

  pinMode(motor2in1Pin, OUTPUT);
  pinMode(motor2in2Pin, OUTPUT);
  
  digitalWrite(motor1in1Pin, LOW);
  digitalWrite(motor1in2Pin, LOW);

  digitalWrite(motor2in1Pin, LOW);
  digitalWrite(motor2in2Pin, LOW);
}
