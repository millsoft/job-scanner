import * as React from "react";
import { useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Box,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import Percentage from "./Percentage";
import { statusOptions } from "./JobView";

export default function JobDetails({
  job,
  opened,
  setOpened,
}: {
  job: any;
  opened: boolean;
  setOpened: (opened: boolean) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState<DialogProps["scroll"]>("paper");
  const [parsedDescription, setParsedDescription] = React.useState("");
  const [status, setStatus] = React.useState(job?.status ?? 0);

  const handleClose = () => {
    setOpen(false);
  };

  const openDetails = () => {
    window.open(job.url, "_blank");
  };

  const updateStatus = (event: SelectChangeEvent) => {
    const status = event.target.value;
    setStatus(status);

    fetch(`/api/jobs/status?id=${job.id}&status=${status}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  useEffect(() => {
    setStatus(job?.status ?? 0);
  }, [job]);

  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }

    setOpened(open);
  }, [open]);

  React.useEffect(() => {
    if (job === null) {
      setOpen(false);
      return;
    }

    const lines = job.description.split("\n");
    const parsed = lines.map((line: string, index: number) => (
      <Typography key={index}>{line}</Typography>
    ));
    setParsedDescription(parsed);
  }, [job]);

  React.useEffect(() => {
    setOpen(opened);
  }, [opened]);

  if (!opened) {
    return null;
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">
          <Grid container spacing={2}>
            <Grid item xs>
              <Typography variant="h5">{job.title}</Typography>
              <Typography variant="caption">{job.company}</Typography>
            </Grid>
            <Grid item>
              <Percentage percentage={job.result?.compatibility_percentage} />
            </Grid>
          </Grid>

          <Box mt={2} mb={2}>
          <Divider />
          </Box>

          <Grid container spacing={0} alignItems={"center"}>
            <Grid item xs={5}>
              <FormControl fullWidth size="small">
                <InputLabel id="status-select-label">Status</InputLabel>
                <Select
                  labelId="status-select-label"
                  id="status-select"
                  value={status ?? 0}
                  label="Status"
                  onChange={updateStatus}
                >
                  {statusOptions.map((option, index) => (
                    <MenuItem key={index} value={index}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent dividers={scroll === "paper"}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <Box mb={2}>
              <Typography variant="body2" style={{ fontWeight: "bold" }}>
                {job.result?.advice}
              </Typography>
            </Box>

            <Divider />
            <Box mt={2}>{parsedDescription}</Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>CLOSE</Button>
          &nbsp;
          <Button
            variant="contained"
            onClick={() => {
              openDetails();
            }}
          >
            OPEN DETAILS
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
