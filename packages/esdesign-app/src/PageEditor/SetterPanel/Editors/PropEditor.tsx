
import { Box, Dialog, styled, SxProps, Theme } from "@mui/material";
import { Stack } from "@mui/system";
import { types } from "packages/esdesign-components/dist";
import { useCallback, useMemo } from "react";

import StringEditor from "./StringEditor";
import SelectEditor from "./SelectEditor";
import { observer } from "mobx-react";
import BooleanEditor from "./BooleanEditor";
import NumberEditor from "./NumberEditor";
import JSONEditor from "./JsonEditor";
import ActionEditor from "./ActionEditor";



interface IProps {

    namespace?: string,
    name: string,
    config: types.ArgConfig,
    labelSplite?: boolean
    onChange?(value: any,isAction?:boolean): void
}

const PropItem = styled(Stack)({
    margin: 1,
    gap: 1,
})

const PropEditor = (props: IProps) => {

    const { config, labelSplite, name, namespace = 'props', onChange } = props


    const hasBound = true

    const onChangeHandler = useCallback((value: any, isAction?:boolean) => {
        onChange?.(value,isAction)
    }, [onChange])

    const commonProps = {
        name,
        // disabled:hasBound,
        onChange: onChangeHandler
    }

    const getConfigInput = useMemo(() => {


        if (config.type == 'string') {

            return config.enums ? <SelectEditor {...commonProps} config={config} /> : <StringEditor {...commonProps} config={config} />
        } else if (config.type == 'boolean') {
            return <BooleanEditor  {...commonProps} config={config} />
        } else if (config.type == 'number') {
            return <NumberEditor  {...commonProps} config={config} />
        } else if (config.type == 'event') {
            // 事件类型没有只有绑定按钮
            return <>{commonProps.name}</>
        } else {
            return <JSONEditor  {...commonProps} config={config} />
        }



    }, [config])




    return <PropItem direction='row' justifyContent="space-between" >
        {labelSplite ? name : null}
        {getConfigInput}

        <ActionEditor config={config} onChange={(value)=>onChangeHandler(value,true)} />

    </PropItem>
}


export default observer(PropEditor)