var current = 0;

var playing = false;

var mysound;
var source;
var progresBar;
var onProgChange = false;
var musics;
var soundImg;

function set_ListOfMusics(mlist) {
	musics = mlist;
}


function startMusic() {
	mysound = document.getElementById('myplay');
	soundImg = document.getElementById('coverImg');
	progresBar = document.getElementById('rangeProgr');

	source = document.getElementById('audioSource');
	source.src = musics[0].fileURL;
	soundImg.src = musics[0].coverURL;
	mysound.load();
	mysound.play();
	changeColorMusic();
	changeArtistTitle();
	playing = true;
	
	mysound.addEventListener("ended", () => {
		if (current < musics.length -1){
			current += 1;

			source.src = musics[current].fileURL;
			document.getElementById('coverImg').src = musics[current].coverURL;
			mysound.load();
			mysound.play();
		}

		changeColorMusic();
		changeArtistTitle();

		if(current == musics.length -1){
			var mylink = document.getElementById("lin_" + current.toString());
			mylink.style.color = "blue";
		}

		updateTime();
	});

	mysound.addEventListener("timeupdate", function() {
		var currentTime = mysound.currentTime;
		var duration = mysound.duration;
		var per = (currentTime / duration) * 100;
		if(onProgChange == false){ 
			progresBar.value = per;
			updateTime();
		}
	});

	progresBar.addEventListener("mouseup", function(){ 
		var newTime = this.value * mysound.duration / 100;
		mysound.currentTime = newTime;
		onProgChange = false;
		updateTime();
	});

	progresBar.addEventListener("mousedown", function(){
		onProgChange = true;
	});

	progresBar.addEventListener("touchend", function(){ 
		var newTime = this.value * mysound.duration / 100;
		mysound.currentTime = newTime;
		onProgChange = false;
		updateTime();
	});

	progresBar.addEventListener("touchstart", function(){
		onProgChange = true;
	});

}


function changeColorMusic() {
	var mylink;

	for (var i = 0; i < musics.length; i++) {
		mylink = document.getElementById(`lim_${i.toString()}`);
		if(i == current){
			mylink.style.color = "green";
		} else {
			mylink.style.color = "blue";
		}
	}
}

function changeArtistTitle(){
	var artist = document.getElementById("artista");
	var title = document.getElementById("titulo");
	if(musics[current].Tags != null){
		artist.innerHTML = musics[current].Tags.TPE1;
		title.innerHTML = musics[current].Tags.TIT2;
	} else {
		artist.innerHTML = " unknonw";
		title.innerHTML = musics[current].fileName;
	}
}


function helper_x(){
	var newTime = this.value * mysound.duration / 100;
	mysound.currentTime = newTime;
	onProgChange = false;
	updateTime();
}


function onPlay() {
	if(playing == false){ 
		document.getElementById('myplay').play();
		playing = true;
		document.getElementById("playbutton").innerHTML = "play_arrow";
	} else {
		document.getElementById('myplay').pause();
		playing = false;
		document.getElementById("playbutton").innerHTML = 'pause';
	}
	updateTime();
}

function changeMusic(newSound) {

	current = musics.map(function(d) {
		return d['fileURL'];
	}).indexOf(newSound);
	changeColorMusic();
	changeArtistTitle();

	source.src = newSound;
	document.getElementById('coverImg').src = musics[current].coverURL;
	mysound.load();
	mysound.play();
	updateTime();

	current = musics.map(d => {
		return d['fileURL'];
	}).indexOf(newSound);
}

function skip_next() {
	if(current == musics.length -1){ 
		current = 0;
		source.src = musics[current].fileURL;
		document.getElementById('coverImg').src = musics[current].coverURL;
		mysound.load();
		mysound.play();
	} else {
		current += 1;
		source.src = musics[current].fileURL;
		document.getElementById('coverImg').src = musics[current].coverURL;
		mysound.load();
		mysound.play();
	}
	changeColorMusic();
	changeArtistTitle();
	updateTime();
}

function skip_previous() {
	if(current == 0) {
		current = 0;
		source.src =musics[current].fileURL;
		document.getElementById('coverImg').src = musics[current].coverURL;
		mysound.load();
		mysound.play();
	} else {
		current -= 1;
		source.src = musics[current].fileURL;
		document.getElementById('coverImg').src = musics[current].coverURL;
		mysound.load();
		mysound.play();
	}
	changeColorMusic();
	changeArtistTitle();
	updateTime();
}


function updateTime() {
	document.getElementById('ctime').innerHTML = sec2minString(mysound.currentTime);
	document.getElementById('totalTime').innerHTML = sec2minString(mysound.duration);
}

function sec2minString (mytime) {
	var minutes = Number(mytime) / 60;
	var tmp = minutes.toString().split('.');
	minutes = tmp[0];
	var seconds = '0.' + tmp[1];
	seconds = Math.round(Number(seconds) * 60);
	if(seconds < 10) {
		seconds = '0'+ seconds.toString();
	} else {
		seconds = seconds.toString();
	}
	return `${minutes}:${seconds}`;
}


