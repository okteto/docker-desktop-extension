import { useState } from 'react';
import { Divider, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { useConfirm } from 'material-ui-confirm';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloudCircleIcon from '@mui/icons-material/CloudCircle';

import { useOkteto } from '../contexts/Okteto.context';
import ContextDialog from './ContextDialog';

const NEW_LABEL = '--new-context';

function ContextSelector({}) {
  const theme = useTheme();
  const confirm = useConfirm();
  const { environment, selectContext, currentContext, contextList, loading } =
    useOkteto();
  const [open, setOpen] = useState(false);

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleContextChange = async ({ target }: SelectChangeEvent) => {
    try {
      if (environment) {
        await confirm({
          title: 'Switch Context',
          content: (
            <Typography variant="body1">
              Switching contexts will stop your running environment. Are you
              sure you want to continue?
            </Typography>
          ),
          confirmationButtonProps: {
            variant: 'contained',
          },
          cancellationButtonProps: {
            variant: 'outlined',
          },
        });
      }
      selectContext(target.value);
    } catch (_) {
      return;
    }
  };

  return (
    <FormControl sx={{ minWidth: 120 }} size="small" disabled={loading}>
      <Select
        id="context-selector"
        value={currentContext?.name ?? ''}
        onChange={handleContextChange}
        displayEmpty
        inputProps={{ 'aria-label': 'Without label' }}
        SelectDisplayProps={{
          style: { 
            display: 'flex', 
            alignItems: 'center' 
          },
        }}
        variant="outlined"
      >
        {contextList.length === 0 && (
          <MenuItem disabled value="">
            <em>No context found</em>
          </MenuItem>
        )}
        {contextList.map((context) => (
          <MenuItem key={context.name} value={context.name}>
            <ListItemIcon>
              <CloudCircleIcon />
            </ListItemIcon>
            <ListItemText primary={context.name} />
          </MenuItem>
        ))}
        <Divider />
        <MenuItem key={NEW_LABEL} value={NEW_LABEL} onClick={handleOpenDialog}>
          <ListItemIcon>
            <AddCircleIcon />
          </ListItemIcon>
          <ListItemText primary="Add new context" />
        </MenuItem>
      </Select>
      <ContextDialog open={open} onClose={handleCloseDialog} />
    </FormControl>
  );
}

export default ContextSelector;
