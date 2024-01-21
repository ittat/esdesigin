/**
 * 临时的db文件，
 * 后面会使用两种方法做保存
 * 1 indexdb
 * 2 远程数据库
 *
 * 要求 indexdb 和远程数据操作方式一模一样保证接口对齐
 */

import { IAppConfig } from "@ittat/esdesign-components";
import { createCustomComponentName } from "@ittat/esdesign-components"

const app1_config: IAppConfig = {
  version: "0.0.1",
  appName: "快熟开发",
  id: "app1id",
  pages: {
    "d23d2d-4g45-2d21d-h44": {
      id: "d23d2d-4g45-2d21d-h44",
      pageName: "page 1",
      scope: {},
      query: {
        // "23r2r-23r2r3r-23rr-23r23-23r32":{
        //     id:'erwe-43r-4retrt43-r23r2-d23',
        //     pageId:'d23d2d-4g45-2d21d-h44',
        //     name:'Query Test',
        //     type:'fetch',
        //     attrs:{
        //         url:'/api/GetEntityMetas',
        //         method:'GET',
        //         dataHandler:'status',
        //     }
        // }
      },
      sort: [
        "element1",
      ],
      domTree: {
        element1: {
          id: "element1",
          parentId: "d23d2d-4g45-2d21d-h44",
          type: "",
          props: {},
          attrs: {
            componentName: {
              type: 1,
              value: "element 1",
            },
            materialId: "Button",
          },
        },
      },
    },
  },
  customComponents: {
    "customComp2-id": {
      id: "customComp2-id",
      parentId: "",
      type: "",
      attrs: {
        source: {
          type: 1,
          value: `//import React from "https://esm.sh/react@18";
import * as React from 'react';
import  Botton from '@mui/material/Button';
//import clone from "https://esm.sh/lodash/clone";
import { createEsDesginComponent } from "@esdesign/components";
function Component1() {
  return (
      <Botton >Merry Xmas 🎄 🎄</Botton>
  );
 } 
function myComponent() {
  //console.log(clone({test:'sadsda',we:undefined}))
  return ( <>
    <Botton>Merry Xmas 🎄</Botton>
    <Component1 />
    </>);
 } 

//  export default myComponent;

 export default createEsDesginComponent('myCustomComp1',myComponent, '', {
    variant: {
      type: 'string',
      value: 'contained',
      enums: ["", "text", "outlined", "contained"]
    },
  });  
 `,
        },
        componentName: {
          type: 1,
          value: "myCustomComp1",
        },
        materialId: createCustomComponentName("customComp2-id"),
      },
    },
  },
};

const app2_config: IAppConfig = {
  version: "0.0.1",
  appName: "快熟开发2",
  id: "app2id",
  pages: {
    "d23d2d-4g45-2d21d-h44": {
      id: "d23d2d-4g45-2d21d-h44",
      pageName: "page 1",
      scope: {},
      query: {
        // "23r2r-23r2r3r-23rr-23r23-23r32":{
        //     id:'erwe-43r-4retrt43-r23r2-d23',
        //     pageId:'d23d2d-4g45-2d21d-h44',
        //     name:'Query Test',
        //     type:'fetch',
        //     attrs:{
        //         url:'/api/GetEntityMetas',
        //         method:'GET',
        //         dataHandler:'status',
        //     }
        // }
      },
      sort: [
        "asdas-fdsf234-23423we4-ewsrwe234",
        "customComp1-id",
        "element1",
        "sdfrf34-4sdf43-sdfd234-few234-ewr",
        "d3f-d3",
      ],
      domTree: {
        element1: {
          id: "element1",
          parentId: "d23d2d-4g45-2d21d-h44",
          type: "",
          props: {},
          attrs: {
            componentName: {
              type: 1,
              value: "element 1",
            },
            materialId: "Button",
          },
        },
        "customComp1-id": {
          id: "customComp1-id",
          parentId: "d23d2d-4g45-2d21d-h44",
          type: "",
          attrs: {
            componentName: {
              type: 1,
              value: "Custom Component 2",
            },
            materialId: createCustomComponentName("customComp2-id"),
          },
        },
        "asdas-fdsf234-23423we4-ewsrwe234": {
          id: "asdas-fdsf234-23423we4-ewsrwe234",
          parentId: "d23d2d-4g45-2d21d-h44",
          type: "slot",
          attrs: {
            componentName: {
              type: 1,
              value: "PageRow",
            },
            materialId: "PageRow",
          },
          sort: ["few-4r-4334-34rr--r4", "ds-erf23-5t5-5t45t-"],
          child: {
            "ds-erf23-5t5-5t45t-": {
              id: "ds-erf23-5t5-5t45t-",
              parentId: "asdas-fdsf234-23423we4-ewsrwe234",
              type: "",
              props: {},
              attrs: {
                componentName: {
                  type: 1,
                  value: "element 1",
                },
                materialId: "Button",
              },
            },
            "few-4r-4334-34rr--r4": {
              id: "few-4r-4334-34rr--r4",
              parentId: "asdas-fdsf234-23423we4-ewsrwe234",
              type: "",
              attrs: {
                componentName: {
                  type: 1,
                  value: "Custom Component 1",
                },
                materialId: createCustomComponentName("customComp2-id"),
              },
            },
          },
        },
        "sdfrf34-4sdf43-sdfd234-few234-ewr": {
          id: "sdfrf34-4sdf43-sdfd234-few234-ewr",
          parentId: "d23d2d-4g45-2d21d-h44",
          type: "slot",
          attrs: {
            componentName: {
              type: 1,
              value: "PageColumn",
            },
            materialId: "PageColumn",
          },
          child: {
            "sr32-dsfw3-4ef-34r5-34-r43": {
              id: "sr32-dsfw3-4ef-34r5-34-r43",
              parentId: "sdfrf34-4sdf43-sdfd234-few234-ewr",
              type: "",
              props: {},
              attrs: {
                componentName: {
                  type: 1,
                  value: "element 1",
                },
                materialId: "Button",
              },
            },
            "d32d3-edwd23d-4t44t-d3": {
              id: "d32d3-edwd23d-4t44t-d3",
              parentId: "sdfrf34-4sdf43-sdfd234-few234-ewr",
              type: "",
              attrs: {
                componentName: {
                  type: 1,
                  value: "Custom Component 3",
                },
                materialId: createCustomComponentName("customComp2-id"),
              },
            },
          },
        },
        "d3f-d3": {
          id: "d3f-d3",
          parentId: "d23d2d-4g45-2d21d-h44",
          type: "",
          props: {
            label: "textField",
            value: "",
            placeholder: "placeholder...",
          },
          attrs: {
            componentName: {
              type: 1,
              value: "input test ",
            },
            materialId: "Input",
          },
        },
      },
    },
  },
  customComponents: {
    "customComp2-id": {
      id: "customComp2-id",
      parentId: "",
      type: "",
      attrs: {
        source: {
          type: 1,
          value: `//import React from "https://esm.sh/react@18";
import * as React from 'react';
import  Botton from '@mui/material/Button';
//import clone from "https://esm.sh/lodash/clone";
import { createEsDesginComponent } from "@esdesign/components";
function Component1() {
  return (
      <Botton >Merry Xmas 🎄 🎄</Botton>
  );
 } 
function myComponent() {
  //console.log(clone({test:'sadsda',we:undefined}))
  return ( <>
    <Botton>Merry Xmas 🎄</Botton>
    <Component1 />
    </>);
 } 

//  export default myComponent;

 export default createEsDesginComponent('myCustomComp1',myComponent, '', {
    variant: {
      type: 'string',
      value: 'contained',
      enums: ["", "text", "outlined", "contained"]
    },
  });  
 `,
        },
        componentName: {
          type: 1,
          value: "myCustomComp1",
        },
        materialId: createCustomComponentName("customComp2-id"),
      },
    },
  },
};


export const appsConfig: Array<IAppConfig> = [app1_config, app2_config];
