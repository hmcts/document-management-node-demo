$(function () {

  $("#uploadForm").submit(function(e) {

    e.stopPropagation();

    e.preventDefault();

    var form = $('#uploadForm')[0];

    var data = new FormData(form);

    $.ajax({
      url: $('#uploadForm').attr("action"),
      data: data,
      headers: {
        "Authorization": $("#uploadForm").data('jwt'),
        "Accept": "application/vnd.uk.gov.hmcts.dm.document-and-metadata-collection.v1+hal+json;charset=UTF-8"
      },
      cache: false,
      contentType: false,
      processData: false,
      method: 'POST',
      success: function(){ window.location = "/list/" + data.get('metadata[someref]'); },
      error: function (res, error, responseText) {
        alert(responseText);
        //debugger
        //alert(res.responseJSON.error);
        //console.log(res.responseJSON.error);
      }
    });

  });

});
