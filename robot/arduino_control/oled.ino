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

void initDisplay() {
  Wire.begin();
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { 
    for (;;);
  }
  display.clearDisplay();
}

void loopDisplay() {
  display.clearDisplay();
  drawOpenEyes();
  display.display();
  delay(4000); // eyes open duration

  blinkEyes();
}