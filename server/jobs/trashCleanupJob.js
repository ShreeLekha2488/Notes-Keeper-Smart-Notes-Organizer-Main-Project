const cron = require("node-cron");
const cleanupTrash = require("../services/trashCleanupService");

// Runs every day at 12:00 AM
cron.schedule("0 0 * * *", async () => {
  console.log("🕛 Running scheduled trash cleanup...");

  await cleanupTrash();
});

module.exports = cron;