// Beautiful console logger with colors and emojis

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  
  // Foreground colors
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  // Background colors
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
}

const getTimestamp = () => {
  const now = new Date()
  return now.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

export const logger = {
  // Authentication logs
  auth: {
    login: (username: string, ip?: string) => {
      console.log(
        `${colors.green}✓${colors.reset} ${colors.dim}[${getTimestamp()}]${colors.reset} ` +
        `${colors.cyan}🔐 เข้าสู่ระบบ${colors.reset} → ${colors.bright}${username}${colors.reset}` +
        (ip ? ` ${colors.dim}(${ip})${colors.reset}` : '')
      )
    },
    logout: (username: string) => {
      console.log(
        `${colors.yellow}○${colors.reset} ${colors.dim}[${getTimestamp()}]${colors.reset} ` +
        `${colors.yellow}🚪 ออกจากระบบ${colors.reset} → ${colors.bright}${username}${colors.reset}`
      )
    },
    failed: (username: string, reason: string) => {
      console.log(
        `${colors.red}✗${colors.reset} ${colors.dim}[${getTimestamp()}]${colors.reset} ` +
        `${colors.red}⚠️  เข้าสู่ระบบล้มเหลว${colors.reset} → ${colors.bright}${username}${colors.reset} ` +
        `${colors.dim}(${reason})${colors.reset}`
      )
    },
    sessionRevoked: (username: string, revokedBy: string) => {
      console.log(
        `${colors.magenta}●${colors.reset} ${colors.dim}[${getTimestamp()}]${colors.reset} ` +
        `${colors.magenta}⚡ บังคับออกจากระบบ${colors.reset} → ${colors.bright}${username}${colors.reset} ` +
        `${colors.dim}โดย ${revokedBy}${colors.reset}`
      )
    },
  },

  // API request logs
  api: {
    request: (method: string, path: string, user?: string) => {
      const methodColor = method === 'GET' ? colors.blue : 
                         method === 'POST' ? colors.green : 
                         method === 'PUT' ? colors.yellow : 
                         method === 'DELETE' ? colors.red : colors.white
      
      console.log(
        `${colors.dim}[${getTimestamp()}]${colors.reset} ` +
        `${methodColor}${method.padEnd(6)}${colors.reset} ` +
        `${colors.cyan}${path}${colors.reset}` +
        (user ? ` ${colors.dim}by ${user}${colors.reset}` : '')
      )
    },
    success: (path: string, duration: number) => {
      console.log(
        `${colors.green}✓${colors.reset} ${colors.dim}[${getTimestamp()}]${colors.reset} ` +
        `${colors.green}Success${colors.reset} → ${colors.cyan}${path}${colors.reset} ` +
        `${colors.dim}(${duration}ms)${colors.reset}`
      )
    },
    error: (path: string, error: string) => {
      console.log(
        `${colors.red}✗${colors.reset} ${colors.dim}[${getTimestamp()}]${colors.reset} ` +
        `${colors.red}Error${colors.reset} → ${colors.cyan}${path}${colors.reset} ` +
        `${colors.red}${error}${colors.reset}`
      )
    },
  },

  // Admin actions
  admin: {
    userCreated: (username: string, role: string, by: string) => {
      console.log(
        `${colors.green}+${colors.reset} ${colors.dim}[${getTimestamp()}]${colors.reset} ` +
        `${colors.green}👤 สร้างผู้ใช้${colors.reset} → ${colors.bright}${username}${colors.reset} ` +
        `${colors.dim}(${role})${colors.reset} โดย ${colors.cyan}${by}${colors.reset}`
      )
    },
    userUpdated: (username: string, by: string) => {
      console.log(
        `${colors.yellow}~${colors.reset} ${colors.dim}[${getTimestamp()}]${colors.reset} ` +
        `${colors.yellow}✏️  แก้ไขผู้ใช้${colors.reset} → ${colors.bright}${username}${colors.reset} ` +
        `โดย ${colors.cyan}${by}${colors.reset}`
      )
    },
    userDeleted: (username: string, by: string) => {
      console.log(
        `${colors.red}-${colors.reset} ${colors.dim}[${getTimestamp()}]${colors.reset} ` +
        `${colors.red}🗑️  ลบผู้ใช้${colors.reset} → ${colors.bright}${username}${colors.reset} ` +
        `โดย ${colors.cyan}${by}${colors.reset}`
      )
    },
    userLocked: (username: string, locked: boolean, by: string) => {
      const emoji = locked ? '🔒' : '🔓'
      const action = locked ? 'ล็อค' : 'ปลดล็อค'
      const color = locked ? colors.red : colors.green
      
      console.log(
        `${color}●${colors.reset} ${colors.dim}[${getTimestamp()}]${colors.reset} ` +
        `${color}${emoji} ${action}บัญชี${colors.reset} → ${colors.bright}${username}${colors.reset} ` +
        `โดย ${colors.cyan}${by}${colors.reset}`
      )
    },
  },

  // System logs
  system: {
    start: (port: number) => {
      console.log('\n' + colors.bright + colors.bgGreen + ' 🚀 ADS169TH SYSTEM ' + colors.reset)
      console.log(
        `${colors.green}✓${colors.reset} ${colors.dim}[${getTimestamp()}]${colors.reset} ` +
        `${colors.green}เริ่มระบบสำเร็จ${colors.reset} → http://localhost:${colors.bright}${port}${colors.reset}`
      )
      console.log(colors.dim + '═'.repeat(60) + colors.reset + '\n')
    },
    database: {
      connected: () => {
        console.log(
          `${colors.green}✓${colors.reset} ${colors.dim}[${getTimestamp()}]${colors.reset} ` +
          `${colors.green}💾 เชื่อมต่อฐานข้อมูล${colors.reset} → ${colors.bright}สำเร็จ${colors.reset}`
        )
      },
      error: (error: string) => {
        console.log(
          `${colors.red}✗${colors.reset} ${colors.dim}[${getTimestamp()}]${colors.reset} ` +
          `${colors.red}💾 ฐานข้อมูลผิดพลาด${colors.reset} → ${colors.red}${error}${colors.reset}`
        )
      },
    },
    info: (message: string) => {
      console.log(
        `${colors.blue}ℹ${colors.reset} ${colors.dim}[${getTimestamp()}]${colors.reset} ` +
        `${colors.blue}${message}${colors.reset}`
      )
    },
    warning: (message: string) => {
      console.log(
        `${colors.yellow}⚠${colors.reset} ${colors.dim}[${getTimestamp()}]${colors.reset} ` +
        `${colors.yellow}${message}${colors.reset}`
      )
    },
    error: (message: string, error?: any) => {
      console.log(
        `${colors.red}✗${colors.reset} ${colors.dim}[${getTimestamp()}]${colors.reset} ` +
        `${colors.red}${message}${colors.reset}`
      )
      if (error) {
        console.error(colors.dim + error.stack || error + colors.reset)
      }
    },
  },

  // Activity logs
  activity: {
    log: (action: string, user: string, description: string) => {
      const emoji = action === 'USER_CREATE' ? '➕' :
                   action === 'USER_UPDATE' ? '✏️' :
                   action === 'USER_DELETE' ? '🗑️' :
                   action === 'SESSION_REVOKE' ? '⚡' :
                   action === 'SETTINGS_UPDATE' ? '⚙️' :
                   action === 'LOGIN' ? '🔐' :
                   action === 'LOGOUT' ? '🚪' : '📝'
      
      console.log(
        `${colors.magenta}●${colors.reset} ${colors.dim}[${getTimestamp()}]${colors.reset} ` +
        `${colors.magenta}${emoji} กิจกรรม${colors.reset} → ${colors.bright}${user}${colors.reset} ` +
        `${colors.dim}${description}${colors.reset}`
      )
    },
  },

  // Statistics
  stats: {
    online: (count: number) => {
      console.log(
        `${colors.cyan}●${colors.reset} ${colors.dim}[${getTimestamp()}]${colors.reset} ` +
        `${colors.cyan}👥 ผู้ใช้ออนไลน์${colors.reset} → ${colors.bright}${count}${colors.reset} คน`
      )
    },
  },

  // Separator
  separator: () => {
    console.log(colors.dim + '─'.repeat(60) + colors.reset)
  },
}
