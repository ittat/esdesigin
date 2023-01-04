import { Box, Button, Stack } from '@mui/material';
import * as React from 'react';
import { ISoltProps } from '../types';
import { createEsDesginComponent } from '../utils';
import BlanksSoltTips from './BlanksSoltTips';


function PageRow(props: ISoltProps) {
  console.log("PageRow length", React.Children.count(props.children))

  return (
    <Box>
      PageRow
      <Stack direction='row' sx={{ mx: 2, gap: 1 }}>
        {props.children}
        {/* {React.Children.count(props.children) ? props.children : <BlanksSoltTips />} */}
      </Stack>
    </Box>
  );
}




export default createEsDesginComponent(PageRow, 'slot', {});  