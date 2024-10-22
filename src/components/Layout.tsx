import React, { useEffect, PropsWithChildren } from 'react'
import { ThemeProvider, useTheme } from 'next-themes'

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
    </ThemeProvider>
  )
}

export default Layout
