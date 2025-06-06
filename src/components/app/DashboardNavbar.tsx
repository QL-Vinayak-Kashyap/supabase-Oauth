import React from 'react'
import ProfileBanner from './ProfileBanner'
import { SidebarTrigger } from '../ui/sidebar'

const Navbar = () => {
  return (
      <header className="flex justify-between h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-[0px] bg-white z-50">
        <div className="flex flex-row items-center gap-2">
          <SidebarTrigger className="-ml-1" />
        </div>
        <div className="flex flex-row items-center gap-2">
          <ProfileBanner />
        </div>
      </header>
  )
}

export default Navbar
