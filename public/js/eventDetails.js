/* Features:
Event Information
RSVP button
Like button
Save button
Comments
Ratings

loadEventDetails()
handleRSVP()
handleLike()
handleSave()
loadComments()
submitComment()
loadReviews()
submitReview()
*/
document.addEventListener("DOMContentLoaded", () => {
  loadEventDetails();
  document.getElementById("rsvp-btn").addEventListener("click", handleRSVP);
  document.getElementById("like-btn").addEventListener("click", handleLike);
  document.getElementById("save-btn").addEventListener("click", handleSave);
  document
    .getElementById("comment-form")
    .addEventListener("submit", submitComment);
  document
    .getElementById("review-form")
    .addEventListener("submit", submitReview);
});

const loadEventDetails = async () => {
  const eventId = window.location.pathname.split("/").pop();
  const res = await fetch(`/event/${eventId}`);
  const event = await res.json();

  document.getElementById("event-title").textContent = event.title;
  document.getElementById("event-description").textContent = event.description;
  document.getElementById("event-date").textContent = new Date(
    event.date
  ).toLocaleString();
  document.getElementById("event-category").textContent = event.category;
  document.getElementById(
    "event-capacity"
  ).textContent = `${event.attendees.length}/${event.maxCapacity}`;

  loadComments();
  loadReviews();
};

const handleRSVP = async () => {
  const eventId = window.location.pathname.split("/").pop();
  await fetch(`/events/${eventId}/rsvp`, { method: "POST" });
  //loadEventDetails();
};

const handleSave = async () => {
  const eventId = window.location.pathname.split("/").pop();
  await fetch(`/events/${eventId}/save`, { method: "POST" });
  //loadEventDetails();
};

const loadComments = async () => {
  const eventId = window.location.pathname.split("/").pop();
  const res = await fetch(`/events/${eventId}/comments`);
  const comments = await res.json();

  const container = document.getElementById("comments-container");
  container.innerHTML = "";

  comments.forEach((comment) => {
    const p = document.createElement("p");
    p.textContent = `${comment.user}: ${comment.text}`;
    container.appendChild(p);
  });
};

const submitComment = async (e) => {
  e.preventDefault();
  const eventId = window.location.pathname.split("/").pop();
  const commentText = document.getElementById("comment-text").value.trim();

  if (!commentText) return;

  await fetch(`/events/${eventId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: commentText }),
  });

  document.getElementById("comment-text").value = "";
  loadComments();
};

const loadReviews = async () => {
  const eventId = window.location.pathname.split("/").pop();
  const res = await fetch(`/events/${eventId}/reviews`);
  const reviews = await res.json();

  const container = document.getElementById("reviews-container");
  container.innerHTML = "";

  reviews.forEach((review) => {
    const p = document.createElement("p");
    p.textContent = `${review.user}: Rating = ${review.rating} - ${review.text}`;
    container.appendChild(p);
  });
};

const submitReview = async (e) => {
  e.preventDefault();
  const eventId = window.location.pathname.split("/").pop();
  const rating = document.getElementById("rating").value;
  const reviewText = document.getElementById("review-text").value.trim();

  if (!rating || !reviewText) return;

  await fetch(`/events/${eventId}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rating, text: reviewText }),
  });

  loadReviews();
};
