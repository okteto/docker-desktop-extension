import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import LinearProgress from '@mui/material/LinearProgress';

import Link from '../components/Link';
import { useOkteto } from '../contexts/Okteto.context';
import logoDark from '../images/logo-dark.svg';
import logoLight from '../images/logo-light.svg';

function Header({}) {
  const theme = useTheme();
  const { selectContext, currentContext, contextList, loading } = useOkteto();

  const handleContextChange = async ({ target }: SelectChangeEvent) => {
    await selectContext(target.value);
  };

  return (
    <>
      <Box sx={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%'
      }}>
        {loading &&
          <LinearProgress />
        }
      </Box>
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        borderRadius: 1,
        py: 2,
        px: 1,
        gap: 1
      }}>
        <img src={theme.palette.mode === 'dark' ? logoDark : logoLight} width="100" />
        <div style={{ flex: '1 auto' }} />
        <Typography variant="body2">
          Connected to:
          {currentContext?.name === 'https://cloud.okteto.com' &&
            <Link
              href="https://cloud.okteto.com"
              variant="body2"
              sx={{
                fontWeight: 'bold',
                color: 'primary',
                m: 0.5
              }}
            >
              Okteto Cloud
            </Link>
          }
        </Typography>

        <FormControl sx={{ minWidth: 120 }} size="small" disabled={loading}>
          <Select
            value={currentContext?.name ?? ''}
            onChange={handleContextChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
          >
            {contextList.map(context => (
              <MenuItem key={context.name} value={context.name}>{context.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </>
  );
}

export default Header;