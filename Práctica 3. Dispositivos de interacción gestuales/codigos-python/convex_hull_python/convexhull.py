import numpy as np
import cv2


	
image = cv2.imread('hand.JPG')
gray = cv2.cvtColor(image,cv2.COLOR_RGB2GRAY)
ret,bw = cv2.threshold(gray,127,255,cv2.THRESH_BINARY)
contours, hierarchy = cv2.findContours(bw,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)[-2:]
cv2.drawContours(image, contours, -1, (0,255,0),3)



hull = cv2.convexHull(contours[0]) # convexhull, contorno 0 (solo) y lo indexamos
cv2.drawContours(image, [hull], 0, (255,0,0),3) # y la pintamos, metiendolo lista [hull], solo 1 elementos (0) 
cv2.imshow('Contours',image)

keyboard = cv2.waitKey(0)

cv2.destroyAllWindows()

