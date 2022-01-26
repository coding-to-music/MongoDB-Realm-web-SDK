# Create MongoDB Realm Web SDK to access Atlas movie database

https://coding-to-music.github.io/MongoDB-Realm-web-SDK/

https://www.mongodb.com/developer/quickstart/realm-web-sdk/

https://github.com/coding-to-music/MongoDB-Realm-web-SDK

https://realmwebsdk-suybq.mongodbstitch.com/

## Introduction

In this tutorial blog post, you will learn how to retrieve data from a MongoDB Atlas cluster using the MongoDB Realm Web SDK and display it in a very basic website hosted in MongoDB Realm Static Hosting.

But wait... If we query our MongoDB cluster directly from the front-end code, isn't that super unsafe?

Usually, applications are designed using the 3-tier architecture with a back end that can act as a gatekeeper for the database. This ensures that the queries are authenticated correctly and that appropriate business rules are applied. Also, it avoids sharing your database connection string (with the username and password...) publicly in the front-end code, which is kind of a good idea if you don't want to share your entire database publicly.

No worries! MongoDB Realm is here to save the day! The web SDK actually uses a Realm Application as a serverless back end to solve all the problems I just mentioned.

So in this tutorial, we will build a minimalistic website that will be able to retrieve movie titles from your MongoDB Atlas database and display them in the browser. For this, we will:

Create a basic Realm Application to handle the anonymous authentication and set the access rules for our movies collection.
- Create the website with just one HTML file and one JavaScript file.

## Getting Set Up

For this tutorial, you will need:

- A free tier Atlas M0 cluster (or higher).
- Load the sample data set as we will need some sample documents from the sample_mflix.movies collection.
- Import the sample data set menu in MongoDB Atlas
![image](https://github.com/coding-to-music/MongoDB-Realm-web-SDK/blob/main/images/import-sample-data.png?raw=true)
- We will also use jQuery (to keep things as simple as possible) and the Realm Web SDK but it's just a couple of imports in the JavaScript code. You don't need anything else.

## Create a Realm Application
Access Realm by clicking the link at the top in your MongoDB Atlas UI, above your cluster.

## Access Realm in the MongoDB Atlas UI
![image](https://github.com/coding-to-music/MongoDB-Realm-web-SDK/blob/main/images/realm-link.png?raw=true)

Create a Realm application. If possible, keep it close (same region) to your Atlas Cluster.

## Create the Realm Application

![image](https://github.com/coding-to-music/MongoDB-Realm-web-SDK/blob/main/images/create-realm-app.png?raw=true)

Our Realm Web SDK needs to authenticate users to work properly. In this tutorial, we will use the anonymous authentication to keep it simple.

## Activating the anonymous authentication in the Realm application

![image](https://github.com/coding-to-music/MongoDB-Realm-web-SDK/blob/main/images/realm-anonymous-auth.png?raw=true)

We need to tell our Realm application what our authenticated users can do with each collection. In this case, we want them to access the sample_mflix.movies collection for reads only.

![image](https://github.com/coding-to-music/MongoDB-Realm-web-SDK/blob/main/images/realm-collection-rules.png?raw=true)

Allow read-only access in the collection rules to the sample_mflix.movies collection

Don't forget to click on Configure Collection to validate this choice. You also need to deploy these modifications.

![image](https://github.com/coding-to-music/MongoDB-Realm-web-SDK/blob/main/images/deploy.png.1?raw=true)

Click review draft & deploy to deploy the modifications we did to our realm application
## Create a Mini Website with the Realm Web SDK
Now that our Realm application is ready, we can create a mini website to retrieve 20 movie titles from our sample_mflix.movies collection in MongoDB Atlas and display them in our website.

## Create a new folder and a new file index.html.

```java
<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="shortcut icon" type="image/png" href="https://www.mongodb.com/assets/images/global/favicon.ico"/>
    <script src="https://unpkg.com/realm-web@1.2.0/dist/bundle.iife.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <title>My Movie Titles</title>
</head>
<body>
<h1>My Movies</h1>
<div>
    <!-- Login anonymously -->
    <input type="submit" value="LOGIN" onClick="login()">
    <!-- Finds first 20 movies in movies collection -->
    <input type="submit" value="FIND 20 MOVIES" onClick="find_movies()">
</div>
<!-- Using this div to display the user ID -->
<div id="user"></div>
<!-- Using this div to show the 20 movie titles -->
<div id="movies"></div>
<!-- Inside this file are the functions used above: login() and find_movies() -->
<script src="data.js"></script>
</body>
</html>
```

## In the same folder, create a file data.js.

```java 
const APP_ID = '<YOUR-REALM-APPID>';
const ATLAS_SERVICE = 'mongodb-atlas';
const app = new Realm.App({id: APP_ID});
// Function executed by the LOGIN button.
const login = async () => {
    const credentials = Realm.Credentials.anonymous();
    try {
        const user = await app.logIn(credentials);
        $('#user').empty().append("User ID: " + user.id); // update the user div with the user ID
    } catch (err) {
        console.error("Failed to log in", err);
    }
};
// Function executed by the "FIND 20 MOVIES" button.
const find_movies = async () => {
    let collMovies;
    try {
        // Access the movies collection through MDB Realm & the readonly rule.
        const mongodb = app.currentUser.mongoClient(ATLAS_SERVICE);
        collMovies = mongodb.db("sample_mflix").collection("movies");
    } catch (err) {
        $("#user").append("Need to login first.");
        console.error("Need to log in first", err);
        return;
    }
    // Retrieve 20 movie titles (only the titles thanks to the projection).
    const movies_titles = await collMovies.find({}, {
        "projection": {
            "_id": 0,
            "title": 1
        },
        "limit": 20
    });
    // Access the movies div and clear it.
    let movies_div = $("#movies");
    movies_div.empty();
    // Loop through the 20 movie title and display them in the movies div.
    for (const movie of movies_titles) {
        let p = document.createElement("p");
        p.append(movie.title);
        movies_div.append(p);
    }
};
```

## Retrieve the Realm AppID in the Realm UI

The first line of data.js needs your Realm APPID. You can find it here:

![image](https://github.com/coding-to-music/MongoDB-Realm-web-SDK/blob/main/images/realm-appid.png?raw=true)

In my case, my first line looks like this, but please use your own APPID:

```java
const APP_ID = 'realmwebsdk-uuldw';
```

## Deploy the Website in MongoDB Realm Static Hosting

## MongoDB Realm - Hosting website feature in the UI

![image](https://github.com/coding-to-music/MongoDB-Realm-web-SDK/blob/main/images/realm-static-hosting.png?raw=true)

Upload your two files index.html and data.js using the UPLOAD FILES button. Realm will tell you that you are overwriting ./index.html. This is the expected result.

## Result of the upload of the 2 files in the MongoDB Realm UI

![image](https://github.com/coding-to-music/MongoDB-Realm-web-SDK/blob/main/images/realm-hosted-files.png?raw=true)

Don't forget to review and deploy your modification!

![image](https://github.com/coding-to-music/MongoDB-Realm-web-SDK/blob/main/images/deploy.png?raw=true)

## Click review draft & deploy to deploy the modifications we did to our realm application
At this point, you should be able to access your website with the provided link, but the DNS can take up to 15 minutes to propagate.

## Link to the hosted website and DNS warning message

![image](https://github.com/coding-to-music/MongoDB-Realm-web-SDK/blob/main/images/realm-dns-warning.png?raw=true)

Try to open the provided link and if that doesn't work yet, feel free to open your local index.html file in your preferred web browser. You should see something like this:

![image](https://github.com/coding-to-music/MongoDB-Realm-web-SDK/blob/main/images/website1.png?raw=true)

The website with 2 buttons "login" and "find 20 movies".
Click on LOGIN. You are now authenticated with an anonymous user.

![image](https://github.com/coding-to-music/MongoDB-Realm-web-SDK/blob/main/images/website2.png?raw=true)

## The website now displays the user ID.

You can find this user in your Realm application in the App Users menu in MongoDB Realm. Of course, you could use a better authentication provider to secure your application correctly.

![image](https://github.com/coding-to-music/MongoDB-Realm-web-SDK/blob/main/images/realm-users.png?raw=true)

## The same user ID in the Realm UI.
If you click on the FIND 20 MOVIES button, you should now see a bunch of movie titles that come from your MongoDB Atlas sample collection.

## The website now displays 20 movies titles
## Wrapping Up
In this tutorial, you learned how to set up your first website using MongoDB Realm Web SDK. We used jQuery for this simple example, but any recent and popular JavaScript front-end technology like React, Angular, or Vue.js would also work.


![image](https://github.com/coding-to-music/MongoDB-Realm-web-SDK/blob/main/images/website3.png?raw=true)

## MongoDB Realm provides a number of SDKs that can also be useful for your project:

- Android SDK
- iOS SDK
- .NET SDK
- Node.js SDK
- React Native SDK
- Kotlin Multiplatform SDK
- Web SDK <== We are here
- Flutter SDK

