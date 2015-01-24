(function($) {

    var Comments = {

        $el: null,
        options: {
            getComments: function() {},
            postComment: function() {},
        },

        init: function(options, el) {
            this.$el = $(el);

            // Init options
            var self = this;
            $(Object.keys(options)).each(function(index, key) {
                self.options[key] = options[key];
            });

            this.refresh();
        },

        refresh: function() {
            this.$el.empty();
            var commentArray = this.options.getComments()

            var self = this;
            $(commentArray).each(function(index, commentJSON) {
                self.createCommentElement(commentJSON);
            });
        },

        createCommentElement: function(commentJSON) {
            var commentEl = $('<div/>');
            commentEl.html(commentJSON.content);
            this.$el.append(commentEl);
        },

        postComment: function() {
            this.options.postComment();
        },

        editComment: function() {
        },
    }

    $.fn.comments = function(options) {
        return this.each(function() {
            var comments = Object.create(Comments);
            comments.init(options, this);
            $.data(this, 'comments', comments);
        });
    };

})(jQuery);
