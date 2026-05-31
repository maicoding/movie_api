const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const { check, validationResult } = require("express-validator");
const Models = require("./models");

const app = express();
const Movies = Models.Movie;
const Users = Models.User;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(morgan("common"));
app.use(
  morgan("combined", {
    stream: fs.createWriteStream(path.join(__dirname, "log.txt"), { flags: "a" }),
  })
);

require("./auth")(app);
require("./passport");

if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
} else {
  console.warn("MONGO_URI is not set. Database routes will fail until it is configured.");
}

const userValidation = [
  check("Username", "Username is required").isLength({ min: 5 }),
  check("Username", "Username contains non-alphanumeric characters.").isAlphanumeric(),
  check("Password", "Password is required").not().isEmpty(),
  check("Email", "Email does not appear to be valid").isEmail(),
];

function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return false;
  }
  return true;
}

app.get("/", (req, res) => {
  res.send("Welcome to Movie Info!");
});

app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

app.get("/movies", passport.authenticate("jwt", { session: false }), (req, res) => {
  Movies.find()
    .then((movies) => res.status(200).json(movies))
    .catch((error) => res.status(500).send("Error: " + error));
});

app.get("/movies/:title", passport.authenticate("jwt", { session: false }), (req, res) => {
  Movies.findOne({ title: req.params.title })
    .then((movie) => {
      if (!movie) {
        return res.status(404).send("Movie not found");
      }
      return res.status(200).json(movie);
    })
    .catch((error) => res.status(500).send("Error: " + error));
});

app.get("/genres/:Name", passport.authenticate("jwt", { session: false }), (req, res) => {
  Movies.findOne({ "genres.Name": req.params.Name })
    .then((movie) => {
      if (!movie) {
        return res.status(404).send("Genre not found");
      }
      return res.status(200).json(movie.genres);
    })
    .catch((error) => res.status(500).send("Error: " + error));
});

app.get("/directors/:Name", passport.authenticate("jwt", { session: false }), (req, res) => {
  Movies.findOne({ "directors.Name": req.params.Name })
    .then((movie) => {
      if (!movie) {
        return res.status(404).send("Director not found");
      }
      return res.status(200).json(movie.directors);
    })
    .catch((error) => res.status(500).send("Error: " + error));
});

app.get("/users", passport.authenticate("jwt", { session: false }), (req, res) => {
  Users.find()
    .then((users) => res.status(200).json(users))
    .catch((error) => res.status(500).send("Error: " + error));
});

app.get("/users/:Username", passport.authenticate("jwt", { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        return res.status(404).send("User not found");
      }
      return res.status(200).json(user);
    })
    .catch((error) => res.status(500).send("Error: " + error));
});

app.post("/users", userValidation, (req, res) => {
  if (!handleValidation(req, res)) {
    return;
  }

  const hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + " already exists");
      }

      return Users.create({
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      }).then((newUser) => res.status(201).json(newUser));
    })
    .catch((error) => res.status(500).send("Error: " + error));
});

app.put(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  userValidation,
  (req, res) => {
    if (!handleValidation(req, res)) {
      return;
    }

    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: Users.hashPassword(req.body.Password),
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true }
    )
      .then((updatedUser) => {
        if (!updatedUser) {
          return res.status(404).send("User not found");
        }
        return res.status(200).json(updatedUser);
      })
      .catch((error) => res.status(500).send("Error: " + error));
  }
);

app.post(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $addToSet: { FavouriteMovies: req.params.MovieID } },
      { new: true }
    )
      .then((updatedUser) => {
        if (!updatedUser) {
          return res.status(404).send("User not found");
        }
        return res.status(200).json(updatedUser);
      })
      .catch((error) => res.status(500).send("Error: " + error));
  }
);

app.delete(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull: { FavouriteMovies: req.params.MovieID } },
      { new: true }
    )
      .then((updatedUser) => {
        if (!updatedUser) {
          return res.status(404).send("User not found");
        }
        return res.status(200).json(updatedUser);
      })
      .catch((error) => res.status(500).send("Error: " + error));
  }
);

app.delete("/users/:Username", passport.authenticate("jwt", { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        return res.status(404).send(req.params.Username + " was not found");
      }
      return res.status(200).send(req.params.Username + " was deleted.");
    })
    .catch((error) => res.status(500).send("Error: " + error));
});

app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).send("Something went wrong.");
});

const port = process.env.PORT || 8081;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
