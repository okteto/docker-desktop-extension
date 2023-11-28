import { RawExecResult } from "@docker/extension-api-client-types/dist/v1";

export type OktetoDevList = Array<string>;

export const listDevs = async (file: string) : Promise<OktetoDevList> => {
  try {
    const args = ['devcontainers', '-f', file];
    const result = await window.ddClient.extension?.host?.cli.exec('okteto-extension', args);
    if (result) {
      return result.parseJsonObject();
    }
  } catch(err) {
    console.error((err as RawExecResult).stderr);
  }
  return [];
};
