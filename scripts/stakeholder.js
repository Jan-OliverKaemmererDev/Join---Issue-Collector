const N8N_WEBHOOK_URL = "https://your-n8n-url/webhook/get-request-count";
const FIREBASE_RTDB_URL = "https://join-4e7df-default-rtdb.europe-west1.firebasedatabase.app/daily_limits.json";
const DAILY_LIMIT = 10;

let currentCount = 0;

/**
 * Initializes the stakeholder page by setting up a real-time listener to Firebase RTDB.
 */
function initStakeholder() {
  const evtSource = new EventSource(FIREBASE_RTDB_URL);

  evtSource.addEventListener("put", function (e) {
    try {
      const parsedData = JSON.parse(e.data);
      if (parsedData.path === "/") {
        const val = parsedData.data;
        if (val !== null) {
          currentCount = parseInt(val, 10);
        } else {
          currentCount = 0;
        }
        updateStakeholderUI(currentCount);
      }
    } catch (err) {
      console.error("Error parsing RTDB stream data:", err);
    }
  });

  evtSource.onerror = function (err) {
    console.error("EventSource failed:", err);
  };
}

/**
 * Updates the DOM based on the current request count.
 * @param {number} count - The number of requests used today.
 */
function updateStakeholderUI(count) {
  const counterSpan = document.getElementById("request-counter");
  const stateNormal = document.getElementById("state-normal");
  const stateLimit = document.getElementById("state-limit");
  const stakeholderImg = document.getElementById("stakeholder-img");

  if (count >= DAILY_LIMIT) {
    counterSpan.textContent = `${DAILY_LIMIT} of ${DAILY_LIMIT} requests used today`;
    counterSpan.className = "counter-limit";

    stateNormal.classList.add("d-none");
    stateLimit.classList.remove("d-none");
    stakeholderImg.src =
      "./assets/issue-collector/stakeholder-limit-reached.png";
  } else {
    counterSpan.textContent = `${count} of ${DAILY_LIMIT} requests used today`;
    counterSpan.className = "counter-normal";

    stateNormal.classList.remove("d-none");
    stateLimit.classList.add("d-none");
    stakeholderImg.src = "./assets/issue-collector/stakeholder.png";
  }
}

/**
 * Handles the button click for creating an email request.
 */
async function createEmailRequest() {
  if (currentCount < DAILY_LIMIT) {
    const newCount = currentCount + 1;
    
    // Optimistic UI update
    updateStakeholderUI(newCount);

    try {
      await fetch(FIREBASE_RTDB_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCount)
      });
    } catch (e) {
      console.error("Error updating limit in Firebase:", e);
    }

    const link = document.createElement("a");
    link.href = "mailto:jowieja22@gmail.com?subject=New%20Join%20Request";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
