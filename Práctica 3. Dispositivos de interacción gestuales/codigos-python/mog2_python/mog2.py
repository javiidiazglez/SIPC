import numpy as np
import cv2


cap = cv2.VideoCapture(0)
backSub = cv2.createBackgroundSubtractorMOG2(detectShadows = True) # llamada substractor de fondo 

if not cap.isOpened:
    print ("Unable to open cam")
    exit(0)

while (True):
	ret,frame=cap.read()
	if not ret:
		exit(0)
	fgMask = backSub.apply(frame,1) # para frame nuevo = apply = mascara binaria (0 no aprende) (1 actualizacion mas rapida)
		# pasamos el frame normal (imagen) y devuelve la mascara
		# lo hace = a través de un tercer argumento (por defecto (-1)) 
		# indica el ratio del aprendizaje -> (indica como de rapido olvida lo nuevo que sale (1) y lo integra en el fondo (0))
	cv2.imshow('frame',frame)
	cv2.imshow('Foreground Mask',fgMask)

	keyboard = cv2.waitKey(1)
	if keyboard & 0xFF == ord('q'):
		break

cap.release()
cv2.destroyAllWindows()

