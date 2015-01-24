(function($, window, document, undefined) {
    $.fn.comments = function(options) {
        var textToChange = $(this);
        var opts = $.extend({}, $.fn.comments.defaults, options);

        textToChange.text("Hello, World!");
        textToChange.css("color", opts.color);
        textToChange.css("font-size", opts.size);

        return this;
    };

    $.fn.comments.defaults = {
        color: "#000",
        size: "36px"
    };
})(jQuery, window, document);
