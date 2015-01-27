(function($) {

    var Comments = {

        $el: null,
        options: {
            commentCount: 0,
            profilePictureURL: '',
            textareaPlaceholder: 'Leave a message',
            sortPopularText: 'Popular',
            myCommentsText: 'My comments',
            getComments: function() {},
            postComment: function() {},
        },

        init: function(options, el) {
            this.$el = $(el);
            this.$el.addClass('comments')

            // Init options
            var self = this;
            $(Object.keys(options)).each(function(index, key) {
                self.options[key] = options[key];
            });

            this.refresh();
        },

        refresh: function() {
            this.$el.empty();
            this.createHTML();

            var self = this;
            var commentArray = this.options.getComments()
            $(commentArray).each(function(index, commentJSON) {
                self.createCommentElement(commentJSON);
            });
        },

        postComment: function() {
            this.options.postComment();
        },

        editComment: function() {
        },


        // HTML elements
        // =============

        createHTML: function() {

            // Profile picture
            var profilePicture = $('<img/>', {
                src: this.options.profilePictureURL,
                class: 'profile-picture'
            });
            this.$el.append(profilePicture);

            // New comment
            var textareaWrapper = $('<div/>', {
                class: 'textarea-wrapper',
            });
            textareaWrapper.html(this.createTextareaElement());
            this.$el.append(textareaWrapper);

            // Navigation bar
            this.$el.append(this.createNavigationElement());

            // Comment list
        },

        createTextareaElement: function() {
            var textareaEl = $('<textarea/>', {
                placeholder: this.options.textareaPlaceholder,
            });
            return textareaEl;
        },

        createNavigationElement: function() {
            var navigationEl = $('<ul/>', {
                class: 'navigation'
            });

            // Sorting
            var sortEl = $('<li/>', {
                text: this.options.sortPopularText,
                class: 'active'
            });

            // My comments
            var myCommentsEl = $('<li/>', {
                text: this.options.myCommentsText,
            });

            navigationEl.append(sortEl).append(myCommentsEl);
            return navigationEl;
        },

        createCommentElement: function(commentJSON) {
            var commentEl = $('<div/>');
            commentEl.html(commentJSON.content);
            this.$el.append(commentEl);
            return commentEl;
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
