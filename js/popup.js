$(document).ready(function(){
	//All links inside the popup load in a new tab
   	$('body').on('click', 'a', function(){
   		var hyperlink = $(this).attr('href')
   		if (hyperlink !== "#") {
     		chrome.tabs.create({url: hyperlink});
 		}
     	return false;
   	});
   	var i=0;

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
   		} else if (grupVal < 20 || grupVal > 99) {
   			toastr.options = {
   				"newestOnTop": true,
   				"positionClass": "toast-bottom-center"
   			}
      		toastr.error("Grup conté un valor incorrecte");
      		return false;
   		} else {
   			var placesLliures = 3;
   			var placesTotals = 40;
   			$('#assig'+i).html("<td>"+ (i+1) +
      		"<td>"+inputVal+"</td><td>"+grupVal+"</td><td>"+placesLliures+"</td><td>"+placesTotals+"</td>");
    		//Avoiding duplicate IDs
    		if (!document.getElementById('assig' + (i+1)))
      			$('#subjectsTable').append('<tr id="assig'+(i+1)+'"></tr>');
      			
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
		 	i--;
		}
	 });
});

window.onload = function(){
	var inputAssig = document.getElementById ('inputAssig');
  	inputAssig.focus();
  	inputAssig.select();
}