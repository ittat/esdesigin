// import * as esdesignCore from 'packages/esdesign-core/dist'  //TODO 改用包命名
import * as esdesignComponents from '@ittat/esdesign-components'  //TODO 改用包命名


function esm(namedExports: any, defaultExport: any = {}) {
  return { ...namedExports, default: defaultExport, __esModule: true };
}


const map: Map<string, any> = new Map([
  // ['@esdesign/core', esm(esdesignCore)],
  ['@esdesign/components', esm(esdesignComponents)],
]);


export default map