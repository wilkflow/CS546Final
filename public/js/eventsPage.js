/*List of features:
Search bar
Event Cards OR Event List

Functions:
loadEvents()
renderEvent()
handleSearch()
cardClickHandler()

*/

document.addEventListener("DOMContentLoaded", () => {
  loadEvents();
  document.getElementById("search-btn").addEventListener("click", handleSearch);
});

const loadEvents = async () => {
  const res = await fetch("/events");
  
  const events = await res.json();
  //console.log(events)
  const table_body = document.getElementById("events-table-body");
  table_body.innerHTML = "";

  events.forEach((event) => {
    table_body.appendChild(renderEvent(event));
  });

  cardClickHandler();
};

const renderEvent = (event) => {
  const tr = document.createElement("tr");
  tr.classList.add("event-row");
  tr.dataset.id = event._id;

  tr.innerHTML = `<td>${event.title}</td>
  <td>${new Date(event.date).toLocaleString()}</td>
  <td>${event.category}</td>
  <td>${event.attendees.length}/${event.maxCapacity}</td>
  <td><button class="view-btn">View</button></td>`;

  return tr;
};

const handleSearch = async () => {
  const keyword = document.getElementById("search-input").value.trim();
  const res = await fetch(`/events?search=${encodeURIComponent(keyword)}`);
  const events = await res.json();

  const table_body = document.getElementById("events-table-body");
  table_body.innerHTML = "";

  events.forEach((event) => {
    table_body.appendChild(renderEvent(event));
  });

  cardClickHandler();
};

const cardClickHandler = () => {
  document.querySelectorAll(".view-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const eventId = e.target.closest(".event-row").dataset.id;
      window.location.href = `/events/${eventId}`;
    });
  });
};
