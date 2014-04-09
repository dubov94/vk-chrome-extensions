(function(wrapped) {
	chrome.storage.sync.get(wrapped, function(items) {
		var injected = false;

		function content_changed() {
			var event = new Event("vk_extensions_mathjax_update");
			document.dispatchEvent(event);
			start_observing();
		}

		var observer = new MutationObserver(function (mutations) { 
			end_observing();
			setTimeout(content_changed, 500);
		});

		function start_observing() {
			observer.observe(document.body, {childList : true, subtree : true});
		}

		function end_observing() {
			observer.disconnect();
		}

		function launch() {
			if(injected) {
				content_changed();
				start_observing();
			} else {
				injected = true;
				var mathjax = document.createElement("script");  
				mathjax.setAttribute("type", "text/javascript");
				if(location.protocol == "https:") {
					mathjax.setAttribute("src", "https://c328740.ssl.cf1.rackcdn.com/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML");
				} else {
					mathjax.setAttribute("src", "http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML");
				}
				mathjax.text = ['MathJax.Hub.Register.StartupHook("End", function () { ', 
					//'console.log("MathJax loaded");', 
					'document.addEventListener("vk_extensions_mathjax_update", function(event) { ',
					'MathJax.Hub.Queue(["Typeset", MathJax.Hub]); }); });'].join('\n'); //console.log("VK MathJax: update enqueued...");
				document.head.appendChild(mathjax);
				start_observing();
			}
		}

		if(items[wrapped] == "true") {
			launch();
		}
		chrome.runtime.onMessage.addListener(
			function(request, sender, sendResponse) {
				if(wrapped in request) {
					if(request[wrapped] == "true") {
						launch();
					} else {
						end_observing();
					}
				}
			}
		);
	});	
})("mathjax");