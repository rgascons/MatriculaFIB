$(document).ready(function() {

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

  //Get all data and add it, if any, and update it to the latest results
  chrome.storage.sync.get(null, function(items) {
    var allKeys = Object.keys(items);
    if (!jQuery.isEmptyObject(items)) {
      $.each(items, function(j, item) {
        $('#assig' + numberOfAssigs).html("<td>" + (numberOfAssigs + 1) +
          "<td>" + items[j].assigName + "</td><td>" + items[j].grupVal + "</td><td>" + items[j].placesLliures + "</td><td>" + items[j].placesTotals + "</td>");
        $('#subjectsTable').append('<tr id="assig' + (numberOfAssigs + 1) + '"></tr>');
        numberOfAssigs++;
      })
      retrieveData();
      refreshTable();
    }
  });
  /*
  function buildDataJSON(html) {
    html = html.trim();
    html = html.substring(html.search("{\"data\"")).trim();
    html = html.substring(0, html.search("]}]}") + "]}]}".length).trim();
    data = JSON.parse(html);
    return data;
  }*/

  function updateHTML(assigName, grupVal) {
    $('#assig' + numberOfAssigs).html("<td>" + (numberOfAssigs + 1) + "<td>" + assigName + "</td><td>" + grupVal + "</td><td>" +
      undefined + "</td><td>" + undefined + "</td>");
    //Avoiding duplicate IDs
    if (!document.getElementById('assig' + (numberOfAssigs + 1))) {
      $('#subjectsTable').append('<tr id="assig' + (numberOfAssigs + 1) + '"></tr>');
      console.log('Number of assigs' + numberOfAssigs);
      numberOfAssigs++;
    }
  }

  var assigs = {};

  function refreshTable () {
    var save = {};
    var table = document.getElementById('subjectsTable');
    for (var p = 1; p < table.rows.length-1; ++p) {
      //console.log(table.rows[i].innerHTML);
      var assig = table.rows[p].cells[1].innerHTML;
      var grup = table.rows[p].cells[2].innerHTML;
      var isValid = false;
      for (var q = 0; q < assigs.length; ++q) {
        //console.log(a[q]["nomAssig"]);
        if (assigs[q]["nomAssig"] == assig) {
          grups = assigs[q]["grups"];
          for (var r = 0; r < grups.length; ++r) {
            if (grups[r]["tipusGrup"] == "N" && grups[r]["nom"] == grup) {
              isValid = true;
              placesLliures = grups[r]["placesLliures"];
              placesTotals = grups[r]["placesTotals"];
              table.rows[p].cells[3].innerHTML = grups[r]["placesLliures"];
              table.rows[p].cells[4].innerHTML = grups[r]["placesTotals"];
              var assigName = assig;
              var grupVal = grup;
              var contingutAssig = { assigName, grupVal, placesLliures, placesTotals };
              console.log(contingutAssig);
              save["assig" + (p-1)] = contingutAssig;
            }
          }
        }
        //if (as["nomAssig"] == assig) console.log(ass["grups"].length);
      }
      if(!isValid) {
        toastr.options = {
          "newestOnTop": true,
          "positionClass": "toast-bottom-center",
        }
        toastr.error("L'assignatura " + assig + " o el seu grup son incorrectes");
      }
    }
    chrome.storage.sync.set(save, function() {
        console.log('Settings saved: ' + JSON.stringify(save));
    });
  }

  //Retrieve data from the webpage
  function retrieveData() {
    var xhr = new XMLHttpRequest();
    var url = "http://46.101.250.23:8080/data";
    xhr.open("GET", url, false);
    xhr.onreadystatechange = function() {
      console.log("mida resposta: " + xhr.responseText.length);
      assigs = JSON.parse(xhr.response);
      console.log("resposta:" + assigs);
    }
    xhr.send();
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
      retrieveData();
      updateHTML(inputVal, grupVal);
      refreshTable();
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
