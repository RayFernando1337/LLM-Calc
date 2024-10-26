import React, { useEffect, PropsWithChildren } from 'react'
import { ThemeProvider, useTheme } from 'next-themes'
import { Toaster } from "@/components/ui/toaster"

const ThemeWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const { theme, resolvedTheme } = useTheme()

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(resolvedTheme || theme || 'light')
  }, [theme, resolvedTheme])

  return <>{children}</>
}

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ThemeWrapper>{children}</ThemeWrapper>
      <Toaster />
    </ThemeProvider>
  )
}

export default Layout
