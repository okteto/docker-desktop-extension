import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';

import okteto, { OktetoContext } from '../api/okteto';
import useIntervalWhileVisible from '../hooks/useIntervalWhileVisible';

interface OktetoInterface {
  currentContext: OktetoContext | null
  login: () => void
  loading: boolean
  ready: boolean
}

const Okteto = createContext<OktetoInterface | null>(null);

type OktetoProviderProps = {
  children?: ReactNode
};

const CONTEXT_POLLING_INTERVAL = 3000;
const CLOUD_CONTEXT_NAME = 'https://cloud.okteto.com';

const OktetoProvider = ({ children } : OktetoProviderProps) => {
  const [currentContext, setCurrentContext] = useState<OktetoContext | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  const login = async () => {
    setLoading(true);
    await okteto.setContext(CLOUD_CONTEXT_NAME);
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
      loading,
      login,
      ready
    }}>
      {children}
    </Okteto.Provider>
  );
};

const useOkteto = () : OktetoInterface => {
  const ctx = useContext(Okteto);
  if (ctx === null) {
    throw new Error('useOkteto must be used within a OktetoProvider');
  }
  return ctx;
};

export { OktetoProvider, useOkteto };
