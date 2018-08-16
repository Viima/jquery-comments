describe('Basic features', function() {

    var comments;

    beforeEach(function() {
        var commentsContainer = $('<div/>');

        var saveComment = function(data) {

            // Convert pings to human readable format
            $(data.pings).each(function(index, id) {
                var user = usersArray.filter(function(user){return user.id == id})[0];
                data.content = data.content.replace('@' + id, '@' + user.fullname);
            });

            return data;
        }

        commentsContainer.comments({
            profilePictureURL: 'https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png',
            roundProfilePictures: true,
            enableAttachments: true,
            enableHashtags: true,
            enablePinging: true,
            enableDeletingCommentWithReplies: true,
            textareaRows: 1,
            textareaMaxRows: 4,
            getUsers: function(success, error) {
                success(usersArray);
            },
            getComments: function(success, error) {
                success(commentsArray);
            },
            postComment: function(data, success, error) {
                setTimeout(function() {
                    success(saveComment(data));
                }, 10);
            },
            uploadAttachments: function(data, success, error) {
                setTimeout(function() {
                    success(data);
                }, 10);
            },
            putComment: function(data, success, error) {
                setTimeout(function() {
                    success(saveComment(data));
                }, 10);
            },
            deleteComment: function(data, success, error) {
                setTimeout(function() {
                    success();
                }, 10);
            },
            upvoteComment: function(data, success, error) {
                setTimeout(function() {
                    success(data);
                }, 10);
            }
        });

        // Append element to DOM
        $('body').append(commentsContainer);

        // Save the instance to global scope
        comments = $('.jquery-comments').data().comments;
    });

    it('Should call the required functions upon refresh', function() {
        spyOn(comments, 'render').andCallThrough();
        spyOn(comments, 'fetchDataAndRender').andCallThrough();
        spyOn(comments, 'createCommentModel').andCallThrough();
        spyOn(comments, 'addCommentToDataModel').andCallThrough();
        spyOn(comments, 'sortComments').andCallThrough();

        comments.fetchDataAndRender();

        expect(comments.render.calls.length).toEqual(1);
        expect(comments.fetchDataAndRender.calls.length).toEqual(1);
        expect(comments.createCommentModel.calls.length).toEqual(10);
        expect(comments.addCommentToDataModel.calls.length).toEqual(10);
        expect(comments.sortComments.calls.length).toBeGreaterThan(1);
    });

    it('Should have rendered the comments', function() {
        var commentElements = $('#comment-list li.comment');
        expect(commentElements.length).toEqual(10);
        commentElements.each(function(index, commentEl) {
            checkCommentElementData($(commentEl));
        });
        checkOrder($('ul#comment-list > li.comment'), [3,2,1]);

        // Check reply to -fields
        expect($('#comment-list li.comment[data-id=8] .name .reply-to').text()).toBe('Jack Hemsworth');
        expect($('#comment-list li.comment[data-id=9] .name .reply-to').text()).toBe('You');
        expect($('#comment-list li.comment[data-id=5] .name .reply-to').text()).toBe('Todd Brown');
        expect($('#comment-list li.comment[data-id=10] .name .reply-to').text()).toBe('Bryan Connery');

        // Check that other comments do not have the field
        $('#comment-list li.comment').each(function(index, el) {
            var el = $(el);
            if([8,9,5,10].indexOf(el.data().model.id) == -1) {
                expect(el.find('.name').first().find('.reply-to').length).toBe(0);
            }
        });

        // Check edited timestamps
        var editedDateFromUI = new Date($('#comment-list li.comment[data-id=9] .content .edited').attr('data-original'));
        compareDates(editedDateFromUI, new Date('1/10/2015'));

        // Check that other comments do not have the field
        $('#comment-list li.comment').each(function(index, el) {
            var el = $(el);
            if([9].indexOf(el.data().model.id) == -1) {
                expect(el.find('.content').first().find('.edited').length).toBe(0);
            }
        });
    });

    it('Should have appended the child comments under their outermost parent', function() {
        expect($('#comment-list > li.comment').length).toBe(3);
        checkOrder($('#comment-list li.comment[data-id=1] .child-comments > li.comment'), [6,7,8,9,10]);
        checkOrder($('#comment-list li.comment[data-id=2] .child-comments > li.comment'), []);
        checkOrder($('#comment-list li.comment[data-id=3] .child-comments > li.comment'), [4,5]);
    });

    it('Should sort the main level comments wihtout affecting the order of child comments', function() {
        $('li[data-sort-key="popularity"]').click();
        checkOrder($('#comment-list > li.comment'), [1,3,2]);
        checkOrder($('#comment-list li.comment[data-id=1] .child-comments > li.comment'), [6,7,8,9,10]);

        $('li[data-sort-key="newest"]').click();
        checkOrder($('#comment-list > li.comment'), [3,2,1]);
        checkOrder($('#comment-list li.comment[data-id=1] .child-comments > li.comment'), [6,7,8,9,10]);

        $('li[data-sort-key="oldest"]').click();
        checkOrder($('#comment-list > li.comment'), [1,2,3]);
        checkOrder($('#comment-list li.comment[data-id=1] .child-comments > li.comment'), [6,7,8,9,10]);
    });


    it('Should be able to toggle all replies', function() {
        var toggleAll = $('#comment-list li.comment[data-id=1]').find('.child-comments li.toggle-all');
        expect(toggleAll.length).toBe(1);
        expect(toggleAll.text()).toBe('View all 5 replies');
        expect($('#comment-list li.comment[data-id=1] li.comment:visible').length).toBe(2);

        // Show all replies
        toggleAll.click();
        expect(toggleAll.text()).toBe('Hide replies');
        expect($('#comment-list li.comment[data-id=1] li.comment:visible').length).toBe(5);

        // Hide replies
        toggleAll.click();
        expect(toggleAll.text()).toBe('View all 5 replies');
        expect($('#comment-list li.comment[data-id=1] li.comment:visible').length).toBe(2);
    });

    describe('Commenting', function() {

        var mainCommentingField;
        var mainTextarea;
        var lineHeight;

        beforeEach(function() {
            mainCommentingField = $('.commenting-field.main');
            mainTextarea = mainCommentingField.find('.textarea');
            lineHeight = parseInt(mainTextarea.css('line-height'));
        });

        it('Should adjust the height of commenting field dynamically', function() {

            // Should have 1 row
            expect(mainTextarea.outerHeight()).toBeLessThan(2*lineHeight);

            // Should have 2 rows
            mainTextarea.trigger('click');
            expect(mainTextarea.outerHeight()).toBeGreaterThan(2*lineHeight);
            expect(mainTextarea.outerHeight()).toBeLessThan(3*lineHeight);

            // Should have 2 rows
            mainTextarea.append($('<div>row 1</div>')).trigger('input');
            mainTextarea.append($('<div>row 2</div>')).trigger('input');
            expect(mainTextarea.outerHeight()).toBeGreaterThan(2*lineHeight);
            expect(mainTextarea.outerHeight()).toBeLessThan(3*lineHeight);

            // Should have 3 rows
            mainTextarea.append($('<div>row 3</div>')).trigger('input');
            expect(mainTextarea.outerHeight()).toBeGreaterThan(3*lineHeight);
            expect(mainTextarea.outerHeight()).toBeLessThan(4*lineHeight);

            // Should have 4 rows
            mainTextarea.append($('<div>row 4</div>')).trigger('input');
            expect(mainTextarea.outerHeight()).toBeGreaterThan(4*lineHeight);
            expect(mainTextarea.outerHeight()).toBeLessThan(5*lineHeight);

            // Should have 4 rows as it's the max value
            mainTextarea.append($('<div>row 5</div>')).trigger('input');
            expect(mainTextarea.outerHeight()).toBeGreaterThan(4*lineHeight);
            expect(mainTextarea.outerHeight()).toBeLessThan(5*lineHeight);

            // Should have 3 rows
            mainTextarea.find('div').last().remove();
            mainTextarea.find('div').last().remove();
            mainTextarea.trigger('input');
            expect(mainTextarea.outerHeight()).toBeGreaterThan(3*lineHeight);
            expect(mainTextarea.outerHeight()).toBeLessThan(4*lineHeight);

            // Should have 2 rows
            mainTextarea.find('div').remove();
            mainTextarea.trigger('input');
            expect(mainTextarea.outerHeight()).toBeGreaterThan(2*lineHeight);
            expect(mainTextarea.outerHeight()).toBeLessThan(3*lineHeight);

            // Should have 1 row
            mainCommentingField.find('.close').click();
            expect(mainTextarea.outerHeight()).toBeLessThan(2*lineHeight);
        });

        it('Should enable control row on click', function() {
            var controlRow = mainCommentingField.find('.control-row');;

            // Show on click
            expect(controlRow.is(':visible')).toBe(false);
            mainTextarea.trigger('click');
            expect(controlRow.is(':visible')).toBe(true);

            // Hide when clicking close icon
            mainCommentingField.find('.close').click();
            expect(controlRow.is(':visible')).toBe(false);
        });

        it('Should enable send button when texarea is not empty', function() {
            var sendButton = mainCommentingField.find('.send');

            expect(sendButton.is(':visible')).toBe(false);
            expect(sendButton.hasClass('enabled')).toBe(false);

            // Show on click
            mainTextarea.trigger('click');
            expect(sendButton.is(':visible')).toBe(true);
            expect(sendButton.hasClass('enabled')).toBe(false);

            // Enable when content
            mainTextarea.append($('<div>row 1</div>')).trigger('input');
            expect(sendButton.is(':visible')).toBe(true);
            expect(sendButton.hasClass('enabled')).toBe(true);

            // Disable when no content
            mainTextarea.empty().trigger('input');
            expect(sendButton.is(':visible')).toBe(true);
            expect(sendButton.hasClass('enabled')).toBe(false);

            // Hide when clicking close icon
            mainCommentingField.find('.close').click();
            expect(sendButton.is(':visible')).toBe(false);
            expect(sendButton.hasClass('enabled')).toBe(false);
        });

        it('Should able to add a new main level comment', function() {
            var newCommentText = 'New main level comment\nwith a new line';
            mainTextarea.html(newCommentText).trigger('input');

            var commentCount = comments.getComments().length;
            wait(function() {
                return comments.getComments().length == commentCount + 1;
            });

            mainCommentingField.find('.send').trigger('click');

            run(function() {
                // New comment should always be placed first initially
                var commentEl = $('#comment-list li.comment').first();
                var idOfNewComment = commentEl.data().id;

                expect(commentEl.find('.content').text()).toBe(newCommentText);
                expect(commentEl.hasClass('by-current-user')).toBe(true);
                checkCommentElementData(commentEl);

                // Check that sorting works also with the new comment
                $('li[data-sort-key="popularity"]').click();
                checkOrder($('#comment-list > li.comment'), [1,3,2,idOfNewComment]);
                $('li[data-sort-key="oldest"]').click();
                checkOrder($('#comment-list > li.comment'), [1,2,3,idOfNewComment]);
                $('li[data-sort-key="newest"]').click();
                checkOrder($('#comment-list > li.comment'), [idOfNewComment,3,2,1]);
            });
        });
    });

    describe('Replying', function() {

        var mostPopularComment;

        beforeEach(function() {
            mostPopularComment = $('#comment-list li.comment[data-id=1]');
        });

        it('Should not show the reply field by default', function() {
            var replyField = mostPopularComment.find('.commenting-field');
            expect(replyField.length).toBe(0);
        });

        it('Should be able to reply', function() {
            mostPopularComment.find('.reply').first().click();
            var replyField = mostPopularComment.find('.commenting-field');
            expect(replyField.length).toBe(1);
            expect(replyField.find('.reply-to.tag').length).toBe(0);

            // Check that the field is last child
            var lastChild = mostPopularComment.find('.child-comments').children().last();
            expect(lastChild[0]).toBe(replyField[0]);

            var replyText = 'This is a reply\nwith a new line';
            replyField.find('.textarea').append(replyText).trigger('input');

            var commentCount = comments.getComments().length;
            wait(function() {
                return comments.getComments().length == commentCount + 1;
            });

            replyField.find('.send').trigger('click');

            run(function() {
                // New reply should always be placed last
                var commentEl = mostPopularComment.find('li.comment').last();
                var idOfNewComment = commentEl.data().id;

                expect(commentEl.find('.content').text()).toBe(replyText);
                expect(commentEl.hasClass('by-current-user')).toBe(true);
                checkCommentElementData(commentEl);

                // Check position
                checkOrder(mostPopularComment.find('li.comment'), [6,7,8,9,10,idOfNewComment]);

                var toggleAllText = mostPopularComment.find('li.toggle-all').text();
                expect(toggleAllText).toBe('View all 6 replies');
                expect(mostPopularComment.find('li.comment:visible').length).toBe(2);
            });
        });

        it('Should close the reply field when clicking the close icon', function() {
            mostPopularComment.find('.reply').first().click();
            var replyField = mostPopularComment.find('.commenting-field');
            expect(replyField.length).toBe(1);
            replyField.find('.close').click();

            replyField = mostPopularComment.find('.commenting-field');
            expect(replyField.length).toBe(0);
        });

        it('Should be able to re-reply', function() {
            var childComment = mostPopularComment.find('.child-comments li.comment[data-id=9]');
            childComment.find('.reply').first().click();
            var replyField = mostPopularComment.find('.commenting-field');
            expect(replyField.find('.reply-to.tag').val()).toBe('@Bryan Connery');

            // Check that the field is last child
            var lastChild = mostPopularComment.find('.child-comments').children().last();
            expect(lastChild[0]).toBe(replyField[0]);

            var replyText = 'This is a re-reply\nwith a new line';
            replyField.find('.textarea').append(replyText).trigger('input');

            var commentCount = comments.getComments().length;
            wait(function() {
                return comments.getComments().length == commentCount + 1;
            });

            replyField.find('.send').trigger('click');

            run(function() {
                // New reply should always be placed last
                var commentEl = mostPopularComment.find('li.comment').last();
                var idOfNewComment = commentEl.data().id;

                expect(commentEl.find('.name .reply-to').text().indexOf('Bryan Connery')).not.toBe(-1);
                expect(commentEl.find('.content').text()).toBe(replyText);
                expect(commentEl.hasClass('by-current-user')).toBe(true);
                checkCommentElementData(commentEl);

                var toggleAllText = mostPopularComment.find('li.toggle-all').text();
                expect(toggleAllText).toBe('View all 6 replies');
                expect(mostPopularComment.find('li.comment:visible').length).toBe(2);
            });
        });

        it('Should be able to re-reply to a hidden reply', function() {
            mostPopularComment.find('.toggle-all').click();
            var childComment = mostPopularComment.find('.child-comments li.comment').first();
            childComment.find('.reply').first().click();

            var replyField = mostPopularComment.find('.commenting-field');
            expect(replyField.find('.reply-to.tag').val()).toBe('@Jack Hemsworth');

            var replyText = 'This is a re-reply\nwith a new line';
            replyField.find('.textarea').append(replyText).trigger('input');

            var commentCount = comments.getComments().length;
            wait(function() {
                return comments.getComments().length == commentCount + 1;
            });

            replyField.find('.send').trigger('click');

            run(function() {
                // New reply should always be placed last
                var commentEl = mostPopularComment.find('li.comment').last();
                var idOfNewComment = commentEl.data().id;

                expect(commentEl.find('.name .reply-to').text().indexOf('Jack Hemsworth')).not.toBe(-1);
                expect(commentEl.find('.content').text()).toBe(replyText);
                expect(commentEl.hasClass('by-current-user')).toBe(true);
                checkCommentElementData(commentEl);

                var toggleAllText = mostPopularComment.find('li.toggle-all').text();
                expect(toggleAllText).toBe('Hide replies');
                expect(mostPopularComment.find('li.comment:visible').length).toBe(6);
            });
        });

        it('Should reply to original user when erasing the reply-to tag', function() {
            var childComment = mostPopularComment.find('.child-comments li.comment').last();
            childComment.find('.reply').first().click();
            var replyField = mostPopularComment.find('.commenting-field');
            var textarea = replyField.find('.textarea');
            expect(parseInt(textarea.attr('data-parent'))).toBe(childComment.data().model.id);

            textarea.empty().trigger('input');
            expect(parseInt(textarea.attr('data-parent'))).toBe(1);

            var replyText = 'This is a re-reply to original user';
            replyField.find('.textarea').append(replyText).trigger('input');

            var commentCount = comments.getComments().length;
            wait(function() {
                return comments.getComments().length == commentCount + 1;
            });

            replyField.find('.send').trigger('click');

            run(function() {
                var commentEl = mostPopularComment.find('li.comment').last();
                expect(commentEl.find('.name .reply-to').length).toBe(0);
            });
        });
    });

    describe('Editing', function() {
        var ownComment;
        var editButton;

        beforeEach(function() {
            ownComment = $('#comment-list li.comment[data-id=3]');
            editButton = ownComment.find('.edit');
        });

        it('Should show the edit button only for own comments', function() {
            expect(editButton.length).toBe(1);
            expect($('.edit').length).toBe(3);
        });

        it('Should be able to open and close the edit field', function() {
            var cloneOfOwnComment = ownComment.clone();

            editButton.click();
            expect(ownComment.hasClass('edit')).toBe(true);

            // Check that the edit field exists
            var editField = ownComment.find('.commenting-field');
            var textarea = editField.find('.textarea');
            expect(editField.is(':visible')).toBe(true);

            // Check that other content is hidden
            ownComment.find('> .comment-wrapper > *:not(.commenting-field)').each(function(index, el) {
                expect($(el).is(':visible')).toBe(false);
            });

            // Check the content
            var contentFromModel = ownComment.data().model.content;
            var contentFromUI = comments.getTextareaContent(textarea, true);
            expect(contentFromModel).toBe(contentFromUI);

            // Closing the field
            editField.find('.close').click();
            expect(ownComment.hasClass('edit')).toBe(false);
            expect(editField.is(':visible')).toBe(false);

            // Check that other content is visible
            ownComment.find('> .comment-wrapper > *:not(.commenting-field)').each(function(index, el) {
                expect($(el).is(':visible')).toBe(true);
            });

            // Check that the comment has not changed
            expect(ownComment[0].outerHTML).toBe(cloneOfOwnComment[0].outerHTML);
        });

        it('Should be able to edit a main level comment', function() {
            testEditingComment(ownComment.data().model.id);
        });

        it('Should be able to edit a reply', function() {
            ownComment.find('.reply').last().click();
            var replyText = 'This is a re-reply';

            var replyField = ownComment.find('.commenting-field');
            replyField.find('.textarea').append(replyText).trigger('input');

            // Create reply
            var commentCount = comments.getComments().length;
            wait(function() {
                return comments.getComments().length == commentCount + 1;
            });

            replyField.find('.send').trigger('click');

            // Test editing the reply
            run(function() {
                var reply = ownComment.find('.child-comments').children().last();
                var replyId = reply.data().model.id;
                testEditingComment(replyId);
            });

            // Test changing the parent of the reply
            run(function() {
                var reply = ownComment.find('.child-comments').children().last();
                var replyId = reply.data().model.id;

                reply.find('.edit').click();
                replyField = reply.find('.commenting-field');
                var textarea = replyField.find('.textarea');
                var saveButton = replyField.find('.save');

                // Save button should be disabled
                textarea.trigger('input');
                expect(saveButton.hasClass('enabled')).toBe(false);

                // Save button should be enabled
                textarea.find('.reply-to.tag').remove();
                textarea.trigger('input');
                expect(saveButton.hasClass('enabled')).toBe(true);

                var replyModelBefore = $.extend({},comments.commentsById[replyId]);
                expect(replyModelBefore.parent).toBe('5');

                wait(function() {
                    return comments.commentsById[replyId].parent != '5';
                });

                // Save the model
                saveButton.click();

                run(function() {
                    expect(comments.commentsById[replyId].parent).toBe('3');
                });
            });
        });

        it('Should not let the user save the comment if it hasn\'t changed', function() {
            editButton.click();
            var editField = ownComment.find('.commenting-field');
            var saveButton = editField.find('.save');
            expect(saveButton.is(':visible')).toBe(true);
            expect(saveButton.hasClass('enabled')).toBe(false);

            var textarea = editField.find('.textarea');
            var originalHTML = textarea.html();

            // Append space
            textarea.append(' ').trigger('input');
            expect(saveButton.hasClass('enabled')).toBe(true);

            // Revert changes
            textarea.html(originalHTML).trigger('input');
            expect(saveButton.hasClass('enabled')).toBe(false);
        });
    });

    describe('Deleting', function() {

        it('Should show the delete button for own comments', function() {
            var ownComment = $('#comment-list li.comment[data-id=3]');
            var editButton = ownComment.find('.edit');

            editButton.click();

            var deleteButton = ownComment.find('.delete');
            expect(deleteButton.length).toBe(1);
            expect(deleteButton.hasClass('enabled')).toBe(true);
        });

        it('Should be able to delete a main level comment', function() {
            var commentId = 3;
            var ownComment = $('#comment-list li.comment[data-id="'+commentId+'"]');

            var childComments = comments.commentsById[commentId].childs.slice();
            expect(childComments.length).toBe(2);
            var commentCountBeforeDelete = comments.getComments().length;

            var editButton = ownComment.find('.edit');
            editButton.click();

            wait(function() {
                return comments.getComments().length < commentCountBeforeDelete;
            });

            var deleteButton = ownComment.find('.delete');
            deleteButton.click();

            run(function() {
                expect(comments.getComments().length).toBe(commentCountBeforeDelete - 3);

                // Expect childs to be deleted
                $(childComments).each(function(index, id) {
                    expect(comments.commentsById[id]).toBe(undefined);
                    expect($('#comment-list li.comment[data-id="'+id+'"]').length).toBe(0);
                });

                // Except the main comment to be deleted
                expect(comments.commentsById[commentId]).toBe(undefined);
                expect($('#comment-list li.comment[data-id="'+commentId+'"]').length).toBe(0);
            });
        });

        it('Should be able to delete a reply', function() {
            var commentId = 10;
            var ownComment = $('#comment-list li.comment[data-id="'+commentId+'"]');
            var commentCountBeforeDelete = comments.getComments().length;
            var outermostParent = ownComment.parents('li.comment').last();
            var toggleAllButton = outermostParent.find('.toggle-all');

            // Check the child count
            expect(toggleAllButton.text()).toBe('View all 5 replies');
            expect(comments.commentsById[outermostParent.attr('data-id')].childs.length).toBe(5);

            var editButton = ownComment.find('.edit');
            editButton.click();

            wait(function() {
                return comments.getComments().length < commentCountBeforeDelete;
            });

            var deleteButton = ownComment.find('.delete');
            deleteButton.click();

            run(function() {
                expect(comments.getComments().length).toBe(commentCountBeforeDelete - 1);

                // Except the main comment to be deleted
                expect(comments.commentsById[commentId]).toBe(undefined);
                expect($('#comment-list li.comment[data-id="'+commentId+'"]').length).toBe(0);

                // Check the child count
                expect(toggleAllButton.text()).toBe('View all 4 replies');
                expect(comments.commentsById[outermostParent.attr('data-id')].childs.length).toBe(4);
            });
        });

        it('Should be able to delete a reply that has re-replies', function() {
            var commentId = 8;
            var reReplies = [9, 10];
            var ownComment = $('#comment-list li.comment[data-id="'+commentId+'"]');
            var commentCountBeforeDelete = comments.getComments().length;
            var outermostParent = ownComment.parents('li.comment').last();
            var toggleAllButton = outermostParent.find('.toggle-all');

            // Check the child count
            expect(toggleAllButton.text()).toBe('View all 5 replies');
            expect(comments.commentsById[outermostParent.attr('data-id')].childs.length).toBe(5);

            var editButton = ownComment.find('.edit');
            editButton.click();

            wait(function() {
                return comments.getComments().length < commentCountBeforeDelete;
            });

            var deleteButton = ownComment.find('.delete');
            deleteButton.click();

            run(function() {
                expect(comments.getComments().length).toBe(commentCountBeforeDelete - 3);

                // Expect re-replies to be deleted
                $(reReplies).each(function(index, id) {
                    expect(comments.commentsById[id]).toBe(undefined);
                    expect($('#comment-list li.comment[data-id="'+id+'"]').length).toBe(0);
                });

                // Except the main comment to be deleted
                expect(comments.commentsById[commentId]).toBe(undefined);
                expect($('#comment-list li.comment[data-id="'+commentId+'"]').length).toBe(0);

                // Check the child count
                expect(outermostParent.find('.toggle-all').length).toBe(0);
                expect(comments.commentsById[outermostParent.attr('data-id')].childs.length).toBe(2);
            });
        });
    });

    describe('Upvoting', function() {

        it('Should be able to upvote a comment', function() {
            var commentId = 1;
            var commentEl = $('#comment-list li.comment[data-id="'+commentId+'"]');
            var commentModel = comments.commentsById[commentId];

            // Check the status before upvoting
            var upvoteEl = commentEl.find('.upvote').first();
            expect(commentModel.userHasUpvoted).toBe(false);
            expect(upvoteEl.hasClass('highlight-font')).toBe(false);

            expect(commentModel.upvoteCount).toBe(3);
            expect(upvoteEl.find('.upvote-count').text()).toBe('3');

            upvoteEl.click();

            // Check status after upvoting
            upvoteEl = commentEl.find('.upvote').first();
            expect(commentModel.userHasUpvoted).toBe(true);
            expect(upvoteEl.hasClass('highlight-font')).toBe(true);

            expect(commentModel.upvoteCount).toBe(4);
            expect(upvoteEl.find('.upvote-count').text()).toBe('4');
        });

        it('Should be able to revoke an upvote', function() {
            var commentId = 3;
            var commentEl = $('#comment-list li.comment[data-id="'+commentId+'"]');
            var commentModel = comments.commentsById[commentId];

            // Check the status before upvoting
            var upvoteEl = commentEl.find('.upvote').first();
            expect(commentModel.userHasUpvoted).toBe(true);
            expect(upvoteEl.hasClass('highlight-font')).toBe(true);

            expect(commentModel.upvoteCount).toBe(2);
            expect(upvoteEl.find('.upvote-count').text()).toBe('2');

            upvoteEl.click();

            // Check status after upvoting
            upvoteEl = commentEl.find('.upvote').first();
            expect(commentModel.userHasUpvoted).toBe(false);
            expect(upvoteEl.hasClass('highlight-font')).toBe(false);

            expect(commentModel.upvoteCount).toBe(1);
            expect(upvoteEl.find('.upvote-count').text()).toBe('1');
        });
    });

describe('Uploading attachments', function() {

    var mainCommentingField;
    var mainTextarea;
    var lineHeight;

    beforeEach(function() {
        mainCommentingField = $('.commenting-field.main');
        mainTextarea = mainCommentingField.find('.textarea');
    });

    it('Should able to upload a new main level attachment', function() {
        var fileName = 'test.txt';
        var file = new File([], 'test.txt');
        comments.uploadAttachments([file]);

        var commentCount = comments.getComments().length;
        var attachmentCount = comments.getAttachments().length;
        wait(function() {
            var commentCountUpdated = comments.getComments().length == commentCount + 1;
            var attachmentCountUpdated = comments.getAttachments().length == attachmentCount + 1;
            return commentCountUpdated && attachmentCountUpdated;
        });

        run(function() {
            // New comment should always be placed first initially
            var commentEl = $('#comment-list li.comment').first();
            var idOfNewComment = commentEl.data().id;

            expect(commentEl.find('.content').text()).toBe(fileName);
            expect(commentEl.hasClass('by-current-user')).toBe(true);
            checkCommentElementData(commentEl);

            // Check that there are one regular comment element and one attachment element
            expect($('li.comment[data-id="'+idOfNewComment+'"]').length).toBe(2);

            // Check that sorting works also with the new comment
            $('li[data-sort-key="popularity"]').click();
            checkOrder($('#comment-list > li.comment'), [1,3,2,idOfNewComment]);
            $('li[data-sort-key="oldest"]').click();
            checkOrder($('#comment-list > li.comment'), [1,2,3,idOfNewComment]);
            $('li[data-sort-key="newest"]').click();
            checkOrder($('#comment-list > li.comment'), [idOfNewComment,3,2,1]);
        });
    });

    it('Should be able to upload an attachment as a reply', function() {
        var mostPopularComment = $('#comment-list li.comment[data-id=1]');
        mostPopularComment.find('.reply').first().click();
        var replyField = mostPopularComment.find('.commenting-field');
        expect(replyField.length).toBe(1);

        var fileName = 'test.txt';
        var file = new File([], 'test.txt');
        comments.uploadAttachments([file], replyField);

        var commentCount = comments.getComments().length;
        var attachmentCount = comments.getAttachments().length;
        wait(function() {
            var commentCountUpdated = comments.getComments().length == commentCount + 1;
            var attachmentCountUpdated = comments.getAttachments().length == attachmentCount + 1;
            return commentCountUpdated && attachmentCountUpdated;
        });

        run(function() {
            // New reply should always be placed last
            var commentEl = mostPopularComment.find('li.comment').last();
            var idOfNewComment = commentEl.data().id;

            expect(commentEl.find('.content').text()).toBe(fileName);
            expect(commentEl.hasClass('by-current-user')).toBe(true);
            checkCommentElementData(commentEl);

            // Check position
            checkOrder(mostPopularComment.find('li.comment'), [6,7,8,9,10,idOfNewComment]);

            var toggleAllText = mostPopularComment.find('li.toggle-all').text();
            expect(toggleAllText).toBe('View all 6 replies');
            expect(mostPopularComment.find('li.comment:visible').length).toBe(2);
        });
    });
});

    afterEach(function() {
        $('.jquery-comments').remove();
    });


    // Helpers
    // =======

    function wait(callback) {
        $('.jquery-comments').hide();
        waitsFor(callback);
    }

    function run(callback) {
        runs(function() {
            $('.jquery-comments').show();
            callback();
        });
    }

    function checkCommentElementData(commentEl) {
        var nameContainer = commentEl.find('.name').first();
        var nameContainerStripped = nameContainer.clone();
        nameContainerStripped.children().remove();

        // Fields to be tested
        var profilePicture = commentEl.find('img.profile-picture').first().attr('src');
        var replyTo = nameContainer.find('.reply-to').text();
        var fullname = nameContainerStripped.text();

        // Model that we are testing against
        var commentModel = commentEl.data().model;

        // Check basic fields
        expect(profilePicture).toBe(commentModel.profilePictureURL);
        expect(fullname).toBe(commentModel.fullname);

        // Check content
        if(commentModel.fileURL) {
            var link = commentEl.find('a');
            expect(link.attr('href')).toBe(commentModel.fileURL);
        } else {
            var content = getTextContentFromCommentElement(commentEl);
            expect(content).toBe(commentModel.content);
        }

        // Check time
        var dateUI = new Date(commentEl.find('time').first().attr('data-original'));
        var modelCreatedDate = new Date(commentModel.created);
        compareDates(dateUI, modelCreatedDate);
    }

    function getTextContentFromCommentElement(commentEl)  {
        var content = commentEl.find('.content').first().clone();

        // Remove edited timestamp
        content.children('time').remove().end();

        // Replace inputs with respective values
        content.find('.tag').replaceWith(function() {
            return $(this).val();
        });
        return content.text();
    }

    function compareDates(dateA, dateB) {
        expect(dateA.getDate()).toBe(dateB.getDate());
        expect(dateA.getMonth()).toBe(dateB.getMonth());
        expect(dateA.getFullYear()).toBe(dateB.getFullYear());
    }

    function getOrder(elements) {
        return elements.map(function(index, commentEl){return $(commentEl).data().id}).toArray();
    }

    function checkOrder(elements, expectedOrder) {
        var order = getOrder(elements);
        expect(JSON.stringify(order)).toBe(JSON.stringify(expectedOrder));
    }

    function testEditingComment(id) {
        var ownComment = $('#comment-list li.comment[data-id='+id+']');
        var editButton = ownComment.find('.edit').first();

        var ownCommentBefore = ownComment.clone();
        var ownCommentModelBefore = $.extend({},comments.commentsById[id]);

        editButton.click();
        var editField = ownComment.find('.commenting-field');
        var textarea = editField.find('.textarea');

        // Edit the comment
        var modifiedContent = '<br>appended content with new line';
        textarea.append(modifiedContent).trigger('input');

        // Save the comment
        var originalContent = comments.commentsById[id].content;
        wait(function() {
            return comments.commentsById[id].content != originalContent;
        });

        editField.find('.save').click();

        run(function() {
            expect(editField.is(':visible')).toBe(false);

            // Check the edited comment
            ownComment = $('#comment-list li.comment[data-id='+id+']');
            checkCommentElementData(ownComment);
            expect(ownComment.find('.content .edited').text().length).not.toBe(0);

            // Check that only fields content and modified have changed in comment model
            var ownCommentModel = comments.commentsById[id];
            $(Object.keys(ownCommentModel)).each(function(index, key) {
                if(key == 'content' || key == 'modified') {
                    expect(ownCommentModel[key]).not.toBe(ownCommentModelBefore[key]);
                } else if(key == 'pings') {
                    expect(JSON.stringify(ownCommentModel[key])).toBe(JSON.stringify(ownCommentModelBefore[key]));
                } else {
                    expect(ownCommentModel[key]).toBe(ownCommentModelBefore[key]);
                }
            });

            // Check that only content has changed in comment element
            ownComment = ownComment.clone();
            ownComment.find('.content').remove();
            ownCommentBefore.find('.content').remove();
            expect(ownComment[0].outerHTML).toBe(ownCommentBefore[0].outerHTML);
        });
    }

});
