import { createContext, useContext, useState, ReactNode } from 'react';
import useInterval from 'use-interval';

import okteto, { OktetoContext, OktetoContextList } from '../api/okteto';

interface OktetoEnvironment {
  file: string
  link: string
  contextName: string
}

interface OktetoStore {
  currentContext: OktetoContext | null
  contextList: OktetoContextList
  environment: OktetoEnvironment | null
  loading: boolean
  ready: boolean

  login: () => void
  stopEnvironment: () => void,
  selectEnvironment: (f: string) => void
  selectContext: (f: string) => void
}

type OktetoProviderProps = {
  children?: ReactNode
};

const Okteto = createContext<OktetoStore | null>(null);

const CONTEXT_POLLING_INTERVAL = 3000;
export const defaultContextName = 'https://cloud.okteto.com';

const OktetoProvider = ({ children } : OktetoProviderProps) => {
  const [currentContext, setCurrentContext] = useState<OktetoContext | null>(null);
  const [contextList, setContextList] = useState<OktetoContextList>([]);
  const [environment, setEnvironment] = useState<OktetoEnvironment | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  const login = async () => {
    setLoading(true);
    await okteto.contextUse(defaultContextName);
    setLoading(false);
  };

  const selectEnvironment = (file: string) => {
    if (!currentContext) return;
    setEnvironment({
      file,
      link: `${currentContext.name}/#/spaces/${currentContext.namespace}`,
      contextName: currentContext.name
    });
  };

  const selectContext = async (contextName: string) => {
    // TODO: What do we do if context is changed with an environment launched? Dialog?
    setLoading(true);
    const context = contextList.find(c => c.name === contextName);
    if (context) {
      setCurrentContext(context);
    }
    setLoading(false);
  };

  const stopEnvironment = async () => {
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

  useInterval(async () => {
    // Don't refresh until current command execution has finished.
    if (loading) return;
    await refreshContext();
    setReady(true);
  }, CONTEXT_POLLING_INTERVAL, true);

  return (
    <Okteto.Provider value={{
      currentContext,
      contextList,
      environment,
      loading,
      ready,

      login,
      stopEnvironment,
      selectEnvironment,
      selectContext
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
