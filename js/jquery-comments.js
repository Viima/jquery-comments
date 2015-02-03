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
            textareaRowsOnFocus: 2,
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

        postComment: function(content) {
            console.log(content)
            this.options.postComment();
        },

        editComment: function() {
        },


        // HTML elements
        // =============

        createHTML: function() {
            var self = this;

            // Commenting field
            var mainCommentingField = this.createCommentingFieldElement();
            this.$el.append(mainCommentingField);

            // Adjust the height of the main commenting field when clicking elsewhere
            var mainTextarea = mainCommentingField.find('textarea');
            var mainControlRow = mainCommentingField.find('.control-row');
            this.$el.bind('click', function(ev) {
                if(ev.target != mainTextarea[0]) {
                    self.adjustTextareaHeight(mainTextarea, false);
                    mainControlRow.hide();
                }
            });
            mainControlRow.hide();
            mainTextarea.bind('focus', function() {
                mainControlRow.show();
            });

            // Navigation bar
            this.$el.append(this.createNavigationElement());

            // Comment list
            var commentList = $('<ul/>', {
                class: 'comment-list'
            });
            this.$el.append(commentList);
        },

        createProfilePictureElement: function(src) {
            var profilePicture = $('<img/>', {
                src: src,
                class: 'profile-picture' + (this.options.roundProfilePictures ? ' round' : '')
            });
            return profilePicture;
        },

        createCommentingFieldElement: function() {
            var self = this;

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
        
            // Control row
            var controlRow = $('<div/>', {
                class: 'control-row',
            });

            // Textarea
            var textarea = this.createTextareaElement();

            // Send -button
            var sendButton = $('<span/>', {
                class: 'send highlight-background',
                text: this.options.sendText,
            }).bind('click', function(ev) {
                if(sendButton.hasClass('enabled')) {
                    self.postComment(textarea.val());
                    textarea.val('');
                }
            });
            //TODO: hide commenting after succesfull reply

            // Enable and disable send button when necessary
            textarea.bind('input', function() {
                if(textarea.val().length) {
                    sendButton.addClass('enabled');
                } else {
                    sendButton.removeClass('enabled');
                }
            });

            controlRow.append(sendButton);
            textareaWrapper.append(textarea).append(controlRow);
            commentingField.append(profilePicture).append(textareaWrapper);
            return commentingField;
        },

        createTextareaElement: function() {
            var self = this;

            // Due to bug with Firefox the placeholder need to be embedded like this
            var textarea = $('<textarea placeholder="'+this.options.textareaPlaceholder+'"/>');

            // Adjust the height dynamically
            textarea.bind('focus input', function() {
                self.adjustTextareaHeight(textarea, true);
            });

            // Setting the initial height
            self.adjustTextareaHeight(textarea, false);

            return textarea;
        },

        adjustTextareaHeight: function(textarea, focus) {
            var textareaBaseHeight = 2.2;
            var lineHeight = 1.4;

            var setRows = function(rows) {
                var height = textareaBaseHeight + (rows - 1) * lineHeight;
                textarea.css('height', height + 'em');
            }

            var textarea = $(textarea);
            var rowCount = focus == true ? this.options.textareaRowsOnFocus : this.options.textareaRows;
            do {
                setRows(rowCount);
                rowCount++;
                var isAreaScrollable = textarea[0].scrollHeight > textarea.outerHeight();
            } while(isAreaScrollable && rowCount <= this.options.textareaMaxRows);
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
                var existingEl = reply.parents('li.comment').find('.commenting-field');
                if(existingEl.length) {
                    if(existingEl.is(':visible')) {
                        existingEl.hide();
                    } else {
                        existingEl.show();
                        existingEl.find('textarea').focus();
                    }
                    reply.toggleClass('highlight-font');

                // Case: creating a new reply field
                } else {
                    var replyField = self.createCommentingFieldElement();
                    reply.after(replyField);

                    var textarea = replyField.find('textarea')
                    textarea.focus();
                    reply.addClass('highlight-font');
                }

            });

            return reply;
        },


        // Styling
        // =======

        createCssDeclarations: function() {

            // Navigation underline
            this.createCss('.comments ul.navigation li.active:after {background: '
                + this.options.highlightColor  + ' !important;',
                +'}');

            // Background highlight
            this.createCss('.comments .highlight-background {background: '
                + this.options.highlightColor  + ' !important;',
                +'}');

            // Font highlight
            this.createCss('.comments .highlight-font {color: '
                + this.options.highlightColor + ' !important;'
                + 'font-weight: bold;'
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
