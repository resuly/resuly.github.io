$(document).ready(function check3() {
        $('#main_content').headsmart()
		var elements3 = document.getElementsByTagName("INPUT");
		for (var i = 0; i < elements3.length; i++) {
			elements3[i].oninvalid = function(e3) {
            e3.target.setCustomValidity("");
            if (!e3.target.validity.valid) {
                e3.target.setCustomValidity("That's a long time, you know!");
            }
        };
        elements3[i].oninput = function(e3) {
            e3.target.setCustomValidity("Google may do you a favor.");
        };
    }
	   
      }
	  
	  )