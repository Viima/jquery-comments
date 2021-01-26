var commentsArray = [
{
   "id": 1,
   "parent": null,
   "created": "2015-01-01",
   "modified": "2015-01-01",
   "content": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Sed posuere interdum sem. Quisque ligula eros ullamcorper quis, lacinia quis facilisis sed sapien. Mauris varius diam vitae arcu.",
   "attachments": [],
   "pings": [],
   "creator": 6,
   "fullname": "Simon Powell",
   "profile_picture_url": "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png",
   "created_by_admin": false,
   "created_by_current_user": false,
   "upvote_count": 3,
   "user_has_upvoted": false,
   "is_new": false
},
{
   "id": 2,
   "parent": null,
   "created": "2015-01-02",
   "modified": "2015-01-02",
   "content": "Sed posuere interdum sem. Quisque ligula eros ullamcorper quis, lacinia quis facilisis sed sapien. Mauris varius diam vitae arcu.",
   "attachments": [],
   "pings": [],
   "creator": 5,
   "fullname": "Administrator",
   "profile_picture_url": "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png",
   "created_by_admin": true,
   "created_by_current_user": false,
   "upvote_count": 2,
   "user_has_upvoted": false,
   "is_new": false
},
{
   "id": 3,
   "parent": null,
   "created": "2015-01-03",
   "modified": "2015-01-03",
   "content": "@Hank Smith sed posuere interdum sem.\nQuisque ligula eros ullamcorper https://www.google.com/ quis, lacinia quis facilisis sed sapien. Mauris varius diam vitae arcu. Sed arcu lectus auctor vitae, consectetuer et venenatis eget #velit.",
   "attachments": [],
   "pings": {
      3: 'Hank Smith',
   },
   "creator": 1,
   "fullname": "You",
   "profile_picture_url": "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png",
   "created_by_admin": false,
   "created_by_current_user": true,
   "upvote_count": 2,
   "user_has_upvoted": true,
   "is_new": false
},
{
   "id": 4,
   "parent": 3,
   "created": "2015-01-04",
   "modified": "2015-01-04",
   "content": "",
   "attachments": [
      {
         "id": 1,
         "file": "http://www.w3schools.com/html/mov_bbb.mp4",
         "mime_type": "video/mp4",
      }, 
   ],
   "creator": 4,
   "fullname": "Todd Brown",
   "profile_picture_url": "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png",
   "created_by_admin": false,
   "created_by_current_user": false,
   "upvote_count": 0,
   "user_has_upvoted": false,
   "is_new": true
},
{
   "id": 5,
   "parent": 4,
   "created": "2015-01-05",
   "modified": "2015-01-05",
   "content": "Quisque ligula eros ullamcorper quis, lacinia quis facilisis sed sapien. Mauris varius diam vitae arcu. Sed arcu lectus auctor vitae, consectetuer et venenatis eget velit.",
   "attachments": [],
   "pings": [],
   "creator": 3,
   "fullname": "Hank Smith",
   "profile_picture_url": "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png",
   "created_by_admin": false,
   "created_by_current_user": false,
   "upvote_count": 0,
   "user_has_upvoted": false,
   "is_new": true
},
{
   "id": 6,
   "parent": 1,
   "created": "2015-01-06",
   "modified": "2015-01-06",
   "content": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Sed posuere interdum sem. Quisque ligula eros ullamcorper quis, lacinia quis facilisis sed sapien. Mauris varius diam vitae arcu.",
   "attachments": [],
   "pings": [],
   "creator": 2,
   "fullname": "Jack Hemsworth",
   "profile_picture_url": "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png",
   "created_by_admin": false,
   "created_by_current_user": false,
   "upvote_count": 1,
   "user_has_upvoted": false,
   "is_new": false
},
{
   "id": 7,
   "parent": 1,
   "created": "2015-01-07",
   "modified": "2015-01-07",
   "content": "Sed posuere interdum sem. Quisque ligula eros ullamcorper quis, lacinia quis facilisis sed sapien. Mauris varius diam vitae arcu. Sed arcu lectus auctor vitae, consectetuer et venenatis eget velit.",
   "attachments": [],
   "pings": [],
   "creator": 5,
   "fullname": "Administrator",
   "profile_picture_url": "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png",
   "created_by_admin": true,
   "created_by_current_user": false,
   "upvote_count": 0,
   "user_has_upvoted": false,
   "is_new": false
},
{
   "id": 8,
   "parent": 6,
   "created": "2015-01-08",
   "modified": "2015-01-08",
   "content": "Sed posuere interdum sem. Quisque ligula eros ullamcorper quis, lacinia quis facilisis sed sapien. Mauris varius diam vitae arcu.",
   "attachments": [],
   "pings": [],
   "creator": 1,
   "fullname": "You",
   "profile_picture_url": "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png",
   "created_by_admin": false,
   "created_by_current_user": true,
   "upvote_count": 0,
   "user_has_upvoted": false,
   "is_new": false
},
{
   "id": 9,
   "parent": 8,
   "created": "2015-01-09",
   "modified": "2015-01-10",
   "content": "Quisque ligula eros ullamcorper quis, lacinia quis facilisis sed sapien. Mauris varius diam vitae arcu. Sed arcu lectus auctor vitae, consectetuer et venenatis eget velit.",
   "attachments": [],
   "pings": [],
   "creator": 7,
   "fullname": "Bryan Connery",
   "profile_picture_url": "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png",
   "created_by_admin": false,
   "created_by_current_user": false,
   "upvote_count": 0,
   "user_has_upvoted": false,
   "is_new": false
},
{
   "id": 10,
   "parent": 9,
   "created": "2015-01-10",
   "modified": "2015-01-10",
   "content": "Quisque ligula eros ullamcorper quis, lacinia quis facilisis sed sapien. Mauris varius diam vitae arcu. Sed arcu lectus auctor vitae, consectetuer et venenatis eget velit.",
   "attachments": [
      {
         "id": 2,
         "file": "https://www.w3schools.com/images/w3schools_green.jpg",
         "mime_type": "image/jpeg",
      }, 
   ],
   "pings": [],
   "creator": 1,
   "fullname": "You",
   "profile_picture_url": "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png",
   "created_by_admin": false,
   "created_by_current_user": true,
   "upvote_count": 0,
   "user_has_upvoted": false,
   "is_new": false
}
]

var usersArray = [
   {
      id: 1,
      fullname: "Current User",
      email: "current.user@viima.com",
      profile_picture_url: "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png"
   },
   {
      id: 2,
      fullname: "Jack Hemsworth",
      email: "jack.hemsworth@viima.com",
      profile_picture_url: "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png"
   },
   {
      id: 3,
      fullname: "Hank Smith",
      email: "hank.smith@viima.com",
      profile_picture_url: "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png"
   },
   {
      id: 4,
      fullname: "Todd Brown",
      email: "todd.brown@viima.com",
      profile_picture_url: "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png"
   },
   {
      id: 5,
      fullname: "Administrator",
      email: "administrator@viima.com",
      profile_picture_url: "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png"
   },
   {
      id: 6,
      fullname: "Simon Powell",
      email: "simon.powell@viima.com",
      profile_picture_url: "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png"
   },
   {
      id: 7,
      fullname: "Bryan Connery",
      email: "bryan.connery@viima.com",
      profile_picture_url: "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png"
   }
]
