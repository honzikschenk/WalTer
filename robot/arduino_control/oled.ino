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

const bool SEQ_OPEN[] = { true, false, true, false, true };
const uint16_t SEQ_MS[] = { 4000, 200, 200, 200, 400 };
const uint8_t SEQ_LEN = sizeof(SEQ_OPEN) / sizeof(SEQ_OPEN[0]);
static uint8_t g_idx = 0;
static unsigned long g_nextAt = 0;

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

void initDisplay() {
  Wire.begin();
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { 
    for (;;);
  }
  display.clearDisplay();

  g_idx = 0;
  g_nextAt = 0;
}

void loopDisplay() {
  unsigned long now = millis();

  if ((long)(now - g_nextAt) >= 0) {
    // Draw current frame
    display.clearDisplay();
    if (SEQ_OPEN[g_idx]) {
      drawOpenEyes();
    } else {
      drawClosedEyes();
    }
    display.display();

    // Schedule next step
    g_nextAt = now + SEQ_MS[g_idx];
    g_idx = (g_idx + 1) % SEQ_LEN;
  }
}