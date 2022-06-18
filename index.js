// IMPORTED MODULES
const express = require("express");
morgan = require("morgan");
const app = express();
// MIDDLEWARE
app.use(morgan("common"));
app.use(express.static("public"));
// CUSTOM GET REQUESTS
// movies to be returned on /movies request
let topMovies = [
  {
    title: "Pulp Fiction",
    director: "Quentin Tarantino",
  },
  {
    title: "Fight Club",
    director: "David Fincher",
  },
  {
    title: "Se7en",
    director: "David Fincher",
  },
  {
    title: "Kill Bill: Vol.1",
    director: "Quentin Tarantino",
  },
  {
    title: "Dead Poets Society",
    director: "Peter Weir",
  },
  {
    title: "The King's Speech",
    director: "Tom Hooper",
  },
  {
    title: "Insomnia",
    director: "Christopher Nolan",
  },
  {
    title: "Lost in Translation",
    director: "Sofia Coppola",
  },
  {
    title: "The Virgin Suicides",
    director: "Sofia Coppola",
  },
  {
    title: "Idiocracy",
    director: "Mike Judge",
  },
];

//middleware
app.use(morgan("common"));
app.use(express.static("public"));

//routes
app.get("/", (req, res) => {
  res.send("Welcome to My Movie App");
});

app.get("/movies", (req, res) => {
  res.json("topTen");
});

app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("An error has occoured.");
});

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
