document.addEventListener("DOMContentLoaded", function () {
	var list = document.getElementsByClassName("immutable_link");
	for(var i = 0; i < list.length; ++i) {
		list[i].onclick = (function(address) {
			return function(event) {
				event.stopPropagation();
				chrome.tabs.create({active: true, url: address});
			}
		}
		)(list[i].href);
	}
});

document.addEventListener("DOMContentLoaded", function() {
	var list = document.getElementsByClassName("checkbox");
	for(var i = 0; i < list.length; ++i) {
		list[i].onclick = (function(obj) {
			return function(event) {
                var flag = !obj.classList.contains("on");
                (function(key, value) {
                    chrome.runtime.getBackgroundPage(
                        function(backgroundPage) {
                            backgroundPage.notify(key, value);
                        }
                    );
                })(obj.id, flag);
				obj.classList.toggle("on", flag);
			};
		})(list[i]);
        (function(obj) {
            chrome.storage.sync.get(obj.id, 
                function(items) {
                    obj.classList.toggle("on", (items[obj.id] == "true"));
                }
            );
        })(list[i]);
	}
});