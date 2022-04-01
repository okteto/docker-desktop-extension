import { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';

import Output from '../components/Output';

type EnvironmentProps = {
  path: string
  onReset?: () => void
};

function Environment({ path, onReset }: EnvironmentProps) {
  const [output, setOutput] = useState('Running okteto...\n');

  useEffect(() => {
    const args = ['up', '-f', path, '-l', 'plain'];
    window.ddClient.extension.host.cli.exec('okteto', args, {
      stream: {
        onOutput(line: { stdout: string | undefined, stderr: string | undefined }): void {
          console.log(line.stdout);
          setOutput(output => `${output}${line.stdout ?? ''}${line.stderr ?? ''}`);
        },
        onError(error: any): void {
          console.error(error);
        },
        onClose(exitCode: number): void {
          console.log(`onClose with exit code ${exitCode}`);
        },
      },
    });
  }, [path]);

  return (
    <Box sx={{
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      height: '100%',
      gap: 1
    }}>
      Docker-compose file: {path}
      <Output>
        {output}
      </Output>
      <Button variant="contained" size="large" onClick={onReset}>
        Stop
      </Button>
    </Box>
  );
}

export default Environment;