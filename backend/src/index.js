const express = require("express");
const app = express();
const port = 3001;
// const morgan = require("morgan"); //HTTP request logger middleware
const path = require("path");
const route = require("./routes/mainRouter.js"); //config routing
const session = require("express-session");
const cors = require("cors");
const cookieParser = require("cookie-parser"); //save data to cookie

//session
app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "SexyMeoww",
    resave: false,
    saveUninitialized: true,
    cookie: {},
  })
);

global.__basedir = __dirname;

// res.body
app.use(
  express.urlencoded({
    extended: true,
  })
);

//Json
app.use(express.json());

//config static files
app.use(express.static(path.join(__dirname, "public")));

// //use morgan
// app.use(morgan("combined"));

//CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

//sign cookie
app.use(cookieParser(process.env.COOKIE_SECRET));

//routing init
route(app);

// console.log(process.env);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
