import { DefineCommand } from "../../utils/decorators/DefineCommand";
import { CommandContext } from "../../structures/CommandContext";
import { BaseCommand } from "../../structures/BaseCommand";
import { createEmbed } from "../../utils/createEmbed";

@DefineCommand({
    aliases: ["infouser", "user", "users", "uinfo"],
    contextUser: "User Information",
    description: "Check the user information",
    name: "userinfo",
    slash: {
        options: [
            {
                name: "user",
                type: "USER",
                description: "Who should I look for?",
                required: true
            }
        ]
    },
    usage: "{prefix}userinfo [@mention | id]"
})
export class UserinfoCommand extends BaseCommand {
    public async execute(ctx: CommandContext): Promise<any> {
        if (ctx.isInteraction() && !ctx.deferred) await ctx.deferReply();
        // Since we're using same key with context menu which 'user' as options key (also for slash options)
        // We don't need access additionalArgs to get user value (context menu user)
        const user = ctx.mentions?.users.first() ?? await this.client.users.fetch(ctx.args[0]).catch(() => null) ?? ctx.options?.getUser("user") ?? ctx.author;
        const status = {
            dnd: "(Do Not Disturb)",
            idle: "(Idle)",
            invisible: "(Invisible)",
            offline: "(Invisible)",
            online: "(Online)",
            unknown: "(Unknown)"
        };
        const member = ctx.guild!.members.cache.get(user.id) ?? await ctx.guild!.members.fetch(user.id).catch(() => undefined);
        const game = member?.presence?.activities.find(x => x.type === "PLAYING");
        const embed = createEmbed("info")
            .setThumbnail(user.displayAvatarURL({ dynamic: true, format: "png", size: 2048 }))
            .setAuthor(`${user.username} - Discord User`)
            .addField("**DETAILS**", `\`\`\`asciidoc
• Username :: ${user.tag}
• ID       :: ${user.id}
• Created  :: ${user.createdAt.toString()}
• Joined   :: ${member?.joinedAt?.toString() ?? "Unknown"}\`\`\``)
            .addField("**STATUS**", `\`\`\`asciidoc
• Type     :: ${user.bot ? "Beep Boop, Boop Beep?" : "I'm Human."}
• Presence :: ${status[member?.presence?.status ?? "unknown"]} ${game ? game.name : "No game detected."}\`\`\``)
            .setFooter(`Replying to: ${ctx.author.tag}`, ctx.author.displayAvatarURL())
            .setTimestamp();
        return ctx.send({
            embeds: [embed],
            askDeletion: {
                reference: ctx.author.id
            }
        }, "editReply");
    }
}
