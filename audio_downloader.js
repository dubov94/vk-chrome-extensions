launcher(new function() {
	function download(url, node) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "blob";

        xhr.onload = function(event) {            
                var blob = new Blob([xhr.response], { type: "audio/mp3" });
                blobUrl = window.URL.createObjectURL(blob);

                var link = document.createElement("a");
		 	    link.href = blobUrl;
		 	    var performer = node.childNodes[0].innerText,
		 	    	dash = node.childNodes[1].textContent,
		 	    	name = node.childNodes[2].innerText;
		 	    var filename = performer + dash + name;
		 	    link.download = filename.trim() + ".mp3";
			    link.click();

                window.URL.revokeObjectURL(blobUrl);
        };

        var separator = node.childNodes[1].textContent;
        xhr.onprogress = function(event) {
        	var progressInfo;
        	if(event.loaded == event.total) {
        		progressInfo = separator;
        	} else {
        		progressInfo = separator + Math.round(event.loaded / event.total * 100) + "%" + separator;
        	}
        	node.childNodes[1].textContent = progressInfo;
        };

        xhr.send(); 
	}
	
	var listener = function (event) {
		var classes = event.target.classList;
		for(var i = 0; i < classes.length; ++i) {
			if(classes[i] == "play_new") {
				event.preventDefault();
				var play_btn = event.target.parentNode.parentNode;
				var url = play_btn.getElementsByTagName("input")[0].value;
				var node = play_btn.nextElementSibling.getElementsByClassName("title_wrap")[0];
				download(url, node);
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