function globalObserver(F, timeout) {
	function smartTimeout(fn, interval) {
		var running = false;
		var timerID;
		this.reRun = function() {
			if(running) {
				clearTimeout(timerID);
			} else {
				running = true;
			}
			timerID = setTimeout(function() { running = false; fn(); }, interval);
		};
		this.stop = function() {
			if(running) {
				clearTimeout(timerID);
				running = false;
			}
		}
	}

	var timer = new smartTimeout(F, timeout);
	var observer = new MutationObserver(function(mutations) {
		timer.reRun();
	});

	this.start = function() {
		observer.observe(document.body, {childList : true, subtree : true});
	}
	this.stop = function() {
		observer.disconnect();
		timer.stop();
	}
}

function launcher(extension) { //name, launch, finish, inject
	var __launch;
	if(extension.hasOwnProperty("inject")) {
		var injected = false;
		__launch = function() {
			if(injected) {
				extension.launch();
			} else {
				extension.inject();
				injected = true;
			}
		}
	} else {
		__launch = extension.launch;
	}
	chrome.storage.sync.get(extension.name, function(items) {
		if(items[extension.name] == "true") {
			__launch();
		}

		if(extension.hasOwnProperty("finish")) {
			chrome.runtime.onMessage.addListener(
				function(request, sender, sendResponse) {
					if(extension.name in request) {
						if(request[extension.name] == "true") {
							__launch();
						} else {
							extension.finish();
						}
					}
				}
			);
		}
	});
}