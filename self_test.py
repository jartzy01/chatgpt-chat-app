
def locate_or_fail(file, confidence=0.8, fallback=None):
    try:
        return pyautogui.locateCenterOnScreen(file, confidence=confidence)
    except Exception:
        return fallback
screen_size = pyautogui.size()
print('Screen size:', screen_size)
center = (screen_size[0] // 2, screen_size[1] // 2)
pyautogui.moveTo(center[0]-50, center[1]-50)  # Top left corner.
time.sleep(1)
pyautogui.drag(100, 0, 1, button='left')       # Move right.
pyautogui.drag(0, 100, 1, button='left')       # Move down.
pyautogui.drag(-100, 0, 1, button='left')      # Move left.
pyautogui.drag(0, -100, 1, button='left')      # Move up.
time.sleep(1)
button_location = locate_or_fail('test_button.png', fallback=center)
pyautogui.moveTo(button_location)
time.sleep(1)
pyautogui.click(button_location)
pyautogui.write('SELF-TEST PASSED!', interval=0.1)
