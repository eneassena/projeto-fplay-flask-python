from flask import Flask , url_for, render_template, json
from flask import send_file, request
import glob
from utils.modules import sec2minString


# manipulando imagem modules
from io import BytesIO
from mutagen import File


MUSICFOLDER = "static/musics/"


def updatemusic():
	db = model()
	musiclist = glob.glob(MUSICFOLDER + "*.mp3")
	musicnames = [mi.split("/")[-1] for mi in musiclist]

	indb = [msi.arquivo
			for msi in db().iterselect(db.musica.arquivo)
			if msi.arquivo in musicnames]


app = Flask(__name__)


# rotas
@app.route("/sounds")
def sounds():
	music = request.args["music"]
	return send_file(music, mimetype="audio/mp3")


@app.route("/coverImage")
def coverImage():
	cover = request.args["music"]
	cover = File(cover)

	if("API:" in cover.tags.keys()):
		imgcover = cover.tags["APIC:"].data
		strIO = BytesIO
		strIO.write(imgcover)
		strIO.seek(0)
		return send_file(strIO, mimetype="image/jpg")
	else:
		return app.send_static_file('images/earphone-music.jpg')


@app.route("/") # rota principal
def home():
	musiclist = glob.glob("static/music/1kilo/*.mp3")
	
	musicJ = [{"fileName" : mi.split("/")[-1],
				"coverURL": url_for("coverImage", music=mi),
				"fileURL": url_for('sounds', music=mi),
				"length": sec2minString(File(mi).info.length),
				"Tags": None 
				} for mi in musiclist]
	
	for i in range(len(musicJ)):
		tag = File(musiclist[i])
		if('TIT2' in tag.keys()):
			musicJ[i]['Tags'] = {'TIT2': tag['TIT2'].text[0],
								 'TPE1': tag['TPE1'].text[0]}

	return render_template("home.html", musicJ=musicJ)
 

if (__name__ == "__main__"):
	app.run()