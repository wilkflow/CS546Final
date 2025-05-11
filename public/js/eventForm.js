/* Features:
Event form (title, description, category, date/time, max capacity)
Validation message (input validation errors)
Submit button

Functions:
validateForm()
submitForm()
loadEventEdit() - pre-fill the form if editing an existing form
*/

document.addEventListener("DOMContentLoaded", () => {
  loadEventEdit();
  document.getElementById("event-form").addEventListener("submit", submitForm);
});

const validateForm = () => {
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const category = document.getElementById("category").value.trim();
  const date = document.getElementById("date").value.trim();
  const capacityRaw = document.getElementById("max-capacity").value.trim();
  const friendsOnly = document.getElementById("friends-only").checked;
  if (!title || !description || !category || !date || !capacityRaw) {
    throw "All fields must be filled.";
  }

  //string validations
  if (typeof title !== "string" || title.length < 3)
    throw "Title must be at least 3 characters.";
  if (typeof description !== "string" || description.length < 10)
    throw "Description must be at least 10 characters.";
  if (typeof category !== "string" || category.length < 3)
    throw "Category must be at least 3 characters.";

  //capacity validation
  const capacity = parseInt(capacityRaw, 10);
  if (isNaN(capacity) || capacity <= 0)
    throw "Capacity must be a positive whole number.";

  //date validation
  const eventDate = new Date(date);
  const now = new Date();
  if (isNaN(eventDate.getTime()))
    throw "Invalid date format. Please provide a valid date.";
  if (eventDate < now) throw "Event date must be in the future.";

  return { title, description, category, date, capacity, friendsOnly };
};

async function submitForm(e) {
  e.preventDefault();
  let valdat;
  try {
    valdat = validateForm();
  } catch (error) {
    alert(error);
    document.getElementById("error-message").textContent = error.message;
    return;
  }
  const eventId = document.getElementById("event-id")?.value; //only get .value if it exists
  const newEvent = {
    title: valdat.title,
    description: valdat.description,
    category: valdat.category,
    date: valdat.date,
    maxCapacity: valdat.capacity,
    friendsOnly: valdat.friendsOnly,
  };

  const url = eventId ? `/events/${eventId}` : "/events";
  await fetch(url, {
    method: eventId ? "PUT" : "POST", //make and put new if eventId exists, otherwise, post
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newEvent),
  });

  window.location.href = "/events_feed";
}

async function loadEventEdit() {
  const eventId = document.getElementById("event-id")?.value;
  if (!eventId) return;

  const res = await fetch(`/events/${eventId}/data`);
  const event = await res.json();

  document.getElementById("title").value = event.title;
  document.getElementById("description").value = event.description;
  document.getElementById("category").value = event.category;
  document.getElementById("date").value = new Date(event.date).toLocaleString();
  document.getElementById("max-capacity").value = event.maxCapacity;
  document.getElementById("friends-only").checked = event.friendsOnly === true;
}
