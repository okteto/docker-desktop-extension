import { ExecProcess } from '@docker/extension-api-client-types/dist/v1';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import useInterval from 'use-interval';

import okteto, { OktetoContext, OktetoContextList } from '../api/okteto';
import { OktetoDevList } from '../api/extension';

interface OktetoEnvironment {
  file: string
  dev: string
  link: string
  contextName: string
  process: ExecProcess | undefined
}

interface OktetoStore {
  currentContext: OktetoContext | null
  contextList: OktetoContextList
  currentManifest: string | null
  currentDev: string | null
  devList: OktetoDevList
  environment: OktetoEnvironment | null
  output: string
  loading: boolean
  ready: boolean

  loginIntoCloud: () => void
  stopEnvironment: () => void,
  selectManifest: (f: string | null) => void
  selectDev: (devName: string) => void
  selectContext: (f: string) => void
  relaunchEnvironment: () => void
}

type OktetoProviderProps = {
  children?: ReactNode
};

const Okteto = createContext<OktetoStore | null>(null);

const CONTEXT_POLLING_INTERVAL = 3000;
export const cloudContextName = 'https://cloud.okteto.com';

const OktetoProvider = ({ children } : OktetoProviderProps) => {
  const [currentContext, setCurrentContext] = useState<OktetoContext | null>(null);
  const [contextList, setContextList] = useState<OktetoContextList>([]);

  const [currentManifest, setCurrentManifest] = useState<string | null>(null);
  const [currentDev, setCurrentDev] = useState<string | null>(null);
  const [devList, setDevList] = useState<OktetoDevList>([]);

  const [environment, setEnvironment] = useState<OktetoEnvironment | null>(null);

  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  const loginIntoCloud = async () => {
    setLoading(true);
    await okteto.contextUse(cloudContextName);
    setLoading(false);
  };

  const selectManifest = (file: string | null) => {
    if (!currentContext) return;
    setCurrentManifest(file);
  };

  const selectDev = (devName: string) => {
    if (!currentContext || !currentManifest) return;
    setCurrentDev(devName);
    launchEnvironment(currentManifest, devName);
  };

  const launchEnvironment = (file: string, devName: string) => {
    if (!currentContext) return;
    setOutput('');
    setEnvironment({
      file,
      dev: devName,
      link: `${currentContext.name}/#/spaces/${currentContext.namespace}`,
      contextName: currentContext.name,
      process: okteto.up(file, currentContext.name, stdout => {
        setOutput(stdout);
      })
    });
  };

  const selectContext = async (contextName: string) => {
    // TODO: What do we do if context is changed with an environment launched? Dialog?
    setLoading(true);
    const context = contextList.find(c => c.name === contextName);
    if (context) {
      stopEnvironment();
      await okteto.contextUse(contextName);
      refreshContext();
    }
    setLoading(false);
  };

  const stopEnvironment = async () => {
    environment?.process?.close();
    setOutput('');
    setEnvironment(null);
    setCurrentDev(null);
    setCurrentManifest(null);
  };

  const refreshContext = async () => {
    // Set context list
    const list = await okteto.contextList();
    setContextList(list);

    // Set current context
    const context = list.find(c => c.current);
    setCurrentContext(context ?? null);
  };

  const relaunchEnvironment = async () => {
    if (!environment || loading) return;

    const {file, dev, contextName} = environment;

    stopEnvironment();
    selectContext(contextName);
    setCurrentManifest(file);
    setCurrentDev(dev);
    launchEnvironment(file, dev);
  }

  useInterval(async () => {
    // Don't refresh until current command execution has finished.
    if (loading) return;
    await refreshContext();
    setReady(true);
  }, CONTEXT_POLLING_INTERVAL, true);

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
      currentManifest,
      currentDev,
      devList,
      environment,
      output,
      loading,
      ready,

      loginIntoCloud,
      stopEnvironment,
      selectManifest,
      selectDev,
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
