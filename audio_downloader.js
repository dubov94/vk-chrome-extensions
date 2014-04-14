launcher(new function() {
	function download(url, filename) {
		var link = document.createElement("a");
	    link.href = url;
	    link.download = filename;
	    var click = document.createEvent("MouseEvents");
	    click.initEvent("click", true, true);
	    link.dispatchEvent(click);
	}
	
	var listener = function (event) {
		var classes = event.target.classList;
		for(var i = 0; i < classes.length; ++i) {
			if(classes[i] == "play_new") {
				event.preventDefault();
				var play_btn = event.target.parentNode.parentNode;
				var url = play_btn.getElementsByTagName("input")[0].value;
				var filename = play_btn.nextElementSibling.getElementsByClassName("title_wrap")[0].innerText + ".mp3";
				download(url, filename);
				break;
			}
		}
	};

	this.name = "audio_downloader";
	this.launch = function() {
		document.body.addEventListener("contextmenu", listener);
	}

	this.finish = function() {
		document.body.removeEventListener("contextmenu", listener);
	}
});