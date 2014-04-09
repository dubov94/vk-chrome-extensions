(function(wrapped) {
	chrome.storage.sync.get(wrapped, function(items) {
		function audio_button_touch(event, url, filename) {
		    event.preventDefault();
			var link = document.createElement('a');
		    link.href = url;
		    link.download = filename;
		    var click = document.createEvent('MouseEvents');
		    click.initEvent("click", true, true);
		    link.dispatchEvent(click);
		}

		var observer = new MutationObserver(function (mutations) { end_observing(); setTimeout(content_changed, 500); });

		function start_observing() {
			observer.observe(document.getElementById("page_body"), {childList : true, subtree : true});
		}

		function end_observing() {
			observer.disconnect(); 
		}

		function content_changed() {
			//console.log("VK Audio Downloader: updating")
			var audios = document.getElementsByClassName("play_new");
			for(var ind = 0; ind < audios.length; ++ind) {
				var block = audios[ind];
				if(block.oncontextmenu == null) {
					var play_btn = block.parentNode.parentNode;
					var link = play_btn.getElementsByTagName("input")[0].value.split("?")[0];
					block.oncontextmenu = (function(url, filename) {
						return function(event) { return audio_button_touch(event, url, filename); }
					})(link, play_btn.nextElementSibling.getElementsByClassName("title_wrap")[0].innerText + ".mp3");
				}
			}
			start_observing();
		}
		function undo() {
			//console.log("VK Audio Downloader: undoing");
			var audios = document.getElementsByClassName("play_new");
			for(var i = 0; i < audios.length; ++i) {
				audios[i].oncontextmenu = null;
			}
		}

		if(items[wrapped] == "true") {	
			content_changed();		
			start_observing();
		}
		chrome.runtime.onMessage.addListener(
			function(request, sender, sendResponse) {
				if(wrapped in request) {
					if(request[wrapped] == "true") {
						content_changed();
						start_observing();
					} else {
						end_observing();
						undo();
					}
				}
			}
		);
	});
})("audio_downloader");