#!/usr/bin/env python
# -*- coding: utf-8 -*-

# ----------------------------------------------------------

# Práctica 3 - SIPC - Reconocimientos de gestos
# José Javier Díaz González

import numpy as np
import cv2
import math

# Calcula el angulo del defecto de convexidad
def angle(s,e,f):
    v1 = [s[0]-f[0],s[1]-f[1]] # desde start hasta f (x con las y)
    v2 = [e[0]-f[0],e[1]-f[1]]
    ang1 = math.atan2(v1[1],v1[0]) # hacemos al arcotag de cada uno = ver angulos 
    ang2 = math.atan2(v2[1],v2[0])
    ang = ang1 - ang2 # rectangulos
    if (ang > np.pi):
        ang -= 2*np.pi 
    if (ang < -np.pi):
        ang += 2*np.pi
    return ang*180/np.pi # convertir a grados
	

cap = cv2.VideoCapture(0) # cap = videocapture(con el defecto)
backSub = cv2.createBackgroundSubtractorMOG2(detectShadows = True) # llamada substractor de fondo 

if not cap.isOpened: # si no se ha abierto
    print ("Unable to open cam")
    exit(0)
# 2 puntos
pt1 = (400,100) # esquina superior izquierda 
pt2 = (600,300) # esquina inferior derecha

learningRate = -1 # declaramos variable = -1 (defecto)
while (True): # bucle finito
    ret,frame=cap.read() # ret y frame = lo leemos 
    if not ret:
        exit(0)

    frame = cv2.flip(frame,1) # usamos el flip para dar la vuelta porque mi camara está invertida

    # Region de interes
    roi = frame[pt1[1]:pt2[1],pt1[0]:pt2[0],:].copy() # 100 a 300  vertical | 400 a 600  horizontal | todos los colores (los tres)
    cv2.rectangle(frame,pt1,pt2,(255,0,0))  # pintamos el recutangulo = azul borde en la region de interes

    fgMask = backSub.apply(roi, None, learningRate) 
    # para frame nuevo = apply = mascara binaria (0 no aprende) (1 actualizacion mas rapida)
    # tercer argumento = learning rate = -1
    # indica el ratio del aprendizaje -> (indica como de rapido olvida lo nuevo que sale (1) y lo integra en el fondo (0))


    # Deteccion de contornos
    contours, hierarchy = cv2.findContours(fgMask,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)[-2:] # Buscamos los contornos externos, desde los 2 ultimos elementos hasta el final
    # todos los contornos blanco y negro, rodea los contornos, contorno externo, rango -2 = son los dos ultimos valores

    numero_defecto = 0
    if len(contours) > 0: # contornos desde (0 a n-1) > 0
        cont = max(contours,key = len) # contorno mas grande
        cv2.drawContours(roi, cont, -1, (0,255,0),2) # pintamos la funcion contorno, (todos los contornos), verde, 2 ancho

        # Bounding rect
        x,y,a,h = cv2.boundingRect(cont) # x,y = punto esquina superior izq, a:ancho, h:alto

        cv2.rectangle(roi,(x,y),(x+a, y+h),(0,0,255),2) # azul 
        # (x,y) = (rect[0],rect[1])
        # (x+a, y+h) = (rect[0]+rect[2],rect[1]+rect[3]) 

        # Malla convexa
        hull = cv2.convexHull(cont,returnPoints = False) # hull = almacene en los indice (no los puntos de si mismo)
        # Defectos de convexidad
        defects = cv2.convexityDefects(cont,hull) # = le pasamos los contornos y los indices
 
        if type(defects) != type(None): # si hay defectos
            numero_defecto = 0
            for i in range(defects.shape[0]): # Guardamos los defectos
                s,e,f,d = defects[i,0] # indices en defects
                start = tuple(cont[s][0]) # tupla del contorno + indexar (vector de puntos)
                end = tuple(cont[e][0])
                far = tuple(cont[f][0])
                depth = d/256.0
                ang = angle(start,end,far)  # angulo
                
                if depth > 30 and ang <= 90:
                    numero_defecto += 1
                    cv2.line(roi,start,end,[255,0,0],2) # linea de la malla convexa
                    cv2.circle(roi,far,5,[0,0,255],-1) # circulo del punto mas lejano
            
            # Número de dedos -> defectos obtenidos y alturas del bounding rect
            font = cv2.FONT_HERSHEY_COMPLEX
            color_blanco = (255, 255, 255) 
            
            if numero_defecto >= 1: # a > 110 and h > 140
                cv2.putText(frame, " Numero dedos: " + str(numero_defecto+1), (0,50), font, 1, color_blanco, 2)
                

            elif h <= 140: # h <= 140 
                cv2.putText(frame, " Numero dedos: 0", (0,50), font, 1, color_blanco, 2)

            else: # entre a > 95 y h > 130 
                cv2.putText(frame, " Numero dedos: 1", (0,50), font, 1, color_blanco, 2)
                if a > 95 and h > 130:
                    cv2.putText(frame, " Viva los unos!!", (0,100), font, 1, color_blanco, 2)

    # Mostrar ventanas
    cv2.imshow('Frame',frame) # ventana frame
    cv2.imshow('ROI',roi) # ventana interes
    cv2.imshow('FG Mask',fgMask) # ventana mascara binaria

    keyboard = cv2.waitKey(1) # 1 milesegundo con el "keyboard"
    if keyboard & 0xFF == ord('q'): # q = salir
        break
    elif keyboard == ord('r'): # r = learning rate 0
        learningRate = 0

        # negro = fondo
        # blanco = cambios (nuevo)
        
# Todos los recursos + cámara
cap.release()
cv2.destroyAllWindows()