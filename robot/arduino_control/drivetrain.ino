#include <Arduino.h>

const int motor1in1Pin = 5;
const int motor1in2Pin = 6;

const int motor2in1Pin = 11;
const int motor2in2Pin = 10;

void driveMotorNormalized(int in1Pin, int in2Pin, float speedNorm) {
  if (speedNorm > 1.0f) speedNorm = 1.0f;
  if (speedNorm < -1.0f) speedNorm = -1.0f;

  int pwm = (int)(fabs(speedNorm) * 255.0f + 0.5f);

  if (speedNorm > 0.0f) {
    analogWrite(in1Pin, pwm);
    digitalWrite(in2Pin, LOW);
  } else if (speedNorm < 0.0f) {
    digitalWrite(in1Pin, LOW);
    analogWrite(in2Pin, pwm);
  } else {
    // Active brake: both sides driven high (PWM max)
    analogWrite(in1Pin, 255);
    analogWrite(in2Pin, 255);
  }
}

inline void driveLeft(float speedNorm) { driveMotorNormalized(motor1in1Pin, motor1in2Pin, speedNorm); }
inline void driveRight(float speedNorm) { driveMotorNormalized(motor2in1Pin, motor2in2Pin, speedNorm); }

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

void loopDrivetrain() {
  tankDrive(1.0f, -1.0f);
  delay(500);

  tankDrive(-1.0f, 1.0f);
  delay(500);

  tankDrive(0.5f, 0.5f);
  delay(500);

  tankDrive(-0.5f, -0.5f);
  delay(500);

  tankDrive(0.0f, 0.0f);
  delay(2000);
}
