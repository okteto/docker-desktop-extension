import { ExecProcess } from "@docker/extension-api-client-types/dist/v1"

export interface OktetoContext {
  name: string
  namespace: string
  builder: string
  registry: string
  current: boolean
};

export type OktetoContextList = Array<OktetoContext>;
export type OktetoEndpointsList = Array<string>;
export type OktetoStatus = {
  status: String,
  stderr: String
}

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
  } catch(_) {
    console.error('Error executing "okteto context" command');
  }
  return [];
};

const contextUse = async (contextName: string) : Promise<OktetoContext | null> => {
  try {
    const args = ['context', 'use', contextName, '--docker-desktop', '--log-output', 'json'];
    const result = await window.ddClient.extension?.host?.cli.exec('okteto', args);
    if (result) {
      return result.parseJsonObject();
    }
  } catch(_) {
    console.error('Error executing "okteto use" command');
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
  } catch(_) {
    console.error('Error executing "okteto endpoints" command');
  }
  return [];
};

const up = (manifestFile: string, contextName: string, onOutputChange: (stdout: string) => void, withBuild = false) : ExecProcess | undefined => {
  let output = '';
  const args = ['up', '-f', manifestFile, '-c', contextName, '--docker-desktop', '--deploy', '--log-output', 'plain'];
  if (withBuild) {
    args.push('--build');
  }
  return window.ddClient.extension?.host?.cli.exec('okteto', args, {
    stream: {
      onOutput(data) {
        output = `${output}${data.stdout ?? ''}${data.stderr ?? ''}`;
        onOutputChange(output);
      },
      onError(e: any) {
        console.error(e);
        output = `${output}\nOkteto exited with error ${e}.`;
      },
      onClose(exitCode: number): void {
        output = `${output}\nOkteto finished with status ${exitCode}.`;
      }
    },
  });
};

const status = async (contextName: string) : Promise<OktetoStatus> => {
  try {
  const args = ['status', '-c', contextName]
  const result = await window.ddClient.extension?.host?.cli.exec('okteto', args) 
  if(result) {
    const status = result.parseJsonObject();
    return status;
  }
  }catch(_) {
    console.error('Error executing "okteto status" command');
  }
  return {status: "Pending", stderr: ""};
};

export default {
  contextList,
  contextUse,
  endpoints,
  version,
  status,
  up
};
