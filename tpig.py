#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# TTFish 2021.11.30
#

import os
import sys
from tkinter import *
from PIL import ImageGrab
from random import random

# tmp Import 
# import time

canvasWidth = 600
canvasHeight = 600

cs = Tk()

ctx = Canvas(cs, width=canvasWidth, height=canvasHeight) # background = white not sure

# Init Default Parameters

#pActAct pInhAct pActInh pInhInh
pActAct = 0.08  # au
pInhAct = -0.08 # av
pActInh = 0.11  # bu
pInhInh = 0     # bv

dt = 0.2
ds = 0.8
pActC = 0.1
pInhC = -0.15
pActLimit = 0.2
pInhLimit = 0.5
diffConstA = 0.02
diffConstI = 0.5
decayConstA = 0.03
decayConstI = 0.06

cellSize = 6 # The size of each cell

# Define Data Storage Structure
actConc = [[0 for col in range(100)] for row in range(100)] # Size 100
inhConc = [[0 for col in range(100)] for row in range(100)]
actDiffArray = [[0 for col in range(100)] for row in range(100)]
inhDiffArray = [[0 for col in range(100)] for row in range(100)]

# Main Functions
def saveImage(pAA, pIA, pAI, pII, widget):
	widget.update()
	cropX1 = cs.winfo_rootx() + widget.winfo_x()
	cropY1 = cs.winfo_rooty() + widget.winfo_y()
	cropX2 = cropX1 + cs.winfo_width()
	cropY2 = cropY1 + cs.winfo_height()
	if not os.path.exists("./Data"):
		os.makedirs("Data")
	filePath = os.path.join("./Data", "%.3f-%.3f-%.3f-%.3f.jpg" % (pAA, pIA, pAI, pII))
	ImageGrab.grab().crop((cropX1, cropY1, cropX2, cropY2)).save(filePath)

# Calculation Part

def Calculate():
	drawSkin()
	for repeatTimes in range(50):
		calcDiffusion()
		calcReaction()

# Drawing Part

# Draw Single Cell (Concentration * 255)
def drawCell(px, py):
	x = px * cellSize # Coordinate for each cell
	y = py * cellSize
	cc = actConc[px][py] * 50
	if (cc > 240):
		cc = 240
	cc = round(cc) # fixing f**king bugs from origin code
	color = "#%02x%02x%02x" % (cc, cc, cc)
	ctx.create_rectangle(x, y, x+cellSize, y+cellSize, fill=color, outline=color)
	ctx.pack() # UNKNOWN

# Draw All Cells on Canvas
def drawSkin():
	for i in range(100):
		for j in range(100):
			drawCell(i, j)

# Sequence Configuration

# Configure actConc, inhConc with Random Seed
def randomizeArray():
	for i in range(100):
		for j in range(100):
			actConc[i][j] = 3 * random()
			inhConc[i][j] = 3 * random()

# Setting for Diffusion Array
def setDiffusionArray():
	for i in range(100):
		for j in range(100):
			rightCell = actConc[(i + 1) % 100][j]
			leftCell = actConc[(i + 99) % 100][j]
			upperCell = actConc[i][(j + 1) % 100]
			lowerCell = actConc[i][(j + 99) % 100]
			actDiffArray[i][j] = diffConstA * dt * (rightCell + leftCell + upperCell + lowerCell - 4 * actConc[i][j]) / ds / ds

			rightCell = inhConc[(i + 1) % 100][j]
			leftCell = inhConc[(i + 99) % 100][j]
			upperCell = inhConc[i][(j + 1) % 100]
			lowerCell = inhConc[i][(j + 99) % 100]
			inhDiffArray[i][j] = diffConstI * dt * (rightCell + leftCell + upperCell + lowerCell - 4 * inhConc[i][j]) / ds / ds

# Diffusion Status Calculation
def calcDiffusion():
	setDiffusionArray()
	for i in range(100):
		for j in range(100):
			actConc[i][j] += actDiffArray[i][j]
			inhConc[i][j] += inhDiffArray[i][j]

# Reaction Status Calculation
def calcReaction():
	for i in range(100):
		for j in range(100):
			synAct = pActAct * actConc[i][j] + pInhAct * inhConc[i][j] + pActC
			if (synAct < 0):
				synAct = 0
			if (synAct > pActLimit):
				synAct = pActLimit
			synInh = pActInh * actConc[i][j] + pInhInh * inhConc[i][j] + pInhC
			if (synInh < 0):
				synInh = 0
			if (synInh > pInhLimit):
				synInh = pInhLimit
			actConc[i][j] += (-decayConstA * actConc[i][j] + synAct) * dt
			inhConc[i][j] += (-decayConstI * inhConc[i][j] + synInh) * dt

# Calculate Single Canvas of Experiment Condition
def Tpig(pAA, pIA, pAI, pII):
	randomizeArray()
	drawSkin()
	pActAct = float(pAA)
	pInhAct = float(pIA)
	pActInh = float(pAI)
	pInhInh = float(pII)

	# Assume Calculation Finish in Every 5ms
	for i in range(50):
		Calculate()

	saveImage(pAA, pIA, pAI, pII, ctx)
	print("Write Image %.3f - %.3f - %.3f - %.3f Success" % (pActAct, pInhAct, pActInh, pInhInh))

# Test Computing Time 
# T1 = time.time()
# Tpig(0.08, -0.08, 0.11, 0)
# T2 = time.time()
# print("Calculation Time is :%ss" % (T2 - T1))

# Multi Conditions Main Function
# num = 0
# allnum = 16 ** 4
# for a in range(16):
# 	for b in range(16):
# 		for c in range(16):
# 			for d in range(16):
# 				tmpfishA = 0.01 * a
# 				tmpfishB = 0.01 * b - 0.16
# 				tmpfishC = 0.01 * c + 0.03
# 				tmpfishD = 0.01 * d - 0.08
# 				Tpig(tmpfishA, tmpfishB, tmpfishC, tmpfishD)
#				num = num + 1
#				print("Process Image %s .............. Status: %.3f%" % (num, num/allnum*100))

if __name__=='__main__':
	args = sys.argv
	if len(args) == 5:
		Tpig(args[1], args[2], args[3], args[4])
	else: 
		print("Parameters missing or too many")
	