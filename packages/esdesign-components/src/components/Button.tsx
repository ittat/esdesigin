import { Button as B } from '@mui/material';
import * as React from 'react';
import { disabledConfig, MUIColorConfig, MUIfullWidthConfig, MUISizeConfig } from '../argCommons';
import { ICommonProps } from '../types';
import { createBuiltInComponent, filterProps } from '../utils';


function Button(props: ICommonProps) {

  const text = props.text || 'Button'

  const clearProps = filterProps(props, ['text', 'children'])


  return (
    <B  {...clearProps}>
      {text}
    </B>
  );
}




export default createBuiltInComponent('Button', Button, '', {
  text: {
    type: 'string',
    value: 'button232312',
    action:{
      type:'JSExpression',
      // value:'$scope("btn1")'
      // value:'$query("23r2r-23r2r3r-23rr-23r23-23r32")'
      value:'$params.get("test123")'
    }
  },
  variant: {
    type: 'string',
    value: 'contained',
    enums: ["", "text", "outlined", "contained"]
  },
  onClick: {
    type: 'event',
    action:{
      type:'JSExpression',
      // value:'$scope("btn1","change!")'
      value: 'console.log($element("d3f-d3"))'
    }
  },
  ...MUISizeConfig,
  ...MUIColorConfig,
  ...MUIfullWidthConfig,
  ...disabledConfig,
});