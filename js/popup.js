$(document).ready(function() {

  var bkg = chrome.extension.getBackgroundPage();

  //All links inside the popup load in a new tab
  $('body').on('click', 'a', function() {
    var hyperlink = $(this).attr('href')
    if (hyperlink !== "#") {
      chrome.tabs.create({
        url: hyperlink
      });
    }
    return false;
  });
  //Number of elements
  var numberOfAssigs = 0;

  //Get all data and add it, if any
  chrome.storage.sync.get(null, function(items) {
    var allKeys = Object.keys(items);
    if (!jQuery.isEmptyObject(items)) {
      $.each(items, function(j, item) {
        $('#assig' + numberOfAssigs).html("<td>" + (numberOfAssigs + 1) +
          "<td>" + items[j].assigName + "</td><td>" + items[j].grupVal + "</td><td>" + items[j].placesLliures + "</td><td>" + items[j].placesTotals + "</td>");
        $('#subjectsTable').append('<tr id="assig' + (numberOfAssigs + 1) + '"></tr>');
        numberOfAssigs++;
      })
    }
  });

  function buildDataJSON(html) {
    html = html.trim();
    html = html.substring(html.search("{\"data\"")).trim();
    html = html.substring(0, html.search("]}]}") + "]}]}".length).trim();
    data = JSON.parse(html);
    return data;
  }

  function parseResponse(assig, grup, html) {
    //bkg.console.log('foo');

  }

  function updateHTML(assigName, grupVal, placesLliures, placesTotals) {
    $('#assig' + numberOfAssigs).html("<td>" + (numberOfAssigs + 1) + "<td>" + assigName + "</td><td>" + grupVal + "</td><td>" +
      placesLliures + "</td><td>" + placesTotals + "</td>");
    //Avoiding duplicate IDs
    if (!document.getElementById('assig' + (numberOfAssigs + 1))) {
      $('#subjectsTable').append('<tr id="assig' + (numberOfAssigs + 1) + '"></tr>');

      //Saving the entered data
      var save = {};
      var contingutAssig = {
        assigName, grupVal, placesLliures, placesTotals
      };
      save["assig" + numberOfAssigs] = contingutAssig;
      chrome.storage.sync.set(save, function() {
        console.log('Settings saved');
      });
      numberOfAssigs++;
    }
  }

  var assigs = {};

  function refreshTable () {
    var save = {};
    var table = document.getElementById('subjectsTable');
    var a = assigs["assigs"];
    for (var p = 1; p < table.rows.length-1; ++p) {
      //console.log(table.rows[i].innerHTML);
      var assig = table.rows[p].cells[1].innerHTML;
      var grup = table.rows[p].cells[2].innerHTML;
      for (var q = 0; q < a.length; ++q) {
        console.log(a[q]["nomAssig"]);
        if (a[q]["nomAssig"] == assig) {
          grups = a[q]["grups"];
          for (var r = 0; r < grups.length; ++r) {
            if (grups[r]["tipusGrup"] == "N" && grups[r]["nom"] == grup) {
              placesLliures = grups[r]["placesLliures"];
              placesTotals = grups[r]["placesTotals"];
              table.rows[p].cells[3].innerHTML = grups[r]["placesLliures"];
              table.rows[p].cells[4].innerHTML = grups[r]["placesTotals"];
              var assigName = assig;
              var grupVal = grup;
              var contingutAssig = { assigName, grupVal, placesLliures, placesTotals };
              save["assig" + p] = contingutAssig;
            }
          }
        }
        //if (as["nomAssig"] == assig) console.log(ass["grups"].length);
      }
    }
    chrome.storage.sync.set(save, function() {
        console.log('Settings saved');
      });
  }

  //Called each time we add a new alement to the table
  function addNewRow() {
    var inputVal = $("#inputAssig").val().toUpperCase();
    var grupVal = $("#inputGrup").val();
    if (inputVal.length <= 0) {
      toastr.options = {
        "newestOnTop": true,
        "positionClass": "toast-bottom-center",
        "preventDuplicates": true
      }
      toastr.error("El camp d'entrada està buit");
      return false;
    } else if (grupVal < 10 || grupVal > 99) {
      toastr.options = {
        "newestOnTop": true,
        "positionClass": "toast-bottom-center",
        "preventDuplicates": true
      }
      toastr.error("Grup conté un valor incorrecte");
      return false;
    } else {

      var placesLliures, placesTotals;
      placesLliures = placesTotals = "99";

      var xhr = new XMLHttpRequest();
      var url = "http://www.fib.upc.edu/fib/estudiar-enginyeria-informatica/matricula/lliures/lliuresGRAU.html";
      xhr.open("GET", url, false);
      xhr.onreadystatechange = function() {
        console.log("mida resposta: " + xhr.responseText.length);
        assigs = buildDataJSON(xhr.responseText);
        placesLliures = "0";
        placesTotals = "10";

        updateHTML(inputVal, grupVal, placesLliures, placesTotals);
        refreshTable();
      }
      xhr.send();
    }
    return true;
  }
  //Add new row to the table
  $("#addBtn").click(function() {
    if (addNewRow()) {
      $("#inputAssig").val("");
      $("#inputGrup").val("");
    }
    return false;
  });

  $("#refreshBtn").click(function() {
    refreshTable();
  });

  $("#assigForm").each(function() {
    $(this).find('input').keypress(function(e) {
      //Enter so send data as well
      if (e.which == 10 || e.which == 13) {
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
  $("#delBtn").click(function() {
    if (numberOfAssigs > 0) {
      $("#assig" + (numberOfAssigs - 1)).html('');
      chrome.storage.sync.remove('assig' + (numberOfAssigs - 1));
      numberOfAssigs--;
    }
  });
});

window.onload = function() {
  var inputAssig = document.getElementById('inputAssig');
  inputAssig.focus();
  inputAssig.select();
}
