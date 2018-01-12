$(function () {
    // Button Press
    $('#searchForm').submit(function(e) {
        e.stopPropagation();
        e.preventDefault();
        runSearch();
    });

    function updateOwnedDocuments(src) {
        console.log('updateOwnedDocuments');
        let renderTable = 'documentTable'
        let renderPagination = 'documentsPagination'
        src = src ? src : $('#'+renderTable).data('dmfinddocumentsbycreator') + '?sort=createdOn,desc&size=5';
        let jwt = $('#'+renderTable).data('jwt')
        let dmviewerurl = $('#'+renderTable).data('dmviewerurl')
        if(src) {
            handleRequest(
                src,
                '',
                jwt,
                function (data) {
                    var newE = jQuery.Event('pageData');
                    newE.eventData = {
                        data: data,
                        jwt: jwt,
                        dmviewerurl: dmviewerurl,
                        resultContainer: renderTable,
                        pageInfoContainer: renderPagination,
                        pageLoader: (newSrc) => updateOwnedDocuments(newSrc)
                    };
                    $('#'+renderTable).trigger(newE);
                },
                function () {
                    console.log('Could not load owned documents: ' + src);
                    $('#'+renderTable).html('');
                });
        }else{
            $('#'+renderTable).html('');
        }
    }


    function updateGroupDocuments(src) {
        console.log('updateGroupDocuments');
        let renderTable = 'groupDocumentTable'
        let renderPagination = 'groupDocumentsPagination'
        src = src ? src : $('#'+renderTable).data('dmfinddocumentsbygroup') + '?sort=createdOn,desc&size=5';
        let jwt = $('#'+renderTable).data('jwt');
        let dmviewerurl = $('#'+renderTable).data('dmviewerurl')

        let query = {};
        query.name = 'userGroup';
        query.value = $('#'+renderTable).data('groupname');

        if(src && src !== 'undefined?sort=createdOn,desc&size=5'){
            handleRequest(
                src,
                JSON.stringify(query),
                jwt,
                function (data) {
                    var newE = jQuery.Event('pageData');
                    newE.eventData = {
                        data: data,
                        jwt: jwt,
                        dmviewerurl: dmviewerurl,
                        resultContainer: renderTable,
                        pageInfoContainer: renderPagination,
                        pageLoader: (newSrc) => updateGroupDocuments(newSrc)
                    };
                    $('#'+renderTable).trigger(newE);
                },
                function () {
                    console.log('Could not load owned documents: ' + src);
                    $('#'+renderTable).html('');
                });
        }else{
            $('#'+renderTable).html('');
        }
    }

    function runSearch(src) {
        console.log('runSearch');
        let renderTable = 'searchDocumentTable';
        let renderPagination = 'searchDocumentsPagination';
        let renderForm = 'searchForm';
        src = src ? src : ($('#'+renderForm).attr('action') + '?sort=createdOn,desc&size=5');
        let jwt = $('#'+renderTable).data('jwt');
        let dmviewerurl = $('#'+renderTable).data('dmviewerurl')

        var form = $('#'+renderForm)[0];
        var formData = new FormData(form);
        var jsonData = jsonfiyForm(formData);

        jsonData = ($.isEmptyObject(jsonData)) ? emptyJsonForm() : jsonData;

        if(src){
            handleRequest(
                src,
                JSON.stringify(jsonData),
                jwt,
                function(data){
                    var newE = jQuery.Event('pageData');
                    newE.eventData = {
                        data: data,
                        jwt: jwt,
                        dmviewerurl: dmviewerurl,
                        resultContainer: renderTable,
                        pageInfoContainer: renderPagination,
                        pageLoader: (newSrc) => runSearch(newSrc)
                    };
                    $('#'+renderTable).trigger(newE);
                },
                function (res) {
                    console.log(res.responseJSON.error);
                }
            );
        }else{
            console.log('no src');
            $('#'+renderTable).html('');
        }

    }

    function jsonfiyForm(formData){
        let jsonData = {};

        for (const [key, value]  of formData.entries()) {
            if (value.trim() != '') {
                jsonData.name = key;
                jsonData.value = value;
            }
        }
        return jsonData;
    }

    function emptyJsonForm(){
        let jsonData = {};
        jsonData.name = '';
        jsonData.value = '';
        return jsonData;
    }


    function handleRequest(src, postData, jwt, success, error){
        console.log(src,postData,jwt)
        $.ajax({
            url: src,
            data: postData,
            headers: { 'Authorization': jwt},
            cache: false,
            contentType: 'application/json',
            processData: false,
            method: 'POST',
            success: success,
            error: error
        });
    }

    runSearch();
    updateOwnedDocuments();
    updateGroupDocuments();
});
