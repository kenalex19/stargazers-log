const list = document.querySelector("#starred");
const status = document.querySelector("#status");

function isRepository(event) {
  return event
    && typeof event.name === "string"
    && event.name.trim() !== ""
    && typeof event.starred === "string"
    && event.starred.trim() !== "";
}

function showError(message) {
  list.replaceChildren();
  list.setAttribute("aria-busy", "false");
  status.textContent = message;
}

async function loadRepositories() {
  try {
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const events = await response.json();
    if (!Array.isArray(events) || !events.every(isRepository)) {
      throw new Error("Repository data has an invalid format");
    }

    const items = events.map((event) => {
      const item = document.createElement("li");
      item.textContent = `${event.name} — starred ${event.starred}`;
      return item;
    });

    list.replaceChildren(...items);
    list.setAttribute("aria-busy", "false");
    status.textContent = events.length === 0
      ? "No starred repositories found."
      : `${events.length} starred repositories loaded.`;
  } catch (error) {
    console.error(error);
    showError("The starred repositories could not be loaded. Please try again later.");
  }
}

loadRepositories();
