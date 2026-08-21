const { app } = require("@azure/functions");

/**
 * Tour / admissions inquiry handler.
 *
 * Sends the submitted form to the school office by email using Microsoft Graph
 * with client-credentials auth, which works with the Microsoft 365 tenant the
 * school already has.
 *
 * Required application settings (Azure portal → Static Web App →
 * Configuration → Application settings):
 *
 *   GRAPH_TENANT_ID       Entra tenant ID
 *   GRAPH_CLIENT_ID       App registration (client) ID
 *   GRAPH_CLIENT_SECRET   Client secret for that app registration
 *   INQUIRY_FROM          Mailbox that sends, e.g. noreply@mywestside.org
 *   INQUIRY_TO            Where inquiries land, e.g. principal@mywestside.org
 *
 * The app registration needs the Microsoft Graph APPLICATION permission
 * Mail.Send, with admin consent granted.
 *
 * If the settings are absent the function returns 503 and the web form tells
 * the visitor to call the office instead. It never silently swallows a lead.
 */

const FIELDS = [
  ["parentName", "Parent name"],
  ["phone", "Phone"],
  ["email", "Email"],
  ["grades", "Grade(s) of interest"],
  ["year", "School year"],
  ["currentSchool", "Current school"],
  ["message", "Message"],
];

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function getGraphToken(tenantId, clientId, clientSecret) {
  const res = await fetch(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        scope: "https://graph.microsoft.com/.default",
        grant_type: "client_credentials",
      }),
    }
  );
  if (!res.ok) {
    throw new Error(`Token request failed: ${res.status} ${await res.text()}`);
  }
  return (await res.json()).access_token;
}

app.http("inquiry", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "inquiry",
  handler: async (request, context) => {
    let body;
    try {
      body = await request.json();
    } catch {
      return { status: 400, jsonBody: { error: "Invalid request body." } };
    }

    // Honeypot: real visitors never fill a hidden field. Bots do.
    if (body.website) {
      context.log("Inquiry rejected: honeypot filled.");
      return { status: 200, jsonBody: { ok: true } };
    }

    if (!body.parentName || !body.email || !body.phone) {
      return {
        status: 400,
        jsonBody: { error: "Name, phone and email are required." },
      };
    }

    const {
      GRAPH_TENANT_ID,
      GRAPH_CLIENT_ID,
      GRAPH_CLIENT_SECRET,
      INQUIRY_FROM,
      INQUIRY_TO,
    } = process.env;

    if (
      !GRAPH_TENANT_ID ||
      !GRAPH_CLIENT_ID ||
      !GRAPH_CLIENT_SECRET ||
      !INQUIRY_FROM ||
      !INQUIRY_TO
    ) {
      // Log the whole submission so a lead is never lost while email is
      // still being configured. Visible in the Static Web App's log stream.
      context.error(
        "Inquiry received but email is not configured. Submission: " +
          JSON.stringify(body)
      );
      return {
        status: 503,
        jsonBody: { error: "Email delivery is not configured yet." },
      };
    }

    const rows = FIELDS.map(
      ([key, label]) =>
        `<tr><th align="left" style="padding:4px 12px 4px 0;vertical-align:top">${label}</th>` +
        `<td style="padding:4px 0">${escapeHtml(body[key]) || "&mdash;"}</td></tr>`
    ).join("");

    const html =
      `<p>A tour request was submitted on the Academy website.</p>` +
      `<table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">${rows}</table>`;

    try {
      const token = await getGraphToken(
        GRAPH_TENANT_ID,
        GRAPH_CLIENT_ID,
        GRAPH_CLIENT_SECRET
      );

      const res = await fetch(
        `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(
          INQUIRY_FROM
        )}/sendMail`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: {
              subject: `Tour request — ${body.parentName}`,
              body: { contentType: "HTML", content: html },
              toRecipients: INQUIRY_TO.split(",").map((address) => ({
                emailAddress: { address: address.trim() },
              })),
              replyTo: [{ emailAddress: { address: body.email } }],
            },
            saveToSentItems: true,
          }),
        }
      );

      if (!res.ok) {
        throw new Error(`sendMail failed: ${res.status} ${await res.text()}`);
      }
    } catch (err) {
      // Log the submission alongside the failure so it can still be followed up.
      context.error(
        `Inquiry email failed: ${err.message}. Submission: ${JSON.stringify(body)}`
      );
      return { status: 502, jsonBody: { error: "Could not send the message." } };
    }

    return { status: 200, jsonBody: { ok: true } };
  },
});
