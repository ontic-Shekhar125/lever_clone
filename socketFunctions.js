const path = require("path");

const RecentActivity = require("./models/recentActivity");
let io; // Declare io variable

const initLogger = (socketIoInstance) => {
  io = socketIoInstance; // Assign io when called in server.js
};
async function logActivity(message) {
  const activity = await RecentActivity.create({ message });
  io.emit("new-activity", activity); // Send to all connected clients
}

module.exports = { logActivity,initLogger };
