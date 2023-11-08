import { ExecProcess, RawExecResult } from "@docker/extension-api-client-types/dist/v1";

export type OktetoDevList = Array<string>;

const listDevs = async (contextName: string) : Promise<OktetoDevList> => {
  try {
    // const args = [];
    // await window.ddClient.extension?.host?.cli.exec('cat', args);
    return ['frontend', 'api', 'another_service'];
  } catch(err) {
    console.error((err as RawExecResult).stderr);
  }
  return [];
};

