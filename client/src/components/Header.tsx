import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import LinearProgress from '@mui/material/LinearProgress';
import { useConfirm } from 'material-ui-confirm';

import Link from './Link';
import { useOkteto, defaultContextName } from '../contexts/Okteto.context';
import logoDark from '../images/logo-dark.svg';
import logoLight from '../images/logo-light.svg';

function Header({}) {
  const theme = useTheme();
  const confirm = useConfirm();
  const { environment, selectContext, currentContext, contextList, loading } = useOkteto();
  const moreThanCloud = !(contextList.length === 1 && contextList[0].name === defaultContextName);

  const handleContextChange = async ({ target }: SelectChangeEvent) => {
    try {
      if (environment) {
        await confirm({
          title: 'Switch Context',
          content: (
            <Typography variant="body1">
              Switching contexts will stop your running environment. Are you sure you want to continue?
            </Typography>
          ),
          confirmationButtonProps: {
            variant: 'contained'
          },
          cancellationButtonProps: {
            variant: 'outlined'
          }
        });
      }
      selectContext(target.value);
    } catch(_) {
      return;
    }
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

        {moreThanCloud &&
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
        }
      </Box>
    </>
  );
}

export default Header;