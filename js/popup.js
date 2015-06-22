//Links inside the popup load in a new tab
$(document).ready(function(){
   $('body').on('click', 'a', function(){
   	var hyperlink = $(this).attr('href')
   	if (hyperlink !== "#") {
     	chrome.tabs.create({url: hyperlink});
 	}
     return false;
   });
});