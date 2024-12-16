import { Stack } from '@mui/material'
import React from 'react'
import Navbar from './Navbar'
import { IoMenu } from "react-icons/io5"

const Header = () => {
    return (
        <>
            <Stack flexDirection={'row'} height={52} justifyContent={'space-around'} alignItems={'center'} position={'sticky'} top={0}
                py={1}>
                <img src="/Threads-logo-black-bg.webp" alt="logo" width={60} height={48} />
                <Stack justifyContent={'center'} width={'550px'} bgcolor={'aliceblue'} zIndex={2} height={96} >
                    <Navbar/>
                </Stack>
                <IoMenu size={36} className='image-icon'/>
            </Stack>
        </>
    )
}

export default Header;