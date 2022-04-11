import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import useInterval from 'use-interval';

import okteto, { OktetoContext, OktetoContextList } from '../api/okteto';

interface OktetoEnvironment {
  file: string
  link: string
}

interface OktetoStore {
  currentContext: OktetoContext | null
  contextList: OktetoContextList
  environment: OktetoEnvironment | null
  loading: boolean
  ready: boolean

  login: () => void
  logout: () => void
  stopEnvironment: () => void,
  selectEnvironment: (f: string) => void
  selectContext: (f: string) => void
}

type OktetoProviderProps = {
  children?: ReactNode
};

const Okteto = createContext<OktetoStore | null>(null);

const CONTEXT_POLLING_INTERVAL = 3000;
const CLOUD_CONTEXT_NAME = 'https://cloud.okteto.com';

const OktetoProvider = ({ children } : OktetoProviderProps) => {
  const [currentContext, setCurrentContext] = useState<OktetoContext | null>(null);
  const [contextList, setContextList] = useState<OktetoContextList>([]);
  const [environment, setEnvironment] = useState<OktetoEnvironment | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  const login = async () => {
    setLoading(true);
    await okteto.contextUse(CLOUD_CONTEXT_NAME);
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    await okteto.contextDelete(CLOUD_CONTEXT_NAME);
    setEnvironment(null);
    setLoading(false);
  };

  const selectEnvironment = (file: string) => {
    setEnvironment({
      file,
      link: `https://cloud.okteto.com/#/spaces/${currentContext?.namespace ?? ''}`
    });
  };

  const selectContext = async (contextName: string) => {
    setLoading(true);
    const { value: context } = await okteto.contextUse(contextName);
    if (context) {
      setCurrentContext(context);
    }
    setLoading(false);
  };

  const stopEnvironment = async () => {
    setEnvironment(null);
  };

  const refreshContext = async () => {
    const { value: list = [] } = await okteto.contextList();
    setContextList(list);

    // We consider a user as logged in if he has configured Okteto Cloud's context.
    const isLoggedIn = list.find(context => context.name === CLOUD_CONTEXT_NAME);
    const context = list.find(context => context.current);
    if (!isLoggedIn) {
      setCurrentContext(null);
    } else if (context) {
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
      logout,
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
