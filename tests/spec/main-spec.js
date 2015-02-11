describe('Basic features', function() {

    var comments;

    beforeEach(function() {
        var commentsContainer = $('<div/>');

        commentsContainer.comments({
            profilePictureURL: 'https://app.viima.com/static/media/user_profiles/user-icon.png',
            roundProfilePictures: true,
            textareaRows: 1,
            textareaMaxRows: 4,
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
        expect(comments.createCommentModel.calls.count()).toEqual(9);
        expect(comments.addCommentToDataModel.calls.count()).toEqual(9);
        expect(comments.sortComments.calls.count()).toBeGreaterThan(1);
    });

    it('Should have rendered the comments', function() {
        var commentElements = $('li.comment');
        expect(commentElements.length).toEqual(9);
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

        comments.sortAndReArrangeComments('oldest');
        checkOrder($('#comment-list > li.comment'), [1,2,3]);
        checkOrder($('li.comment[data-id=1] .child-comments li.comment'), [6,7,8,9]);
    });


    it('Should be able to toggle all replies', function() {
        var toggleAll = $('li.comment[data-id=1]').find('.child-comments li.toggle-all');
        expect(toggleAll.length).toBe(1);
        expect(toggleAll.text()).toBe('View all 4 replies');
        expect($('li.comment[data-id=1] li.comment:visible').length).toBe(2);

        // Show all replies
        toggleAll.click();
        expect(toggleAll.text()).toBe('Hide replies');
        expect($('li.comment[data-id=1] li.comment:visible').length).toBe(4);

        // Hide replies
        toggleAll.click();
        expect(toggleAll.text()).toBe('View all 4 replies');
        expect($('li.comment[data-id=1] li.comment:visible').length).toBe(2);
    });

    describe('Textarea', function() {

        var mainTextarea;
        var lineHeight;

        beforeEach(function() {
            mainTextarea = $('.commenting-field.main .textarea');
            lineHeight = parseInt(mainTextarea.css('line-height'));
        });

        it('Should adjust the height dynamically', function() {

            // Should have 1 row
            expect(mainTextarea.outerHeight()).toBeLessThan(2*lineHeight);

            // Should have 2 rows
            mainTextarea.trigger('focus').focus();
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
            comments.$el.trigger('click');
            expect(mainTextarea.outerHeight()).toBeLessThan(2*lineHeight);

        });

        it('TODO', function() {
            //expect(mainTextarea.outerHeight()).toBeGreaterThan(2*lineHeight);
        });

    });


    xit('TODO', function() {

    });

    xit('TODO', function() {

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