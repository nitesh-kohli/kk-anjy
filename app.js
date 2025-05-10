const express = require("express");
const session = require("express-session");
const path = require("path");
const users = require("./users");

const app = express();
const PORT = 3000;


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));}
);

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
}
);


// Middleware to parse form data
app.use(express.urlencoded({extended:true}));

//serve the static file
app.use(express.static(path.join(__dirname, "public")));


// Setup session
// secret: Protects the session with a unique key.
// resave: Avoids saving the session unless necessary.
// saveUninitialized: Avoids saving empty sessions.
app.use(session({
  secret: "mySecretKey",
  resave: false,
  saveUninitialized: false
}));

app.post('/login', (req,res) => {
    const {username, password} = req.body;
    const user = users.find(u => u.username == username && u.password == password);

    if(user){
        req.session.user = user.username;
        res.redirect("/dashboard");
    }
    else {
        res.redirect("/index.html?error=1");
    }
})

// Protect dashboard.html
app.use("/dashboard.html", (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/index.html");
  }
});



// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});