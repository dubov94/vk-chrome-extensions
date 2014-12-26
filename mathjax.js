launcher(new function() {
	function content_changed() {
		var editables = document.querySelectorAll('[contenteditable="true"]');
		for(var editableIndex = 0; editableIndex < editables.length; ++editableIndex) {
			editables[editableIndex].classList.add("tex2jax_ignore");
		}
		var event = new Event("vk_extensions_mathjax_update");
		document.dispatchEvent(event);
	}

	var observer = new globalObserver(content_changed, 100);

	this.inject = function() {
		var mathjax = document.createElement("script");  
		mathjax.setAttribute("type", "text/javascript");
		mathjax.setAttribute("src", "//cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML");
		mathjax.text = ['MathJax.Hub.Register.StartupHook("End", function () { ', 
			//'console.log("MathJax loaded");', 
			'document.addEventListener("vk_extensions_mathjax_update", function(event) { ',
			'MathJax.Hub.Queue(["Typeset", MathJax.Hub]); }); });'].join('\n'); // console.log("VK MathJax: update enqueued...");
		document.head.appendChild(mathjax);
		observer.start();
	}

	this.name = "mathjax";

	this.launch = function() {
		content_changed();
		observer.start();
	}

	this.finish = function() {
		observer.stop();
	}
});