import express from "express";
import exphbs from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "landing-page/views"));

app.use("/public", express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/login", (req, res) => {
  res.render("landing/login");
});

app.get("/signup", (req, res) => {
  res.render("landing/signup");
});

app.get("/", (req, res) => {
  res.send(`
    <h1>Signup/Login</h1>
    <a href="/signup">Sign Up</a><br />
    <a href="/login">Login</a>    
    <h1>Communities</h1>
  `);
});



app.listen(3000, () => {
  console.log(`Server running at http://localhost:3000`);
});
