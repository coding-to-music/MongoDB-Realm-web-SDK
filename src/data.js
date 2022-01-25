const APP_ID = 'realmwebsdk-suybq';
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