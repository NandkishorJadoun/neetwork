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
  - [ ] GET / will show all latest posts
  - [ ] GET /following will show all the posts from the following
  - [ ] POST / will create a new post
  - [ ] GET /:postId will show the post
  - [ ] DELETE /:postId will delete the post
  - [ ] POST /:postId will create the new comment
  - [ ] POST /:postId/like will like the post
  - [ ] DELETE /:postId/like will unlike the post 

- [ ] /users
  - [x] GET / show all users who exist on the platform but user haven't followed yet
  - [x] GET /:userId show the profile of the user
  - [x] GET /:userId/posts show the posts
  - [x] GET /:userId/comments show the comments
  - [x] GET /:userId/followers show the followers
  - [x] GET /:userId/followings show the followings

  - [x] POST /:userId/follow-request will send follow request
  - [x] DELETE /:userId/follow-request will delete follow request

  - [x] GET /me will send the data for patch
  - [ ] PATCH /me will update the profile of the user

  - [ ] GET /me/follow-requests will show all users who sent FR
  - [ ] PATCH /me/follow-requests/:userId will accept the FR
  - [ ] DELETE /me/follow-requests/:userId will reject the FR