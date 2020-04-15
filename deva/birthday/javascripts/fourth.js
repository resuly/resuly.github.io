$(document).ready(function check4() {
        $('#main_content').headsmart()
		var elements4 = document.getElementsByTagName("INPUT");
		for (var i = 0; i < elements4.length; i++) {
			elements4[i].oninvalid = function(e4) {
            e4.target.setCustomValidity("");
            if (!e4.target.validity.valid) {
                e4.target.setCustomValidity("Hint: In the summer of 2012.");
            }
        };
        elements4[i].oninput = function(e4) {
            e4.target.setCustomValidity("It was recorded in someone's Weibo.");
        };
    }
	   
      }
	  
	  )