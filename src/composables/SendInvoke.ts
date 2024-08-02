import { RunProjectRequest } from "../classes/RunProjectRequest";
import { InvokeResponse } from "../classes/invokeResponse";

export async function SendInvoke(
  invokeName: string,
  request: object,
): Promise<InvokeResponse> {
  const invokeResponse = (await window.ipcRenderer.invoke(
    invokeName,
    request,
  )) as InvokeResponse;

  const response = new InvokeResponse(
    invokeResponse.success,
    invokeResponse.message,
  );

  response.ensureSuccess();
  return response;
}
