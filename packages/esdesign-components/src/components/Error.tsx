import { Box, Button } from '@mui/material';
import * as React from 'react';
import { createBuiltInComponent } from '../utils';


function Error() {
  return (
    <Box>Something is wrroy!</Box>
  );
}




export default createBuiltInComponent('Error',Error,'', {});  