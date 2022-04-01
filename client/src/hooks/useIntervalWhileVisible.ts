import { useEffect } from 'react';

const useIntervalWhileVisible = (callback: () => void, delay = 0, immediate = true) => {
  useEffect(() => {
    let interval: number;

    const handleVisibilityChange = () => {
      window.clearInterval(interval);
      if (document.visibilityState === 'hidden') return;
      if (immediate) callback();
      interval = window.setInterval(callback, delay);
    };

    handleVisibilityChange();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [callback, delay, immediate]);
};

export default useIntervalWhileVisible;
