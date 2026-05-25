# Neetwork

## Features

- [x] Users can sign in using github.
- [ ] Users can send follow requests to other users.
- [ ] Users can create posts (text only).
- [ ] Users can like posts.
- [ ] Users can comment on posts.
- [ ] Posts display the post content, author, comments, and likes.
- [ ] Index page for posts shows all the recent posts from the current user and users they are following.
- [ ] Users can create a profile with a profile picture.
- [ ] User’s profile page contain their profile information, profile photo, and posts.
- [ ] Index page for users shows all users and buttons for sending follow requests to users the user is not already following or have a pending request

## Todos

- [x] /auth
  - [x] GET /github
  - [x] GET /github/callback

- [ ] /posts
  - [x] GET / will show all latest posts
  - [x] GET /following will show all the posts from the following
  - [x] POST / will create a new post
  - [x] GET /:postId will show the post
  - [x] DELETE /:postId will delete the post
  - [x] POST /:postId will create the new comment
  - [x] POST /:postId/like will like the post
  - [x] DELETE /:postId/like will unlike the post 

 - [x] /users
  - [x] GET / show all users who exist on the platform but user haven't followed yet
  - [x] GET /:userId show the profile of the user
  - [x] GET /:userId/posts show the posts
  - [x] GET /:userId/comments show the comments
  - [x] GET /:userId/followers show the followers
  - [x] GET /:userId/followings show the followings
  - [x] POST /:userId/follow-request will send follow request
  - [x] DELETE /:userId/follow-request will delete follow request
  - [x] DELETE /:userId/follow will unfollow the user

- [x] /me
  - [x] GET / will send the data for patch
  - [x] PATCH / will update the profile of the user
  - [x] GET /follow-requests will show all users who sent FR
  - [x] PATCH /follow-requests/:userId will accept the FR
  - [x] DELETE /follow-requests/:userId will reject the FR
  - [x] DELETE /followers/:userId will remove the follower