import { Stack, useMediaQuery } from '@mui/material'
import Grid from '@mui/material/Grid2';
import React from 'react'
import Navbar from './Navbar'
import { IoMenu } from "react-icons/io5"
import { useDispatch, useSelector } from 'react-redux';
import { toggleMainMenu } from '../../redux/slice';

const Header = () => {
    const { darkMode } = useSelector(state=>state.service); 

    const _700 = useMediaQuery("(min-width:700px)");

    const dispatch = useDispatch();

    const handleOpenMenu = (e) => {
        // e.currentTarget gives the image selected so that we can open our menu close to it 
        dispatch(toggleMainMenu(e.currentTarget));
    }

    return (
        <>
            {
                _700 ? 
                (
                    <Stack flexDirection={'row'} height={52} justifyContent={'space-around'} alignItems={'center'} position={'sticky'} top={0} py={1}>
                        {
                            darkMode ? <img src="/Threads-logo-black-bg.webp" alt="logo" width={60} height={50} />
                            : <img src="/Threads-logo-white-bg.png" alt="logo.png" width={60} height={35} />
                        }
                        <Stack justifyContent={'center'} width={'550px'} zIndex={2} height={96} >
                            <Navbar/>
                        </Stack>
                        <IoMenu size={36} className='image-icon' color='gray' onClick={handleOpenMenu}/>
                    </Stack>
                ) : 
                <>
                    <Stack position={"fixed"} bottom={0} justifyContent={"center"} width={"100%"} height={52} p={1} bgcolor={"aliceblue"}
                        zIndex={2}  
                    >
                        <Navbar/>
                    </Stack>
                    <Grid container height={60} justifyContent={'flex-end'} alignItems={'center'} p={1}>
                        <Grid size={{ xs: 6}}>
                            <img src="/Threads-logo-white-bg.png" alt="logo.png" width={60} height={35} />
                        </Grid >
                        <IoMenu size={36} className='image-icon' color='gray'/>  
                    </Grid>
                </>
            }
        </>
    )
}

export default Header;