// Run from backend: node scripts/check-chat.cjs
// Sends one synthetic question without MongoDB access or patient information.
const path = require("node:path");
require("dotenv").config({
  path: path.join(__dirname, "../.env")
});
require("node:dns").setServers(["1.1.1.1", "1.0.0.1"]);
const {
  getChatConfig,
  generateReply
} = require("../services/chatService");
async function main() {
  try {
    const config = getChatConfig();
    console.log("Provider:", config.provider);
    console.log("Model:", config.model);
    console.log("Credential configured:", Boolean(config.apiKey));
    await generateReply({
      language: "en",
      directory: [],
      config,
      messages: [{
        role: "user",
        content: "Where is the appointment page in Zoi?"
      }]
    });
    console.log("PASS: AI provider returns a non-empty reply.");
  } catch (error) {
    // Never print raw errors, HTTP bodies, headers, credentials or prompts.
    console.log("FAIL:", error.code || "CHAT_UNAVAILABLE");
    if (error.diagnostic?.upstreamStatus) console.log("Provider HTTP status:", error.diagnostic.upstreamStatus);
    if (error.diagnostic?.networkCode) console.log("Network code:", error.diagnostic.networkCode);
    const hints = {
      400: "The provider rejects the request format or model parameters.",
      401: "The provider rejects the credential.",
      403: "Check API key restrictions, project access and regional availability.",
      404: "The configured model or endpoint is unavailable to this API project.",
      429: "The provider quota or rate limit is exhausted; do not enable paid billing just to test."
    };
    if (hints[error.diagnostic?.upstreamStatus]) console.log(hints[error.diagnostic.upstreamStatus]);
    process.exitCode = 1;
  }
}
main();
