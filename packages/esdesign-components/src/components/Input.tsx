import { TextField } from '@mui/material';
import * as React from 'react';
import { disabledConfig, MUIColorConfig, MUIfullWidthConfig, MUISizeConfig } from '../argCommons';
import { ICommonProps } from '../types';
import { createBuiltInComponent, filterProps } from '../utils';


function Input(props: ICommonProps) {

  return (
    <TextField {...props} />
  );
}




export default createBuiltInComponent('Input', Input, '', {
  label: {
    type: 'string',
    value: 'textField'
  },
  value:{
    type:'string',
    value:''
  },
  placeholder:{
    type:'string',
    value:'placeholder...'
  },
  type: {
    type: 'string',
    value: 'text',
    enums: [
      , 'button'
      , 'checkbox'
      , 'color'
      , 'date'
      , 'datetime-local'
      , 'email'
      , 'file'
      , 'hidden'
      , 'image'
      , 'month'
      , 'number'
      , 'password'
      , 'radio'
      , 'range'
      , 'reset'
      , 'search'
      , 'submit'
      , 'tel'
      , 'text'
      , 'time'
      , 'url'
      , 'week'
    ]
  },
  variant: {
    type: 'string',
    value: 'outlined',
    enums: [ "filled", "outlined", "standard"]
  },
  // margin: {
  //   type: 'string',
  //   value: 'none',
  //   enums: ["none", "dense", "normal"]
  // },
  // maxRows: {
  //   type: 'string',
  //   value: '',
  // },
  // minRows: {
  //   type: 'string',
  //   value: '',
  // },
  // ...MUISizeConfig,
  ...MUIColorConfig,
  ...MUIfullWidthConfig,
  ...disabledConfig,
});  