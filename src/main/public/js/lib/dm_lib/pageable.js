$(function () {

    $('.pageable').on('pageData', function (e) {renderPage(e.eventData);});

    function renderPage(e) {
        //console.log(e);
        renderTable(e);
        renderPagination(e);
    }

    function renderTable(e){
        $(`#${e.resultContainer}`).html('');
        $(`#${e.resultContainer}`)
            .append(getTableHead([
                "",
                "Title",
                "Ref",
                "User Group",
                "File Name",
                "Created By",
                "Created On",
                "",
                ""
            ]))
            .append(getTableBody((e.data._embedded) ? e.data._embedded.documents : [], e.jwt, e.dmviewerurl))
    }

    function getTableHead(table_cols){
        let table_head_row = $("<tr/>")
        $.each(table_cols, function(i,col){
            table_head_row.append($("<th/>").text(col));
        });

        return $('<thead/>').append(table_head_row)
    }


    function getTableBody(docs, jwt, dmviewerurl){
        let table_body = $("<tbody/>");

        console.log(docs)
        $.each(docs, function (i, doc) {
            let row = $("<tr/>");
            let thumbnail = $("<img/>").attr("src", doc._links.thumbnail.href ).attr("width",32);
            row.append($("<td/>").append(thumbnail));

            row.append($("<td/>").text(`${metaClean(doc.metadata.title)}`));

            let somerefLink = $("<a/>").text(`${metaClean(doc.metadata.someref)}`).attr("href", "/list/"+ doc.metadata.someref + '#search-doc');
            row.append($("<td/>").append(somerefLink));

            row.append($("<td/>").text(`${metaClean(doc.metadata.userGroup)}`));
            row.append($("<td/>").text(`${metaClean(doc.originalDocumentName)}`));
            row.append($("<td/>").text(`${metaClean(doc.createdBy)}`));
            row.append($("<td/>").text(`${dateClean(metaClean(doc.createdOn))}`));
            let fileViewLink = $("<a/>").text("View").attr("href", dmviewerurl + '?jwt='+ jwt + '&url=' + doc._links.self.href ).attr("target", "_blank");
            row.append($("<td/>").append(fileViewLink));
            let fileBinLink = $("<a/>").text("Download").attr("href", doc._links.binary.href + '?jwt='+jwt).attr("target", "_blank");
            row.append($("<td/>").append(fileBinLink));

            table_body.append(row);
        });
        return table_body;
    }

    function renderPagination(e){
//  Reset Pagination Component
        $(`#${e.pageInfoContainer}`).html('')

        let links = $(e.data._links);
        let pageData = $(e.data.page);

        let pagerControllerComp = $("<div/>").addClass("pager-controls");
        let pagerItemGroupComp = $("<ul/>").addClass("pager-items");
        let pagerSummary = $("<div/>").addClass("pager-summary");


        pagerItemGroupComp.append($("<li/>").append(
            (links[0].first) ? createPageLink('first', links[0].first.href, e) : "first"
        ));

        pagerItemGroupComp.append($("<li/>").append(
            (links[0].prev) ? createPageLink('prev', links[0].prev.href, e) : "prev"
        ));

        pagerItemGroupComp.append($("<li/>").append(
            (links[0].next) ? createPageLink('next', links[0].next.href, e) : "next"
        ));

        pagerItemGroupComp.append($("<li/>").append(
            (links[0].last) ? createPageLink('last', links[0].last.href, e) : "last"
        ));

        pagerControllerComp.append(pagerItemGroupComp)

        let pageNo = (pageData[0].number) ? pageData[0].number + 1 : 1;
        let totalPagesNo = (pageData[0].totalPages) ? pageData[0].totalPages : 1;

        pagerSummary.text(`Showing page ${pageNo} of ${totalPagesNo} of ${pageData[0].totalElements} documents`);

////    pagination
        $(`#${e.pageInfoContainer}`).addClass("pager").append(pagerControllerComp).append(pagerSummary)
    }

    function createPageLink(label, href, e) {
        return $("<a/>")
            .attr("href", href)
            .text(label)
            .click(function (clickE) {
                clickE.stopPropagation();
                clickE.preventDefault();
                e.pageLoader(href, e);
            });
    }


    function metaClean(meta){
        return (meta) ? meta : "";
    }

    function dateClean(date){
        let d = new Date(date);
        return d.getUTCDay() + "-" + (d.getUTCMonth() + 1) + "-" + d.getUTCFullYear();
    }

});
