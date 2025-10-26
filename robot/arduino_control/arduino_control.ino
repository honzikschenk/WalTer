#include <Arduino.h>

void setup() {
  Serial.begin(115200);
  initUart(115200);

  initDrivetrain();
  initDisplay();
  initUltrasonic();
}

void loop() {
  loopUart();

  Serial.println(getDistance());

  loopDisplay();
}
