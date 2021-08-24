import { DefineListener } from "../utils/decorators/DefineListener";
import { BaseListener } from "../structures/BaseListener";
import { createEmbed } from "../utils/createEmbed";
import { Message, User } from "discord.js";

@DefineListener("messageCreate")
export class MessageCreateEvent extends BaseListener {
    public async execute(message: Message): Promise<any> {
        if (message.author.bot || message.channel.type === "DM") return message;
        if (message.content.startsWith(this.client.config.prefix)) return this.client.commands.handle(message);

        if ((await this.getUserFromMention(message.content))?.id === this.client.user?.id) {
            message.channel.send({
                embeds: [
                    createEmbed("info", `👋 **|** Hello ${message.author.toString()}, my prefix is \`${this.client.config.prefix}\``)
                        .setAuthor(this.client.user!.username, this.client.user?.displayAvatarURL())
                        .setTimestamp()
                ]
            }).catch(e => this.client.logger.error("PROMISE_ERR:", e));
        }
    }

    private getUserFromMention(mention: string): Promise<User | undefined> {
        const matches = /^<@!?(\d+)>$/.exec(mention);
        if (!matches) return Promise.resolve(undefined);

        const id = matches[1];
        return this.client.users.fetch(id);
    }
}
