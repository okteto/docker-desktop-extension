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

  const login = useCallback(() => {
    setLoading(true);
    okteto.contextUse(CLOUD_CONTEXT_NAME);
  }, [setLoading]);

  const logout = useCallback(() => {
    okteto.contextDelete(CLOUD_CONTEXT_NAME);
    setEnvironment(null);
  }, []);

  const selectEnvironment = (file: string) => {
    setEnvironment({
      file,
      link: `https://cloud.okteto.com/#/spaces/${currentContext?.namespace ?? ''}`
    });
  };

  const selectContext = useCallback((contextName: string) => {
    okteto.contextUse(contextName);
    // Should we stop running environment? Warn users: "You have running environments, do you want to switch?"
  }, []);

  const stopEnvironment = async () => {
    setEnvironment(null);
  };

  const refreshContext = async () => {
    const { value: context, error } = await okteto.contextShow();
    const isLoggedIn = !error && context?.name === CLOUD_CONTEXT_NAME;
    setCurrentContext(isLoggedIn ? context : null);

    const { value: list } = await okteto.contextList();
    setContextList(list ?? []);
  };

  useInterval(async () => {
    await refreshContext();
    setReady(true);
  }, CONTEXT_POLLING_INTERVAL);

  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
  }, [currentContext]);

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
