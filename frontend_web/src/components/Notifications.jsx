import React from "react";
import { Box, Typography } from "@mui/material";

function Overview() {
  return (
    <Box
      component="main"
      sx={{
        bgcolor: "background.default",
        p: 3,
      }}
    >
      <Typography variant="h4">Notifications</Typography>
    </Box>
  );
}

export default Overview;
