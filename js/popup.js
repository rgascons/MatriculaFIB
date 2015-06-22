$(document).ready(function(){
	//All links inside the popup load in a new tab
   	$('body').on('click', 'a', function(){
   		var hyperlink = $(this).attr('href')
   		if (hyperlink !== "#") {
     		chrome.tabs.create({url: hyperlink});
 		}
     	return false;
   	});

   	//Add new row to the table
	var i=0;
   	$("#addBtn").click(function(){
   		var inputVal = $("#inputAssig").val();
   		if (inputVal.length > 0) {
   			var placesLliures = 3;
   			var placesTotals = 40;
   			$('#assig'+i).html("<td>"+ (i+1) +
      		"<td>"+inputVal+"</td><td>"+placesLliures+"</td><td>"+placesTotals+"</td>");
    		//Avoiding duplicate IDs
    		if (!document.getElementById('assig' + (i+1)))
      			$('#subjectsTable').append('<tr id="assig'+(i+1)+'"></tr>');
      			
      		i++; 
   		} else {
   			toastr.options = {
   				"newestOnTop": true,
   				"positionClass": "toast-bottom-center"
   			}
      		toastr.error("El camp d'entrada està buit");

      	}
  	});
  	//Delete last row
  	$("#delBtn").click(function(){
    	if(i>0){
		 	$("#assig"+(i-1)).html('');
		 	i--;
		}
	 });
});