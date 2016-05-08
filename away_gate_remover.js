'use strict';

addFeature(new function() {
    this.name = 'away_gate_remover'
    this.start = function() {
        document.body.style.display = 'none'
        let pairs = window.location.search.substring(1).split('&')
        for(let i = 0; i < pairs.length; i++) {
            let splittedParams = pairs[i].split('=')
            if(splittedParams[0] == 'to') {
                window.location.replace(decodeURIComponent(splittedParams[1]))
            }
        }
    }
})
