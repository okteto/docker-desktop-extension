import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';

import okteto, { OktetoContext } from '../api/okteto';
import useIntervalWhileVisible from '../hooks/useIntervalWhileVisible';

interface OktetoEnvironment {
  file: string
  link: string
  endpoints: Array<string>
}

interface OktetoStore {
  currentContext: OktetoContext | null
  environment: OktetoEnvironment | null
  loading: boolean
  ready: boolean

  login: () => void
  logout: () => void
  launchEnvironment: (f: string) => void
  stopEnvironment: () => void
}

const Okteto = createContext<OktetoStore | null>(null);

type OktetoProviderProps = {
  children?: ReactNode
};

const CONTEXT_POLLING_INTERVAL = 3000;
const CLOUD_CONTEXT_NAME = 'https://cloud.okteto.com';

const OktetoProvider = ({ children } : OktetoProviderProps) => {
  const [currentContext, setCurrentContext] = useState<OktetoContext | null>(null);
  const [environment, setEnvironment] = useState<OktetoEnvironment | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  const login = async () => {
    setLoading(true);
    await okteto.setContext(CLOUD_CONTEXT_NAME);
  };

  const logout = async () => {
    await okteto.deleteContext(CLOUD_CONTEXT_NAME);
  };

  const launchEnvironment = async (file: string) => {
    setEnvironment({
      file,
      link: 'https://cloud.okteto.com',
      endpoints: []
    });
  };

  const stopEnvironment = async () => {
    setEnvironment(null);
  };

  const refreshCurrentContext = async () => {
    const { value, error } = await okteto.getContext();
    const isLoggedIn = !error && value?.name === CLOUD_CONTEXT_NAME;
    setCurrentContext(isLoggedIn ? value : null);
  };

  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
  }, [currentContext]);

  useIntervalWhileVisible(async () => {
    await refreshCurrentContext();
    setReady(true);
  }, CONTEXT_POLLING_INTERVAL);

  return (
    <Okteto.Provider value={{
      currentContext,
      environment,
      loading,
      ready,

      login,
      logout,
      launchEnvironment,
      stopEnvironment
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
