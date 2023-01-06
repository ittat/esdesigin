import { Button as B } from '@mui/material';
import * as React from 'react';
import { disabledConfig, MUIColorConfig, MUIfullWidthConfig, MUISizeConfig } from '../argCommons';
import { ICommonProps } from '../types';
import { createBuiltInComponent, filterProps } from '../utils';


function Button(props: ICommonProps) {

  const text = props.text || 'Button'
  

  const clearProps = filterProps(props,['text','children'])

  return (
    <B  {...clearProps}>
      {text}
    </B>
  );
}




export default createBuiltInComponent('Button',Button, '', {
  text: {
    type: 'string',
    value: 'button'
  },
  variant: {
    type: 'string',
    value: 'contained',
    enums: ["", "text", "outlined", "contained"]
  },
  ...MUISizeConfig,
  ...MUIColorConfig,
  ...MUIfullWidthConfig,
  ...disabledConfig,
});  