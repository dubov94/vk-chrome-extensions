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

/* VK code */
function ge(el) {
  return (typeof el == 'string' || typeof el == 'number') ? document.getElementById(el) : el;
} 
function trim(text) { return (text || '').replace(/^\s+|\s+$/g, ''); } 
function hasClass(obj, name) {
  obj = ge(obj);
  return obj && (new RegExp('(\\s|^)' + name + '(\\s|$)')).test(obj.className);
} 
function addClass(obj, name) {
  if ((obj = ge(obj)) && !hasClass(obj, name)) {
    obj.className = (obj.className ? obj.className + ' ' : '') + name;
  }
} 
function removeClass(obj, name) {
  if (obj = ge(obj)) {
    obj.className = trim((obj.className || '').replace((new RegExp('(\\s|^)' + name + '(\\s|$)')), ' '));
  }
} 
function toggleClass(obj, name, v) {
  if (v === undefined) {
    v = !hasClass(obj, name);
  }
  (v ? addClass : removeClass)(obj, name);
} 
function isChecked(el) {
  el = ge(el);
  return hasClass(el, 'on') ? 1 : '';
} 
function checkbox(el, v) {
  el = ge(el);
  if (!el || hasClass(el, 'disabled')) return;

  /*if (v === undefined) {
    v = !isChecked(el);
  }*/
  toggleClass(el, 'on', v);
  return false;
} 
/* End VK code */

document.addEventListener("DOMContentLoaded", function() {
	var list = document.getElementsByClassName("checkbox");
	for(var i = 0; i < list.length; ++i) {
		list[i].onclick = (function(obj) {
			return function(event) {
                var flag = !isChecked(obj);
                (function(key, value) {
                    chrome.runtime.getBackgroundPage(
                        function(backgroundPage) {
                            backgroundPage.notify(key, value);
                        }
                    );
                })(obj.id, flag);
				checkbox(obj, flag);
			};
		})(list[i]);
        (function(obj) {
            chrome.storage.sync.get(obj.id, 
                function(items) {
                    checkbox(obj, (items[obj.id] == "true"));
                }
            );
        })(list[i]);
	}
});