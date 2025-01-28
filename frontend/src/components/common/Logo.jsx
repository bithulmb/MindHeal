import { useTheme } from '@/utils/ThemeProvider'
import React from 'react'
import logoLight from "@/assets/logo-light.png"; // Light theme logo
import logoDark from "@/assets/logo-dark.png"; // Dark theme logo

const Logo = () => {
    const {theme} = useTheme()
  return (
    <>
        <div className="flex items-center ">
        <img src={theme === "dark" || theme==="system" ? logoDark : logoLight} alt="logo" className='h-7 w-7 mr-2 ' />
        <span className='text-2xl font-bold text-foreground'>MindHeal</span>
        </div>
        
    </>
  )
}

export default Logo
