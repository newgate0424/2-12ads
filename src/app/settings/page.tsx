'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Palette, Type, Eye, Lock, Save, Check, Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from 'next-themes'
import { LoadingScreen } from '@/components/loading-screen'
import { useLanguage } from '@/contexts/language-context'

const colors = [
  { name: 'สีน้ำเงิน', value: 'blue', hex: '#3b82f6' },
  { name: 'สีเขียว', value: 'green', hex: '#22c55e' },
  { name: 'สีชมพู', value: 'rose', hex: '#f43f5e' },
  { name: 'สีม่วง', value: 'purple', hex: '#a855f7' },
  { name: 'สีส้ม', value: 'orange', hex: '#f97316' },
  { name: 'สีแดง', value: 'red', hex: '#ef4444' },
  { name: 'สีฟ้า', value: 'sky', hex: '#0ea5e9' },
  { name: 'สีเหลือง', value: 'yellow', hex: '#eab308' },
  { name: 'สีเขียวมิ้นต์', value: 'teal', hex: '#14b8a6' },
  { name: 'สีชมพูบานเย็น', value: 'pink', hex: '#ec4899' },
]

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

const fonts = [
  { name: 'Inter', value: 'inter', category: 'สากล' },
  { name: 'Roboto', value: 'roboto', category: 'สากล' },
  { name: 'Open Sans', value: 'open-sans', category: 'สากล' },
  { name: 'Lato', value: 'lato', category: 'สากล' },
  { name: 'Montserrat', value: 'montserrat', category: 'สากล' },
  { name: 'Poppins', value: 'poppins', category: 'สากล' },
  { name: 'Nunito', value: 'nunito', category: 'สากล' },
  { name: 'Ubuntu', value: 'ubuntu', category: 'สากล' },
  { name: 'Kanit', value: 'kanit', category: 'ไทย' },
  { name: 'Sarabun', value: 'sarabun', category: 'ไทย' },
  { name: 'Prompt', value: 'prompt', category: 'ไทย' },
  { name: 'Noto Sans Thai', value: 'noto-sans-thai', category: 'ไทย' },
  { name: 'IBM Plex Sans Thai', value: 'ibm-plex-sans-thai', category: 'ไทย' },
  { name: 'Mitr', value: 'mitr', category: 'ไทย' },
  { name: 'Mali', value: 'mali', category: 'ไทย' },
  { name: 'Chakra Petch', value: 'chakra-petch', category: 'ไทย' },
]

const fontSizes = [
  { name: '13px', value: '13', px: 13 },
  { name: '14px', value: '14', px: 14 },
  { name: '15px', value: '15', px: 15 },
  { name: '16px', value: '16', px: 16 },
  { name: '17px', value: '17', px: 17 },
  { name: '18px', value: '18', px: 18 },
]

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  
  const [settings, setSettings] = useState({
    primaryColor: 'blue',
    customPrimaryColor: '#3b82f6',
    backgroundColor: 'gradient-mint-pink',
    customBackgroundColor: '#ffffff',
    customGradientStart: '#a8edea',
    customGradientEnd: '#fed6e3',
    fontFamily: 'inter',
    fontSize: '16',
    language: 'th',
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    fetchSettings()
    
    // Listen for language changes from LanguageContext
    const handleLanguageChange = (event: CustomEvent) => {
      if (event.detail && (event.detail === 'th' || event.detail === 'en')) {
        setSettings(prev => ({ ...prev, language: event.detail }))
      }
    }
    
    window.addEventListener('languageChanged', handleLanguageChange as EventListener)
    
    // Cleanup timeout on unmount
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout)
      }
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener)
    }
  }, [])

  // ติดตามการเปลี่ยนแปลง dark class ด้วย MutationObserver
  useEffect(() => {
    if (isLoading) return

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          console.log('🌓 Theme class changed, re-applying settings...')
          setTimeout(() => applyThemeSettings(settings), 50)
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
  }, [settings, isLoading])

  useEffect(() => {
    // Apply settings whenever they change
    if (!isLoading) {
      applyThemeSettings(settings)
    }
  }, [settings, isLoading])

  // Re-apply theme when dark mode changes
  useEffect(() => {
    if (!isLoading) {
      applyThemeSettings(settings)
    }
  }, [theme])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings')
      const data = await res.json()
      
      // Load language from localStorage first
      const savedLanguage = localStorage.getItem('language') || 'th'
      
      if (data.settings) {
        const loadedSettings = {
          primaryColor: data.settings.primaryColor || 'blue',
          customPrimaryColor: data.settings.customPrimaryColor || '#3b82f6',
          backgroundColor: data.settings.backgroundColor || 'gradient-mint-pink',
          customBackgroundColor: data.settings.customBackgroundColor || '#ffffff',
          customGradientStart: data.settings.customGradientStart || '#a8edea',
          customGradientEnd: data.settings.customGradientEnd || '#fed6e3',
          fontFamily: data.settings.fontFamily || 'inter',
          fontSize: data.settings.fontSize || '16',
          language: data.settings.language || savedLanguage,
        }
        setSettings(loadedSettings)
        // Apply settings
        applyThemeSettings(loadedSettings)
      } else {
        // No settings from server, use localStorage language
        setSettings(prev => ({ ...prev, language: savedLanguage }))
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
      // On error, load language from localStorage
      const savedLanguage = localStorage.getItem('language') || 'th'
      setSettings(prev => ({ ...prev, language: savedLanguage }))
    } finally {
      setIsLoading(false)
    }
  }

  const applyThemeSettings = (settings: any) => {
    console.log('🎨 Applying theme settings:', settings)
    
    // เช็คว่าอยู่ใน dark mode หรือไม่
    const isDarkMode = document.documentElement.classList.contains('dark')
    console.log('🌙 Dark mode:', isDarkMode)
    
    // Apply language to localStorage
    if (settings.language) {
      localStorage.setItem('language', settings.language)
    }
    
    if (settings.primaryColor) {
      if (settings.primaryColor === 'custom' && settings.customPrimaryColor) {
        // Convert hex to HSL and apply
        document.documentElement.style.setProperty('--primary', hexToHSL(settings.customPrimaryColor))
      } else {
        document.documentElement.setAttribute('data-color', settings.primaryColor)
      }
    }
    if (settings.backgroundColor) {
      // Remove any background color data attribute
      document.documentElement.removeAttribute('data-bg-color')
      
      // Get the root element
      const html = document.documentElement
      const body = document.body
      
      if (settings.backgroundColor === 'custom' && settings.customGradientStart && settings.customGradientEnd) {
        // Apply custom gradient
        const customGradient = `linear-gradient(135deg, ${settings.customGradientStart} 0%, ${settings.customGradientEnd} 100%)`
        console.log('🎨 Applying custom gradient:', customGradient)
        html.style.setProperty('background', customGradient, 'important')
        body.style.setProperty('background', customGradient, 'important')
        html.style.setProperty('background-attachment', 'fixed', 'important')
        body.style.setProperty('background-attachment', 'fixed', 'important')
        html.style.setProperty('min-height', '100vh', 'important')
        body.style.setProperty('min-height', '100vh', 'important')
      } else {
        // Apply preset gradient
        const gradient = backgroundColors.find(c => c.value === settings.backgroundColor)?.gradient
        console.log('🎨 Applying preset gradient:', settings.backgroundColor, '→', gradient)
        if (gradient) {
          // ถ้าเป็น dark mode ให้เพิ่ม overlay มืดทับ gradient
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
          console.log('✅ Gradient applied!', isDarkMode ? '(with dark overlay)' : '')
        } else {
          console.log('❌ Gradient not found!')
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

  // Helper function to convert hex to HSL
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

  // Debounce timer for auto-save
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null)

  // Auto-save when settings change
  const handleSettingChange = (key: string, value: string) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    
    // If language changed, trigger immediate update
    if (key === 'language') {
      localStorage.setItem('language', value)
      // Broadcast to all components
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: value }))
    }
    
    // Apply immediately (ให้เห็นทันที) - force sync
    requestAnimationFrame(() => {
      applyThemeSettings(newSettings)
    })
    
    // Save to localStorage immediately
    localStorage.setItem('userSettings', JSON.stringify(newSettings))
    
    // ส่ง custom event เพื่อแจ้งหน้าอื่นๆ (ใน same tab)
    window.dispatchEvent(new CustomEvent('settingsChanged', { detail: newSettings }))
    
    // Debounce server save (รอ 1 วินาทีก่อนส่ง API)
    if (saveTimeout) {
      clearTimeout(saveTimeout)
    }
    
    const timeout = setTimeout(async () => {
      try {
        await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSettings),
        })
      } catch (error) {
        console.error('Failed to save settings:', error)
      }
    }, 1000) // รอ 1 วินาทีหลังจากหยุดเปลี่ยนค่า
    
    setSaveTimeout(timeout)
  }

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true)
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (res.ok) {
        applyThemeSettings(settings)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      } else {
        alert('ไม่สามารถบันทึกการตั้งค่าได้')
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาด')
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('รหัสผ่านใหม่ไม่ตรงกัน')
      return
    }

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      })

      if (res.ok) {
        alert('เปลี่ยนรหัสผ่านสำเร็จ')
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        const data = await res.json()
        alert(data.error || 'ไม่สามารถเปลี่ยนรหัสผ่านได้')
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาด')
    }
  }

  if (isLoading) {
    return <LoadingScreen message={t('common.loading')} />
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4">
      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <div>
              <CardTitle>{t('settings.appearance')}</CardTitle>
              <CardDescription>{t('settings.appearance.desc')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Mode - Compact */}
          <div className="space-y-2">
            <Label>{t('settings.theme')}</Label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setTheme('light')
                  setTimeout(() => {
                    applyThemeSettings(settings)
                    window.dispatchEvent(new CustomEvent('themeChanged', { detail: 'light' }))
                  }, 100)
                }}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors ${
                  theme === 'light' 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'bg-background hover:bg-muted border-border'
                }`}
              >
                <Sun className="h-3.5 w-3.5" />
                <span>{t('settings.theme.light')}</span>
              </button>
              <button
                onClick={() => {
                  setTheme('dark')
                  setTimeout(() => {
                    applyThemeSettings(settings)
                    window.dispatchEvent(new CustomEvent('themeChanged', { detail: 'dark' }))
                  }, 100)
                }}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors ${
                  theme === 'dark' 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'bg-background hover:bg-muted border-border'
                }`}
              >
                <Moon className="h-3.5 w-3.5" />
                <span>{t('settings.theme.dark')}</span>
              </button>
              <button
                onClick={() => {
                  setTheme('system')
                  setTimeout(() => {
                    applyThemeSettings(settings)
                    window.dispatchEvent(new CustomEvent('themeChanged', { detail: 'system' }))
                  }, 100)
                }}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors ${
                  theme === 'system' 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'bg-background hover:bg-muted border-border'
                }`}
              >
                <Monitor className="h-3.5 w-3.5" />
                <span>{t('settings.theme.system')}</span>
              </button>
            </div>
          </div>

          {/* Primary Color */}
          <div className="space-y-3">
            <Label>{t('settings.primaryColor')}</Label>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleSettingChange('primaryColor', color.value)}
                  className={`relative w-10 h-10 rounded-md border-2 transition-all hover:scale-110 ${
                    settings.primaryColor === color.value
                      ? 'border-foreground ring-2 ring-offset-1 ring-foreground'
                      : 'border-border'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                >
                  {settings.primaryColor === color.value && (
                    <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-white drop-shadow-lg" />
                  )}
                </button>
              ))}
              {/* Custom Color Button */}
              <button
                onClick={() => handleSettingChange('primaryColor', 'custom')}
                className={`relative w-10 h-10 rounded-md border-2 transition-all hover:scale-110 flex items-center justify-center ${
                  settings.primaryColor === 'custom'
                    ? 'border-foreground ring-2 ring-offset-1 ring-foreground'
                    : 'border-border'
                }`}
                style={{ 
                  background: settings.primaryColor === 'custom' 
                    ? settings.customPrimaryColor 
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
                }}
                title="กำหนดเอง"
              >
                <Palette className="h-4 w-4 text-white drop-shadow-lg" />
              </button>
            </div>
            {settings.primaryColor === 'custom' && (
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Label htmlFor="customPrimaryColor" className="text-sm whitespace-nowrap">
                  {t('settings.primaryColor.selectColor')}:
                </Label>
                <Input
                  id="customPrimaryColor"
                  type="color"
                  value={settings.customPrimaryColor}
                  onChange={(e) => handleSettingChange('customPrimaryColor', e.target.value)}
                  className="h-10 w-20 cursor-pointer"
                />
                <Input
                  type="text"
                  value={settings.customPrimaryColor}
                  onChange={(e) => handleSettingChange('customPrimaryColor', e.target.value)}
                  placeholder="#3b82f6"
                  className="flex-1 font-mono"
                />
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              {settings.primaryColor === 'custom' 
                ? `${t('settings.primaryColor.custom')}: ${settings.customPrimaryColor}`
                : `${t('settings.primaryColor.selected')}: ${colors.find((c) => c.value === settings.primaryColor)?.name}`
              }
            </p>
          </div>

          {/* Background Gradient */}
          <div className="space-y-3">
            <Label>{t('settings.background')}</Label>
            <div className="flex flex-wrap gap-2">
              {backgroundColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleSettingChange('backgroundColor', color.value)}
                  className={`relative w-12 h-12 rounded-md border-2 transition-all hover:scale-110 ${
                    settings.backgroundColor === color.value
                      ? 'border-foreground ring-2 ring-offset-1 ring-foreground'
                      : 'border-border'
                  }`}
                  style={{ 
                    background: color.gradient || 'transparent',
                  }}
                  title={color.name}
                >
                  {settings.backgroundColor === color.value && (
                    <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-white drop-shadow-lg" />
                  )}
                  {color.type === 'custom' && (
                    <Palette className="h-4 w-4 text-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  )}
                </button>
              ))}
            </div>
            {settings.backgroundColor === 'custom' && (
              <div className="space-y-3 p-4 bg-muted rounded-lg">
                <Label className="text-sm font-semibold">{t('settings.background.custom')}</Label>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Label htmlFor="customGradientStart" className="text-xs text-muted-foreground">
                      {t('settings.background.startColor')}
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        id="customGradientStart"
                        type="color"
                        value={settings.customGradientStart}
                        onChange={(e) => handleSettingChange('customGradientStart', e.target.value)}
                        className="h-10 w-16 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={settings.customGradientStart}
                        onChange={(e) => handleSettingChange('customGradientStart', e.target.value)}
                        placeholder="#667eea"
                        className="flex-1 font-mono text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="customGradientEnd" className="text-xs text-muted-foreground">
                      {t('settings.background.endColor')}
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        id="customGradientEnd"
                        type="color"
                        value={settings.customGradientEnd}
                        onChange={(e) => handleSettingChange('customGradientEnd', e.target.value)}
                        className="h-10 w-16 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={settings.customGradientEnd}
                        onChange={(e) => handleSettingChange('customGradientEnd', e.target.value)}
                        placeholder="#764ba2"
                        className="flex-1 font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div 
                  className="h-16 rounded-lg border-2 border-border"
                  style={{ 
                    background: `linear-gradient(135deg, ${settings.customGradientStart} 0%, ${settings.customGradientEnd} 100%)` 
                  }}
                />
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              {settings.backgroundColor === 'custom'
                ? `${t('settings.background.customGradient')}: ${settings.customGradientStart} → ${settings.customGradientEnd}`
                : `${t('settings.background.selected')}: ${backgroundColors.find((c) => c.value === settings.backgroundColor)?.name}`
              }
            </p>
          </div>

          {/* Font Family & Font Size & Language - 3 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Font Family */}
            <div className="space-y-3">
              <Label htmlFor="font">{t('settings.font')} ({fonts.length} {t('settings.font.count')})</Label>
              <Select
                value={settings.fontFamily}
                onValueChange={(value) => handleSettingChange('fontFamily', value)}
              >
                <SelectTrigger id="font" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                    {t('settings.font.international')}
                  </div>
                  {fonts.filter(f => f.category === 'สากล').map((font) => (
                    <SelectItem 
                      key={font.value} 
                      value={font.value}
                      className={`font-${font.value}`}
                    >
                      <span className={`font-${font.value}`}>{font.name}</span>
                    </SelectItem>
                  ))}
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t mt-2">
                    {t('settings.font.thai')}
                  </div>
                  {fonts.filter(f => f.category === 'ไทย').map((font) => (
                    <SelectItem 
                      key={font.value} 
                      value={font.value}
                      className={`font-${font.value}`}
                    >
                      <span className={`font-${font.value}`}>{font.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {t('settings.font.selected')}: {fonts.find((f) => f.value === settings.fontFamily)?.name}
              </p>
            </div>

            {/* Font Size */}
            <div className="space-y-3">
              <Label htmlFor="fontSize">{t('settings.fontSize')}</Label>
              <Select
                value={settings.fontSize}
                onValueChange={(value) => handleSettingChange('fontSize', value)}
              >
                <SelectTrigger id="fontSize">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontSizes.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {t('settings.fontSize.selected')}: {fontSizes.find((s) => s.value === settings.fontSize)?.name}
              </p>
            </div>

            {/* Language */}
            <div className="space-y-3">
              <Label htmlFor="language">{t('settings.language')}</Label>
              <Select
                value={settings.language || 'th'}
                onValueChange={(value) => handleSettingChange('language', value)}
              >
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="th">
                    <div className="flex items-center gap-2">
                      <span>🇹🇭</span>
                      <span>ไทย</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="en">
                    <div className="flex items-center gap-2">
                      <span>🇬🇧</span>
                      <span>English</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {t('settings.language.selected')}: {settings.language === 'en' ? 'English' : 'ไทย'}
              </p>
            </div>
          </div>

          {/* Preview Text */}
          <div className="p-6 rounded-lg border bg-muted space-y-3">
            <p className="text-sm font-semibold text-muted-foreground mb-3">{t('settings.preview')}:</p>
            <div className="space-y-2">
              <p className="text-2xl font-bold">
                {t('settings.preview.title')}
              </p>
              <p className="text-lg">
                The quick brown fox jumps over the lazy dog
              </p>
              <p className="text-base">
                {t('settings.preview.subtitle')}
              </p>
              <p className="text-sm text-muted-foreground">
                ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789
              </p>
              <p className="text-sm text-muted-foreground">
                กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-sm text-green-700 dark:text-green-300">
                {t('settings.autoSave')}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password Change */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Lock className="h-5 w-5" />
            <div>
              <CardTitle>{t('settings.password')}</CardTitle>
              <CardDescription>{t('settings.password.desc')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">{t('settings.password.current')}</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">{t('settings.password.new')}</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('settings.password.confirm')}</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                }
                required
              />
            </div>

            <Button type="submit" className="w-full">
              <Lock className="mr-2 h-4 w-4" />
              {t('settings.password.button')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
