const  express = require("express"),
	   app = express(),
	   bodyParser = require("body-parser"),
	   mongoose = require("mongoose"),
	   seedDB = require("./seeds"),	   
	   passport = require("passport"),
	   LocalStrategy = require("passport-local"),
	   Campground = require("./models/campground"),
	   Comment = require("./models/comment"),
	   User = require("./models/user"),
	   methodOverride = require("method-override"),
	   flash = require("connect-flash");

//requiring routes
const commentRoutes = require("./routes/comments"),
	  campgroundRoutes = require("./routes/campgrounds"),
	  authRoutes = require("./routes/index");

//mongodb+srv://test1:test1@cluster0-14rqk.mongodb.net/test?retryWrites=true&w=majority
console.log(process.env.DATABASEURL);
mongoose.connect(process.env.DATABASEURL,{
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {		
	console.log("connected to DB!");
}).catch(err => {
	console.log("error:", err.message);
});



app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname +"/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "YelpCamp",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});


app.use("/", authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);



app.listen(process.env.PORT || 3000, function(){
    console.log("server is listening");
});