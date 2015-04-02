# jquery-comments
jquery-comments is a jQuery based plugin to provide commenting features to any web application with an existing backend. It provides all the UI functionalities with callbacks where you define what you want to do with the data. The library is highly customizable and easy to integrate through various settings.

![Screenshot of jquery-comments](screenshot.png?raw=true "Screenshot of jquery-comments")

###Features
- Commenting, replying, editing, deleting and upvoting
- Enabling/disabling functionalities
- Localization
- Time formatting
- Field mappings
- Callbacks
- Fully responsive and mobile compatible
- Miscellaneous settings

###Demo
http://viima.github.io/jquery-comments/demo/

###Quick start
**1) Add the following to your HTML file:**
```
<link rel="stylesheet" type="text/css" href="css/jquery-comments.css">
<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">

<script type="text/javascript" src="js/lib/jquery-1.9.0.min.js"></script>
<script type="text/javascript" src="js/jquery-comments.js"></script>
```

**2) Initialize the library**
```
$('#comments-container').comments({
    profilePictureURL: 'https://app.viima.com/static/media/user_profiles/user-icon.png',
    getComments: function(success, error) {
        // Call the success function with array of comments as parameter
        // after you have fetched the comments from your server
        success(commentsArray);  // Call success or error function based on the response from server
    },
    putComment: function(commentJSON, success, error) {
        // Update the changed comment to your server here,
        // commentJSON contains the model with changed fields
        success(commentJSON);   // Call success or error function based on the response from server
    },
    deleteComment: function(commentJSON, success, error) {
        // Delete the comment from your server here,
        // commentJSON contains the deleted model
        success();  // Call success or error function based on the response from server
    },
    upvoteComment: function(commentJSON, success, error) {
        // Create an upvote to your server here
        success(commentJSON);    // Call success or error function based on the response from server
    }
});
```
If you are not using Font Awesome for icons, you should replace the icons with custom images by overriding following options when initializing the library:
```
spinnerIconURL: 'img/spinner.gif',
upvoteIconURL: 'img/upvote-icon.png',
replyIconURL: 'img/reply-icon.png',
noCommentsIconURL: 'img/no-comments-icon.png',
```

###Dependencies
- jQuery >= 1.9.0
- Font Awesome (optional)

###Documentation
http://viima.github.io/jquery-comments

###Maintainers
- Joona Tykkyläinen, Viima Solutions Oy

###Browser support
IE9+ and all modern browsers

###Copyright and license
Code and documentation copyright 2015 [Viima Solutions Oy](https://www.viima.com/). Code released under [the MIT license](https://github.com/Viima/jquery-comments/blob/master/LICENSE)
