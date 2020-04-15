$(document).ready(function check5() {
        $('#main_content').headsmart()
		var elements5 = document.getElementsByTagName("INPUT");
		for (var i = 0; i < elements5.length; i++) {
			elements5[i].oninvalid = function(e5) {
            e5.target.setCustomValidity("");
            if (!e5.target.validity.valid) {
                e5.target.setCustomValidity("Come on, just like happened yesterday.");
            }
        };
        elements5[i].oninput = function(e5) {
            e5.target.setCustomValidity("Forgot? Call me maybe.");
        };
    }
	   
      }
	  
	  )