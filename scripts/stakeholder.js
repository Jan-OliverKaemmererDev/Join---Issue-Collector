/**
 * URL of the n8n webhook that returns the current daily request count.
 * Replace this with your actual n8n webhook URL.
 */
const N8N_WEBHOOK_URL = 'https://your-n8n-url/webhook/get-request-count';
const DAILY_LIMIT = 10;

/**
 * Initializes the stakeholder page by fetching the current request count and updating the UI.
 */
async function initStakeholder() {
  let count = 0;
  
  try {
    // Try fetching the count from the n8n webhook
    // Uncomment the code below once the webhook URL is valid
    /*
    const response = await fetch(N8N_WEBHOOK_URL);
    if (response.ok) {
      const data = await response.json();
      count = data.count || 0;
    }
    */
    // For now, simulating the limit check. You can change this to test.
    // count = 10; 
  } catch (error) {
    console.error('Error fetching request limit from n8n:', error);
  }

  updateStakeholderUI(count);
}

/**
 * Updates the DOM based on the current request count.
 * @param {number} count - The number of requests used today.
 */
function updateStakeholderUI(count) {
  const counterSpan = document.getElementById('request-counter');
  const stateNormal = document.getElementById('state-normal');
  const stateLimit = document.getElementById('state-limit');
  const stakeholderImg = document.getElementById('stakeholder-img');

  if (count >= DAILY_LIMIT) {
    counterSpan.textContent = `${DAILY_LIMIT} of ${DAILY_LIMIT} requests used today`;
    counterSpan.className = 'counter-limit';
    
    stateNormal.classList.add('d-none');
    stateLimit.classList.remove('d-none');
    stakeholderImg.src = './assets/issue-collector/stakeholder-limit-reached.png';
  } else {
    counterSpan.textContent = `${count} of ${DAILY_LIMIT} requests used today`;
    counterSpan.className = 'counter-normal';
    
    stateNormal.classList.remove('d-none');
    stateLimit.classList.add('d-none');
    stakeholderImg.src = './assets/issue-collector/stakeholder.png';
  }
}

/**
 * Handles the button click for creating an email request.
 */
function createEmailRequest() {
  // Logic to open email client or send request via another n8n webhook.
  window.location.href = "mailto:jowieja22@gmail.com?subject=New%20Join%20Request";
}
