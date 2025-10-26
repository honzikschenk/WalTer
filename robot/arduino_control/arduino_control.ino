#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET    -1

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// Eye parameters
int eyeWidth = 20;
int eyeHeight = 20;
int leftEyeX = 30;
int rightEyeX = 78;
int eyeY = 24;

void drawOpenEyes() {
  display.fillRect(leftEyeX, eyeY, eyeWidth, eyeHeight, SSD1306_WHITE);  // Left eye
  display.fillRect(rightEyeX, eyeY, eyeWidth, eyeHeight, SSD1306_WHITE); // Right eye
  display.fillRect(leftEyeX+6, eyeY+6, 8, 8, SSD1306_BLACK);   // Left pupil
  display.fillRect(rightEyeX+6, eyeY+6, 8, 8, SSD1306_BLACK);  // Right pupil
}

void drawClosedEyes() {
  display.fillRect(leftEyeX, eyeY+eyeHeight/2, eyeWidth, 2, SSD1306_WHITE);  // Left closed
  display.fillRect(rightEyeX, eyeY+eyeHeight/2, eyeWidth, 2, SSD1306_WHITE); // Right closed
}

void blinkEyes() {
  display.clearDisplay();
  drawClosedEyes();
  display.display();
  delay(200); // eyes closed duration

  display.clearDisplay();
  drawOpenEyes();
  display.display();
  delay(200); // eyes open duration

  display.clearDisplay();
  drawClosedEyes();
  display.display();
  delay(200); // eyes closed duration

  display.clearDisplay();
  drawOpenEyes();
  display.display();
  delay(400); // eyes open duration
}

void setup() {
  Wire.begin();
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { 
    for (;;);
  }
  display.clearDisplay();
}

void loop() {
  display.clearDisplay();
  drawOpenEyes();
  display.display();
  delay(4000); // eyes open duration

  blinkEyes();
}



// #include <Arduino.h>

// const int motor1in1Pin = 5;
// const int motor1in2Pin = 6;

// const int motor2in1Pin = 11;
// const int motor2in2Pin = 10;

// void setup() {
//   Serial.begin(115200);

//   pinMode(motor1in1Pin, OUTPUT);
//   pinMode(motor1in2Pin, OUTPUT);

//   pinMode(motor2in1Pin, OUTPUT);
//   pinMode(motor2in2Pin, OUTPUT);
  
//   digitalWrite(motor1in1Pin, LOW);
//   digitalWrite(motor1in2Pin, LOW);

//   digitalWrite(motor2in1Pin, LOW);
//   digitalWrite(motor2in2Pin, LOW);
// }

// void driveMotorNormalized(int in1Pin, int in2Pin, float speedNorm) {
//   if (speedNorm > 1.0f) speedNorm = 1.0f;
//   if (speedNorm < -1.0f) speedNorm = -1.0f;

//   int pwm = (int)(fabs(speedNorm) * 255.0f + 0.5f);

//   if (speedNorm > 0.0f) {
//     analogWrite(in1Pin, pwm);
//     digitalWrite(in2Pin, LOW);
//   } else if (speedNorm < 0.0f) {
//     digitalWrite(in1Pin, LOW);
//     analogWrite(in2Pin, pwm);
//   } else {
//     // Active brake: both sides driven high (PWM max)
//     analogWrite(in1Pin, 255);
//     analogWrite(in2Pin, 255);
//   }
// }

// inline void driveLeft(float speedNorm) { driveMotorNormalized(motor1in1Pin, motor1in2Pin, speedNorm); }
// inline void driveRight(float speedNorm) { driveMotorNormalized(motor2in1Pin, motor2in2Pin, speedNorm); }

// void tankDrive(float speedLeft, float speedRight) {
//   driveLeft(speedLeft);
//   driveRight(speedRight);
// }

// void loop() {
//   tankDrive(1.0f, -1.0f);
//   delay(500);

//   tankDrive(-1.0f, 1.0f);
//   delay(500);

//   tankDrive(0.5f, 0.5f);
//   delay(500);

//   tankDrive(-0.5f, -0.5f);
//   delay(500);

//   tankDrive(0.0f, 0.0f);
//   delay(2000);
// }
