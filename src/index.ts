import "dotenv/config";
import { createLogger } from "./utils/Logger";
import { isProd, shardsCount } from "./config";
import { ShardingManager } from "discord.js";
import { resolve } from "path";

const log = createLogger("shardingmanager", isProd);

const manager = new ShardingManager(resolve(__dirname, "bot.js"), {
    totalShards: shardsCount,
    respawn: true,
    token: process.env.DISCORD_TOKEN,
    mode: "process"
});

manager.on("shardCreate", shard => {
    log.info(`[ShardManager] Shard #${shard.id} spawned.`);
    shard.on("disconnect", () => {
        log.warn("SHARD_DISCONNECTED: ", { stack: `[ShardManager] Shard #${shard.id} disconnected.` });
    }).on("reconnecting", () => {
        log.info(`[ShardManager] Shard #${shard.id} reconnected.`);
    });
    if (manager.shards.size === manager.totalShards) log.info("[ShardManager] All shards spawned successfully.");
}).spawn().catch(e => log.error("SHARD_SPAWN_ERR: ", e));
