def sec2minString(sec):
	mi = sec / 60
	mi = str(mi).split(".")
	seci = int(float('' + mi[1]) * 60.0)
	if (seci < 10):
		seci = '0' + str(seci)
	else:
		seci = str(seci)
	return mi[0] + ":" + seci