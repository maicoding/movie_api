// IMPORTED MODULES
const express = require("express"),
  morgan = require("morgan"),
  bodyParser = require("body-parser"),
  uuid = require("uuid"),
  fs = require("fs"),
  path = require("path");
var app = express();
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
    Description:
      "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    Director: {
      Name: "Quentin Tarantino",
      BirthYear: "1963",
      Biography:
        "Quentin Jerome Tarantino was born in Knoxville, Tennessee. His father, Tony Tarantino, is an Italian-American actor and musician from New York, and his mother, Connie (McHugh), is a nurse from Tennessee. Quentin moved with his mother to Torrance, California, when he was four years old.",
    },
    Genre: {
      Name: "Crime",
    },
  },
  {
    Title: "Fight Club",
    Description:
      "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.",
    Director: {
      Name: "David Fincher",
      BirthYear: "1962",
      Biography:
        "David Fincher was born in 1962 in Denver, Colorado, and was raised in Marin County, California. When he was 18 years old he went to work for John Korty at Korty Films in Mill Valley. He subsequently worked at ILM (Industrial Light and Magic) from 1981-1983. Fincher left ILM to direct TV commercials and music videos after signing with N. Lee Lacy in Hollywood. He went on to found Propaganda in 1987 with fellow directors Dominic Sena, Greg Gold and Nigel Dick. Fincher has directed TV commercials for clients that include Nike, Coca-Cola, Budweiser, Heineken, Pepsi, Levi's, Converse, AT&T and Chanel. He has directed music videos for Madonna, Sting, The Rolling Stones, Michael Jackson, Aerosmith, George Michael, Iggy Pop, The Wallflowers, Billy Idol, Steve Winwood, The Motels and, most recently, A Perfect Circle. ",
    },
    Genre: {
      Name: "Crime",
    },
  },
  {
    Title: "Se7en",
    Description:
      "Two detectives, a rookie and a veteran, hunt a serial killer who uses the seven deadly sins as his motives.",
    Director: {
      Name: "David Fincher",
      BirthYear: "1962",
      Biography:
        "David Fincher was born in 1962 in Denver, Colorado, and was raised in Marin County, California. When he was 18 years old he went to work for John Korty at Korty Films in Mill Valley. He subsequently worked at ILM (Industrial Light and Magic) from 1981-1983. Fincher left ILM to direct TV commercials and music videos after signing with N. Lee Lacy in Hollywood. He went on to found Propaganda in 1987 with fellow directors Dominic Sena, Greg Gold and Nigel Dick. Fincher has directed TV commercials for clients that include Nike, Coca-Cola, Budweiser, Heineken, Pepsi, Levi's, Converse, AT&T and Chanel. He has directed music videos for Madonna, Sting, The Rolling Stones, Michael Jackson, Aerosmith, George Michael, Iggy Pop, The Wallflowers, Billy Idol, Steve Winwood, The Motels and, most recently, A Perfect Circle.",
    },
    Genre: {
      Name: "Crime",
    },
  },
  {
    Title: "Kill Bill: Vol.1",
    Description:
      "After awakening from a four-year coma, a former assassin wreaks vengeance on the team of assassins who betrayed her.",

    Director: {
      Name: "Quentin Tarantino",
      BirthYear: "1963",
      Biography:
        "Quentin Jerome Tarantino was born in Knoxville, Tennessee. His father, Tony Tarantino, is an Italian-American actor and musician from New York, and his mother, Connie (McHugh), is a nurse from Tennessee. Quentin moved with his mother to Torrance, California, when he was four years old.",
    },
    Genre: {
      Name: "Crime",
    },
  },
  {
    Title: "Dead Poets Society",
    Description:
      "Maverick teacher John Keating uses poetry to embolden his boarding school students to new heights of self-expression.",
    Director: {
      Name: "Peter Weir",
      BirthYear: "1944",
      Biography:
        "Peter Weir was born on August 21, 1944 in Sydney, New South Wales, Australia. He is a director and writer, known for Master & Commander: Bis ans Ende der Welt (2003), The Way Back (2010) and Der einzige Zeuge (1985). He has been married to Wendy Stites since 1966.",
    },
    Genre: {
      Name: "Drama",
    },
  },
  {
    Title: "The King's Speech",
    Description:
      "The story of King George VI, his impromptu ascension to the throne of the British Empire in 1936, and the speech therapist who helped the unsure monarch overcome his stammer.",
    Director: {
      Name: "Tom Hooper",
      BirthYear: "1972",
      Biography:
        "Tom Hooper was educated at one of England's most prestigious schools, Westminster. His first film, Runaway Dog, was made when he was 13 years old and shot on a Clockwork 16mm Bolex camera, using 100 feet of film.",
    },
    Genre: {
      Name: "Drama",
    },
  },
  {
    Title: "Insomnia",
    Description:
      "Two Los Angeles homicide detectives are dispatched to a northern town where the sun doesn't set to investigate the methodical murder of a local teen.",
    Director: {
      Name: "Christopher Nolan",
      BirthYear: "1970",
      Biography:
        "Best known for his cerebral, often nonlinear, storytelling, acclaimed writer-director Christopher Nolan was born on July 30, 1970, in London, England. Over the course of 15 years of filmmaking, Nolan has gone from low-budget independent films to working on some of the biggest blockbusters ever made. ",
    },
    Genre: {
      Name: "Thriller",
    },
  },
  {
    Title: "Lost in Translation",
    Description:
      "A faded movie star and a neglected young woman form an unlikely bond after crossing paths in Tokyo.",
    Director: {
      Name: "Sofia Coppola",
      BirthYear: "1971",
      Biography:
        "Sofia Coppola is a director, known for Somewhere - Verloren in Hollywood (2010), Lost in Translation: Zwischen den Welten (2003), and Marie Antoinette (2006). She has been married to Thomas Mars since August 27, 2011.",
    },
    Genre: {
      Name: "Comedy",
    },
  },
  {
    Title: "The Virgin Suicides",
    Description:
      "A group of male friends become obsessed with five mysterious sisters who are sheltered by their strict, religious parents in suburban Detroit in the mid 1970s.",
    Director: {
      Name: "Sofia Coppola",
      BirthYear: "1971",
      Biography:
        "Sofia Coppola is a director, known for Somewhere - Verloren in Hollywood (2010), Lost in Translation: Zwischen den Welten (2003), and Marie Antoinette (2006). She has been married to Thomas Mars since August 27, 2011.",
    },
    Genre: {
      Name: "Drama",
    },
  },
  {
    Title: "Idiocracy",
    Description:
      "Private Joe Bauers, a decisively average American, is selected as a guinea pig for a top-secret hibernation program but is forgotten, awakening to a future so incredibly moronic he's easily the most intelligent person alive.",
    Director: {
      Name: "Mike Judge",
      BirthYear: "1962",
      Biography:
        "Mike Judge is an American actor, animator, film director, screenwriter, and television producer. In 1962, Judge was born in Guayaquil, the largest city of Ecuador and the country's main port. His parents were expatriate Americans. His father was archaeologist William James Judge and his mother was librarian Margaret Yvonne Blue.",
    },
    Genre: {
      Name: "Comedy",
    },
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

// Read: Get one movie, by title
app.get("/movies/:title", (req, res) => {
  const { title } = req.params;
  const movie = movies.find((movie) => movies.Title === title);
  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send("Sorry, no such movie.");
  }
});
// Read: get info about genre, by genre name
app.get("/genres/:name", (req, res) => {
  const { genreName } = req.params;
  const genre = genre.find((Genre) => genre.Name === genreName);
  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send("Sorry, no such genre.");
  }
});
// Read: get info about director, by director's name
app.get("/directors/:name", (req, res) => {
  const { directorsName } = req.params;
  const info = info.find((Director) => directors.Name === directorsName);
  if (info) {
    res.status(200).json(info);
  } else {
    res.status(400).send("Sorry, no such director.");
  }
});

//Create new user
app.post("/users", (req, res) => {
  let newUser = req.body;

  if (!newUser.name) {
    const message = "Missing name in request body";
    res.status(400).send(message);
  } else {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).send(newUser);
  }
});

//update user
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;
  let user = users.find((user) => user.id == id);
  if (user) {
    user.name = updatedUser;
    res.status(200).json(user);
  } else {
    res.status(400).send("No such user");
  }
});

//Add movie to favouriteMovies list
app.post("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;
  let user = users.find((user) => user.id == id);
  if (user) {
    user.favouriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
  } else {
    res.status(400).send("No such user");
  }
});

//Delete movie from user's favouriteMovies list
app.delete("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;
  let user = users.find((user) => user.id == id);
  if (user) {
    user.favouriteMovies = user.favouriteMovies.filter(
      (title) => title !== movieTitle
    );
    res
      .status(200)
      .send(`${movieTitle} has been removed from user ${id}'s array`);
  } else {
    res.status(400).send("No such user");
  }
});
//Delete user
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  let user = users.find((user) => user.id == id);
  if (user) {
    users = users.filter((user) => user.id !== id);
    res.status(200).send(`User account ${id} has been deleted`);
  } else {
    res.status(400).send("No such user");
  }
});
//Read
app.get("/", (req, res) => {
  res.send("Welcome to myFlix Movie App!");
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
  res.status(500).send("Something broke!");
});

// listen for requests
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
