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
            timeFormatter: function(time) {
                return time;
            }
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
                var commentEl = self.createCommentElement(commentJSON);
                self.$el.find('ul.comment-list').append(commentEl);
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
            var commentList = $('<ul/>', {
                class: 'comment-list'
            });
            this.$el.append(commentList);
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
            
            // Comment container element
            var commentEl = $('<li/>', {
                class: 'comment'
            });

            // Profile picture
            var profilePicture = $('<img/>', {
                class: 'profile-picture',
                src: commentJSON.profile_picture_url,
            });

            // Time
            var time = $('<time/>', {
                text: this.options.timeFormatter(commentJSON.created)
            });

            // Name
            var name = $('<div/>', {
                class: 'name',
                text: commentJSON.fullname,
            });

            // Content
            var content = $('<div/>', {
                class: 'content',
                text: commentJSON.content,
            });

            commentEl.append(profilePicture).append(time).append(name).append(content);
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
