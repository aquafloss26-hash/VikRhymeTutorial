$(document).ready(function () {
    $('.dropdown-menu a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var text = $(e.target).text();
        $(e.target)
            .closest('.dropdown')
            .find('.dropdown-toggle')
            .html(text + ' <span class="caret"></span>');
    });
});
