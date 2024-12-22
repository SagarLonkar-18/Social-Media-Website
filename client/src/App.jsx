import React from 'react'
import Loading from './components/common/Loading';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Header from './components/common/Header'; 
import Home from './pages/Protected/Home';
import Search from './pages/Protected/Search';
import Error from './pages/Error';
import Register from './pages/Registerr';
import "./index.css"
import { Box } from '@mui/material';
import ProtectedLayout from './pages/Protected/ProtectedLayout';
import ProfileLayout from './pages/Protected/profile/ProfileLayout';
import Threads from './pages/Protected/profile/Threads';
import Replies from './pages/Protected/profile/Replies';
import Reposts from './pages/Protected/profile/Reposts';
import SinglePost from './pages/Protected/SinglePost';
import Registerr from './pages/Registerr';

const App = () => {

  const data = true;

  return (
    <>
      {/* Box is a material ui component which acts like a div */}
      <Box minHeight={"100vh"} >
          <BrowserRouter>
              <Routes>
                {/* if data not available show register route  */}
                {
                  data ? 
                  <Route exact path='/' element={<ProtectedLayout/>}>
                      <Route exact path="" element={<Home/>}/>
                      <Route exact path="post/:id" element={<SinglePost/>}/>
                      <Route exact path="search" element={<Search/>}/>
                      {/* profile layout route is there because user can visit his own profile or others profile, if other's info then we need to gather info from API */}
                      <Route exact path="profile" element={<ProfileLayout/>}>
                          <Route exact path='threads/:id' element={<Threads/>}/>
                          <Route exact path='replies/:id' element={<Replies/>}/>
                          <Route exact path='reposts/:id' element={<Reposts/>}/>
                      </Route>
                      {/* <Route exact path="*" element={<Error/>}/> */}
                  </Route>
                  : (
                    <Route exact path="/" element={<Registerr/>}/>
                  )
                }
                <Route exact path="*" element={<Error/>}/>
              </Routes>
          </BrowserRouter>
      </Box>
    </>
  )
}

export default App;