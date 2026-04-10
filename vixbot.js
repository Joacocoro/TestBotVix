// constante para importar las librerias //

const tmi = require("tmi.js"); // hace la conexion con el chat de twitch //
const axios = require("axios"); // hace la peticion por HTTP a la API de twitch //

// token donde toma la identidad el bot y nombre para comparar con los tokens //

const BOT_USERNAME = "ranitabot_vix";
const OAUTH_TOKEN = "oauth:4gkudl1nvk8cpocm6wvh0lvdrc576f";
const ACCESS_TOKEN = "4gkudl1nvk8cpocm6wvh0lvdrc576f";
const CLIENT_ID = "gp762nuuoqcoxypju8c569th9wz7q5";

// indentidad del cliente que toma el bot para entrar al chat //
const client = new tmi.Client({
    identity: {
        username: BOT_USERNAME,
        password: OAUTH_TOKEN
    },
    channels: ["joaco_coro"]
});

// constantes con los arrays con las palabras y enlaces baneados para el bot //
const bannedLinks = [
    "http://", "https://", "www.",
    ".com", ".net", ".org"
];

const bannedWords = [
    "puto", "puta", "pvto", "pvta",
    "pvt0", "pvt4", "pvt@", "pvt4",
    "pvt4", "pvt4",
];

// seccion donde el bot solicita su ID y hace la solicitud a AXIOS y espera una //
// respuesta por parte de twitch, al recibirlas muestra en consola los datos del bot. //
// en caso de error muestra el error en la consola o terminal //

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

// conexion del bot y solicitud para obtener el id del bot para utilizarla automaticamente //
client.connect();
getBotId();

// API que utiliza el bot para realizar el timeout recibiendo la ID del //
// usuario que realizó la infracción y aplica el timeout por palabras prohibidas //

async function timeoutUser(userId) {
    await axios.post(
        `https://api.twitch.tv/helix/moderation/bans?broadcaster_id=147876970&moderator_id=1478420732`,
        {
            data: { // datos que envia el bot a twtich para realizar la recuest del timeout //
                user_id: userId, // ID del usuario que realizó la infracción //
                duration: 30, // duración del timeout en segundos //
                reason: "Utilizar palabras inapropiadas ❌❌" // razón del timeout //
            }
        },
        {
            headers: { // solicita el id del cliente del bot para realizar la solicitud //
                "Client-ID": CLIENT_ID,
                "Authorization": `Bearer ${ACCESS_TOKEN}`,
                "Content-Type": "application/json"
            }
        }
    );
}

// API que utiliza el bot para realizar el timeout recibiendo la ID del //
// usuario que realizó la infracción y aplica el timeout por insertar enlaces //

async function timeoutUserLinks(userId) {
    await axios.post(
        `https://api.twitch.tv/helix/moderation/bans?broadcaster_id=147876970&moderator_id=1478420732`,
        {
            data: { 
                user_id: userId,
                duration: 30,
                reason: "No se permiten enlaces en el chat ❌❌"
            }
        },
        {
            headers: { // solicita el id del cliente del bot para realizar la solicitud //
                "Client-ID": CLIENT_ID,
                "Authorization": `Bearer ${ACCESS_TOKEN}`,
                "Content-Type": "application/json"
            }
        }
    );
}

// Deteccion de palabras prohibidas donde el bot lee los mensajes//

client.on("message", async (channel, tags, message, self) => {
    if (self) return; // acá el bot evita matarse a si mismo si es que llega a enviar un mensaje baneado //

    const lowerMessage = message.toLowerCase(); // convierte el mensaje a minúsculas para facilitar la comparación //

    if (bannedWords.some(word => lowerMessage.includes(word))) { // hace la pregunta si alguna palabra que lee es como la almacenada en el array //
        console.log("Palabra inapropiada detectada");
        // prueba en primer intento mostrar en consola a quien le aplica el tome out y mostrar el mensaje //
        try {
            await timeoutUser(tags["user-id"]);
            console.log(`"timeout aplicado a " ${tags.username}"`);
            // hace un catch y muestra el error en consola //
        } catch (error) {
            console.log("❌ error api:", error.response?.data || error.message);
        }
    }
});

client.on("message", async (channel, tags, message, self) => {
    if (self) return;
    if (bannedLinks.some(link => message.includes(link))) {
        console.log("Link detectado");
        // prueba en primer intento mostrar en consola a quien le aplica el tome out y mostrar el mensaje //
        try {
            await timeoutUserLinks(tags["user-id"]);
            console.log(`"timeout aplicado a " ${tags.username}"`);
            // hace un catch y muestra el error en consola //
        } catch (error) {
            console.log("❌ error api:", error.response?.data || error.message);
        }
    }
});

