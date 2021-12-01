import numpy as np
import cv2


	
image = cv2.imread('hand.JPG')
gray = cv2.cvtColor(image,cv2.COLOR_RGB2GRAY)
ret,bw = cv2.threshold(gray,127,255,cv2.THRESH_BINARY)
contours, hierarchy = cv2.findContours(bw,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)[-2:]
cv2.drawContours(image, contours, -1, (0,255,0),3)
rect = cv2.boundingRect(contours[0])



pt1 = (rect[0],rect[1])#  punto esquina superior izquierda, 
pt2 = (rect[0]+rect[2],rect[1]+rect[3]) # punto esquina inferior derecha + (x) ancho y (y) alto

cv2.rectangle(image,pt1,pt2,(0,0,255),3) # rectangulo y listo


cv2.imshow('Contours',image)

keyboard = cv2.waitKey(0)

cv2.destroyAllWindows()

