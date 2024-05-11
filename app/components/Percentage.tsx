import * as React from "react";
import { CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";

export default function Percentage({
  percentage,
}: {
  percentage: number;
}) {

  if (isNaN(percentage)) {
    return null;
  }

  return (
    <>
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress
          variant="determinate"
          value={percentage}
        />

        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="caption"
            component="div"
            color="text.secondary"
          >{`${Math.round(percentage)}%`}</Typography>
        </Box>
      </Box>
    </>
  );
}
