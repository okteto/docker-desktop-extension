import { ChangeEvent, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useOkteto } from '../contexts/Okteto.context';



type ContextDialogProps = {
  open: boolean,
  onClose?: () => void 
};

export default function ContextDialog({ open, onClose } : ContextDialogProps) {
  const [url, setUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(true);
  const { addContext } = useOkteto();

  const handleClose = () => {
    onClose?.();
    setUrl('');
    setIsValidUrl(true);
  };

  const handleAddContext = async () => {
    if (isValidUrl) {
      await addContext(url);
      handleClose();
    }
  }

  const handleUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setUrl(inputValue);

    // Regular expression for a simple URL validation
    const urlRegex: RegExp = /^(https):\/\/[^ "]+$/;

    // Check if the input value matches the URL pattern
    setIsValidUrl(inputValue === '' || urlRegex.test(inputValue));
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Context</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Add a new context URL to point to you Okteto cluster. 
        </DialogContentText>
        <TextField
          autoFocus
          id="name"
          label="Okteto Context URL"
          type="url"
          fullWidth
          variant="filled"
          sx={{
            minWidth: 400,
            my: 2
          }}
          onChange={handleUrlChange}
          error={!isValidUrl}
          helperText={!isValidUrl ? 'Please enter a valid URL' : ''}
          value={url}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          variant="contained"
          color="primary"
          onClick={handleAddContext} 
          disabled={!isValidUrl || url.trim() === ''}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
