const axios = require("axios");
const { connect, StringCodec } = require("nats");
const natsUrl = process.env.NATS_URL || "nats://localhost:4222";
const WEBHOOK_URL = process.env.WEBHOOK_URL || "";

async function connectNats() {
  const nc = await connect({ servers: natsUrl });
  console.log("Broadcaster connected to NATS server");
  return nc;
}

async function setupSubscription(nc) {
  const sc = StringCodec();
  const sub = nc.subscribe("todo_status", { queue: "broadcaster" });
  for await (const m of sub) {
    const event = JSON.parse(sc.decode(m.data));
    console.log(`New todo created by ${event.user}: ${event.message}`);
    try {
      await axios.post(WEBHOOK_URL, {
        content: `New todo created by **${event.user}**: ${event.message}`,
      });
      console.log("Discord notification sent");
    } catch (error) {
      console.error("Error sending Discord notification:", error.message);
    }
  }
  console.log("subscription closed");
}

async function start() {
  try {
    const nc = await connectNats();
    setupSubscription(nc);
  } catch (error) {
    console.error("Error starting broadcaster:", error);
    throw error;
  }
}

start();
