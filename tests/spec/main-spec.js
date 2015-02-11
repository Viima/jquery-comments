describe('Initialization', function() {

    var comments;

    beforeEach(function() {
        var commentsContainer = $('<div/>');

        commentsContainer.comments({
            profilePictureURL: 'https://app.viima.com/static/media/user_profiles/user-icon.png',
            roundProfilePictures: true,
            textareaRows: 1,
            getComments: function() {
                return commentsArray;
            },
            postComment: function(commentJSON, successCallback, errorCallback) {
              setTimeout(function() {
                successCallback();
              }, 100);
            }
        });

        // Append element to DOM
        $('body').append(commentsContainer);
        
        // Save the instance to global scope
        comments = $('.jquery-comments').data().comments;
    });

    it('Should call the required functions upon refresh', function() {
        spyOn(comments, 'render').and.callThrough();
        spyOn(comments, 'updateData').and.callThrough();
        spyOn(comments, 'createCommentModel').and.callThrough();
        spyOn(comments, 'addCommentToDataModel').and.callThrough();
        spyOn(comments, 'sortComments').and.callThrough();

        comments.refresh();

        expect(comments.render.calls.count()).toEqual(1);
        expect(comments.updateData.calls.count()).toEqual(1);
        expect(comments.createCommentModel.calls.count()).toEqual(commentsArray.length);
        expect(comments.addCommentToDataModel.calls.count()).toEqual(commentsArray.length);
        expect(comments.sortComments.calls.count()).toBeGreaterThan(1);
    });

    it('Should have rendered the comments', function() {
        var commentElements = $('li.comment');
        expect(commentElements.length).toEqual(commentsArray.length);
        commentElements.each(function(index, commentEl) {
            checkCommentElementData($(commentEl));
        });

    });

    it('Should sort the main level comments wihtout affecting the order of child comments', function() {
        comments.sortAndReArrangeComments('popularity');
        checkOrder($('#comment-list > li.comment'), [1,3,2]);
        checkOrder($('li.comment[data-id=1] .child-comments li.comment'), [6,7,8,9]);

        comments.sortAndReArrangeComments('newest');
        checkOrder($('#comment-list > li.comment'), [3,2,1]);
        checkOrder($('li.comment[data-id=1] .child-comments li.comment'), [6,7,8,9]);

        comments.sortAndReArrangeComments('oldets');
        checkOrder($('#comment-list > li.comment'), [1,2,3]);
        checkOrder($('li.comment[data-id=1] .child-comments li.comment'), [6,7,8,9]);
    });

    afterEach(function() {
        $('.jquery-comments').remove();
    });


    // Helpers
    // =======

    function checkCommentElementData(commentEl) {
        var nameContainer = commentEl.find('.name').first();

        // Fields to be tested
        var profilePicture = commentEl.find('img.profile-picture').first().attr('src');
        var replyTo = nameContainer.find('.reply-to').text();
        var fullname = replyTo.length ? nameContainer.text().split(replyTo)[0] : nameContainer.text();
        var content = commentEl.find('.content').first().text();
        var dateUI = new Date(commentEl.find('time').first().text());

        // Model that we are testing against
        var commentModel = commentEl.data().model;

        // Check basic fields
        expect(profilePicture).toBe(commentModel.profile_picture_url);
        expect(fullname).toBe(commentModel.fullname);
        expect(content).toBe(commentModel.content);

        // Check reply to -field
        if(commentModel.parent) {
            var parent = comments.commentsById[commentModel.parent];
            if(parent.parent) {
                expect(replyTo.indexOf(parent.fullname)).not.toBe(-1);
            } else {
                expect(replyTo.length).toBe(0);
            }
        } else {
            expect(replyTo.length).toBe(0);
        }

        // Check position in DOM
        if(commentModel.parent) {
            expect(commentEl.parents('.child-comments').length).toBe(1);
        } else {
            expect(commentEl.parents('.child-comments').length).toBe(0);
        }

        // Check time
        var modelCreatedDate = new Date(commentModel.created);
        expect(dateUI.getDate()).toBe(modelCreatedDate.getDate());
        expect(dateUI.getMonth()).toBe(modelCreatedDate.getMonth());
        expect(dateUI.getFullYear()).toBe(modelCreatedDate.getFullYear());
    }

    function getOrder(elements) {
        return elements.map(function(index, commentEl){return $(commentEl).data().id}).toArray();
    }

    function checkOrder(elements, expectedOrder) {
        var order = getOrder(elements);
        expect(JSON.stringify(order)).toBe(JSON.stringify(expectedOrder));
    }

});