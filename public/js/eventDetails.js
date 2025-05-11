/* Features:
Event Information
RSVP button
Like button
Comments
Ratings

loadEventDetails()
handleRSVP()
handleLike()
loadComments()
submitComment()
loadReviews()
submitReview()
*/
document.addEventListener("DOMContentLoaded", () => {
  loadEventDetails();
  document.getElementById("rsvp-btn").addEventListener("click", handleRSVP);
  document.getElementById("like-btn").addEventListener("click", handleLike);
  document
    .getElementById("comment-form")
    .addEventListener("submit", submitComment);
  document
    .getElementById("review-form")
    .addEventListener("submit", submitReview);
});

const loadEventDetails = async () => {
  const eventId = window.location.pathname.split("/").pop();
  const res = await fetch(`/events/${eventId}/data`);
  const event = await res.json();

  document.getElementById("event-title").textContent = event.title;
  document.getElementById("event-description").textContent = event.description;
  document.getElementById("event-date").textContent = new Date(
    event.date
  ).toLocaleString();
  document.getElementById("event-category").textContent = event.category;
  document.getElementById(
    "event-capacity"
  ).textContent = `${event.attendees_count}/${event.maxCapacity}`;
  document.getElementById("like-count").textContent = event.likes_count;
  document.getElementById("visibility").textContent = event.friendsOnly
    ? "Friends Only"
    : "Public";

  loadComments();
  loadReviews();
};

const handleRSVP = async () => {
  const eventId = window.location.pathname.split("/").pop();
  await fetch(`/events/${eventId}/rsvp`, { method: "POST" });
  // window.location.reload(); //Option 1: Reload full page to update page after pressing
  loadEventDetails(); //Option 2: Fetch call to NOT reload full page and directly update the UI elements dynamically
};

const handleLike = async () => {
  const eventId = window.location.pathname.split("/").pop();
  await fetch(`/events/${eventId}/like`, { method: "POST" });
  // window.location.reload(); //Option 1: Reload full page to update page after pressing
  loadEventDetails(); //Option 2: Fetch call to NOT reload full page and directly update the UI elements dynamically
};

const loadComments = async () => {
  try {
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
  } catch (e) {
    alert(e);
  }
};

const submitComment = async (e) => {
  e.preventDefault();
  const eventId = window.location.pathname.split("/").pop();
  const commentText = document.getElementById("comment-text").value.trim();

  //input check
  if (!commentText) {
    alert("Please enter a comment.");
    return;
  }
  //Safeguard
  try {
    const res = await fetch(`/events/${eventId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: commentText }),
    });
    if (!res.ok) {
      const error = await res.json();
      alert(error.error || "Failed to submit comment.");
      return;
    }
    document.getElementById("comment-text").value = "";
    loadComments();
  } catch (err) {
    console.error("Error submitting comment:", err);
    alert("Something went wrong while submitting your comment.");
  }
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
  const rating = parseInt(document.getElementById("rating").value, 10);
  const reviewText = document.getElementById("review-text").value.trim();

  // input checks
  if (!reviewText) {
    alert("Please enter review text.");
    return;
  }

  if (isNaN(rating) || rating < 1 || rating > 5) {
    alert("Rating must be a number between 1 and 5.");
    return;
  }

  // try catch safeguard
  try {
    const res = await fetch(`/events/${eventId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, text: reviewText }),
    });
    if (!res.ok) {
      const error = await res.json();
      alert(error.error || "Failed to submit review.");
      return;
    }
    document.getElementById("review-text").value = "";
    loadReviews();
  } catch (err) {
    console.error("Error submitting review:", err);
    alert("Something went wrong while submitting your review.");
  }
};
