import { Button as B } from '@mui/material';
import * as React from 'react';
import { MUIColorConfig, MUISizeConfig } from '../argCommons';
import { ICommonProps } from '../types';
import { createEsDesginComponent, filterProps } from '../utils';


function Button(props: ICommonProps) {

  const text = props.text || 'Button'

  const clearProps = filterProps(props,['text','children'])

  return (
    <B  {...clearProps}>
      {text}
    </B>
  );
}




export default createEsDesginComponent(Button, '', {
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
  ...MUIColorConfig
});  