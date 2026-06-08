let events = [
    {
        id: generateId(),
        name: "Annual Tech Summit 2026",
        date: "2026-07-15",
        description: "Join industry leaders for a day of innovation, keynote speeches, and networking. Explore the latest trends in AI, cloud computing, and cybersecurity."
    },
    {
        id: generateId(),
        name: "Summer Music Festival",
        date: "2026-08-22",
        description: "A vibrant outdoor music festival featuring live performances from top artists across genres. Food trucks, art installations, and good vibes all day long."
    },
    {
        id: generateId(),
        name: "Charity Gala Night",
        date: "2026-06-30",
        description: "An elegant black-tie evening dedicated to raising funds for underprivileged communities. Live auction, fine dining, and inspirational speakers."
    },
    {
        id: generateId(),
        name: "Spring Design Workshop",
        date: "2026-03-10",
        description: "A hands-on workshop exploring modern UI/UX design principles, prototyping tools, and design systems. Perfect for aspiring designers."
    },
    {
        id: generateId(),
        name: "New Year Countdown Bash",
        date: "2025-12-31",
        description: "Ring in the new year with an unforgettable countdown party! DJ sets, fireworks, champagne toast, and a midnight celebration."
    },
    {
        id: generateId(),
        name: "Community Fitness Run",
        date: "2026-09-05",
        description: "A 5K fun run open to all ages and fitness levels. Promote health and community spirit while enjoying scenic routes and post-run refreshments."
    }
];
// ---------- DOM Element References ----------
const eventsListEl = document.getElementById("events-list");
const eventCountEl = document.getElementById("event-count");
const noEventsEl = document.getElementById("no-events-message");
const noSearchEl = document.getElementById("no-search-results");
const eventForm = document.getElementById("event-form");
const formWarning = document.getElementById("form-warning");
const warningText = document.getElementById("warning-text");
const eventNameInput = document.getElementById("event-name");
const eventDateInput = document.getElementById("event-date");
const eventDescInput = document.getElementById("event-description");
const addEventBtn = document.getElementById("add-event-btn");
const searchBar = document.getElementById("search-bar");
const clearSearchBtn = document.getElementById("clear-search");
const currentYearEl = document.getElementById("current-year");
// ---------- Utility Functions ----------
/** Generate a simple unique ID */
function generateId() {
    return "_" + Math.random().toString(36).substring(2, 11);
}
/** Check if a date string is in the past */
function isPastEvent(dateStr) {
    const eventDate = new Date(dateStr + "T23:59:59");
    const today = new Date();
    return eventDate < today;
}
/** Format a date string to a readable format */
function formatDate(dateStr) {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", options);
}
/** Sort events by date ascending */
function sortEventsByDate() {
    events.sort((a, b) => new Date(a.date) - new Date(b.date));
}
// ---------- Rendering ----------
/** Render all events to the DOM */
function renderEvents(filteredEvents = null) {
    const list = filteredEvents !== null ? filteredEvents : events;
    eventsListEl.innerHTML = "";
    // Update event count
    const totalCount = events.length;
    eventCountEl.textContent = `${totalCount} event${totalCount !== 1 ? "s" : ""}`;
    // Show/hide no-events messages
    if (events.length === 0) {
        noEventsEl.style.display = "block";
        noSearchEl.style.display = "none";
        return;
    } else {
        noEventsEl.style.display = "none";
    }
    if (list.length === 0) {
        noSearchEl.style.display = "block";
        return;
    } else {
        noSearchEl.style.display = "none";
    }
    // Render each event card
    list.forEach((event, index) => {
        const past = isPastEvent(event.date);
        const card = document.createElement("div");
        card.classList.add("event-card", past ? "past" : "upcoming");
        card.setAttribute("data-id", event.id);
        card.style.animationDelay = `${index * 0.06}s`;
        card.innerHTML = `
            <div class="event-card-header">
                <h3 class="event-card-name">${escapeHTML(event.name)}</h3>
                <span class="event-status-badge ${past ? "past" : "upcoming"}">
                    ${past ? "Past" : "Upcoming"}
                </span>
            </div>
            <div class="event-card-date">
                <span>📅</span>
                <span>${formatDate(event.date)}</span>
            </div>
            <p class="event-card-description">${escapeHTML(event.description)}</p>
            <button class="delete-btn" data-id="${event.id}" aria-label="Delete ${escapeHTML(event.name)}">
                🗑️ Delete
            </button>
        `;
        eventsListEl.appendChild(card);
    });
}
/** Escape HTML to prevent XSS */
function escapeHTML(str) {
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}
// ---------- Event Handlers ----------
/** Handle form submission — add a new event */
eventForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = eventNameInput.value.trim();
    const date = eventDateInput.value;
    const description = eventDescInput.value.trim();
    // Remove previous invalid states
    eventNameInput.classList.remove("invalid");
    eventDateInput.classList.remove("invalid");
    eventDescInput.classList.remove("invalid");
    // Validate all fields
    const missingFields = [];
    if (!name) {
        missingFields.push("Event Name");
        eventNameInput.classList.add("invalid");
    }
    if (!date) {
        missingFields.push("Event Date");
        eventDateInput.classList.add("invalid");
    }
    if (!description) {
        missingFields.push("Event Description");
        eventDescInput.classList.add("invalid");
    }
    if (missingFields.length > 0) {
        warningText.textContent = `Please fill in: ${missingFields.join(", ")}`;
        formWarning.style.display = "flex";
        // Re-trigger shake animation
        formWarning.style.animation = "none";
        // Force reflow
        formWarning.offsetHeight;
        formWarning.style.animation = "";
        return;
    }
    // Hide warning
    formWarning.style.display = "none";
    // Create new event
    const newEvent = {
        id: generateId(),
        name: name,
        date: date,
        description: description
    };
    events.push(newEvent);
    sortEventsByDate();
    // Clear search and re-render
    searchBar.value = "";
    clearSearchBtn.style.display = "none";
    renderEvents();
    // Reset form
    eventForm.reset();
    // Button success feedback
    const originalText = addEventBtn.innerHTML;
    addEventBtn.innerHTML = "<span class='btn-icon'>✓</span> Added!";
    addEventBtn.classList.add("btn-success");
    setTimeout(() => {
        addEventBtn.innerHTML = originalText;
        addEventBtn.classList.remove("btn-success");
    }, 1500);
    // Scroll to the new event card
    const newCard = eventsListEl.querySelector(`[data-id="${newEvent.id}"]`);
    if (newCard) {
        newCard.scrollIntoView({ behavior: "smooth", block: "center" });
    }
});
/** Remove invalid class on input focus */
eventNameInput.addEventListener("focus", () => eventNameInput.classList.remove("invalid"));
eventDateInput.addEventListener("focus", () => eventDateInput.classList.remove("invalid"));
eventDescInput.addEventListener("focus", () => eventDescInput.classList.remove("invalid"));
/** Handle delete event — using event delegation on the events list */
eventsListEl.addEventListener("click", function (e) {
    const deleteBtn = e.target.closest(".delete-btn");
    if (!deleteBtn) return;
    const eventId = deleteBtn.getAttribute("data-id");
    const card = eventsListEl.querySelector(`.event-card[data-id="${eventId}"]`);
    if (card) {
        // Play removal animation
        card.classList.add("removing");
        card.addEventListener("animationend", () => {
            events = events.filter((ev) => ev.id !== eventId);
            // Re-render considering active search
            const query = searchBar.value.trim().toLowerCase();
            if (query) {
                const filtered = filterEvents(query);
                renderEvents(filtered);
            } else {
                renderEvents();
            }
        }, { once: true });
    }
});
/** Filter events by name or date */
function filterEvents(query) {
    return events.filter((event) => {
        const nameMatch = event.name.toLowerCase().includes(query);
        const dateMatch = event.date.includes(query);
        const formattedDateMatch = formatDate(event.date).toLowerCase().includes(query);
        return nameMatch || dateMatch || formattedDateMatch;
    });
}
/** Handle search input */
searchBar.addEventListener("input", function () {
    const query = this.value.trim().toLowerCase();
    // Toggle clear button
    clearSearchBtn.style.display = query ? "flex" : "none";
    if (!query) {
        renderEvents();
        return;
    }
    const filtered = filterEvents(query);
    renderEvents(filtered);
});
/** Clear search */
clearSearchBtn.addEventListener("click", function () {
    searchBar.value = "";
    clearSearchBtn.style.display = "none";
    renderEvents();
    searchBar.focus();
});
// ---------- Initialization ----------
/** Set the current year in the footer */
currentYearEl.textContent = new Date().getFullYear();
/** Sort and render initial events */
sortEventsByDate();
renderEvents();
