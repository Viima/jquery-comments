(function($) {

    var Comments = {

        $el: null,
        commentArray: [],
        commentTree: {},
        currentSortKey: '',

        options: {
            profilePictureURL: '',
            textareaPlaceholder: 'Leave a message',
            newestText: 'Newest',
            popularText: 'Popular',
            sendText: 'Send',
            likeText: 'Like',
            replyText: 'Reply',
            youText: 'You',

            viewAllRepliesText: 'View all replies',
            hideRepliesText: 'Hide replies',

            highlightColor: '#1B7FCC',
            roundProfilePictures: false,
            textareaRows: 2,
            textareaRowsOnFocus: 2,
            textareaMaxRows: 5,
            maxRepliesVisible: 2,

            getComments: function() {},
            postComment: function() {},
            timeFormatter: function(time) {
                return new Date(time).toLocaleDateString('fi-FI');;
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

            // Create CSS declarations for highlight color
            this.createCssDeclarations();

            this.refresh();
            this.render();
        },

        refresh: function () {
            // Get comments
            this.commentArray = this.options.getComments();

            // Sort comments by date (oldest first so that they can be appended to DOM
            // without caring dependencies)
            this.sortComments(this.commentArray, 'oldest');

            var self = this;
            $(this.commentArray).each(function(index, commentJSON) {
                self.commentTree[commentJSON.id] = {
                    model: commentJSON,
                    childs: []
                };

                // Update child array of the parent (append childs to the array of outer most parent)
                if(commentJSON.parent != null) {
                    var parentId = commentJSON.parent;
                    do {
                        var parentComment = self.commentTree[parentId];
                        var parentId = parentComment.model.parent;
                    } while(parentComment.model.parent != null)
                    parentComment.childs.push(commentJSON.id);

                }
            });
        },

        render: function() {
            var self = this;

            this.$el.empty();
            this.createHTML();

            // Divide commments into main level comments and replies
            var mainLevelComments = [];
            var replies = [];
            $(this.commentArray).each(function(index, commentJSON) {
                if(commentJSON.parent == null) {
                    mainLevelComments.push(commentJSON);
                } else {
                    replies.push(commentJSON);
                }
            });

            // Sort the main level comments based on active tab
            this.currentSortKey = this.$el.find('.navigation li.active').data().sortKey;
            this.sortComments(mainLevelComments, this.currentSortKey);

            // Append main level comments
            $(mainLevelComments).each(function(index, commentJSON) {
                var commentEl = self.createCommentElement(commentJSON);
                self.$el.find('#comment-list').append(commentEl);
            });

            // Append replies
            $(replies).each(function(index, commentJSON) {
                var commentEl = self.createCommentElement(commentJSON);
                var directParentEl = self.$el.find('.comment[data-id="'+commentJSON.parent+'"]');

                // Force replies into one level only
                var outerMostParent = directParentEl.parents('.comment');
                if(outerMostParent.length == 0) {
                    var childCommentsEl = directParentEl.find('.child-comments');
                } else {
                    var childCommentsEl = outerMostParent.find('.child-comments');
                }

                // Append element to DOM
                childCommentsEl.append(commentEl);

                // Show only limited amount of replies
                var hiddenReplies = childCommentsEl.children('.comment').slice(0, -self.options.maxRepliesVisible)
                hiddenReplies.addClass('hidden-reply');


                // Append button to toggle all replies if necessary
                if(hiddenReplies.length && !childCommentsEl.find('li.toggle-all').length) {
                    var toggleAllContainer = $('<li/>', {
                        class: 'toggle-all highlight-font',
                    });
                    var toggleAllButton = $('<span/>', {
                        text: self.options.viewAllRepliesText,
                    });
                    var caret = $('<span/>', {
                        class: 'caret highlight-border',
                    });

                    toggleAllContainer.bind('click', function(){
                        // Toggle text in toggle button
                        if(toggleAllButton.text() == self.options.hideRepliesText) {
                            toggleAllButton.text(self.options.viewAllRepliesText);
                        } else {
                            toggleAllButton.text(self.options.hideRepliesText);
                        }
                        // Toggle direction of the caret
                        caret.toggleClass('up');

                        // Toggle replies
                        childCommentsEl.find('.hidden-reply').toggle();
                    });

                    // Append toggle button to DOM
                    toggleAllContainer.append(toggleAllButton).append(caret)
                    childCommentsEl.prepend(toggleAllContainer);
                }
            });

        },

        sortComments: function (comments, sortKey) {
            var self = this;

            // Sort by popularity
            if(sortKey == 'popularity') {
                comments.sort(function(commentA, commentB) {
                    var childsOfA = self.commentTree[commentA.id].childs.length;
                    var childsOfB = self.commentTree[commentB.id].childs.length;
                    return childsOfB - childsOfA;
                });

            // Sort by date
            } else {
                comments.sort(function(commentA, commentB) {
                    var createdA = new Date(commentA.created).getTime();
                    var createdB = new Date(commentB.created).getTime();
                    if(sortKey == 'newest') {
                        return createdB - createdA;
                    } else {
                        return createdA - createdB;
                    }
                });
            }
        },

        sortAndReArrangeComments: function(sortKey) {
            if(sortKey != this.currentSortKey) {
                var commentList = this.$el.find('#comment-list');
                var mainLevelComments = [];

                var self = this;
                commentList.find('> li.comment').each(function(index, el) {
                    var commentId = $(el).data().id;
                    mainLevelComments.push(self.commentTree[commentId].model);
                });
                this.sortComments(mainLevelComments, sortKey);

                // Rearrange the main level comments
                $(mainLevelComments).each(function(index, commentJSON) {
                    var commentEl = commentList.find('> li.comment[data-id='+commentJSON.id+']');
                    commentList.append(commentEl);
                });
            }
        },

        postComment: function(commentJSON) {
            var success = function() {};
            var error = function() {};

            commentJSON.fullname = this.options.youText;
            commentJSON.profile_picture_url = this.options.profilePictureURL;
            
            this.createCommentElement(commentJSON);

            this.options.postComment(commentJSON, success, error);
        },

        editComment: function() {
        },

        createCommentJSON: function(content, parent) {
            var comment = {
                content: content,
                parent: parent,
            }
            return comment;
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
                id: 'comment-list'
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
                    var parent = null;
                    var data = sendButton.parents('.comment').data();
                    if(data && data.id) parent = data.id;

                    var commentJSON = self.createCommentJSON(textarea.val(), parent);
                    self.postComment(commentJSON);
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

            // Popular
            var popular = $('<li/>', {
                text: this.options.popularText,
                class: 'active',
                'data-sort-key': 'popularity',
            });
            
            // Newest
            var newest = $('<li/>', {
                text: this.options.newestText,
                 'data-sort-key': 'newest',
            });

            navigationEl.append(popular).append(newest);;

            // Bind click to sorting
            var self = this;
            navigationEl.find('li').bind('click', function(ev) {
                var el = $(ev.currentTarget);

                // Indicate active sort
                navigationEl.find('li').removeClass('active');
                el.addClass('active');

                // Sort the comments
                var sortKey = el.data().sortKey;
                self.sortAndReArrangeComments(sortKey);

                // Save the current sort key
                self.currentSortKey = sortKey;
            });
            return navigationEl;
        },

        createCommentElement: function(commentJSON) {

            // Comment container element
            var commentEl = $('<li/>', {
                'data-id': commentJSON.id,
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

            if(commentJSON.parent) {
                var replyToName = this.commentArray.filter(function(comment){
                    return comment.id == commentJSON.parent
                })[0].fullname;

                var replyTo = $('<span/>', {
                    class: 'reply-to',
                    text: ' @' + replyToName,
                });
                name.append(replyTo);
            }

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

            // Child comments
            var childComments = $('<ul/>', {
                class: 'child-comments'
            });
            
            wrapper.append(content);
            wrapper.append(like).append(reply)
            if(commentJSON.parent == null) wrapper.append(childComments);
            commentEl.append(profilePicture).append(time).append(name).append(wrapper);
            return commentEl;
        },

        createReplyElement: function() {
            var self = this;

            var reply = $('<span/>', {
                class: 'reply',
                text: this.options.replyText,
            }).bind('click', function(ev) {

                var toggleReplyField = function() {
                    if(replyField.is(':visible')) {
                        replyField.hide();
                    } else {
                        replyField.show();
                        replyField.find('textarea').focus();
                    }
                    reply.toggleClass('highlight-font');
                }

                // Case: remove exsiting field
                var replyField = reply.siblings('.commenting-field');
                if(replyField.length) {
                    toggleReplyField();

                // Case: creating a new reply field
                } else {
                    var replyField = self.createCommentingFieldElement();
                    reply.after(replyField);

                    // Hide the field on send
                    replyField.find('.send').bind('click', toggleReplyField);

                    replyField.find('textarea').focus();
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

            // Font highlight
            this.createCss('.comments .highlight-border {border-color: '
                + this.options.highlightColor + ';'
                +'}');
        },

        createCss: function(css) {
            var styleEl = $('<style/>', {
                type: 'text/css',
                text: css,
            });
            $('head').append(styleEl);
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
