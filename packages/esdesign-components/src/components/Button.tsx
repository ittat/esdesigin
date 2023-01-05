import { Button as B } from '@mui/material';
import * as React from 'react';
import { createEsDesginComponent } from '../utils';


function Button() {
  return (
    <B style={{ fontSize: '30px' }} >
     TestButton
    </B>
  );
}




export default createEsDesginComponent(Button,'', {
  text:{
    type:'string',
    value:'button'
  }
});  