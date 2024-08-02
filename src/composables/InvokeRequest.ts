import { RunProjectRequest } from "../classes/RunProjectRequest";
import { InvokeResponse } from "../classes/invokeResponse";

export async function InvokeRequest(
  invokeName: string,
  request: RunProjectRequest,
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
