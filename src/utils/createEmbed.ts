import { ColorResolvable, MessageEmbed } from "discord.js";

type hexColorsType = "info" | "warn" | "error" | "success";
const hexColors: Record<hexColorsType, ColorResolvable> = {
    info: "BLUE",
    warn: "YELLOW",
    success: "GREEN",
    error: "RED"
};

export function createEmbed(type: hexColorsType, message?: string, emoji = false): MessageEmbed {
    const embed = new MessageEmbed()
        .setColor(hexColors[type]);

    if (message) embed.setDescription(message);
    if (type === "error" && emoji) embed.setDescription(`✅ **|** ${message!}`);
    if (type === "success" && emoji) embed.setDescription(`❌ **|** ${message!}`);
    return embed;
}
