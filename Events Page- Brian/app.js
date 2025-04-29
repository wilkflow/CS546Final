//Very barebones frontend testing
import express from "express";
import exphbs from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "events-page/views"));

app.use("/public", express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/test/events", (req, res) => {
  res.render("events/eventsPage");
});

app.get("/test/event-details", (req, res) => {
  res.render("events/eventDetails");
});

app.get("/test/event-form", (req, res) => {
  res.render("events/eventForm", { eventId: null });
});

app.get("/test/event-edit", (req, res) => {
  res.render("events/eventForm", { eventId: "1234" });
});

app.get("/", (req, res) => {
  res.send(`
    <h1>Test Dashboard</h1>
    <ul>
      <li><a href="/test/events">Events List</a></li>
      <li><a href="/test/event-details">Event Details</a></li>
      <li><a href="/test/event-form">Create Event Form</a></li>
      <li><a href="/test/event-edit">Edit Event Form</a></li>
    </ul>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
