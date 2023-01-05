import { NoSsr } from '@mui/material'
import React from 'react'
import { BrowserRouter, Routes, Navigate, Route } from "react-router-dom"
import AppWorkspace from './Layout/AppWorkspace'
import AppsOverView from './AppsOverView'


export interface IHomesProps {
    // basename: string
}

const Homes = (props: IHomesProps) => {

    // const { basename } = props

    return <NoSsr>

        <BrowserRouter>
            <Routes >
                <Route path="/" element={<Navigate to="apps" replace />} />
                <Route path="/apps" element={<AppsOverView />} />
                <Route path="/app/:appId/*" element={<AppWorkspace />} />
            </Routes>
        </BrowserRouter>
    </NoSsr>

}

export default Homes