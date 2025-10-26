#include <Arduino.h>

void setup() {
  Serial.begin(115200);
  initUart(115200);

  initDrivetrain();
  initDisplay();
  initUltrasonic();

  delay(1000);

  tankDrive(0.5f, 0.5f);
  delay(2000);
  tankDrive(0.0f, 0.0f);
}

void loop() {
  loopUart();

  // Serial.println(getDistance());

  uartSendCommand((uint8_t)0);

  Serial.println(uartGetActivated());

  tankDrive(0.0f, 0.0f);

  // tankDrive(0.5f, 0.5f);
  // delay(2000);
  // tankDrive(-0.5f, -0.5f);
  // delay(2000);
  // tankDrive(-0.5f, 0.5f);
  // delay(4000);
  // tankDrive(0.0f, 0.0f);
  // delay(2000);

  // loopBasicRun();

  loopDisplay();
}
