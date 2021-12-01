import numpy as np
import cv2


cap = cv2.VideoCapture(0)

if not cap.isOpened:
    print ("Unable to open cam")
    exit(0)

while (True):
	ret,frame=cap.read()
	if not ret:
		exit(0)
	cv2.imshow('frame',frame)
	keyboard = cv2.waitKey(1)
	if keyboard & 0xFF == ord('q'):
		break

cap.release()
cv2.destroyAllWindows()

