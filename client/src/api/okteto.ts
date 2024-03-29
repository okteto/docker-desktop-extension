import { ExecProcess, RawExecResult } from "@docker/extension-api-client-types/dist/v1";

export interface OktetoContext {
  name: string
  namespace: string
  builder: string
  registry: string
  current: boolean
};

export type OktetoContextList = Array<OktetoContext>;
export type OktetoEndpointsList = Array<string>;

const notifyError = (result: RawExecResult) => {
  let msg = '';
  switch(result.code) {
    case 126: msg = 'Command invoked cannot execute'; break;
    case 127: msg = 'Command not found'; break;
    default: msg = result.stderr;
  }
  window.ddClient.desktopUI.toast.error(`Error executing "okteto" command: ${msg}`);
  console.error(`Error executing ${result.cmd}`, result);
};

const isOktetoContext = (context: OktetoContext) => {
  // As of Okteto CLI 2.1.1-rc.2, the output of the `context list` command
  // doesn't provide a way to distinguish Okteto contexts from Kubernetes contexts.
  // The `name` field contains the URL for Okteto contexts and that's at the moment
  // the only way to do so.
  let url;
  try {
    url = new URL(context.name);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
};

const version = async () : Promise<string | null> => {
  try {
    const result = await window.ddClient.extension?.host?.cli.exec('okteto', ['version']);
    if (result) {
      result.lines().join('\n')
    }
  } catch(_) {
    console.error('Error executing "okteto version" command');
  }
  return null;
};

const contextList = async (oktetoOnly = true) : Promise<OktetoContextList> => {
  try {
    const args = ['context', 'list', '-o', 'json'];
    const result = await window.ddClient.extension?.host?.cli.exec('okteto', args);
    if (result) {
      const list = result.parseJsonObject();
      return oktetoOnly ? list.filter((context: OktetoContext) => isOktetoContext(context)) : list;
    }
  } catch(e) {
    const error = e as RawExecResult;
    if (error.code === 1) {
      return [];
    }
    notifyError(error);
  }
  return [];
};

const contextUse = async (contextName: string) : Promise<null> => {
  try {
    const args = ['context', 'use', contextName];
    await window.ddClient.extension?.host?.cli.exec('okteto', args);
  } catch(err) {
    notifyError(err as RawExecResult);
  }
  return null;
};

const endpoints = async (manifestFile: string, contextName: string) : Promise<OktetoEndpointsList> => {
  try {
    const args = ['endpoints', '-f', manifestFile, '-c', contextName, '-o', 'json'];
    const result = await window.ddClient.extension?.host?.cli.exec('okteto', args);
    if (result) {
      return result.parseJsonObject();
    }
  } catch(err) {
    notifyError(err as RawExecResult);
  }
  return [];
};

const up = (manifestFile: string, contextName: string, devName: string, onOutputChange: (stdout: string) => void) : ExecProcess | undefined => {
  let output = '';
  const deployArgs = ['deploy', '--build', '-f', manifestFile, '-c', contextName]; //, '--log-output', 'plain'];

  return window.ddClient.extension?.host?.cli.exec('okteto', deployArgs, {
    stream: {
      onOutput(data) {
        output = `${output}${data.stdout ?? ''}${data.stderr ?? ''}`;
        onOutputChange(output);
      },
      onError(e: any) {
        console.error(e);
        output = `${output}\nOkteto exited with error ${e}.`;
      },
      onClose: async(exitCode: number): Promise<void> => {
        output = `${output}\nOkteto deploy finished with status ${exitCode}.`;

        const upArgs = ['up', '-f', manifestFile, '-c', contextName, '--log-output', 'plain', devName];
        await window.ddClient.extension?.host?.cli.exec('okteto', upArgs, {
          stream: {
            onOutput(data): void {
              output = `${output}${data.stdout ?? ''}${data.stderr ?? ''}`;
              onOutputChange(output);
            },
            onError(error: any): void {
              console.error(error);
            },
            onClose(exitCode: number): void {
              console.log("okteto up with exit code " + exitCode);
            },
          },
        });
      }
    },
  });
  
};

export default {
  contextList,
  contextUse,
  endpoints,
  version,
  up
};
