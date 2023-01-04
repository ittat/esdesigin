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
                <Route  key={"/page/:nodeId"}  path="/page/:nodeId/*" element={<AppEditor />} />
                <Route  key={'/codeComponents/:nodeId'}  path="/codeComponents/:nodeId" element={<CodeComponentEditor />} />
            </Route>
        </Routes>
    </Provider>


    )


}

export default AppWorkspace

