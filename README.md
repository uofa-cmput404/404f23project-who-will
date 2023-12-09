CMPUT404-project-socialdistribution
===================================

CMPUT 404 Project: Social Distribution

[Project requirements](https://github.com/uofa-cmput404/project-socialdistribution/blob/master/project.org) 

Contributors / Licensing
========================

Authors:
Firstname Lastname    
* William Boytinck
* Frank Li
* Ian Harding
* Neel Patel
* Xuemeng Wei
  
User Stories:

--------------------------------------------------------------------------------

- [x] As an author I want to make public posts.                                          

- [x] As an author I want to edit public posts. 														           

- [x] As an author, posts I create can link to images.											            

- [x] As an author, posts I create can be images.														       

- [x] As a server admin, images can be hosted on my server.									            

- [x] As an author, posts I create can be private to another author					           

- [x] As an author, posts I create can be private to my friends								 

- [x] As an author, I can share other author’s public posts									             [via URI]

- [x] As an author, I can re-share other author’s friend posts to my friends             [via URI]

- [x] As an author, posts I make can be in simple plain text								           	

- [ ] As an author, posts I make can be in CommonMark												      

- [x] As an author, I want a consistent identity per server									            

- [x] As a server admin, I want to host multiple authors on my server				            

- [x] As a server admin, I want to share public images with users on other servers.	    

- [x] As an author, I want to pull in my github activity to my “stream”							    

- [x] As an author, I want to post posts to my “stream”															    

- [x] As an author, I want to delete my own public posts.						 								    

- [x] As an author, I want to befriend local authors																    

- [ ] As an author, I want to befriend remote authors																     [NO - other team problem]

- [x] As an author, I want to feel safe about sharing images and posts with my friends – images shared to friends should only be visible to friends. public images are public						                                     
- [x] As an author, when someone sends me a friends only-post I want to see the likes.  

- [x] As an author, comments on friend posts are private only to me the original author. 

As an author, I want un-befriend local and remote authors													 [Local Done]

- [x] As an author, I want to be able to use my web-browser to manage my profile			

- [x] As an author, I want to be able to use my web-browser to manage/author my posts						

- [x] As a server admin, I want to be able add, modify, and remove authors.						

- [ ] As a server admin, I want to OPTIONALLY be able allow users to sign up but require my OK to finally be on my server	

- [x] As a server admin, I don’t want to do heavy setup to get the posts of my author’s friends.										

- [x] As a server admin, I want a restful interface for most operations								  

- [x] As an author, other authors cannot modify my public post											   

- [x] As an author, other authors cannot modify my shared to friends post.							

- [x] As an author, I want to comment on posts that I can access													

- [x] As an author, I want to like posts that I can access													

- [x] As an author, my server will know about my friends														

- [x] As an author, When I befriend someone (they accept my friend request) I follow them, only when the other author befriends me do I count as a real friend – a bi-directional follow is a true friend.		            

- [x] As an author, I want to know if I have friend requests.													    

- [x] As an author I should be able to browse the public posts of everyone						 

- [ ] As a server admin, I want to be able to add nodes to share with									 

- [ ] As a server admin, I want to be able to remove nodes and stop sharing with them.  

As a server admin, I can limit nodes connecting to me via authentication.				      [partially complete] - some auth

As a server admin, node to node connections can be authenticated with HTTP Basic Auth  [partially complete] - 1/2 implemented in all teams

- [x] As a server admin, I can disable the node to node interfaces for connections that are not authenticated!

- [x] As an author, I want to be able to make posts that are unlisted, that are publicly shareable by URI alone (or for embedding images)


Teams Connected With:
--------------------------------------------------------------------------------
Web Crawlers (Team Silk): We can receive authors, posts, follow requests, comments and likes we can send authors and posts.

HTTP Academy: We can recieve authors, posts, comments and likes. We can send authors and posts.

Team == Good: We can send posts.

**Credentials:**

Who Will: 
deployed app URL:  https://whosocialwill.netlify.app/  
backend URL: https://whoiswill-130181bf2e5e.herokuapp.com/  
username:admin  
password:admin  

Http Academy:
https://cmput404-httpacademy10-929f7da50223.herokuapp.com/  
username: admin@email.com  
password: admin  

Team == Good: 
frontend:  https://cmput404-social-network-401e4cab2cc0.herokuapp.com/   
backend:  https://cmput404-social-network-401e4cab2cc0.herokuapp.com/  
username:admin  
password: admin  

Silk:
Frontend: https://incandescent-croissant-3ddf57.netlify.app/  
Backend: https://silk-cmput404-project-21e5c91727a7.herokuapp.com/  
Username: Michelangelo  
Password: edEZCtef30dPm4ap%QcrzEhx  

Generally everything is LICENSE'D under the Apache License 2.0
