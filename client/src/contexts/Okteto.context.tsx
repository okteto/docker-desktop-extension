import { ExecProcess } from '@docker/extension-api-client-types/dist/v1';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import useInterval from 'use-interval';

import okteto, { OktetoContext, OktetoContextList, OktetoStatus } from '../api/okteto';

interface OktetoEnvironment {
  file: string
  link: string
  contextName: string
  process: ExecProcess | undefined
}

interface OktetoStore {
  currentContext: OktetoContext | null;
  contextList: OktetoContextList;
  environment: OktetoEnvironment | null;
  output: string;
  loading: boolean;
  ready: boolean;
  status: OktetoStatus | null;

  login: () => void;
  stopEnvironment: () => void;
  selectEnvironment: (f: string, withBuild: boolean) => void;
  selectContext: (f: string) => void;
  relaunchEnvironment: () => void;
}

type OktetoProviderProps = {
  children?: ReactNode
};

const Okteto = createContext<OktetoStore | null>(null);

const CONTEXT_POLLING_INTERVAL = 3000;
const STATUS_POLLING_INTERVAL = 3000;
export const defaultContextName = 'https://cloud.okteto.com';

const OktetoProvider = ({ children } : OktetoProviderProps) => {
  const [currentContext, setCurrentContext] = useState<OktetoContext | null>(null);
  const [contextList, setContextList] = useState<OktetoContextList>([]);
  const [environment, setEnvironment] = useState<OktetoEnvironment | null>(null);
  const [status, setStatus] = useState<OktetoStatus | null>(null);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);


  const login = async () => {
    setLoading(true);
    await okteto.contextUse(defaultContextName);
    setLoading(false);
  };

  const selectEnvironment = (file: string, withBuild = false) => {
    if (!currentContext) return;
    setOutput('');
    setEnvironment({
      file,
      link: `${currentContext.name}/#/spaces/${currentContext.namespace}`,
      contextName: currentContext.name,
      process: okteto.up(file, currentContext.name, stdout => {
        setOutput(stdout);
      }, withBuild)
    });
  };

  const selectContext = async (contextName: string) => {
    // TODO: What do we do if context is changed with an environment launched? Dialog?
    setLoading(true);
    const context = contextList.find(c => c.name === contextName);
    if (context) {
      stopEnvironment();
      setCurrentContext(context);
    }
    setLoading(false);
  };

  const stopEnvironment = async () => {
    environment?.process?.close();
    setOutput('');
    setEnvironment(null);
  };

  const refreshContext = async () => {
    const list = await okteto.contextList();
    setContextList(list);

    // We consider a user as logged in if he has configured Okteto Cloud's context.
    const isLoggedIn = Boolean(list.find(c => c.name === defaultContextName));
    if (!isLoggedIn) {
      setCurrentContext(null);
    } else if (!currentContext) {
      const context = list.find(c => c.name === defaultContextName) ?? null;
      setCurrentContext(context);
    }
  };

  const refreshStatus = async () => {
    if (!environment || !currentContext) return;
    const status = await okteto.status(environment.file, currentContext.name);
    setStatus(status);
  };


  const relaunchEnvironment = async () => {
    if(!environment || loading) return;

    const {file, contextName} = environment;

    await stopEnvironment();
    await selectContext(contextName);
    selectEnvironment(file);
  }


  useInterval(async () => {
    // Don't refresh until current command execution has finished.
    if (loading) return;
    await refreshContext();
    setReady(true);
  }, CONTEXT_POLLING_INTERVAL, true);

  useInterval(async () => {
    await refreshStatus();
    }, environment ? STATUS_POLLING_INTERVAL : null, true);

  useEffect(() => {
    return () => {
      // When unmounted destroy any running environment.
      stopEnvironment();
    }
  }, []);

  return (
    <Okteto.Provider value={{
      currentContext,
      contextList,
      environment,
      output,
      loading,
      ready,
      status,

      login,
      stopEnvironment,
      selectEnvironment,
      selectContext,
      relaunchEnvironment
    }}>
      {children}
    </Okteto.Provider>
  );
};

const useOkteto = () : OktetoStore => {
  const ctx = useContext(Okteto);
  if (ctx === null) {
    throw new Error('useOkteto must be used within a OktetoProvider');
  }
  return ctx;
};

export { OktetoProvider, useOkteto };
