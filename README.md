# m2sid-biblio

Welcome to this project, this is a simple web tool library management written with Node.js behind.
The framework [Sails](http://sailsjs.org) is used for the Node.js part.

Here is the main three part of the application:
- Web tool management (Dashboard) (HTML, JS, CSS, ...)
- Web server that serve the web tool management (Node.js)
- Web service REST which is used by the web tool to interact with database.

Web server and web service are built inside same app which is also built with sails.js.

## Technical information
- Client side technologies: EJS for the view management with ejs-locals between EJS and Sails (template, layout and other extra stuff for EJS)
- Server side technologies: Waterline as ORM using Bluebird for promises. Lodash for common task. 

## Other information
- Access account: maxime / password