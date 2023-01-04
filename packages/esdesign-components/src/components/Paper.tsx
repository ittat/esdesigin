import { Paper as P, styled, Box, Typography } from '@mui/material';
import * as React from 'react';
import { ISoltProps } from '../types';
import { createEsDesginComponent } from '../utils';
import BlanksSoltTips from './BlanksSoltTips';

function Paper(props: ISoltProps) {

  return (

    <P sx={{ margin: 1 }}>
      {props.children}
      {/* {React.Children.count(props.children) ? props.children : <BlanksSoltTips />} */}
    </P>

  );
}




export default createEsDesginComponent(Paper, 'slot', {});  