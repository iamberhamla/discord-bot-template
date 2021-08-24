import { DefineCommand } from "../../utils/decorators/DefineCommand";
import { CommandContext } from "../../structures/CommandContext";
import { BaseCommand } from "../../structures/BaseCommand";
import { createEmbed } from "../../utils/createEmbed";
import { ColorResolvable } from "discord.js";

@DefineCommand({
    aliases: ["pong", "peng", "pung"],
    description: "Shows the current ping of the bot",
    name: "ping",
    slash: {
        options: []
    },
    usage: "{prefix}ping"
})
export class PingCommand extends BaseCommand {
    public async execute(ctx: CommandContext): Promise<any> {
        if (ctx.isInteraction() && !ctx.deferred) await ctx.deferReply();
        const before = Date.now();
        const msg = await ctx.send({ content: "🏓" });
        const latency = Date.now() - before;
        const wsLatency = this.client.ws.ping.toFixed(0);
        const embed = createEmbed("info")
            .setColor(this.searchHex(wsLatency) as ColorResolvable)
            .setAuthor("🏓 PONG", this.client.user!.displayAvatarURL())
            .addFields({
                name: "📶 **|** API Latency",
                value: `**\`${latency}\`** ms`,
                inline: true
            }, {
                name: "🌐 **|** WebSocket Latency",
                value: `**\`${wsLatency}\`** ms`,
                inline: true
            })
            .setFooter(`Requested by: ${ctx.author.tag}`, ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();
        await msg.edit({ content: " ", embeds: [embed] });
    }

    private searchHex(ms: string | number): string | number {
        const listColorHex = [
            [0, 20, "GREEN"],
            [21, 50, "GREEN"],
            [51, 100, "YELLOW"],
            [101, 150, "YELLOW"],
            [150, 200, "YELLOW"]
        ];

        const defaultColor = "RED";

        const min = listColorHex.map(e => e[0]);
        const max = listColorHex.map(e => e[1]);
        const hex = listColorHex.map(e => e[2]);
        let ret: string | number = "#000000";

        for (let i = 0; i < listColorHex.length; i++) {
            if (min[i] <= ms && ms <= max[i]) {
                ret = hex[i];
                break;
            } else {
                ret = defaultColor;
            }
        }
        return ret;
    }
}
