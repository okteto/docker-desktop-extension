interface OktetoResult<E> {
  value: E
  error?: string
};

interface OktetoContext {
  name: string
  namespace: string
  builder: string
  registry: string
};

type OktetoContextList = OktetoResult<Array<OktetoContext>>;

const getContextList = () : Promise<OktetoContextList> => {
  return new Promise(done => {
    let output = '';
    let error: string | null = null;
    window.ddClient.extension.host.cli.exec('okteto', ['context', 'list', '-o', 'json'], {
      stream: {
        onOutput(line: { stdout: string | undefined, stderr: string | undefined }): void {
          // console.log(line.stdout);
          output += line.stdout;
        },
        onError(e: string): void {
          console.error(e);
          error = `${error ?? ''}${e}`;
        },
        onClose(exitCode: number): void {
          console.log(`onClose with exit code ${exitCode}`);
          const result: OktetoContextList = { value: [] };
          if (exitCode == 0) {
            result.value = JSON.parse(output);
          }
          console.log(result);
          done(result);
        },
      },
    });
  });
};

const setContext = (context: string) : Promise<OktetoResult<string>> => {
  return new Promise(done => {
    let output = '';
    let error: string | null = null;
    window.ddClient.extension.host.cli.exec('okteto', ['context', 'use', context], {
      stream: {
        onOutput(line: { stdout: string | undefined, stderr: string | undefined }): void {
          output += line.stdout;
        },
        onError(e: string): void {
          console.error(e);
          error = `${error ?? ''}${e}`;
        },
        onClose(exitCode: number): void {
          const result: OktetoResult<string> = { value: '' };
          if (exitCode == 0) {
            result.value
          }
          done(result);
        },
      },
    });
  });
};

export default {
  getContextList,
  setContext
};
