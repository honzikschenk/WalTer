#include <Arduino.h>

void setup() {
  Serial.begin(115200);

  initDrivetrain();
  initDisplay();
  initUltrasonic();
}

void loop() {
  Serial.println(getDistance());

  loopDisplay();
}
