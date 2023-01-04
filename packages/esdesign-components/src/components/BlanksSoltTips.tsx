import { styled, Box, Typography } from '@mui/material';
import * as React from 'react';

const TipsBorder = styled(Box)({
  boxSizing:'border-box',
  color: 'green',
  padding: 2,
  border: "3px dashed",
  borderRadius: 5,
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight:65,
  backgroundColor:'white'
})

const BlanksSoltTips = () => {
  return <TipsBorder>
     <Typography variant='h6' mx={1} >+</Typography>
    <Typography>Drop Component in here</Typography>
  </TipsBorder>
}

export default BlanksSoltTips
