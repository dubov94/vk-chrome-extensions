
(function () {
var mathjax = document.createElement("script");  
mathjax.setAttribute("type", "text/javascript");
mathjax.setAttribute("src", "http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML");
mathjax.innerHTML = 
'var observer = new MutationObserver(function (mutations) { console.log("VK MathJax: update enqueued..."); MathJax.Hub.Queue(["Typeset", MathJax.Hub, "page_body"]); });' +
'observer.observe(document.getElementById("page_body"), {childList : true, subtree : true});';
document.head.appendChild(mathjax);
})();