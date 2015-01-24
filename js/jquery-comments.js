(function($) {

    var Comments = {
        init: function(options, el) {
            console.log('init ' + el)
        },
        postComment: function() {
            console.log('post')
        }
    }

    $.fn.comments = function(options) {
        return this.each(function() {
            var comments = Object.create(Comments);
            comments.init(options, this);
            $.data(this, 'comments', comments);
        });
    };

    $.fn.comments.defaults = {
        color: "#000",
        size: "36px"
    };
})(jQuery);
