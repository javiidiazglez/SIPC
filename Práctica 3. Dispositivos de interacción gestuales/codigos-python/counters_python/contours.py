import numpy as np
import cv2


	
image = cv2.imread('hand.JPG')
gray = cv2.cvtColor(image,cv2.COLOR_RGB2GRAY)# cvtcolor, pasamos imagen, constante conversion gris
ret,bw = cv2.threshold(gray,127,255,cv2.THRESH_BINARY)# funcion nuestra imagen a escala gris, de 127 a 255 = tresh_binary
contours, hierarchy = cv2.findContours(bw,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)[-2:] 
# todos los contornos blanco y negro, rodea los contornos, contorno externo, rango -2 = son los dos ultimos valores
cv2.drawContours(image, contours, -1, (0,255,0),3) pintamos la funcion contorno, (todos los contornos), verde, 3 ancho



cv2.imshow('Contours',image)

keyboard = cv2.waitKey(0)

cv2.destroyAllWindows()

