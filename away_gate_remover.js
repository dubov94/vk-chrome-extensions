launcher(new function() {
	this.name = "away_gate_remover";
	this.launch = function() {
		document.body.style.display = "none";
		var pairs = window.location.search.substring(1).split("&");
		for(var i = 0; i < pairs.length; i++) {
		    var splitted = pairs[i].split("=");
		    if(splitted[0] == "to") {
		    	window.location.replace(decodeURIComponent(splitted[1]));
		    }
		}
	}
});