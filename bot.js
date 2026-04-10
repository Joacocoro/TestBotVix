const tmi = require("tmi.js");
const axios = require("axios");

const BOT_USERNAME = "ranitabot_vix";
const OAUTH_TOKEN = "oauth:4gkudl1nvk8cpocm6wvh0lvdrc576f";
const ACCESS_TOKEN = "4gkudl1nvk8cpocm6wvh0lvdrc576f";
const CLIENT_ID = "gp762nuuoqcoxypju8c569th9wz7q5";

const client = new tmi.Client({
    identity: {
        username: BOT_USERNAME,
        password: OAUTH_TOKEN
    },
    channels: ["joaco_coro"]
});

const bannedWords = ["puto", "puta", "pvto", "pvta"];

// ✅ ESTA FUNCIÓN VA AFUERA
async function getBotId() {
    try {
        const res = await axios.get(
            "https://api.twitch.tv/helix/users?login=ranitabot_vix",
            {
                headers: {
                    "Client-ID": CLIENT_ID,
                    "Authorization": `Bearer ${ACCESS_TOKEN}`
                }
            }
        );

        console.log("🤖 Datos bot:", res.data.data[0]);
    } catch (error) {
        console.log("❌ Error:", error.response?.data || error.message);
    }
}

client.connect();
getBotId();

async function timeoutUser(userId) {
    await axios.post(
        `https://api.twitch.tv/helix/moderation/bans?broadcaster_id=147876970&moderator_id=1478420732`,
        {
            data: {
                user_id: userId,
                duration: 30,
                reason: "Palabra prohibida"
            }
        },
        {
            headers: {
                "Client-ID": CLIENT_ID,
                "Authorization": `Bearer ${ACCESS_TOKEN}`,
                "Content-Type": "application/json"
            }
        }
    );
}

client.on("message", async (channel, tags, message, self) => {
    if (self) return;

    const lowerMessage = message.toLowerCase();

    if (bannedWords.some(word => lowerMessage.includes(word))) {
        console.log("⚠️ palabra detectada");

        try {
            await timeoutUser(tags["user-id"]);
            console.log("✅ timeout aplicado");
        } catch (error) {
            console.log("❌ error api:", error.response?.data || error.message);
        }
    }
});