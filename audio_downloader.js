(function(wrapped) {
	chrome.storage.sync.get(wrapped, function(items) {
		function download(url, filename) {
			var link = document.createElement('a');
		    link.href = url;
		    link.download = filename;
		    var click = document.createEvent('MouseEvents');
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

		function start_listening() {
			document.body.addEventListener("contextmenu", listener);
		}

		function end_listening() {
			document.body.removeEventListener("contextmenu", listener);
		}

		if(items[wrapped] == "true") {	
			start_listening();
		}
		chrome.runtime.onMessage.addListener(
			function(request, sender, sendResponse) {
				if(wrapped in request) {
					if(request[wrapped] == "true") {
						start_listening();
					} else {
						end_listening();
					}
				}
			}
		);
	});
})("audio_downloader");