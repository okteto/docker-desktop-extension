import { createContext, useContext, useState, ReactNode } from 'react';

import okteto from '../api/okteto';
import useIntervalWhileVisible from '../hooks/useIntervalWhileVisible';

interface OktetoContextInterface {
  context: string | null
}

const OktetoContext = createContext<OktetoContextInterface | null>(null);

type OktetoProviderProps = {
  children?: ReactNode
};

const CONTEXT_POLLING_INTERVAL = 5000;

const OktetoProvider = ({ children } : OktetoProviderProps) => {
  const [context, setContext] = useState(null);

  const value = {
    context,
    setContext
  };

  useIntervalWhileVisible(() => {
    console.log(okteto.getContextList());
  }, CONTEXT_POLLING_INTERVAL);

  return (
    <OktetoContext.Provider value={value}>
      {children}
    </OktetoContext.Provider>
  );
};

const useOkteto = () : OktetoContextInterface => {
  const context = useContext(OktetoContext);
  if (context === null) {
    throw new Error('useOkteto must be used within a OktetoProvider');
  }
  return context;
};

export { OktetoProvider, useOkteto };
