
import { action, makeObservable, observable, runInAction } from "mobx";
import { ArgStringConfig, IAttrs, IQueryConfig, JSExpressionActionConfig, RecordStr } from "packages/esdesign-components/dist/types";
import { getJSExpressionHander } from "packages/esdesign-core/dist/evalExpression";
import { getUUID } from "../globals";
import { API_NAMES, API_NAMES_LIST, IApiResult, RequestType } from "../types";
import PageConfig from "./pageConfig";



export default class QueryConfig<T = API_NAMES> implements IQueryConfig<API_NAMES> {
    pageId: string;
    page: PageConfig
    id: string;
    name: string = 'query';
    type: "fetch";
    _attrs: {
        url: ArgStringConfig<API_NAMES | string>;
        params?: RecordStr<{ key: ArgStringConfig, value: ArgStringConfig }>;
        method: ArgStringConfig<"GET" | "POST">;
        dataHandler?: JSExpressionActionConfig;
    }
    attrs: IAttrs<API_NAMES>

    rawResult?: IApiResult<T> = undefined  //TODO: 使用selm api 规范

    result?: any = {}

    errorData?: any


    //  -1 出错
    //  0 为fetch
    // 1 得到数据
    status: -1 | 0 | 1 = 0

    constructor(props: { page: PageConfig, config: IQueryConfig<API_NAMES | string>, fetchAuto?: boolean }) {

        const { config } = props
        this.page = props.page
        this.pageId = this.page.id


        if (config.id) {
            this.id = config.id
        } else {
            this.id = getUUID()
        }

        this.name = config.name

        // attrs
        {
            this._attrs = {
                url: {
                    type: 'string',
                    value: '/api/GetById', //TODO:跨域了
                    enums: API_NAMES_LIST
                },
                method: {
                    type: 'string',
                    value: 'GET',
                    enums: ["GET", "POST"]
                },
                params: {},
            }

            this.attrs = config.attrs


            this._attrs.method.value = config.attrs.method
            this._attrs.url.value = config.attrs.url
            if (config.attrs.params) {
                config.attrs.params.forEach(keyval => {
                    const id = getUUID()
                    this._attrs.params[id] = {
                        key: {
                            type: 'string',
                            value: keyval.key
                        },
                        value: {
                            type: 'string',
                            value: keyval.value
                        }

                    }
                })
                // Object.entries(config.attrs.params).forEach(([key, value]) => {
                //     this._attrs.params[key] = {
                //         type: 'string',
                //         value: value
                //     }

                // })
            }
            if (config.attrs.dataHandler) {
                this._attrs.dataHandler = {
                    type: 'JSExpression',
                    value: config.attrs.dataHandler
                }
            }

        }

        if (props.fetchAuto) {
            // TODO: doFetch

            console.log("#$@#$#$#$#$#$", this);
            this.fetchResult()

        }

        makeObservable(this, {
            name: observable,
            result: observable,
            rawResult: observable.ref,
            status: observable,
            _attrs: observable,
            updateProp: action.bound,
            fetchResult: action.bound,
            clearResult: action.bound,
            changeName: action.bound,
            doDataHandle: action.bound,
        })

    }


    // Page init 调用
    // component init 调用？？ -- 暂不考虑
    // app init 调用 ？？   -- 暂不考虑 - 不知道UI入口放哪里
    //  query 编辑器调用
    async fetchResult() {
        const attrs = this._attrs
        const url = attrs.url.value
        const method = attrs.method.value
        const params = Object.entries(attrs.params).reduce((sum, [id, config], index) => {
            const key = config.key.value
            const val = config.value.value
            sum[key] = val
            return sum
        }, {})
        let result = null
        try {
            if (method == 'GET') {
                result = await QueryConfig.getJsonApi(url, params)
            } else {
                result = await QueryConfig.postJsonApi(url, params)
            }

            runInAction(() => {
                this.rawResult = result
                this.status = 1
                this.doDataHandle()
            })
        } catch (error) {
            runInAction(() => {
                this.errorData = error
                this.status = -1
            })
        }

    }

    updateProp(name: keyof IAttrs, value: any) {

        if (name == 'dataHandler') {
            this._attrs.dataHandler = { type: 'JSExpression', value }
        } else if (name == 'params') {
            this._attrs.params = value as RecordStr<{ key: ArgStringConfig, value: ArgStringConfig }>

        } else {
            this._attrs[name].value = value
        }

        if (name !== 'dataHandler') {
            this.clearResult()
        }

    }

    changeName(value: string) {
        this.name = value

    }


    doDataHandle() {

        if (this.status == 1 && this.rawResult && this._attrs.dataHandler) {
            const scope = {
                ...this.rawResult,
                ...this.page.scope
            }
            const fn = getJSExpressionHander(this._attrs.dataHandler, scope)

            const res = fn()

            if (res) {
                this.result = res
            }

        }


    }





    clearResult() {
        this.rawResult = undefined
        this.errorData = undefined
        this.status = 0
    }

    ouputConfig() {
        // TODO
    }


    // 网络获取能力

    static requestsCache: { [k: string]: Promise<any> } = {};

    static async jsonApi<T>(url: API_NAMES, reqType: RequestType, jsonData?: any): Promise<IApiResult<T> | undefined> {

        const key = `${url}__${reqType}__${JSON.stringify(jsonData)}`;

        if (!!QueryConfig.requestsCache[key]) {
            return QueryConfig.requestsCache[key];
        }
        else {
            return QueryConfig.requestsCache[key] = new Promise<IApiResult<T> | undefined>(async (resolve, rejects) => {
                try {
                    let reqPars: RequestInit = {
                        method: reqType,
                    };
                    let paras = '';
                    if (jsonData instanceof FormData) {
                        reqPars = { method: reqType };
                        reqPars.body = jsonData;
                    } else {
                        reqPars.headers = { 'Content-Type': 'application/json' };
                        if (jsonData) {
                            if (reqType === 'post') {
                                reqPars.body = JSON.stringify(jsonData);
                            } else {
                                for (const k of Object.keys(jsonData)) {
                                    paras = paras + (paras ? '&' : '?');
                                    paras = paras + k + '=' + encodeURI(jsonData[k]);
                                }
                            }
                        }
                    }
                    const res: Response = await fetch(url + paras, reqPars);
                    const resJson: IApiResult<T> = await res.json();
                    // if (resJson?.status === 0) {
                    //   return resJson;
                    // }
                    delete QueryConfig.requestsCache[key];
                    resolve(resJson);
                    return;
                } catch (ex) {
                    console.log('call api post json error:', ex);
                    delete QueryConfig.requestsCache[key];
                    // resolve(undefined);
                    rejects(`call api post json error: ${ex}`)
                }
            });
        }
    }

    static async jsonApiPaging<T>(url: API_NAMES, jsonData: object): Promise<IApiResult<T> | undefined> {
        return QueryConfig.jsonApi<T>(url, 'post', jsonData);
    }

    static async getJsonApi<T>(url: API_NAMES, jsonData?: object): Promise<{ status: number, data?: T }> {
        const result = await QueryConfig.jsonApi<T>(url, 'get', jsonData);
        if (result?.status === 0 && result?.data) {
            return { status: 200, data: result.data };
        }
        return { status: 404 };
    }
    static async postJsonApi<T>(url: API_NAMES, jsonData: object): Promise<{ status: number, data?: T }> {
        const result = await QueryConfig.jsonApi<T>(url, 'post', jsonData);
        if (result?.status === 0 && result.data) {
            return { status: 200, data: result.data };
        }
        return { status: 404 };
    }


}