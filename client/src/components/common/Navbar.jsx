import { Stack, useMediaQuery } from '@mui/material';
import React from 'react'
import { GoHomeFill } from "react-icons/go";
import { IoIosSearch } from "react-icons/io";
import { FiArrowLeft } from "react-icons/fi";
import { TbEdit } from "react-icons/tb";
import { CiHeart } from "react-icons/ci";
import { RxAvatar } from "react-icons/rx";
import { Link } from 'react-router-dom';

const Navbar = () => {
    const _300 = useMediaQuery("(min-width:700px)");
    return (
        <>
            <Stack flexDirection={'row'} maxWidth={'100%'} justifyContent={'space-around'} alignItems={'center'}>
                <FiArrowLeft size={_300 ? 32 : 24} className='image-icon' color='black'/>
                <Link to={'/'} className='link' color='black'>
                    <GoHomeFill size={_300 ? 32 : 24}/>
                </Link>
                <Link to={'/search'} className='link' color='black'>
                    <IoIosSearch size={_300 ? 32 : 24}/>
                </Link>
                <TbEdit size={_300 ? 32 : 24} className='image-icon' color='black'/>
                <CiHeart size={_300 ? 32 : 24} className='image-icon'/>
                <Link to={'/profile/threads/1'} className='link' color='black'>
                    <RxAvatar size={_300 ? 32 : 24}/>
                </Link>
            </Stack>
        </>
    )
}

export default Navbar;