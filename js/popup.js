$(document).ready(function(){
	//All links inside the popup load in a new tab
   	$('body').on('click', 'a', function(){
   		var hyperlink = $(this).attr('href')
   		if (hyperlink !== "#") {
     		chrome.tabs.create({url: hyperlink});
 		}
     	return false;
   	});
   	//Number of elements
   	var i=0;

   	//Get all data and add it, if any
   	chrome.storage.sync.get(null, function(items) {
    	var allKeys = Object.keys(items);
    	if(!jQuery.isEmptyObject(items)) {
    		$.each(items, function(j, item) {
    			$('#assig'+i).html("<td>"+ (i+1) +
      				"<td>"+items[j].inputVal+"</td><td>"+items[j].grupVal+"</td><td>"+2+"</td><td>"+40+"</td>");
    			$('#subjectsTable').append('<tr id="assig'+(i+1)+'"></tr>');
    			i++;
			})
    	}
	});

    function getInfoPlaces() {
      var xmlHttp = new XMLHttpRequest();
      var url = "http://www.fib.upc.edu/fib/estudiar-enginyeria-informatica/matricula/lliures/lliuresGRAU.html";
      xmlHttp.open("GET", url, false);
      xmlHttp.send(null);
      console.log("xmlHttp.responseText");
      var info;
      info.placesLliures = 0;
      info.placesTotals = 10;
      return info;
    }

   	//This function is called each time we add a new alement to the table
   	var addNewRow = (function() {
   		var inputVal = $("#inputAssig").val().toUpperCase();
   		var grupVal = $("#inputGrup").val();
   		if (inputVal.length <= 0) {
   			toastr.options = {
   				"newestOnTop": true,
   				"positionClass": "toast-bottom-center"
   			}
      		toastr.error("El camp d'entrada està buit");
      		return false;
   		} else if (grupVal < 10 || grupVal > 99) {
   			toastr.options = {
   				"newestOnTop": true,
   				"positionClass": "toast-bottom-center"
   			}
      		toastr.error("Grup conté un valor incorrecte");
      		return false;
   		} else {
   			var info = getInfoPlaces();
        var placesLliures = info.lliures;
   			var placesTotals = info.totals;
        if (info === null || placesTotals === null || placesLliures === null) {
          placesLliures = placesTotals = 99;
        }
   			$('#assig'+i).html("<td>"+ (i+1) +
      		"<td>"+inputVal+"</td><td>"+grupVal+"</td><td>"+placesLliures+"</td><td>"+placesTotals+"</td>");
    		//Avoiding duplicate IDs
    		if (!document.getElementById('assig' + (i+1)))
      			$('#subjectsTable').append('<tr id="assig'+(i+1)+'"></tr>');
      		
      		//Saving the entered data
      		var save = {};
      		var contingutAssig = {inputVal, grupVal};
      		save["assig"+i] = contingutAssig;
      		chrome.storage.sync.set(save, function() {
    			console.log('Settings saved');
			});

      		i++; 
   		}
   		return true;
   	});
   	//Add new row to the table
   	$("#addBtn").click(function() {
   		if (addNewRow()) {
   			$("#inputAssig").val("");
   			$("#inputGrup").val("");
   		}
  		return false;
   	});
  	$("#assigForm").each(function() {
        $(this).find('input').keypress(function(e) {
        	//Press enter to rock
            if(e.which == 10 || e.which == 13) {
                if (addNewRow()) {
   					$("#inputAssig").val("");
   					$("#inputGrup").val("");
   				}
  				return false;
            }
        });
        $(this).find('input[type=submit]').hide();
    });
  	//Delete last row
  	$("#delBtn").click(function(){
    	if(i>0){
		 	$("#assig"+(i-1)).html('');
		 	chrome.storage.sync.remove('assig'+(i-1));
		 	i--;
		}
	 });
});

window.onload = function(){
	var inputAssig = document.getElementById ('inputAssig');
  	inputAssig.focus();
  	inputAssig.select();
}