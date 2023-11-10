import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { List, Box, Divider, ListItem, ListItemText, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { shadows, colors } from '../components/Theme';
import { useOkteto } from '../contexts/Okteto.context';

function SelectDev() {
  const theme = useTheme();
  const { selectManifest, selectDev } = useOkteto();

  function handleDevClick(devName: string) {
    selectDev(devName);
  }

  return (
    <>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        px: 3,
        py: 2,
        gap: 1,
      }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          gap: 1,
        }}>
          <Button size="small" startIcon={<ArrowBackIcon />} onClick={() => selectManifest(null)}>
            Back
          </Button>
        </Box>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          px: 1
        }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            Select Dev Container
          </Typography>
          <Typography variant="subtitle1">
            Choose the development container to start syncronizing your code.
          </Typography>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            gap: 1,
            borderRadius: 2,
            alignItems: 'center',
            py: 4
          }}>
            <List component="nav" sx={{
              width: '100%',
              borderRadius: 1,
              border: '.5px solid',
              borderColor: theme.palette.divider,
              maxWidth: '250px',  
              boxShadow: shadows.primary,
            }}>
              <ListItem button>
                <ListItemText primary="api" onClick={() => handleDevClick('api')} />
              </ListItem>
              <Divider />
              <ListItem button divider>
                <ListItemText primary="frontend" onClick={() => handleDevClick('frontend')}/>
              </ListItem>
              <ListItem button>
                <ListItemText primary="worker" onClick={() => handleDevClick('worker')} />
              </ListItem>
              <Divider light />
            </List>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default SelectDev;