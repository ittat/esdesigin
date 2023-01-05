import React, { createContext, PropsWithChildren, useContext, useMemo } from 'react'
import { BrowserRouter, Routes, Navigate, Route } from "react-router-dom"
import AppEditor from '../AppEditor';
import AppEditorShell from './AppEditorShell';
import CodeComponentEditor from '../CustomComponent/ComponentEditorContent';
import { Provider } from '../Provider';



const AppWorkspace = () => {


    return (<Provider>
        <Routes >
            <Route  element={<AppEditorShell />}>
                <Route key={'1'} path="/codeComponents/:nodeId" element={<CodeComponentEditor />} />
                <Route key={"2"} path="/page/:nodeId" element={<AppEditor />} />
            </Route>
        </Routes>
    </Provider>


    )


}

export default AppWorkspace

