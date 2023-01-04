import { reaction } from "mobx";
import loadModule, { compileModule } from "packages/esdesign-core/dist/loadModule";
import React from "react";
import { useEffect, useState } from "react";





const CodeComponent = (props: { code: string }) => {
    const [component, setComponent] = useState<unknown>(null)

    useEffect(() => {


        const test = async () => {

            const compiledModule = compileModule(props.code, 'sssss');
            const { default: Component } = await loadModule(compiledModule);

            setComponent(Component())
        }

        test()

    }, [props.code])





    return component ? component : null
}

export default CodeComponent