import { EventActionConfig, JSExpressionActionConfig } from "@ittat/esdesign-components";

// 方案一 - 备份方案
export function getFunction(scope: any, value: string) {

  try {
    const newScope = {
      // $runtime:runTime,
      // $root:runTime.render,
      $scope: scope
    }
    const contextArr = ['"use strict";', 'var __self = arguments[0];'];
    contextArr.push('return ');
    let tarStr: string;
    tarStr = (value || '').trim();

    // NOTE: use __self replace 'this' in the original function str
    // may be wrong in extreme case which contains '__self' already
    if (newScope) {
      tarStr = tarStr.replace(/this(\W|$)/g, (_a: any, b: any) => `__self${b}`);
    }

    tarStr = contextArr.join('\n') + tarStr;
    const code = `with( '$scope || {}') { ${tarStr} }`;
    const fn: Function = new Function('$scope', code)(scope);
    console.log("FN","::",fn);

    
    return fn
  } catch (err) {
    console.warn("getFunction Error",err);
    
    return function () { }
  }
}



//  方案二 - 当前方案 - 使用 iframe沙盒机制 - 安全
let iframe: HTMLIFrameElement;

/**
 * Evaluates a javascript expression with global scope in an iframe.
 */
export default function evalExpression(code: string, globalScope: Record<string, unknown>) {
  // TODO: investigate https://www.npmjs.com/package/ses
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts');
    iframe.style.display = 'none';
    document.documentElement.appendChild(iframe);
  }

  // eslint-disable-next-line no-underscore-dangle
  (iframe.contentWindow as any).__SCOPE = globalScope;
  (iframe.contentWindow as any).console = window.console;
  return (iframe.contentWindow as any).eval(`with (window.__SCOPE) { ${code} }`);
}


export function evaluateExpression(
  code: string,
  globalScope: Record<string, unknown>,
) {
  try {
    const value = evalExpression(code, globalScope);

    // 备份方案
    // const value = getFunction(globalScope,code)

    return { value };
  } catch (rawError) {

    return { error: rawError };
  }
}

export function getJSExpressionHander(action: JSExpressionActionConfig, globalScope: Record<string, any>) {

  const handler = () => {

    const code = action.value;
    // const exprToEvaluate = `(async () => {${code}})()`;
    // const exprToEvaluate = `(async () => {return (${code})})()`;
    // TODO : 实现 async
    const exprToEvaluate = `( () => {return (${code})})()`;
    const result = evaluateExpression(exprToEvaluate, globalScope);

    if (!result.error) {
      return result.value
    } else {
      console.warn("getJSExpressionHander Error!", result.error);
      return undefined
    }

  };

  return handler
}