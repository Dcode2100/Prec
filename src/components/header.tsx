import ThemeToggle from '@/components/layouts/ThemeToggle/theme-toggle';

import { UserNav } from '@/components/user-nav';

export default function Header() {
  return (
    <header className="sticky inset-x-0 top-0 w-full border-b border-accent mb-2 bg-background ">
      <nav className="flex items-center justify-between px-4 py-3 md:justify-end">
        {/* <div className={cn('block lg:!hidden')}>
      
        </div> */}
        <div className="flex items-center gap-4  ">
          <UserNav />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
