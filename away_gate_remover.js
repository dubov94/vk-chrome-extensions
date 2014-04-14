launcher(new function() {
	this.name = "away_gate_remover";
	this.launch = function() {
		window.stop();
		document.body.innerHTML = "";
		var pairs = window.location.search.substring(1).split("&");
		var result = "";
		for(var i = 0; i < pairs.length; i++) {
		    var splitted = pairs[i].split("=");
		    if(splitted[0] == "to") {
		        result = splitted[1];
		        break;
		    }
		}
		window.location = decodeURIComponent(result);
	}
});