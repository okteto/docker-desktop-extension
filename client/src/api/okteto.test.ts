import { ExecResult, ExecStreamOptions, ExecProcess } from '@docker/extension-api-client-types/dist/v1';
import mockConsole from 'jest-mock-console';

import okteto, { OktetoContext } from './okteto';

const defaultExecResult = {
  stdout: '',
  stderr: '',
  lines: jest.fn(),
  parseJsonLines: jest.fn(),
  parseJsonObject: jest.fn()
};

const contextA: OktetoContext = {
  "name": "https://cloud.okteto.com",
  "namespace": "rlamana",
  "builder": "tcp://buildkit.cloud.okteto.net:1234",
  "registry": "registry.cloud.okteto.net",
  "current": false
};

const contextB: OktetoContext = {
  "name": "https://demo.okteto.dev",
  "namespace": "rlamana",
  "builder": "tcp://buildkit.demo.okteto.dev:1234",
  "registry": "registry.demo.okteto.dev",
  "current": false
};

const processResult = {
  close: jest.fn()
};

describe('Okteto CLI Calls', () => {
  let execMock:
    ((cmd: string, args: string[]) => Promise<ExecResult>) |
    ((cmd: string, args: string[], options: { stream: ExecStreamOptions }) => ExecProcess)
    = jest.fn();
  let errorSpy: jest.SpyInstance;

  Object.defineProperty(window, 'ddClient', {
    value: {
      extension: {
        host: {
          cli: {
            exec: jest.fn().mockImplementation((cmd: string, args: string[], options) => {
              return execMock(cmd, args, options);
            })
          }
        }
      },
      desktopUI: {
        toast: {
          error: jest.fn()
        }
      }
    }
  });

  beforeAll(() => {
    errorSpy = jest.spyOn(global.console, 'error').mockImplementation(jest.fn());
  });

  afterAll(() => {
    errorSpy.mockRestore();
  });

  describe('Context List Command', () => {
    it('should return a list of contexts', async () => {
      execMock = (cmd: string, args: string[]) => {
        return Promise.resolve({
          ...defaultExecResult,
          parseJsonObject: () => [contextA, contextB]
        });
      };
      const list = await okteto.contextList();
      expect(list).toEqual([contextA, contextB]);
    });

    it('should return empty list on error', async () => {
      execMock = (): Promise<ExecResult> => {
        return Promise.reject({
          ...defaultExecResult
        });
      };
      mockConsole();
      const list = await okteto.contextList();
      expect(console.error).toHaveBeenCalled();
      expect(list).toEqual([]);
    });

    it('should return empty list on exception', async () => {
      execMock = (cmd: string, args: string[]) => {
        throw Error();
      };
      const context = await okteto.contextList();
      expect(context).toEqual([]);
    });
  });

  describe('Context Use Command', () => {
    it('should return null on error', async () => {
      execMock = (cmd: string, args: string[]) => {
        return Promise.reject({
          parseJsonObject: () => contextA
        });
      };
      const context = await okteto.contextUse(contextA.name);
      expect(context).toEqual(null);
    });

    it('should return null on exception', async () => {
      execMock = (cmd: string, args: string[]) => {
        throw Error();
      };
      const context = await okteto.contextUse(contextA.name);
      expect(context).toEqual(null);
    });
  });

  describe('Up Command', () => {
    it('should call up without the --build option', async () => {
      execMock = (cmd: string, args: string[]) => {
        return processResult;
      };
      await okteto.up(
        '/docker-compose.yml',
        contextA.name,
        'dev',
        jest.fn()
      );
    });
  });
})