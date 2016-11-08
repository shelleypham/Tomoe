<img src="/assets/images/logos/logo_blue.png" alt="Tomoe" width=250 >
# Hackathon Application Management API
Tomoe is a scalable, open source API that allows Hackathon organizers to manage and monitor thier applicants and staff. Tomoe was built for HackMerced's application management but has been extended and open-sourced for everyone. Tomoe is still in development and will be available for use this december.

[Website](http://tomoe.hackmerced.com) |
[Docs](http://tomoe.hackmerced.com/docs) |
[Installation](http://tomoe.hackmerced.com/install) |
[HackMerced](http://hackmerced.com) |
[Sponsor Us!](http://hackmerced.com/sponsor) |
[Blog](https://blog.hackmerced.com/)

# Table of Contents

- [**Features**](#features)
- [**Installation**](#installation)
- [**Documentation**](#features)
- [**Resources and Tools**](#resources-and-tools)
- [**Roadmap**](#roadmap)
- [**Contributing**](#contributing)
- [**Support**](#support)
- [**License**](#license)

# Features

- **API**: Tomoe is primarily an API that allows you to build your own UI and interfaces around
- **Application Manager**: Manage students who apply to your hackathon by approving, denying, generating qr codes for hackers.
- **Email Utility**: Tomoe works with SendGrid to send application statuses, important updates, and other information to hackers.
 <br>
**[⬆ back to top](#table-of-contents)**

# Installation
Tomoe's runs on top of node.js and requires you to install `node.js` and `npm`

Once you've installed the prerequistes you will need to run the following command to install your Tomoe instance. It will ask you a few questions and set up either a development or live environment as well as an admin account for the gui.

```terminal
npm install
npm run setup
```

Access the server and gui locally at:
```terminal
http://localhost:4925
```

 <br>
**[⬆ back to top](#table-of-contents)**

# Documentation
## Shortcuts
[**Hacker Object**](#the-hacker-object)<br>
[**<code>GET</code> /hackers**](#get-hackers)<br>
[**<code>GET</code> /hackers/{user-email}**](#get-hackersuser-email)<br>
[**<code>GET</code> /hackers/{user-id}**](#get-hackersuser-id)<br>
[**<code>POST</code> /hackers**](#post-hackers)<br>
[**<code>POST</code> /hackers/{user-email}**](#post-hackersuser-email)<br>
[**<code>POST</code> /hackers/{user-id}**](#post-hackersuser-id)<br>
[**<code>DELETE</code> /hackers/{user-email}**](#delete-hackersuser-email)<br>
[**<code>DELETE</code> /hackers/{user-id}**](#delete-hackersuser-id)<br>

## The Hacker Object
The Hacker Object is the core to Tomoe's hackathon management system. Hackers are the people who apply to your hackathon.
```javascript
{
 "_id":"user-id",
 "name":"user-name",
 "email":"hackathon@email.com",
 "password":"userpasswordhash", // not returned normally
 "survey":{
    ... // array of attributes that can be customized and sent to the user
 }
}
```
<br>
**[⬆ back to top](#table-of-contents)**
**- [back to documentation](#documentation)**
###<code>GET</code> /hackers<br>
Lists all hackers stored in your database

#### Parameters
* <code>survey.data.{option}={any-data}</code> <br>**optional** : will filter the hackers returned based on a particular survey data
<br><br>
* <code>survey.lte.{option}={numeric-data}</code> <br>**optional** : will filter for a range of options that are less than the entered value
<br><br>
* <code>survey.gte.{option}={numeric-data}</code> <br>**optional** : will filter for a range of options that are greater than the entered value
<br><br>
* <code>survey.rangemin.{option}={numeric-data}</code> <br>**optional** : will filter for a range of options, sets the min value
<br><br>
* <code>survey.rangemax.{option}={numeric-data}</code> <br>**optional** : will filter for a range of options, sets the max value


#### Example 1
```
GET https://{your-tomoe-server}/v1.0/hackers
```

##### Response
```js
Array [
 {
  "_id":"349mei8234",
  "name":"John Mallon",
  "email":"john@ucmerced.edu",
  "survey":{
   "age":22,
   "college_origin":"University of California-Merced"
  }
 },
 ...
 {
  "_id":"934554",
  "name":"Bob Brown",
  "email":"bbrown@ucmerced.edu",
  "survey":{
   "age":18,
   "college_origin":"University of California-Los Angeles"
  }
 },
]
```

#### Example 2
```
GET https://{your-tomoe-server}/v1.0/hackers?survey.rangemin.age=22&survey.rangemax.age=25&survey.data.college_origin=University of California-Merced
```
##### Response
```js
Array [
 {
  "_id":"349mei8234",
  "name":"John Mallon",
  "email":"john@ucmerced.edu",
  "survey":{
   "age":22,
   "college_origin":"University of California-Merced"
  }
 },
 ...
 {
  "_id":"934554",
  "name":"Karl Korn",
  "email":"kkorn@ucmerced.edu",
  "survey":{
   "age":25,
   "college_origin":"University of California-Merced"
  }
 },
]
```
<br>
**[⬆ back to top](#table-of-contents)**
**- [back to documentation](#documentation)**

###<code>GET</code> /hackers/{user-email}
###<code>GET</code> /hackers/{user-id}
Returns a particular hackathon hacker, requires one of the previous parameters

#### Example
```
GET https://{your-tomoe-server}/v1.0/hackers/john@ucmerced.edu
```

##### Response
```js
{
 "_id":"349mei8234",
 "name":"John Mallon",
 "email":"john@ucmerced.edu",
 "survey":{
  "age":22,
  "college_origin":"University of California-Merced"
 }
}
```
<br>
**[⬆ back to top](#table-of-contents)**
**- [back to documentation](#documentation)**

###<code>POST</code> /hackers
Creates a hacker user
#### Example
```
POST https://{your-tomoe-server}/v1.0/hackers
```
```
CONTENT-TYPE: application/json
BODY: {
 "name":"Shubham Naik",
 "email":"snaik3@ucmerced.edu",
 "survey":{
  "age":19,
  "college_origin":"University of California-Merced"
 }
}
```

##### Response
```js
{
 "_id":"5340424",
 "name":"Shubham Naik",
 "email":"snaik3@ucmerced.edu",
 "survey":{
  "age":19,
  "college_origin":"University of California-Merced"
 }
}
```
<br>
**[⬆ back to top](#table-of-contents)**
**- [back to documentation](#documentation)**

###<code>POST</code> /hackers/{user-email}
###<code>POST</code> /hackers/{user-id}
Updates a particular hackathon hacker, requires one of the previous parameters

#### Example
```
GET https://{your-tomoe-server}/v1.0/hackers/john@ucmerced.edu
```
```
CONTENT-TYPE: application/json
BODY: {
 "name":"Shubham D Naik",
 "survey":{
  "age":20,
 }
}
```

##### Response
```js
{
 "_id":"349mei8234",
 "name":"Shubham D Naik",
 "email":"john@ucmerced.edu",
 "survey":{
  "age":19,
  "college_origin":"University of California-Merced"
 }
}
```
<br>
**[⬆ back to top](#table-of-contents)**
**- [back to documentation](#documentation)**

####<code>DELETE</code> /hackers/{user-email}
####<code>DELETE</code> /hackers/{user-id}
Deletes a particular hackathon hacker, requires one of the previous parameters

#### Example
```
DELETE https://{your-tomoe-server}/v1.0/hackers/john@ucmerced.edu
```

##### Response
```js
{ deleted: true }
```
<br>
**[⬆ back to top](#table-of-contents)**
**- [back to documentation](#documentation)**


# Contributing
Want to contribute to Tomoe? We would love if you were to contribute to the continued growth of our project. Just submit a branch request - if you're a UC Merced student, please [contact us](shub@hackmerced.com)! We're still looking to add developers to our mentorship program too!
<br>
**[⬆ back to top](#table-of-contents)**




# Support
The HackMerced Team is happy to help Hackathon organizers with setting up and configuring your application. Email us at [help@hackmerced.com](help@hackmerced.com).
<br>
**[⬆ back to top](#table-of-contents)**

# License
```
Copyright 2016 HackMerced

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
<br>
**[⬆ back to top](#table-of-contents)**
