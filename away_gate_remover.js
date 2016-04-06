launcher(new function() {
    this.name = "away_gate_remover"
    this.launch = function() {
        document.body.style.display = "none"
        let pairs = window.location.search.substring(1).split("&")
        for(let i = 0; i < pairs.length; i++) {
            let splitted = pairs[i].split("=")
            if(splitted[0] == "to") {
                window.location.replace(decodeURIComponent(splitted[1]))
            }
        }
    }
})
