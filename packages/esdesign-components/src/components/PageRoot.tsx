import { Box, Button, Stack } from '@mui/material';
import * as React from 'react';
import { ISoltProps } from '../types';
import { createEsDesginComponent } from '../utils';


function PageRoot(props: ISoltProps) {
  return (<Stack
    data-testid="page-root"
    direction="column"
    sx={{ p: 1, gap: 1, width: '100%' }}>
    PageRoot
    {props.children}
  </Stack>);
}




export default createEsDesginComponent(PageRoot, 'slot', {});  