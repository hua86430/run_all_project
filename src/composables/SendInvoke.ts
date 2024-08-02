import { RunProjectRequest } from "../classes/RunProjectRequest";
import { InvokeResponse } from "../classes/invokeResponse";

export async function SendInvoke<T = any>(
  invokeName: string,
  request?: object,
): Promise<InvokeResponse> {
  const invokeResponse = (await window.ipcRenderer.invoke(
    invokeName,
    request,
  )) as InvokeResponse;

  const response = new InvokeResponse<T>(
    invokeResponse.success,
    invokeResponse.message,
    invokeResponse.data,
  );

  response.ensureSuccess();
  return response;
}
