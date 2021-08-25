import { ClientOptions, ClientPresenceStatus, Collection, Intents, UserResolvable } from "discord.js";

export const defaultPrefix = "!";
export const devs: UserResolvable[] = [];
export const clientOptions: ClientOptions = {
    allowedMentions: { parse: ["users"] },
    intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES],
    makeCache: () => new Collection(),
    restTimeOffset: 300,
    retryLimit: 3
};
export const devGuild = JSON.parse(process.env.DEV_GUILD!);
export const isProd = process.env.NODE_ENV === "production";
export const isDev = !isProd;
export const prefix = isDev ? "d!" : defaultPrefix;
export const presenceData = {
    activities: [
        "Hello, world!",
        "Watching {textChannels.size} of text channels in {guilds.size}",
        "Listening to {users.size} of users",
        "Hello there, I am {username}",
        `My default prefix is ${prefix}`
    ],
    status: ["online"] as ClientPresenceStatus[],
    interval: 60000
};
export const shardsCount: number | "auto" = "auto";
