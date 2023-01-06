import { Box, Button, Stack } from '@mui/material';
import * as React from 'react';
import { ISoltProps } from '../types';
import { createBuiltInComponent } from '../utils';
import BlanksSoltTips from './BlanksSoltTips';


function PageColumn(props: ISoltProps) {
  return (
    <Box>
      <Stack direction='column' sx={{ my: 2, mx: 1, gap: 1 }} alignItems={props.alignItems || undefined}>
        {props.children}
        {/* {React.Children.count(props.children) ? props.children : <BlanksSoltTips />} */}
      </Stack>
    </Box>
  );
}




export default createBuiltInComponent('PageColumn',PageColumn, 'slot', {
  alignItems: {
    type: 'string',
    value: 'unset',
    enums: ['unset','start', 'center', 'end']
  }
});  