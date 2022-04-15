import { ExecResult } from '@docker/extension-api-client-types/dist/v1';
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

describe('Okteto CLI Calls', () => {
  let execMock: (cmd: string, args: string[]) => Promise<ExecResult> = jest.fn();

  Object.defineProperty(window, 'ddClient', {
    value: {
      extension: {
        host: {
          cli: {
            exec: jest.fn().mockImplementation((cmd: string, args: string[]) => {
              return execMock(cmd, args);
            })
          }
        }
      }
    }
  });

  describe('Context List', () => {
    it('should return a list of contexts', async () => {
      execMock = (cmd: string, args: string[]): Promise<ExecResult> => {
        return Promise.resolve({
          ...defaultExecResult,
          parseJsonObject: () => [contextA, contextB]
        });
      }
      const list = await okteto.contextList();
      expect(list).toEqual([contextA, contextB]);
    });

    it('should return empty list on error', async () => {
      execMock = (): Promise<ExecResult> => {
        return Promise.reject({
          ...defaultExecResult
        });
      }
      mockConsole();
      const list = await okteto.contextList();
      expect(console.error).toHaveBeenCalled();
      expect(list).toEqual([]);
    });
  });
})