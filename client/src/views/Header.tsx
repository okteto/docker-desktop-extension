import { Box, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

import Link from '../components/Link';
import { useOkteto } from '../contexts/Okteto.context';
import logoDark from '../images/logo-dark.svg';
import logoLight from '../images/logo-light.svg';

function Header({}) {
  const theme = useTheme();
  const { selectContext, currentContext, contextList } = useOkteto();

  const handleContextChange = ({ target }: SelectChangeEvent) => {
    selectContext(target.value)
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      borderRadius: 1,
      py: 2,
      px: 1,
      gap: 2
    }}>
      <img src={theme.palette.mode === 'dark' ? logoDark : logoLight} width="100" />
      <div style={{ flex: '1 auto' }} />
      <Typography variant="body2">
        Connected to: <Link
          href="https://cloud.okteto.com"
          variant="body2"
          sx={{
            fontWeight: 'bold',
            color: 'primary'
          }}
        >
          Okteto Cloud
        </Link>
      </Typography>

      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
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
  );
}

export default Header;