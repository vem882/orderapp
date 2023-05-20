import React, { useState } from 'react';
import { useNotify, useRefresh } from 'react-admin';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTracking } from '../dataProvider';
import { AFTERSHIP_COURIERS } from '../constants';

const useStyles = makeStyles(() => ({
  dialog: {
    minWidth: '400px',
  },
}));

const TrackingButton = ({ record }) => {
  const classes = useStyles();
  const notify = useNotify();
  const refresh = useRefresh();
  const [open, setOpen] = useState(false);
  const [courier, setCourier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const tracking = useTracking();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    try {
      const response = await tracking.addTracking({
        courier: courier,
        tracking_number: trackingNumber,
        orderNumber: record.orderNumber,
      });
      notify(`Successfully added tracking for ${courier} ${trackingNumber}`);
      refresh();
      handleClose();
    } catch (err) {
      notify(`Error adding tracking: ${err.message}`, 'error');
    }
  };

  const handleCourierChange = (event) => {
    setCourier(event.target.value);
  };

  const handleTrackingNumberChange = (event) => {
    setTrackingNumber(event.target.value);
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Add Tracking
      </Button>
      <Dialog open={open} onClose={handleClose} className={classes.dialog}>
        <DialogTitle>Add Tracking</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Courier"
            select
            required
            fullWidth
            value={courier}
            onChange={handleCourierChange}
          >
            {AFTERSHIP_COURIERS.map((courier) => (
              <option key={courier} value={courier}>
                {courier}
              </option>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="Tracking Number"
            fullWidth
            required
            value={trackingNumber}
            onChange={handleTrackingNumberChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TrackingButton;
