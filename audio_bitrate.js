launcher(new function() { 
		function insertCSS() {
			var css = document.createElement("style");
			css.type = "text/css";
			css.innerHTML = [".vk_extensions_duration { padding-top: 0px !important; padding-bottom: 0px !important; position: absolute; right: 0px; bottom: 14px; }",
						".vk_extensions_bitrate { clear: right; font-size: 0.7em !important; padding-top: 1px !important; padding-bottom: 0px !important; position: absolute; right: 0px; bottom: 3px; }"].join("\n");
			document.head.appendChild(css);
		}

		function update(obj) {
			var bitrate = document.createElement("div");
			bitrate.style = "display: none;";
			obj.parentNode.appendChild(bitrate);
			bitrate.className = "vk_extensions_bitrate duration fl_r";
			var url = obj.parentNode.parentNode.getElementsByTagName("input")[0].value;
			var dur = parseInt(url.substring(url.lastIndexOf(",") + 1));
			var xhr = new XMLHttpRequest();
			xhr.open("HEAD", url, true);
			xhr.onreadystatechange = function() {
				if(xhr.readyState == 4 && xhr.status == 200) {
					bitrate.innerText = Math.round(parseInt(xhr.getResponseHeader("Content-Length")) * 8 / dur / 1000);
					obj.classList.add("vk_extensions_duration");
					bitrate.style = "";
				}
			}
			xhr.send();
		}

		function is_audio_info_block(obj, count) {
			return obj.childElementCount == count && obj.children[0].classList.contains("title_wrap");
		}

		function content_changed() {
			var blocks = document.getElementsByClassName("info");
			for(var i = 0; i < blocks.length; ++i) {
				if(is_audio_info_block(blocks[i], 3)) {
					update(blocks[i].children[2]);
				}
			}
		}

		function undo() {
			var blocks = document.getElementsByClassName("info");
			for(var i = 0; i < blocks.length; ++i) {
				if(is_audio_info_block(blocks[i], 4)) {
					blocks[i].removeChild(blocks[i].children[3]);
					blocks[i].children[2].classList.remove("vk_extensions_duration");
				}
			}
		}

		var observer = new globalObserver(content_changed, 100);

		this.name = "audio_bitrate";
		this.launch = function() {
			content_changed();
			observer.start();
		}

		this.inject = function() {
			insertCSS();
			this.launch();
		}

		this.finish = function () {
			observer.stop();
			undo();
		}
});