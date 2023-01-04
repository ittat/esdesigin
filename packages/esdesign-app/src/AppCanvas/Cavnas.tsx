

import { Box, Button, createTheme, Stack, styled, ThemeProvider } from '@mui/material'
import { observer } from 'mobx-react';
import { components, ESDESIGN_COMPONENT, types } from 'packages/esdesign-components/dist';
import { RecordStr } from 'packages/esdesign-components/dist/types';
import { compileModule } from 'packages/esdesign-core/dist';
import loadModule from 'packages/esdesign-core/dist/loadModule';
import React, { forwardRef, PropsWithChildren, useEffect, useMemo, useReducer, useState } from 'react'
import { BrowserRouter, Routes, Navigate, Route } from "react-router-dom"

import { getPage, useAppDom } from '../Provider';

import { IHostYoube, IModules, Rectangle } from '../types';
import Cell from './Cell';


const PageRoot = components.default['PageRoot']


const Cavnas = (props: { pageId: string }) => {
    // const [nodes, setNodes] = useState<DomNode[]>([])

    const [_, updateUI] = useReducer((x) => x + 1, 0)
    const appDom = useAppDom()

    const page = getPage()


    useEffect(() => {

        const farseUpdate = () => {
            updateUI()

        }


        farseUpdate()

        if (appDom) {
            appDom.event.addListener('appdom.update', farseUpdate)
        }

        return () => {
            appDom?.event.removeListener('appdom.update', farseUpdate)
        }


    }, [appDom])









    return <PageRoot>
        {
            // Object.values(page?.domTree || {}).map(node => <Cell node={node} />)
            page ? page.sort.map(nodeId => <Cell key={nodeId} node={page.domTree[nodeId]} />) : null
        }
    </PageRoot>



    {/* </Box> */ }
}



export default observer(Cavnas)
