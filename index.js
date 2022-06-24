// IMPORTED MODULES
const express = require("express"),
  morgan = require("morgan"),
  bodyParser = require("body-parser"),
  uuid = require("uuid"),
  fs = require("fs"),
  path = require("path");
const app = express();
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

let users = [
  {
    id: "1",
    name: "Otti",
    favouriteMovies: ["Pulp Fiction"],
  },
  {
    id: "2",
    name: "Sandy",
    favouriteMovies: ["Fight Club"],
  },
];

let movies = [
  {
    Title: "Pulp Fiction",
    Director: {
      Name: "Quentin Tarantino",
    },
    Genre: {
      Name: "Crime",
    },
  },
  {
    Title: "Fight Club",
    Director: {
      Name: "David Fincher",
    },
    Genre: {
      Name: "Crime",
    },
  },
  {
    Title: "Se7en",
    Director: {
      Name: "David Fincher",
    },
    Genre: {
      Name: "Crime",
    },
  },
  {
    Title: "Kill Bill: Vol.1",
    Director: {
      Name: "Quentin Tarantino",
    },
    Genre: {
      Name: "Crime",
    },
  },
  {
    Title: "Dead Poets Society",
    Director: {
      Name: "Peter Weir",
    },
    Genre: {
      Name: "Drama",
    },
  },
  {
    Title: "The King's Speech",
    Director: {
      Name: "Tom Hooper",
    },
    Genre: {
      Name: "Drama",
    },
  },
  {
    Title: "Insomnia",
    Director: {
      Name: "Christopher Nolan",
    },
    Genre: {
      Name: "Thriller",
    },
  },
  {
    Title: "Lost in Translation",
    Director: {
      Name: "Sofia Coppola",
    },
    Genre: {
      Name: "Comedy",
    },
  },
  {
    Title: "The Virgin Suicides",
    Director: {
      Name: "Sofia Coppola",
    },
    Genre: {
      Name: "Drama",
    },
  },
  {
    Title: "Idiocracy",
    Director: {
      Name: "Mike Judge",
    },
    Genre: {
      Name: "Comedy",
    },
  },
];

let genres = [
  {
    name: "Drama",
    description:
      "Drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.",
  },
  {
    name: "Crime",
    description:
      "Crime films, in the broadest sense, is a film genre inspired by and analogous to the crime fiction literary genre. Films of this genre generally involve various aspects of crime and its detection. Stylistically, the genre may overlap and combine with many other genres, such as drama or gangster film,[1] but also include comedy, and, in turn, is divided into many sub-genres, such as mystery, suspense or noir.",
  },
  {
    name: "Thriller",
    description:
      "Thriller is a genre of fiction, having numerous, often overlapping subgenres. Thrillers are characterized and defined by the moods they elicit, giving viewers heightened feelings of suspense, excitement, surprise, anticipation and anxiety.",
  },

  {
    name: "Comedy",
    description:
      "A comedy film is a category of film which emphasizes humor. These films are designed to make the audience laugh through amusement.",
  },
];

let directors = [
  {
    name: "David Fincher",
    birthdate: "28.07.1962",
    bio: "David Fincher is an American filmmaker and director. He is known for his work in the genre of crime film.",
  },
];

// GET requests
app.get("/", (req, res) => {
  res.send("Welcome to Movie Info!");
});

app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html");
});

//Display all movies
app.get("/movies", (req, res) => {
  res.status(200).json(movies);
});

// Get one movie, by title
app.get("/movies/:title", (req, res) => {
  const { title } = req.params;
  const movie = movies.find((movie) => movie.Title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send("No such movie");
  }
});

// Get movie by genre
app.get("/genres/:name", (req, res) => {
  res.json(genres.find((genre) => genre.name === req.params.name));

  if (genre) {
    res.status(200).json(description);
  } else {
    res.status(400).send("There is no such genre.");
  }
});

// get info about director, by director's name
app.get("/directors/:Name", (req, res) => {
  res.json(directors.find((director) => director.name === req.params.Name));

  if (directors) {
    res.status(200).json(directors);
  } else {
    res.status(400).send("No such directors");
  }
});

//Create new user
app.post("/users", (req, res) => {
  const newUser = req.body;
  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).send("user needs name");
  }
});

//update user
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find((user) => user.id === id);
  if (user) {
    user.name = updatedUser;
    res.status(200).json(user);
  } else {
    res.status(400).send("This user does not exist.");
  }
});

//Add movie to favouriteMovies list
app.post("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id === id);
  if (user) {
    user.favouriteMovies.push(movieTitle);
    res
      .status(200)
      .send(`${movieTitle} has been added to your favourite's list.`);
  } else {
    res.status(400).send("This user does not exist.");
  }
});

//Delete movie from user's favouriteMovies list
app.delete("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id === id);
  if (user) {
    user.favouriteMovies = user.favouriteMovies.filter(
      (title) => title !== movieTitle
    );
    res
      .status(200)
      .send(`${movieTitle} has been removed from your favourite's list.`);
  } else {
    res.status(400).send("This user does not exist.");
  }
});

//Delete user
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  let user = users.find((user) => user.id === id);
  if (user) {
    users = users.filter((user) => user.id !== id);
    res.status(200).send(`user ${id} has been removed`);
  } else {
    res.status(400).send("This user does not exist.");
  }
});

//serving static files
app.use(express.static("public"));
//Morgan request logger
const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});
app.use(morgan("combined", { stream: accessLogStream }));
//error-handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// listen for requests
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
