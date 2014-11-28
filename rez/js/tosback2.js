/**
 * SETTINGS
 */
var audit_base = 'http://audit.tosback2.dev/';

/*
case insensitive Contains
*/
jQuery.expr[':'].Contains = function(a,i,m){
    return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase())>=0;
};


var intRegex = /^\d+$/;

var entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': '&quot;',
  "'": '&#39;',
  "/": '&#x2F;'
};

var escapeHtml = function(string) {
  return String(string).replace(/[&<>"'\/]/g, function (s) {
    return entityMap[s];
  });
};

var getParameterByName = function(name){
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)", 
      regex = new RegExp( regexS ),
      results = regex.exec( window.location.href );
  if( results == null ){
    return "";
  } else {
    return decodeURIComponent(results[1].replace(/\+/g, " "));
  }
}

var debug = function(log_txt) {
    if (typeof window.console != 'undefined') {
        console.log(log_txt);
    }
}

var isArray = function(what) {
    return Object.prototype.toString.call(what) === '[object Array]';
}

