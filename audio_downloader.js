(function() {
function audio_button_touch(event, url, filename) {
    event.preventDefault();
	var link = document.createElement('a');
    link.href = url;
    link.download = filename;
    var click = document.createEvent('MouseEvents');
    click.initEvent("click", true, true);
    link.dispatchEvent(click);
}

function content_changed() {
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
}

var observer = new MutationObserver(function (mutations) { console.log("VK Audio Downloader: page_body mutated"); content_changed(); });
observer.observe(document.getElementById("page_body"), {childList : true, subtree : true});
content_changed();
})();