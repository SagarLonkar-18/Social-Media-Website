import { Stack, useMediaQuery } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../../components/common/Header'
import AddPost from '../../components/modals/AddPost'
import EditProfile from '../../components/modals/EditProfile'
import MainMenu from '../../components/menu/MainMenu'
import MyMenu from '../../components/menu/MyMenu'

const ProtectedLayout = () => {

    const _700 = useMediaQuery("(min-width:700px)")

    return (
        <>
            {/* Protected layout page has the permission to render its children with outlet */}
            {/* When data from API is taken If cookies are stored then pages are loaded other redirect to login or signup */}
            <Stack flexDirection={"column"} maxWidth={_700 ? "800px" : "90%"} minWidth={"100%"} mx={"auto"} overflow={"hidden"}>
                <Header/>
                <AddPost/>
                <EditProfile/>
                <MainMenu/>
                <MyMenu/>
                {/* // outlet meams render the child elements of route if they exists */}
                <Outlet/>  
            </Stack>
        </>
    )
}

export default ProtectedLayout