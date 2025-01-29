import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Menu,X } from 'lucide-react'
import { Button } from '../ui/button'
import { ModeToggle } from '@/utils/ModeToggle'
import Logo from './Logo'
import LoginModal from './LoginModal'




const Header = () => {

      const [isMenuOpen,setIsMenuOpen] = useState(false)
  
      const toggleMenu = () => {
          setIsMenuOpen(!isMenuOpen)
      }
      
      const navigate = useNavigate();
     
  return (
       
          <div className="fixed top-0 right-0 left-0 z-50">
            <header className='bg-background shadow-md'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className="flex justify-between items-center py-4">
            <Logo/>
          <nav className='hidden md:flex space-x-8'>
            <NavLink 
              to="/" 
              className={({ isActive }) =>
                isActive
                  ? "text-foreground font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }>
              Home
            </NavLink>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                isActive
                  ? "text-foreground font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }>
              Services
            </NavLink>
            <NavLink
              to="/psychologists"
              className={({ isActive }) =>
                isActive
                  ? "text-foreground font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }>
              Psychologists
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive
                  ? "text-foreground font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }>
              About Us
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive
                  ? "text-foreground font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }>
              Contact Us
            </NavLink>
          </nav>
          <div className='hidden md:flex'>
          <div className="hidden md:block">
            {/* <Button onClick={() => navigate("/login")}>Login</Button> */}
            <LoginModal/>
          </div>
          <div className='ms-3'>
            <ModeToggle/>
          </div>
          </div>
          
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-muted-foreground hover:text-foreground">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <nav className="px-2 pt-2 pb-4 space-y-1">
            <NavLink 
              to="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent">
              Home
            </NavLink>
            <NavLink 
              to="/services" 
              className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent">
              Services
            </NavLink>
            <NavLink 
              to="/psychologists" 
              className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent">
              Psychologists
            </NavLink>
            <NavLink 
              to="/about" 
              className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent">
              About Us
            </NavLink>
            <NavLink 
              to="/contact" 
              className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent">
              Contact Us
            </NavLink>
          </nav>

          <div className="px-4 py-2"  onClick={() => {
              console.log("hii");
              navigate("/login");
            }}>
            <Button>Login</Button>
          </div>
        </div>
      )}
    </header>
          </div>
            
       
  )
}

export default Header
