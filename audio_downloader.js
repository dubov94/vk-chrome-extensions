launcher(new function() {
	function download(url, filename) {
		/*var link = document.createElement("a");
	    link.href = url;
	    link.download = filename;
	    link.click();*/
	    window.open(url);
	}
	
	var listener = function (event) {
		var classes = event.target.classList;
		for(var i = 0; i < classes.length; ++i) {
			if(classes[i] == "play_new") {
				event.preventDefault();
				var play_btn = event.target.parentNode.parentNode;
				var url = play_btn.getElementsByTagName("input")[0].value;
				var filename = play_btn.nextElementSibling.getElementsByClassName("title_wrap")[0].innerText;
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