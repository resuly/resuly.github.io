$(document).ready(function check2() {
        $('#main_content').headsmart()
		var elements2 = document.getElementsByTagName("INPUT");
		for (var i = 0; i < elements2.length; i++) {
			elements2[i].oninvalid = function(e2) {
            e2.target.setCustomValidity("");
            if (!e2.target.validity.valid) {
                e2.target.setCustomValidity("Oops, it wasn't that day!");
            }
        };
        elements2[i].oninput = function(e2) {
            e2.target.setCustomValidity("Just think it carefully.");
        };
    }
	   
      }
	  
	  )