'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'

const backgroundColors = [
  { name: 'ไล่เฉดเขียวมิ้นต์-ชมพู', value: 'gradient-mint-pink', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', type: 'gradient' },
  { name: 'ไล่เฉดน้ำเงิน-ม่วง', value: 'gradient-blue', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', type: 'gradient' },
  { name: 'ไล่เฉดชมพู-แดง', value: 'gradient-pink-red', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', type: 'gradient' },
  { name: 'ไล่เฉดส้ม-ชมพู', value: 'gradient-orange-pink', gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', type: 'gradient' },
  { name: 'ไล่เฉดส้ม-แดง', value: 'gradient-orange-red', gradient: 'linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)', type: 'gradient' },
  { name: 'ไล่เฉดฟ้า-เขียว', value: 'gradient-sky-green', gradient: 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)', type: 'gradient' },
  { name: 'ไล่เฉดม่วง-ชมพู', value: 'gradient-purple-pink', gradient: 'linear-gradient(135deg, #8EC5FC 0%, #E0C3FC 100%)', type: 'gradient' },
  { name: 'ไล่เฉดเหลือง-ส้ม', value: 'gradient-yellow-orange', gradient: 'linear-gradient(135deg, #FAD961 0%, #F76B1C 100%)', type: 'gradient' },
  { name: 'ไล่เฉดเขียว-เหลือง', value: 'gradient-green-yellow', gradient: 'linear-gradient(135deg, #85FFBD 0%, #FFFB7D 100%)', type: 'gradient' },
  { name: 'ไล่เฉดน้ำเงินเข้ม', value: 'gradient-dark-blue', gradient: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', type: 'gradient' },
  { name: 'ไล่เฉดพระอาทิตย์ตก', value: 'gradient-sunset', gradient: 'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)', type: 'gradient' },
  { name: 'ไล่เฉดกลางคืน', value: 'gradient-night', gradient: 'linear-gradient(135deg, #2C3E50 0%, #4CA1AF 100%)', type: 'gradient' },
  { name: 'กำหนดเอง', value: 'custom', type: 'custom' },
]

export function ThemeApplier() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // ถ้าอยู่ในหน้า login ใช้ค่า default ไม่ดึงจาก API
    const isLoginPage = pathname === '/login'
    
    if (isLoginPage) {
      // ใช้ค่า default สำหรับหน้า login
      const defaultSettings = {
        primaryColor: 'blue',
        customPrimaryColor: '#3b82f6',
        backgroundColor: 'gradient-mint-pink',
        customGradientStart: '#a8edea',
        customGradientEnd: '#fed6e3',
        fontFamily: 'inter',
        fontSize: 'medium',
      }
      applyThemeSettings(defaultSettings)
      return
    }

    // โหลด settings จาก localStorage
    const loadSettings = () => {
      const savedSettings = localStorage.getItem('userSettings')
      if (savedSettings) {
        const settings = JSON.parse(savedSettings)
        applyThemeSettings(settings)
      } else {
        // ถ้าไม่มี settings ใน localStorage ให้โหลดจาก server
        fetchSettings()
      }
    }

    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings')
        const data = await res.json()
        if (data.settings) {
          const settings = {
            primaryColor: data.settings.primaryColor || 'blue',
            customPrimaryColor: data.settings.customPrimaryColor || '#3b82f6',
            backgroundColor: data.settings.backgroundColor || 'gradient-mint-pink',
            customGradientStart: data.settings.customGradientStart || '#a8edea',
            customGradientEnd: data.settings.customGradientEnd || '#fed6e3',
            fontFamily: data.settings.fontFamily || 'inter',
            fontSize: data.settings.fontSize || 'medium',
          }
          localStorage.setItem('userSettings', JSON.stringify(settings))
          applyThemeSettings(settings)
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error)
        // ใช้ค่า default ถ้าดึงไม่สำเร็จ
        const defaultSettings = {
          primaryColor: 'blue',
          customPrimaryColor: '#3b82f6',
          backgroundColor: 'gradient-mint-pink',
          customGradientStart: '#a8edea',
          customGradientEnd: '#fed6e3',
          fontFamily: 'inter',
          fontSize: 'medium',
        }
        applyThemeSettings(defaultSettings)
      }
    }

    loadSettings()
  }, [mounted, pathname])

  // Re-apply when theme changes
  useEffect(() => {
    if (!mounted) return

    const savedSettings = localStorage.getItem('userSettings')
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      // ใช้ setTimeout เพื่อรอให้ dark class ถูก apply ก่อน
      setTimeout(() => {
        applyThemeSettings(settings)
      }, 50)
    }
  }, [theme, mounted])

  // ติดตาม dark class changes ด้วย MutationObserver
  useEffect(() => {
    if (!mounted) return

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          console.log('🌓 Dark mode toggled, re-applying theme...')
          const savedSettings = localStorage.getItem('userSettings')
          if (savedSettings) {
            const settings = JSON.parse(savedSettings)
            setTimeout(() => {
              applyThemeSettings(settings)
            }, 10)
          }
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => {
      observer.disconnect()
    }
  }, [mounted])

  // ฟังการเปลี่ยนแปลงจาก localStorage (เมื่อหน้า settings เปลี่ยน)
  useEffect(() => {
    if (!mounted) return

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userSettings' && e.newValue) {
        const settings = JSON.parse(e.newValue)
        applyThemeSettings(settings)
      }
    }

    // ฟังการเปลี่ยนแปลงจาก custom event (same tab)
    const handleSettingsChange = (e: any) => {
      if (e.detail) {
        applyThemeSettings(e.detail)
      }
    }

    // ฟังการเปลี่ยน theme mode
    const handleThemeChange = (e: any) => {
      console.log('🎨 Theme changed to:', e.detail)
      const savedSettings = localStorage.getItem('userSettings')
      if (savedSettings) {
        const settings = JSON.parse(savedSettings)
        setTimeout(() => {
          applyThemeSettings(settings)
        }, 50)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('settingsChanged', handleSettingsChange)
    window.addEventListener('themeChanged', handleThemeChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('settingsChanged', handleSettingsChange)
      window.removeEventListener('themeChanged', handleThemeChange)
    }
  }, [mounted])

  const applyThemeSettings = (settings: any) => {
    const isDarkMode = document.documentElement.classList.contains('dark')
    
    if (settings.primaryColor) {
      if (settings.primaryColor === 'custom' && settings.customPrimaryColor) {
        document.documentElement.style.setProperty('--primary', hexToHSL(settings.customPrimaryColor))
      } else {
        document.documentElement.setAttribute('data-color', settings.primaryColor)
      }
    }
    
    if (settings.backgroundColor) {
      document.documentElement.removeAttribute('data-bg-color')
      
      const html = document.documentElement
      const body = document.body
      
      if (settings.backgroundColor === 'custom' && settings.customGradientStart && settings.customGradientEnd) {
        const customGradient = `linear-gradient(135deg, ${settings.customGradientStart} 0%, ${settings.customGradientEnd} 100%)`
        html.style.setProperty('background', customGradient, 'important')
        body.style.setProperty('background', customGradient, 'important')
        html.style.setProperty('background-attachment', 'fixed', 'important')
        body.style.setProperty('background-attachment', 'fixed', 'important')
        html.style.setProperty('min-height', '100vh', 'important')
        body.style.setProperty('min-height', '100vh', 'important')
      } else {
        const gradient = backgroundColors.find(c => c.value === settings.backgroundColor)?.gradient
        if (gradient) {
          if (isDarkMode) {
            const darkOverlay = `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), ${gradient}`
            html.style.setProperty('background', darkOverlay, 'important')
            body.style.setProperty('background', darkOverlay, 'important')
          } else {
            html.style.setProperty('background', gradient, 'important')
            body.style.setProperty('background', gradient, 'important')
          }
          html.style.setProperty('background-attachment', 'fixed', 'important')
          body.style.setProperty('background-attachment', 'fixed', 'important')
          html.style.setProperty('min-height', '100vh', 'important')
          body.style.setProperty('min-height', '100vh', 'important')
        }
      }
    }
    
    if (settings.fontFamily) {
      document.documentElement.setAttribute('data-font', settings.fontFamily)
    }
    
    if (settings.fontSize) {
      document.documentElement.setAttribute('data-font-size', settings.fontSize)
    }
  }

  const hexToHSL = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return '0 0% 50%'
    
    let r = parseInt(result[1], 16) / 255
    let g = parseInt(result[2], 16) / 255
    let b = parseInt(result[3], 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0, s = 0, l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
        case g: h = ((b - r) / d + 2) / 6; break
        case b: h = ((r - g) / d + 4) / 6; break
      }
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
  }

  return null // Component นี้ไม่แสดงอะไร แค่ทำงานเบื้องหลัง
}
