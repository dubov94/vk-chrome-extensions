launcher(new function() {
	function get_value(string, key) {
		var i = string.indexOf(key + "=");
		if(i == -1) return null;
		else {
			var len = key.length + 1;
			var end = string.indexOf("&", i +  len);
			if(end == -1) end = string.length;
			return string.substr(i + len, end - i - len);
		}
	}

	function calculate_age(year, month, day) {
		var today = new Date();
		todayYear = today.getFullYear();
		todayMonth = today.getMonth();
		todayDay = today.getDate();
		age = todayYear - year; 
	    if (todayMonth < month - 1) age--;
		if (todayMonth == month - 1 && todayDay < day) age--;
		return age;
	}

	var observer = new MutationObserver(function (mutations) { content_changed(); });

	function start_observing() {
		observer.observe(document.getElementById("page_body"), { childList : true, subtree : true});
	}

	function end_observing() {
		observer.disconnect();
	}

	function content_changed() {
		// console.log("VK Age: updating");
		var dest = document.getElementById("age");
		if(dest == null) {
			// console.log("VK Age: searching");
			var block_ext = document.getElementById("profile_short");
			if(block_ext != null) {
				var block_int = block_ext.children[0].children[0].children[1];
				if(block_int.childElementCount != 2 ||
					block_int.children[0].tagName != "A" || 
					block_int.children[1].tagName != "A") return;
				var date = block_int.children[0].href;
				var age = block_int.children[1].href;
				var day = get_value(date, "c[bday]");
				var month = get_value(date, "c[bmonth]");
				var year = get_value(age, "c[byear]");
				if(day == null || month == null || year == null) return;
				dest = document.createElement("div");
				dest.id = "age";
				dest.className = "label";
				dest.style["display"] = "inline";
				dest.innerText = " (" + 
					calculate_age(parseInt(year), parseInt(month), parseInt(day)) + " years)";
				block_int.appendChild(dest);
			}
		}
	}

	function undo() {
		//console.log("VK Age: undoing");
		var block = document.getElementById("age");
		if(block != null) {
			block.parentNode.removeChild(block);
		}
	}

	this.name = "age";
	this.launch = function() {
		content_changed();
		start_observing();
	}

	this.finish = function() {
		end_observing();
		undo();
	}
});