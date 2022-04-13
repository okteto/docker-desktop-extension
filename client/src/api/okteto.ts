export interface OktetoResult<E> {
  value: E
  error: string | null
};

export interface OktetoContext {
  name: string
  namespace: string
  builder: string
  registry: string
  current: boolean
};

export type OktetoContextList = Array<OktetoContext>;
export type OktetoEndpointsList = Array<string>;

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

const contextList = (oktetoOnly = true) : Promise<OktetoResult<OktetoContextList>> => {
  return new Promise(done => {
    let output = '';
    let error: string | null = null;
    let value: OktetoContextList = [];
    window.ddClient.extension.host.cli.exec('okteto', ['context', 'list', '-o', 'json'], {
      stream: {
        onOutput(line: { stdout: string | undefined, stderr: string | undefined }): void {
          output += line.stdout;
        },
        onError(e: string): void {
          console.error(e);
          error = `${error ?? ''}${e}`;
        },
        onClose(exitCode: number): void {
          if (exitCode == 0) {
            try {
              value = JSON.parse(output)
              if (oktetoOnly) {
                value = value.filter((context: OktetoContext) => isOktetoContext(context));
              }
            } catch(e) {
              console.error(e);
              value = [];
            }
          }
          done({ value, error });
        },
      },
    });
  });
};

const contextShow = () : Promise<OktetoResult<OktetoContext | null>> => {
  return new Promise(done => {
    let output = '';
    let error: string | null = null;
    let value: OktetoContext | null = null;
    window.ddClient.extension.host.cli.exec('okteto', ['context', 'show', '-o', 'json'], {
      stream: {
        onOutput(line: { stdout: string | undefined, stderr: string | undefined }): void {
          output += line.stdout;
        },
        onError(e: string): void {
          console.error(e);
          error = `${error ?? ''}${e}`;
        },
        onClose(exitCode: number): void {
          if (exitCode == 0) {
            value = JSON.parse(output);
          }
          done({ value, error });
        },
      },
    });
  });
};

const contextUse = (contextName: string) : Promise<OktetoResult<OktetoContext | null>> => {
  return new Promise(done => {
    let output = '';
    let error: string | null = null;
    let value: OktetoContext | null = null;
    window.ddClient.extension.host.cli.exec('okteto', ['context', 'use', contextName, '--docker-desktop', '--log-output', 'json'], {
      stream: {
        onOutput(line: { stdout: string | undefined, stderr: string | undefined }): void {
          output += line.stdout;
        },
        onError(e: string): void {
          console.error(e);
          error = `${error ?? ''}${e}`;
        },
        onClose(exitCode: number): void {
          if (exitCode == 0) {
            value = JSON.parse(output);
          }
          done({ value, error });
        },
      },
    });
  });
};

const contextDelete = (contextName: string) : Promise<OktetoResult<boolean>> => {
  return new Promise(done => {
    let output = '';
    let error: string | null = null;
    let value = false;
    window.ddClient.extension.host.cli.exec('okteto', ['context', 'delete', contextName], {
      stream: {
        onOutput(line: { stdout: string | undefined, stderr: string | undefined }): void {
          output += line.stdout;
        },
        onError(e: string): void {
          console.error(e);
          error = `${error ?? ''}${e}`;
        },
        onClose(exitCode: number): void {
          if (exitCode == 0) {
            value = true;
          }
          done({ value, error });
        },
      },
    });
  });
};

const endpoints = (manifestFile: string) : Promise<OktetoResult<OktetoEndpointsList>> => {
  return new Promise(done => {
    let output = '';
    let error: string | null = null;
    let value: OktetoEndpointsList = [];
    window.ddClient.extension.host.cli.exec('okteto', ['endpoints', '-f', manifestFile, '-o', 'json'], {
      stream: {
        onOutput(line: { stdout: string | undefined, stderr: string | undefined }): void {
          output += line.stdout;
        },
        onError(e: string): void {
          console.error(e);
          error = `${error ?? ''}${e}`;
        },
        onClose(exitCode: number): void {
          if (exitCode == 0) {
            value = JSON.parse(output);
          }
          done({ value, error });
        },
      },
    });
  });
};

const up = (manifestFile: string, onOutputChange: (stdout: string) => void) : Promise<OktetoResult<boolean>> => {
  return new Promise(done => {
    let error: string | null = null;
    let value = false;
    let output = '';
    window.ddClient.extension.host.cli.exec('okteto', ['up', '-f', manifestFile, '--detach', '--log-output', 'plain'], {
      stream: {
        onOutput(line: { stdout: string | undefined, stderr: string | undefined }): void {
          output = `${output}${line.stdout ?? ''}${line.stderr ?? ''}`;
          onOutputChange(output);
        },
        onError(e: any): void {
          console.error(e);
          error = `${error ?? ''}${e}`;
        },
        onClose(exitCode: number): void {
          if (exitCode == 0) {
            value = true;
          }
          done({ value, error });
        },
      },
    });
  });
};

export default {
  contextList,
  contextShow,
  contextUse,
  contextDelete,
  endpoints,
  up
};
