# CS-546-Final-Project
A website platform for programmers of all skill levels to create accounts and become available to employers seeking both part-time and full-time positions. The site is centered primarily around temporary small-to-medium sized jobs that can be completed by a programmer working from home (i.e. freelancing), though longer, more permanent positions may also result if desired by the employer.

## Setup 

Requires an installation of Node.js and MongoDB (running on localhost, port 27017) Run
```
npm i
```
to install all dependencies.

To run, use the command
```
sudo npm start
```

The server is required to run as root because we bind to port 80 and 443. We use a self-signed certificate, so SSL warnings will appear and should just be accepted.

To seed the database, use the command
```
npm run seed
```

One candidate account given by seeding the database is (mgrosso@gmail.com, Password123)
One employer account given by seeding the database is (ftank@ibm.com, Password123)

## The Website
The website itself is straight forward: a user can create either a candidate account or employer account, and perform actions related to the needs of that type of account. For example, an employer account can create jobs, search through candidates by skills, and message candidates. A candidate can look though available jobs, apply to them, and create a detailed custom profile.