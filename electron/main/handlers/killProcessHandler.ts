import { InvokeResponse } from "../../../src/classes/invokeResponse";
import { killProcessByName } from "../useProcess";
import { InvokeEvent } from "../../../src/enums/InvokeEvent";
import { useHandler } from "./useHandler";

export function killProcessHandler() {
  useHandler(
    InvokeEvent.KILL_PROCESS,
    async (event, processName: string): Promise<InvokeResponse> => {
      await killProcessByName(processName);

      return InvokeResponse.success("Kill process successful");
    },
  );
}
