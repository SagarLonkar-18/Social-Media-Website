import { Stack } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../../components/common/Header'

const ProtectedLayout = () => {
    return (
        <>
            {/* Protected layout page has the permission to render its children with outlet */}
            {/* When data from API is taken If cookies are stored then pages are loaded other redirect to login or signup */}
            <Stack flexDirection={"column"} maxWidth={"800px"} minWidth={"100%"} mx={"auto"} overflow={"hidden"}>
                <Header/>
                {/* // outlet meams render the child elements of route if they exists */}
                <Outlet/>  
            </Stack>
        </>
    )
}

export default ProtectedLayout