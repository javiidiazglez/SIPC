import numpy as np
import cv2


cap = cv2.VideoCapture(0) # cap = hacemos un videocapture(con el defecto)

if not cap.isOpened: # si no se ha abierto
    print ("Unable to open cam")
    exit(0)

while (True):  # bucle finito
	ret,frame=cap.read()  # ret y frame = lo leemos
	if not ret: # retorno = 0
		exit(0)
	cv2.imshow('frame',frame) # mostrar ventana frame
	keyboard = cv2.waitKey(1) # 1 milesegundo con el "keyboard"
	if keyboard & 0xFF == ord('q'): # q = salir
		break

cap.release()
cv2.destroyAllWindows()

