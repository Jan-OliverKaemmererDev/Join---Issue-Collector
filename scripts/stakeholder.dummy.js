const DAILY_LIMIT = 10;
const AUTH_TOKEN = "YOUR_FIREBASE_AUTH_TOKEN";
let currentCount = 0;

/**
 * Gets the current date formatted as YYYY-MM-DD.
 * @returns {string} The formatted date string.
 */
function getTodayString() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Constructs the Firebase RTDB URL for the current day.
 * @returns {string} The authenticated Firebase URL.
 */
function getFirebaseUrl() {
  return `https://join-4e7df-default-rtdb.europe-west1.firebasedatabase.app/daily_limits/${getTodayString()}.json?auth=${AUTH_TOKEN}`;
}

/**
 * Initializes the stakeholder page and sets up the RTDB listener.
 */
function initStakeholder() {
  const evtSource = new EventSource(getFirebaseUrl());
  evtSource.addEventListener("put", handleStreamEvent);
  evtSource.addEventListener("patch", handleStreamEvent);
  evtSource.onerror = handleStreamError;
}

/**
 * Handles incoming stream events from Firebase RTDB.
 * @param {MessageEvent} e - The Server-Sent Event message.
 */
function handleStreamEvent(e) {
  try {
    const parsedData = JSON.parse(e.data);
    parseFirebaseData(parsedData);
  } catch (err) {
    console.error("Error parsing RTDB stream data:", err);
  }
}

/**
 * Logs EventSource errors.
 * @param {Event} err - The error event.
 */
function handleStreamError(err) {
  console.error("EventSource failed:", err);
}

/**
 * Parses Firebase data object and updates the current count.
 * @param {Object} parsedData - The parsed JSON data from Firebase.
 */
function parseFirebaseData(parsedData) {
  if (parsedData.path === "/") {
    updateCountFromRoot(parsedData.data);
  } else if (parsedData.path === "/count") {
    currentCount = parseInt(parsedData.data, 10);
    updateStakeholderUI(currentCount);
  }
}

/**
 * Updates count from the root data object.
 * @param {Object|number|null} data - The root data from Firebase.
 */
function updateCountFromRoot(data) {
  if (data && data.count !== undefined) {
    currentCount = parseInt(data.count, 10);
  } else if (typeof data === "number") {
    currentCount = data;
  } else {
    currentCount = 0;
  }
  updateStakeholderUI(currentCount);
}

/**
 * Updates the DOM based on the current request count.
 * @param {number} count - The number of requests used today.
 */
function updateStakeholderUI(count) {
  const counterSpan = document.getElementById("request-counter");
  if (count >= DAILY_LIMIT) {
    setLimitReachedUI(counterSpan);
  } else {
    setNormalUI(count, counterSpan);
  }
}

/**
 * Sets the UI to show the daily limit has been reached.
 * @param {HTMLElement} counterSpan - The counter element.
 */
function setLimitReachedUI(counterSpan) {
  counterSpan.textContent = `${DAILY_LIMIT} of ${DAILY_LIMIT} requests used today`;
  counterSpan.className = "counter-limit";
  toggleStateVisibility("state-limit", "state-normal");
  setStakeholderImage("stakeholder-limit-reached.png");
}

/**
 * Sets the UI to the normal state showing current count.
 * @param {number} count - The current request count.
 * @param {HTMLElement} counterSpan - The counter element.
 */
function setNormalUI(count, counterSpan) {
  counterSpan.textContent = `${count} of ${DAILY_LIMIT} requests used today`;
  counterSpan.className = "counter-normal";
  toggleStateVisibility("state-normal", "state-limit");
  setStakeholderImage("stakeholder.png");
}

/**
 * Toggles visibility between two state elements.
 * @param {string} showId - The ID of the element to show.
 * @param {string} hideId - The ID of the element to hide.
 */
function toggleStateVisibility(showId, hideId) {
  document.getElementById(showId).classList.remove("d-none");
  document.getElementById(hideId).classList.add("d-none");
}

/**
 * Updates the stakeholder illustration image.
 * @param {string} imageName - The filename of the image.
 */
function setStakeholderImage(imageName) {
  const img = document.getElementById("stakeholder-img");
  img.src = `./assets/issue-collector/${imageName}`;
}

/**
 * Handles the button click for creating an email request.
 */
async function createEmailRequest() {
  if (currentCount >= DAILY_LIMIT) return;
  const newCount = currentCount + 1;
  updateStakeholderUI(newCount);
  await patchFirebaseCount(newCount);
  openEmailClient();
}

/**
 * Sends a PATCH request to Firebase to update the count.
 * @param {number} newCount - The new request count to save.
 */
async function patchFirebaseCount(newCount) {
  try {
    await fetch(getFirebaseUrl(), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ count: newCount })
    });
  } catch (e) {
    console.error("Error updating limit in Firebase:", e);
  }
}

/**
 * Opens the user's default email client with a pre-filled subject.
 */
function openEmailClient() {
  const link = document.createElement("a");
  link.href = "mailto:jowieja22@gmail.com?subject=New%20Join%20Request";
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
