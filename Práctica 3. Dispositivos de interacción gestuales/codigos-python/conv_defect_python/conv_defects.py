import numpy as np
import cv2
import math

# angulos 
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
	


image = cv2.imread('hand.JPG')
gray = cv2.cvtColor(image,cv2.COLOR_RGB2GRAY)
ret,bw = cv2.threshold(gray,127,255,cv2.THRESH_BINARY)
contours, hierarchy = cv2.findContours(bw,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)[-2:]
cv2.drawContours(image, contours, -1, (0,255,0),3)

cnt = contours[0]
hull = cv2.convexHull(cnt,returnPoints = False) # hull = almacene en los indice (no los puntos de si mismo)
defects = cv2.convexityDefects(cnt,hull) # =  le pasamos los contornos y los indices

for i in range(len(defects)): # iteramos todos los defectos de convexidad (desde 0 a n-1) (pasar los indices)
	s,e,f,d = defects[i,0] # indices en defects
	start = tuple(cnt[s][0]) # tupla del contorno + indexar (vector de puntos)
	end = tuple(cnt[e][0])
	far = tuple(cnt[f][0])
	depth = d/256.0 # 
	print(depth)
	ang = angle(start,end,far) # angulo
	cv2.line(image,start,end,[255,0,0],2) # linea
	cv2.circle(image,far,5,[0,0,255],-1) # circulo mas lejano

cv2.imshow('Contours',image)

keyboard = cv2.waitKey(0)

cv2.destroyAllWindows()

