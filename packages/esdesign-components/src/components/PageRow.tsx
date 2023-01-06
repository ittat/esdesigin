import { Box, Button, Stack } from '@mui/material';
import * as React from 'react';
import { ISoltProps } from '../types';
import { createBuiltInComponent } from '../utils';
import BlanksSoltTips from './BlanksSoltTips';


function PageRow(props: ISoltProps) {
  console.log("PageRow length", React.Children.count(props.children))


  return (
    <Box>
      <Stack direction='row' sx={{ mx: 2, my: 1, gap: 1 }} justifyContent={props.justifyContent || undefined}>
        {props.children}
        {/* {React.Children.count(props.children) ? props.children : <BlanksSoltTips />} */}
      </Stack>
    </Box>
  );
}




export default createBuiltInComponent('PageRow',PageRow, 'slot', {
  justifyContent: {
    type: 'string',
    value: 'start',
    enums: ['start', 'center', 'end']
  }
});  