import { ChangeEvent, useState } from 'react';
import { Box, Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';

import { useOkteto } from '../contexts/Okteto.context';
import illustration from '../images/illustration.svg';

const defaultFile = '';
// /Users/rlamana/Repositories/okteto/compose-getting-started/docker-compose.yml';

function SelectCompose() {
  const { environment, selectEnvironment } = useOkteto();
  const [file, setFile] = useState(defaultFile);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.value);
  };

  const handleLaunch = () => {
    if (file) {
      selectEnvironment(file);
    }
  };

  return (
    <>
      <Box sx={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        width: '100%'
      }}>
        {/* <img src={illustration} width="240" /> */}

        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          gap: 1
        }}>
          <FormControl sx={{ flex: 1, width: '100%'}}>
            <TextField
              defaultValue={defaultFile}
              hiddenLabel
              placeholder="/file/to/your/docker-compose"
              onChange={handleFileChange}
            />
          </FormControl>

          <Button
            variant="contained"
            size="large"
            sx={{ fontSize: '1rem', height: '3.2rem' }}
            onClick={handleLaunch}
          >
            Launch Remote Environment
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default SelectCompose;