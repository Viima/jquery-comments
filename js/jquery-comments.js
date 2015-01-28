(function($) {

    var Comments = {

        $el: null,
        options: {
            profilePictureURL: '',
            textareaPlaceholder: 'Leave a message',
            sortPopularText: 'Popular',
            myCommentsText: 'My comments',
            sendText: 'Send',
            likeText: 'Like',
            replyText: 'Reply',

            highlightColor: '#1B7FCC',
            roundProfilePictures: false,
            textareaRows: 2,
            textareaMaxRows: 5,

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
            this.createCssDeclarations();

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
            // Commenting field
            this.$el.append(this.createCommentingFieldElement());

            // Navigation bar
            this.$el.append(this.createNavigationElement());

            // Comment list
            var commentList = $('<ul/>', {
                class: 'comment-list'
            });
            this.$el.append(commentList);
        },

        createCommentingFieldElement: function() {

            // Commenting field
            var commentingField = $('<div/>', {
                class: 'commenting-field',
            });

            // Profile picture
            var profilePicture = this.createProfilePictureElement(this.options.profilePictureURL);
            profilePicture.addClass('own');

            // New comment
            var textareaWrapper = $('<div/>', {
                class: 'textarea-wrapper',
            });

            // Send -button
            var sendButton = $('<span/>', {
                class: 'send',
                text: this.options.sendText
            });

            textareaWrapper.append(this.createTextareaElement()).append(sendButton);
            commentingField.append(profilePicture).append(textareaWrapper);
            return commentingField;
        },

        createProfilePictureElement: function(src) {
            var profilePicture = $('<img/>', {
                src: src,
                class: 'profile-picture' + (this.options.roundProfilePictures ? ' round' : '')
            });
            return profilePicture;
        },

        createTextareaElement: function() {
            var self = this;

            // Due to bug with Firefox the placeholder need to be embedded like this
            var textareaEl = $('<textarea placeholder="'+this.options.textareaPlaceholder+'"/>');
            var lineHeight = 20;
            var textareaBaseHeight = 30;

            var setRows = function(rows) {
                textareaEl.css('height', textareaBaseHeight + (rows - 1) * lineHeight);
            }

            // Setting maximum height to the textarea so that it remains unscrollable
            var adjustHeight = function()  {
                var verticalPadding = parseInt(textareaEl.css('padding-top'))
                    + parseInt(textareaEl.css('padding-bottom'));

                var rowCount = self.options.textareaRows;
                do {
                    setRows(rowCount);
                    rowCount++;
                    var isAreaScrollable = textareaEl[0].scrollHeight > textareaEl.height() + verticalPadding;
                } while(isAreaScrollable && rowCount <= self.options.textareaMaxRows);
            }

            // Setting the initial height
            adjustHeight();

            // Increase the height if neccessary
            textareaEl.bind('input blur', adjustHeight);

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
            var profilePicture = this.createProfilePictureElement(commentJSON.profile_picture_url);

            // Time
            var time = $('<time/>', {
                text: this.options.timeFormatter(commentJSON.created)
            });

            // Name
            var name = $('<div/>', {
                class: 'name',
                text: commentJSON.fullname,
            });

            // Wrapper
            var wrapper = $('<div/>', {
                class: 'wrapper',
            });

            // Content
            var content = $('<div/>', {
                class: 'content',
                text: commentJSON.content,
            });

            // Like
            var like = $('<span/>', {
                class: 'like',
                text: this.options.likeText,
            });

            // Reply
            var reply = this.createReplyElement();
            
            wrapper.append(content);
            wrapper.append(like).append(reply);
            commentEl.append(profilePicture).append(time).append(name).append(wrapper);
            return commentEl;
        },

        createReplyElement: function() {
            var self = this;

            var reply = $('<span/>', {
                class: 'reply',
                text: this.options.replyText,
            }).bind('click', function(ev) {

                // Case: remove exsiting field
                var existingEl = $(ev.currentTarget).parents('li.comment').find('.commenting-field');
                if(existingEl.length) {
                    existingEl.remove();

                // Case: creating a new reply field
                } else {
                    var replyField = self.createCommentingFieldElement();
                    $(ev.currentTarget).after(replyField);

                    var textarea = replyField.find('textarea')
                    textarea.focus();
                }

            });

            return reply;
        },


        // Styling
        // =======

        createCssDeclarations: function() {
            // Navigation underline
            this.createCss('.comments ul.navigation li.active:after {background: '
                + this.options.highlightColor 
                +'}');

            // Send button
            this.createCss('.comments span.send {background: '
                + this.options.highlightColor 
                +'}');

        },

        createCss: function(css) {
            var styleEl = $('<style/>', {
                type: 'text/css',
                text: css,
            });
            $('head').append(styleEl);
        },


        // Utilities
        // =========


    }

    $.fn.comments = function(options) {
        return this.each(function() {
            var comments = Object.create(Comments);
            comments.init(options, this);
            $.data(this, 'comments', comments);
        });
    };

})(jQuery);
