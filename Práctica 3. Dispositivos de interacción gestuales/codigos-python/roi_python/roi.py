
import numpy as np
import cv2

cap = cv2.VideoCapture(0)

if not cap.isOpened:
    print ("Unable to open file")
    exit(0)

# 2 puntos
pt1 = (400,100) # esquina superior izquierda 
pt2 = (600,300) # esquina inferior derecha

while (True):
	ret,frame=cap.read()
	if not ret:
		exit(0)
	
	frame = cv2.flip(frame,1)  # usamos el flip para dar la vuelta porque mi camara está invertida
	
	roi = frame[pt1[1]:pt2[1],pt1[0]:pt2[0],:].copy() # 100 a 300  vertical | 400 a 600  horizontal | todos los colores (los tres)

	cv2.rectangle(frame,pt1,pt2,(255,0,0)) # pintamos el recutangulo = azul borde en frame 
	cv2.imshow('frame',frame)
	cv2.imshow('ROI',roi)

	keyboard = cv2.waitKey(40)
	if keyboard & 0xFF == ord('q'):
		break

cap.release()
cv2.destroyAllWindows()

