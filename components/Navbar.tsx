import React from 'react'
import Button from './Button';
import { Box } from 'lucide-react';
import { useOutletContext } from 'react-router';

const Navbar = () => {

     const {isSignedIn, userName, signIn, signOut} = useOutletContext<AuthContext>()

     const handleAuthClick = async () => {
          if(isSignedIn){
               try {
                    await signOut();
               } catch (error) {
                    console.error("Error signing out:", error);
               }
          }

          try {
               await signIn();
          } catch (error) {
               console.error("Error signing in:", error);
          }



     }

  return (
    <header className='navbar'>
     <nav className='inner'>
          <div className='left'>
               <div className='brand'>
                    <Box className="logo" />
                    <span className='name'>
                         Roomify
                    </span>
               </div>

               <ul className='links'>
                    <li><a href="#">Product</a></li>
                    <li><a href="#">Pricing</a></li>
                    <li><a href="#">Community</a></li>
                    <li><a href="#">Enterprise</a></li>
               </ul>
          </div>

          <div className='actions'> 
               {isSignedIn ? (
                    <>
                         <span className='greeting'>
                              {userName ? `Hi ${userName}!` : 'Signed In'}
                         </span>

                         <Button size='sm' onClick={handleAuthClick} className='btn'> 
                              Logout
                         </Button>
                    </>
               ) : (
                    <>
                    <Button onClick={handleAuthClick} size='sm' variant='ghost'>
                         Login 
                    </Button>
                    <a className='cta' href="#upload">
                         Get Started
                    </a>
                    </>
               )}
              
          </div>

     </nav>
    </header>
  )
}

export default Navbar