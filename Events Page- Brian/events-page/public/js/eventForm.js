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
  const capacity = document.getElementById("max-capacity").value.trim();

  if (!title || !description || !category || !date || !capacity) {
    throw "All fields must be filled.";
  }
  if (title === undefined || title === null) throw "Title must be filled";
  if (description === undefined || description === null)
    throw "Description must be filled";
  if (category === undefined || category === null)
    throw "Category must be filled";
  if (date === undefined || date === null) throw "Date must be filled";
  if (capacity === undefined || capacity === null)
    throw "Capacity must be filled";
  if (isNaN(capacity) || capacity <= 0) {
    throw "Capacity must be a positive number";
  }
  // add in valid checks for date and all the strings:
  //TODO
};

async function submitForm(e) {
  e.preventDefault();

  try {
    validateForm();
  } catch (error) {
    document.getElementById("error-message").textContent = error.message;
    return;
  }

  const eventId = document.getElementById("event-id")?.value; //only get .value if it exists
  const newEvent = {
    title: document.getElementById("title").value.trim(),
    description: document.getElementById("description").value.trim(),
    category: document.getElementById("category").value.trim(),
    date: document.getElementById("date").value.trim(),
    maxCapacity: parseInt(document.getElementById("max-capacity").value.trim()),
  };

  const url = eventId ? `/events/${eventId}` : "/events";

  await fetch(url, {
    method: eventId ? "PUT" : "POST", //make and put new if eventId exists, otherwise, post
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newEvent),
  });

  window.location.href = "/events";
}

async function loadEventEdit() {
  const eventId = document.getElementById("event-id")?.value;
  if (!eventId) return;

  const res = await fetch(`/events/${eventId}`);
  const event = await res.json();

  document.getElementById("title").value = event.title;
  document.getElementById("description").value = event.description;
  document.getElementById("category").value = event.category;
  document.getElementById("date").value = event.date.split(".")[0];
  document.getElementById("max-capacity").value = event.maxCapacity;
}
