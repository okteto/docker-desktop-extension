import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

import okteto, { OktetoContext } from '../api/okteto';
import useIntervalWhileVisible from '../hooks/useIntervalWhileVisible';

interface OktetoInterface {
  currentContext: OktetoContext | null
  login: () => void
  loading: boolean
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

  const login = async () => {
    setLoading(true);
    await okteto.setContext(CLOUD_CONTEXT_NAME);
  };

  useIntervalWhileVisible(async () => {
    // Update current context.
    const { value, error } = await okteto.getContext();
    if (!error && value?.name === CLOUD_CONTEXT_NAME) {
      if (loading) setLoading(false);
      setCurrentContext(value);
    } else {
      setCurrentContext(null);
    }
  }, CONTEXT_POLLING_INTERVAL, true);


  return (
    <Okteto.Provider value={{
      currentContext,
      loading,
      login
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
