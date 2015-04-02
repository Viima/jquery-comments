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
        success(commentsArray);
    },
    putComment: function(commentJSON, success, error) {
        success(commentJSON);
    },
    deleteComment: function(commentJSON, success, error) {
        success();
    },
    upvoteComment: function(commentJSON, success, error) {
        success(commentJSON);
    }
});
```
If you are not using Font Awesome for icons, you should override the icons with custom images by following options:
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

###Brwoser support
IE9+ and all modern browsers

###Copyright and license
Code and documentation copyright 2015 [Viima Solutions Oy](https://www.viima.com/). Code released under [the MIT license](https://github.com/Viima/jquery-comments/blob/master/LICENSE)
