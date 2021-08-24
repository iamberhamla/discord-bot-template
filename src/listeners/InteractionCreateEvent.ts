/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { DefineListener } from "../utils/decorators/DefineListener";
import { CommandContext } from "../structures/CommandContext";
import { BaseListener } from "../structures/BaseListener";
import { createEmbed } from "../utils/createEmbed";
import { Interaction, Permissions } from "discord.js";

@DefineListener("interactionCreate")
export class InteractionCreateEvent extends BaseListener {
    public async execute(interaction: Interaction): Promise<any> {
        if (!interaction.inGuild()) return;
        if (interaction.isButton()) {
            const val = this.decode(interaction.customId);
            const user = val.split("_")[0] ?? "";
            const cmd = val.split("_")[1] ?? "";
            if (cmd === "delete-msg") {
                if (interaction.user.id !== user && !new Permissions(interaction.member.permissions as any).has("MANAGE_MESSAGES")) {
                    void interaction.reply({
                        ephemeral: true,
                        embeds: [
                            createEmbed("error", `That interaction only for <@${user.toString()}> and server staff`)
                        ]
                    });
                } else {
                    const msg = await interaction.channel?.messages.fetch(interaction.message.id).catch(() => null);
                    if (msg?.deletable) {
                        void msg.delete();
                    }
                }
            }
        }
        const context = new CommandContext(interaction);
        if (interaction.isContextMenu()) {
            const data = interaction.options.getUser("user") ?? interaction.options.getMessage("message");
            const cmd = this.client.commands.find(x => (data as any).type === "MESSAGE" ? x.meta.contextChat === interaction.commandName : x.meta.contextUser === interaction.commandName);
            if (cmd) {
                context.additionalArgs.set("options", data);
                void cmd.execute(context);
            }
        }
        if (interaction.isCommand()) {
            const cmd = this.client.commands.filter(x => x.meta.slash !== undefined).find(x => x.meta.slash!.name === interaction.commandName);
            if (cmd) {
                void cmd.execute(context);
            }
        }
        if (interaction.isSelectMenu()) {
            const val = this.decode(interaction.customId);
            const user = val.split("_")[0] ?? "";
            const cmd = val.split("_")[1] ?? "";
            if (interaction.user.id !== user) {
                void interaction.reply({
                    ephemeral: true,
                    embeds: [
                        createEmbed("error", `That interaction only for <@${user.toString()}>`)
                    ]
                });
            }
            if (cmd && user === interaction.user.id) {
                const command = this.client.commands.filter(x => x.meta.slash !== undefined).find(x => x.meta.name === cmd);
                if (command) {
                    context.additionalArgs.set("values", interaction.values);
                    void command.execute(context);
                }
            }
        }
    }

    private decode(string: string): string {
        return Buffer.from(string, "base64").toString("ascii");
    }
}
