import { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import LinkIcon from '@mui/icons-material/Link';

import Output from '../components/Output';
import Atom from '../components/Atom';
import Link from '../components/Link';

type EnvironmentProps = {
  path: string
  onReset?: () => void
};

const endpoints = [
  'https://movies-rlamana.staging.okteto.net',
  'https://movies-rlamana.staging.okteto.net/api'
];

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
    <>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        bgcolor: theme => theme.palette.mode === 'dark' ? '#13222a' : 'grey.800',
        borderRadius: 1,
        px: 3,
        py: 2,
        gap: 2
      }}>
        <Atom
          label="Docker-compose file:"
          icon={<InsertDriveFileIcon htmlColor="#B0BCD7" />}
        >
          <Typography variant="body1">{path}</Typography>
        </Atom>

        <Atom
          label="Endpoints:"
          icon={<LinkIcon htmlColor="#B0BCD7" />}
        >
          {endpoints.map(endpoint => (
            <Link href={endpoint}>
              {endpoint}
            </Link>
          ))}
        </Atom>
      </Box>

      <Output>
        {output}
      </Output>
      <Button variant="contained" size="large" onClick={onReset}>
        Stop
      </Button>
    </>
  );
}

export default Environment;