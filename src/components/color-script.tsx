'use client'

export const colorPresets = [
  { name: 'น้ำเงิน', value: 'blue', hsl: '221 83% 53%' },
  { name: 'เขียว', value: 'green', hsl: '142 71% 45%' },
  { name: 'แดง', value: 'red', hsl: '0 72% 51%' },
  { name: 'ส้ม', value: 'orange', hsl: '25 95% 53%' },
  { name: 'ม่วง', value: 'purple', hsl: '262 83% 58%' },
  { name: 'ชมพู', value: 'pink', hsl: '326 78% 66%' },
  { name: 'เหลือง', value: 'yellow', hsl: '48 96% 53%' },
  { name: 'ฟ้า', value: 'cyan', hsl: '189 94% 43%' },
  { name: 'เทา', value: 'gray', hsl: '220 9% 46%' },
  { name: 'น้ำตาล', value: 'brown', hsl: '25 41% 43%' },
  { name: 'เขียวมรกต', value: 'emerald', hsl: '160 84% 39%' },
  { name: 'ชมพูกลีบบัว', value: 'rose', hsl: '350 89% 60%' },
  { name: 'ม่วงอ่อน', value: 'violet', hsl: '258 90% 66%' },
  { name: 'ฟ้าคราม', value: 'indigo', hsl: '239 84% 67%' },
  { name: 'เขียวมะนาว', value: 'lime', hsl: '84 81% 44%' },
  { name: 'ฟ้าน้ำเงิน', value: 'sky', hsl: '199 89% 48%' },
  { name: 'ม่วงบานเย็น', value: 'fuchsia', hsl: '292 84% 61%' },
  { name: 'เขียวหยก', value: 'teal', hsl: '173 80% 40%' },
  { name: 'ชมพูแสด', value: 'amber', hsl: '38 92% 50%' },
  { name: 'เทาหิน', value: 'slate', hsl: '215 16% 47%' },
] as const

export const fontFamilies = [
  { name: 'Inter', value: 'inter', className: 'font-sans' },
  { name: 'Roboto', value: 'roboto', className: 'font-roboto' },
  { name: 'Open Sans', value: 'open-sans', className: 'font-open-sans' },
  { name: 'Lato', value: 'lato', className: 'font-lato' },
  { name: 'Poppins', value: 'poppins', className: 'font-poppins' },
  { name: 'Montserrat', value: 'montserrat', className: 'font-montserrat' },
  { name: 'Noto Sans Thai', value: 'noto-sans-thai', className: 'font-noto-sans-thai' },
  { name: 'Sarabun', value: 'sarabun', className: 'font-sarabun' },
  { name: 'Prompt', value: 'prompt', className: 'font-prompt' },
  { name: 'Kanit', value: 'kanit', className: 'font-kanit' },
  { name: 'IBM Plex Thai', value: 'ibm-plex-thai', className: 'font-ibm-plex-thai' },
  { name: 'Charm', value: 'charm', className: 'font-charm' },
  { name: 'Mali', value: 'mali', className: 'font-mali' },
  { name: 'Mitr', value: 'mitr', className: 'font-mitr' },
] as const

export const fontSizes = [
  { name: 'เล็ก', value: 'small', size: '14px' },
  { name: 'ปานกลาง', value: 'medium', size: '16px' },
  { name: 'ใหญ่', value: 'large', size: '18px' },
  { name: 'ใหญ่มาก', value: 'xlarge', size: '20px' },
  { name: 'กำหนดเอง', value: 'custom', size: null },
] as const

export function ColorScript() {
  const script = `
    (function() {
      try {
        const settings = JSON.parse(localStorage.getItem('userSettings') || '{}')
        const root = document.documentElement
        
        if (settings.primaryColor) {
          root.setAttribute('data-color', settings.primaryColor)
        }
        
        if (settings.backgroundColor) {
          root.setAttribute('data-bg-color', settings.backgroundColor)
        }
        
        if (settings.fontSize) {
          root.setAttribute('data-font-size', settings.fontSize)
        }
        
        if (settings.fontFamily) {
          root.setAttribute('data-font', settings.fontFamily)
        }
      } catch (e) {}
    })()
  `

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: script,
      }}
    />
  )
}
