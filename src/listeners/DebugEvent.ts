import { DefineListener } from "../utils/decorators/DefineListener";
import { BaseListener } from "../structures/BaseListener";

@DefineListener("debug")
export class DebugEvent extends BaseListener {
    public execute(message: string): void {
        if (this.client.config.isDev) this.client.logger.debug(message);
    }
}
