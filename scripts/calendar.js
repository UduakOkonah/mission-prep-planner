const CLIENT_ID = "791646561581-isasb62jc3l70ipaemmrg934aff3rhbn.apps.googleusercontent.com";
const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

let tokenClient;
let gapiInited = false;

document.addEventListener("DOMContentLoaded", initClient);

function initClient() {
  gapi.load("client", async () => {
    await gapi.client.init({ discoveryDocs: [DISCOVERY_DOC] }); // no API key
    gapiInited = true;
  });

  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: handleAuthResponse
  });

  document.getElementById("authorizeBtn").addEventListener("click", () => {
    tokenClient.requestAccessToken();
  });
}

async function handleAuthResponse(tokenResponse) {
  if (tokenResponse && tokenResponse.access_token) {
    document.getElementById("authorizeBtn").style.display = "none";
    document.getElementById("signoutBtn").style.display = "block";
    listUpcomingEvents();
  }
}

async function listUpcomingEvents() {
  const response = await gapi.client.calendar.events.list({
    calendarId: "primary",
    timeMin: new Date().toISOString(),
    showDeleted: false,
    singleEvents: true,
    maxResults: 5,
    orderBy: "startTime"
  });

  const events = response.result.items;
  const container = document.getElementById("calendarEvents");
  container.innerHTML = "<h3>Upcoming Events</h3>";

  if (!events || events.length === 0) {
    container.innerHTML += "<p>No upcoming events found.</p>";
    return;
  }

  events.forEach(event => {
    const start = event.start.dateTime || event.start.date;
    container.innerHTML += `<p>${start} — ${event.summary}</p>`;
  });
}
