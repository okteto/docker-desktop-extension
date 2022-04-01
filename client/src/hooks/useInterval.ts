import { useEffect } from 'react';

const useInterval = (callback: () => void, delay = 0, immediate = true) => {
  useEffect(() => {
    let interval: number;

    if (immediate) callback();
    interval = window.setInterval(callback, delay);

    return () => {
      window.clearInterval(interval);
    };
  }, [callback, delay, immediate]);
};

export default useInterval;
