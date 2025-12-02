'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'th' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  th: {
    // Navigation
    'nav.dashboard': 'แดชบอร์ด',
    'nav.users': 'จัดการผู้ใช้',
    'nav.sessions': 'ผู้ใช้ออนไลน์',
    'nav.activity': 'บันทึกกิจกรรม',
    'nav.settings': 'ตั้งค่า',
    
    // Header
    'header.toggle.open': 'เปิด Sidebar',
    'header.toggle.close': 'ปิด Sidebar',
    'header.theme.light': 'โหมดสว่าง',
    'header.theme.dark': 'โหมดมืด',
    
    // User Menu
    'user.menu.title': 'บัญชีของฉัน',
    'user.menu.settings': 'ตั้งค่า',
    'user.menu.logout': 'ออกจากระบบ',
    'user.role.admin': 'ผู้ดูแลระบบ',
    'user.role.staff': 'พนักงาน',
    
    // Settings Page
    'settings.title': 'ตั้งค่า',
    'settings.appearance': 'รูปลักษณ์',
    'settings.appearance.desc': 'ปรับแต่งธีม สี และฟอนต์ตามความชอบ',
    'settings.theme': 'โหมดธีม',
    'settings.theme.light': 'โหมดสว่าง',
    'settings.theme.dark': 'โหมดมืด',
    'settings.theme.system': 'ตามระบบ',
    'settings.primaryColor': 'สีหลัก',
    'settings.primaryColor.selected': 'สีที่เลือก',
    'settings.primaryColor.custom': 'สีกำหนดเอง',
    'settings.primaryColor.selectColor': 'เลือกสี',
    'settings.background': 'พื้นหลังแบบกราเดี้ยน',
    'settings.background.selected': 'พื้นหลังที่เลือก',
    'settings.background.custom': 'กำหนดกราเดี้ยนเอง',
    'settings.background.startColor': 'สีเริ่มต้น',
    'settings.background.endColor': 'สีสิ้นสุด',
    'settings.background.customGradient': 'กราเดี้ยนกำหนดเอง',
    'settings.font': 'แบบอักษร',
    'settings.font.thai': 'ฟอนต์ภาษาไทย',
    'settings.font.international': 'ฟอนต์สากล',
    'settings.font.selected': 'ฟอนต์ที่เลือก',
    'settings.font.count': 'แบบ',
    'settings.fontSize': 'ขนาดตัวอักษร',
    'settings.fontSize.small': 'เล็ก',
    'settings.fontSize.medium': 'ปานกลาง',
    'settings.fontSize.large': 'ใหญ่',
    'settings.fontSize.selected': 'ขนาดที่เลือก',
    'settings.language': 'ภาษา',
    'settings.language.th': 'ไทย',
    'settings.language.en': 'English',
    'settings.language.selected': 'ภาษาที่เลือก',
    'settings.preview': 'ตัวอย่างข้อความ',
    'settings.preview.title': 'ระบบจัดการผู้ใช้งาน',
    'settings.preview.subtitle': 'การจัดการระบบผู้ใช้งานและสิทธิ์การเข้าถึง',
    'settings.autoSave': 'การตั้งค่าจะถูกบันทึกอัตโนมัติทันทีที่เปลี่ยนแปลง',
    'settings.password': 'เปลี่ยนรหัสผ่าน',
    'settings.password.desc': 'เปลี่ยนรหัสผ่านของคุณเพื่อความปลอดภัย',
    'settings.password.current': 'รหัสผ่านปัจจุบัน',
    'settings.password.new': 'รหัสผ่านใหม่',
    'settings.password.confirm': 'ยืนยันรหัสผ่านใหม่',
    'settings.password.button': 'เปลี่ยนรหัสผ่าน',
    
    // Logo
    'logo.subtitle': 'Admin Panel',
    
    // Common
    'common.loading': 'กำลังโหลด...',
    'common.error': 'เกิดข้อผิดพลาด',
    'common.success': 'สำเร็จ',
    'common.cancel': 'ยกเลิก',
    'common.confirm': 'ยืนยัน',
    'common.save': 'บันทึก',
    
    // Privacy Policy
    'privacy.title': 'นโยบายความเป็นส่วนตัว',
    'privacy.subtitle': 'เราให้ความสำคัญกับความเป็นส่วนตัวและข้อมูลส่วนบุคคลของคุณ นโยบายนี้อธิบายวิธีการเก็บรวบรวม ใช้งาน และปกป้องข้อมูลของคุณ',
    'privacy.lastUpdated': 'อัปเดตล่าสุด',
    
    // Information Collection
    'privacy.collection.title': 'ข้อมูลที่เรารวบรวม',
    'privacy.collection.description': 'เราเก็บรวบรวมข้อมูลเพื่อให้บริการที่ดีและปลอดภัยแก่คุณ',
    'privacy.collection.personal.title': 'ข้อมูลส่วนบุคคล',
    'privacy.collection.personal.name': 'ชื่อ-นามสกุล',
    'privacy.collection.personal.email': 'ที่อยู่อีเมล',
    'privacy.collection.personal.username': 'ชื่อผู้ใช้งาน',
    'privacy.collection.personal.role': 'บทบาทและสิทธิ์การเข้าถึง',
    'privacy.collection.technical.title': 'ข้อมูลทางเทคนิค',
    'privacy.collection.technical.ip': 'ที่อยู่ IP Address',
    'privacy.collection.technical.browser': 'ข้อมูลเบราว์เซอร์',
    'privacy.collection.technical.device': 'ข้อมูลอุปกรณ์',
    'privacy.collection.technical.activity': 'บันทึกการใช้งาน',
    
    // How We Use Information
    'privacy.usage.title': 'วิธีการใช้ข้อมูล',
    'privacy.usage.description': 'เราใช้ข้อมูลของคุณเพื่อวัตถุประสงค์ต่อไปนี้',
    'privacy.usage.service.title': 'การให้บริการ',
    'privacy.usage.service.authentication': 'การยืนยันตัวตนและเข้าสู่ระบบ',
    'privacy.usage.service.authorization': 'การควบคุมสิทธิ์การเข้าถึง',
    'privacy.usage.service.personalization': 'การปรับแต่งประสบการณ์การใช้งาน',
    'privacy.usage.security.title': 'ความปลอดภัย',
    'privacy.usage.security.monitoring': 'การตรวจสอบและป้องกันการใช้งานที่ผิดปกติ',
    'privacy.usage.security.fraud': 'การป้องกันการฉ้อโกงและการละเมิด',
    'privacy.usage.security.compliance': 'การปฏิบัติตามกฎหมายและระเบียบ',
    'privacy.usage.improvement.title': 'การพัฒนาระบบ',
    'privacy.usage.improvement.analytics': 'การวิเคราะห์การใช้งาน',
    'privacy.usage.improvement.performance': 'การปรับปรุงประสิทธิภาพ',
    'privacy.usage.improvement.features': 'การพัฒนาฟีเจอร์ใหม่',
    
    // Data Protection
    'privacy.protection.title': 'การปกป้องข้อมูล',
    'privacy.protection.description': 'เราใช้มาตรการรักษาความปลอดภัยหลายชั้นเพื่อปกป้องข้อมูลของคุณ',
    'privacy.protection.technical.title': 'มาตรการทางเทคนิค',
    'privacy.protection.technical.encryption.title': 'การเข้ารหัสข้อมูล',
    'privacy.protection.technical.encryption.description': 'ข้อมูลทั้งหมดได้รับการเข้ารหัสทั้งในการส่งและการจัดเก็บ',
    'privacy.protection.technical.access.title': 'การควบคุมการเข้าถึง',
    'privacy.protection.technical.access.description': 'มีระบบควบคุมการเข้าถึงหลายชั้นและการยืนยันตัวตน',
    'privacy.protection.technical.audit.title': 'การตรวจสอบ',
    'privacy.protection.technical.audit.description': 'มีการบันทึกและตรวจสอบการเข้าถึงข้อมูลทั้งหมด',
    'privacy.protection.organizational.title': 'มาตรการองค์กร',
    'privacy.protection.organizational.access.title': 'การจำกัดการเข้าถึง',
    'privacy.protection.organizational.access.description': 'เฉพาะบุคลากรที่ได้รับอนุญาตเท่านั้นที่สามารถเข้าถึงข้อมูล',
    'privacy.protection.organizational.retention.title': 'การเก็บรักษาข้อมูล',
    'privacy.protection.organizational.retention.description': 'ข้อมูลจะถูกเก็บเฉพาะระยะเวลาที่จำเป็นเท่านั้น',
    'privacy.protection.organizational.backup.title': 'การสำรองข้อมูล',
    'privacy.protection.organizational.backup.description': 'มีระบบสำรองข้อมูลที่ปลอดภัยและการกู้คืนข้อมูล',
    
    // Your Rights
    'privacy.rights.title': 'สิทธิ์ของคุณ',
    'privacy.rights.description': 'คุณมีสิทธิ์ในการควบคุมข้อมูลส่วนบุคคลของคุณ',
    'privacy.rights.access.title': 'สิทธิ์เข้าถึง',
    'privacy.rights.access.description': 'ขอดูข้อมูลส่วนบุคคลที่เราเก็บไว้',
    'privacy.rights.correction.title': 'สิทธิ์แก้ไข',
    'privacy.rights.correction.description': 'แก้ไขข้อมูลที่ไม่ถูกต้องหรือไม่สมบูรณ์',
    'privacy.rights.deletion.title': 'สิทธิ์ลบ',
    'privacy.rights.deletion.description': 'ขอให้ลบข้อมูลส่วนบุคคลของคุณ',
    'privacy.rights.contact.title': 'ติดต่อเรา',
    'privacy.rights.contact.description': 'ติดต่อสอบถามเกี่ยวกับข้อมูลของคุณ',
    
    // Contact Information
    'privacy.contact.title': 'ข้อมูลการติดต่อ',
    'privacy.contact.description': 'หากคุณมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัวหรือต้องการใช้สิทธิ์ของคุณ',
    'privacy.contact.methods.title': 'ช่องทางการติดต่อ',
    'privacy.contact.methods.email': 'อีเมล',
    'privacy.contact.methods.response': 'เวลาตอบกลับ',
    'privacy.contact.methods.responseTime': 'ภายใน 7 วันทำการ',
    'privacy.contact.policy.title': 'การเปลี่ยนแปลงนโยบาย',
    'privacy.contact.policy.description': 'เราขอสงวนสิทธิ์ในการปรับปรุงนโยบายนี้เป็นครั้งคราว',
    'privacy.contact.policy.updates': 'การเปลี่ยนแปลงสำคัญจะมีการแจ้งให้ทราบล่วงหน้า',
    
    // Footer
    'privacy.footer.version': 'เวอร์ชัน',
    'privacy.footer.effective': 'มีผลบังคับใช้',
    'privacy.footer.notice': 'นโยบายนี้เป็นส่วนหนึ่งของข้อกำหนดการใช้บริการของเรา',
    
    // Terms of Service
    'terms.title': 'ข้อกำหนดการใช้บริการ',
    'terms.subtitle': 'ข้อกำหนดและเงื่อนไขการใช้งานระบบ ads169th System ที่ผู้ใช้ต้องยอมรับและปฏิบัติตาม',
    'terms.lastUpdated': 'อัปเดตล่าสุด',
    
    // Acceptance
    'terms.acceptance.title': 'การยอมรับข้อกำหนด',
    'terms.acceptance.description': 'การเข้าใช้งานระบบถือว่าคุณยอมรับข้อกำหนดทั้งหมด',
    'terms.acceptance.content': 'การเข้าใช้งานระบบ ads169th System ในรูปแบบใดก็ตาม หมายความว่าคุณได้อ่าน เข้าใจ และยอมรับที่จะปฏิบัติตามข้อกำหนดการใช้บริการนี้ทั้งหมด หากคุณไม่ยอมรับข้อกำหนดใดข้อหนึ่ง กรุณาหยุดใช้งานระบบทันที',
    'terms.acceptance.note': 'หมายเหตุ: ข้อกำหนดนี้อาจมีการเปลี่ยนแปลงเป็นครั้งคราว และจะมีผลบังคับใช้ทันทีที่ประกาศ',
    
    // Service Description
    'terms.service.title': 'คำอธิบายบริการ',
    'terms.service.description': 'ระบบ ads169th System คือระบบจัดการผู้ใช้งานและควบคุมการเข้าถึง',
    'terms.service.features.title': 'ฟีเจอร์หลักของระบบ',
    'terms.service.features.authentication': 'ระบบยืนยันตัวตนและเข้าสู่ระบบ',
    'terms.service.features.management': 'การจัดการผู้ใช้งานและสิทธิ์การเข้าถึง',
    'terms.service.features.monitoring': 'การติดตามและบันทึกกิจกรรม',
    'terms.service.features.reporting': 'ระบบรายงานและวิเคราะห์',
    'terms.service.availability.title': 'ความพร้อมใช้งาน',
    'terms.service.availability.content': 'เรามุ่งมั่นให้บริการที่มีความเสถียรและพร้อมใช้งาน แต่ไม่สามารถรับประกันการให้บริการแบบไม่มีขัดข้อง 100%',
    'terms.service.availability.maintenance': 'ระบบอาจมีการปิดปรับปรุงเป็นครั้งคราวเพื่อการบำรุงรักษาและพัฒนา',
    
    // User Responsibilities
    'terms.responsibilities.title': 'ความรับผิดชอบของผู้ใช้',
    'terms.responsibilities.description': 'สิ่งที่ผู้ใช้ต้องปฏิบัติและไม่ควรกระทำ',
    'terms.responsibilities.account.title': 'การดูแลบัญชี',
    'terms.responsibilities.account.security.title': 'ความปลอดภัย',
    'terms.responsibilities.account.security.description': 'ดูแลรักษาชื่อผู้ใช้และรหัสผ่านให้ปลอดภัย ไม่เปิดเผยให้ผู้อื่น',
    'terms.responsibilities.account.accuracy.title': 'ความถูกต้อง',
    'terms.responsibilities.account.accuracy.description': 'ให้ข้อมูลที่ถูกต้องและเป็นปัจจุบันเสมอ',
    'terms.responsibilities.account.compliance.title': 'การปฏิบัติตาม',
    'terms.responsibilities.account.compliance.description': 'ปฏิบัติตามนโยบายและระเบียบขององค์กร',
    'terms.responsibilities.prohibited.title': 'สิ่งที่ห้ามกระทำ',
    'terms.responsibilities.prohibited.unauthorized': 'เข้าถึงข้อมูลที่ไม่ได้รับอนุญาต',
    'terms.responsibilities.prohibited.interference': 'แทรกแซงหรือรบกวนการทำงานของระบบ',
    'terms.responsibilities.prohibited.malicious': 'ใช้งานในลักษณะที่เป็นอันตรายหรือผิดกฎหมาย',
    'terms.responsibilities.prohibited.violation': 'ละเมิดสิทธิ์ของผู้อื่นหรือนโยบายความเป็นส่วนตัว',
    
    // Privacy and Data
    'terms.privacy.title': 'ความเป็นส่วนตัวและข้อมูล',
    'terms.privacy.description': 'การคุ้มครองข้อมูลส่วนบุคคลและความเป็นส่วนตัว',
    'terms.privacy.content': 'การใช้งานระบบนี้ เป็นไปตามนโยบายความเป็นส่วนตัวของเรา ซึ่งอธิบายวิธีการเก็บรวบรวม ใช้งาน และปกป้องข้อมูลของคุณ',
    'terms.privacy.reference.title': 'อ้างอิง',
    'terms.privacy.reference.content': 'โปรดอ่านนโยบายความเป็นส่วนตัวของเราเพื่อทำความเข้าใจเพิ่มเติม',
    'terms.privacy.reference.link': 'อ่านนโยบายความเป็นส่วนตัว',
    
    // Limitations and Disclaimers
    'terms.limitations.title': 'ข้อจำกัดและการปฏิเสธความรับผิดชอบ',
    'terms.limitations.description': 'ข้อจำกัดความรับผิดชอบและการรับประกัน',
    'terms.limitations.liability.title': 'ข้อจำกัดความรับผิดชอบ',
    'terms.limitations.liability.content': 'เราจะไม่รับผิดชอบต่อความเสียหายใดๆ ที่เกิดจากการใช้งานระบบ ยกเว้นกรณีที่เกิดจากความประมาทเลินเล่อของเราโดยตรง',
    'terms.limitations.warranty.title': 'การปฏิเสธการรับประกัน',
    'terms.limitations.warranty.content': 'ระบบให้บริการในสภาพ "ตามที่เป็น" โดยไม่มีการรับประกันใดๆ ทั้งโดยชัดแจ้งหรือโดยนัย',
    'terms.limitations.important.title': 'ข้อสำคัญ',
    'terms.limitations.important.content': 'ข้อจำกัดเหล่านี้อาจไม่มีผลบังคับใช้ในบางเขตอำนาจศาล โปรดศึกษากฎหมายท้องถิ่นที่เกี่ยวข้อง',
    
    // Termination
    'terms.termination.title': 'การยกเลิกการใช้งาน',
    'terms.termination.description': 'เงื่อนไขการยกเลิกการใช้งานระบบ',
    'terms.termination.content': 'เราขอสงวนสิทธิ์ในการยกเลิกหรือระงับการใช้งานบัญชีของคุณในกรณีต่อไปนี้:',
    'terms.termination.reasons.violation': 'การละเมิดข้อกำหนดการใช้บริการ',
    'terms.termination.reasons.security': 'การกระทำที่เป็นอันตรายต่อความปลอดภัยของระบบ',
    'terms.termination.reasons.discretion': 'เหตุผลอื่นๆ ตามดุลยพินิจของเรา',
    
    // Contact and Changes
    'terms.contact.title': 'การติดต่อและการเปลี่ยนแปลง',
    'terms.contact.description': 'ข้อมูลการติดต่อและนโยบายการแก้ไขข้อกำหนด',
    'terms.contact.support.title': 'การติดต่อสนับสนุน',
    'terms.contact.support.content': 'หากมีคำถามเกี่ยวกับข้อกำหนดการใช้บริการ กรุณาติดต่อเรา',
    'terms.contact.support.email': 'อีเมล',
    'terms.contact.changes.title': 'การเปลี่ยนแปลงข้อกำหนด',
    'terms.contact.changes.content': 'เราขอสงวนสิทธิ์ในการแก้ไขข้อกำหนดนี้เป็นครั้งคราว',
    'terms.contact.changes.notification': 'การเปลี่ยนแปลงสำคัญจะมีการแจ้งให้ทราบล่วงหน้า',
    
    // Footer
    'terms.footer.version': 'เวอร์ชัน',
    'terms.footer.effective': 'มีผลบังคับใช้',
    'terms.footer.notice': 'ข้อกำหนดนี้เป็นส่วนหนึ่งของข้อตกลงการใช้บริการโดยรวม',
  },
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.users': 'User Management',
    'nav.sessions': 'Online Users',
    'nav.activity': 'Activity Logs',
    'nav.settings': 'Settings',
    
    // Header
    'header.toggle.open': 'Open Sidebar',
    'header.toggle.close': 'Close Sidebar',
    'header.theme.light': 'Light Mode',
    'header.theme.dark': 'Dark Mode',
    
    // User Menu
    'user.menu.title': 'My Account',
    'user.menu.settings': 'Settings',
    'user.menu.logout': 'Logout',
    'user.role.admin': 'Administrator',
    'user.role.staff': 'Staff',
    
    // Settings Page
    'settings.title': 'Settings',
    'settings.appearance': 'Appearance',
    'settings.appearance.desc': 'Customize theme, colors and fonts',
    'settings.theme': 'Theme Mode',
    'settings.theme.light': 'Light Mode',
    'settings.theme.dark': 'Dark Mode',
    'settings.theme.system': 'System',
    'settings.primaryColor': 'Primary Color',
    'settings.primaryColor.selected': 'Selected color',
    'settings.primaryColor.custom': 'Custom color',
    'settings.primaryColor.selectColor': 'Select color',
    'settings.background': 'Gradient Background',
    'settings.background.selected': 'Selected background',
    'settings.background.custom': 'Custom gradient',
    'settings.background.startColor': 'Start color',
    'settings.background.endColor': 'End color',
    'settings.background.customGradient': 'Custom gradient',
    'settings.font': 'Font Family',
    'settings.font.thai': 'Thai Fonts',
    'settings.font.international': 'International Fonts',
    'settings.font.selected': 'Selected font',
    'settings.font.count': 'fonts',
    'settings.fontSize': 'Font Size',
    'settings.fontSize.small': 'Small',
    'settings.fontSize.medium': 'Medium',
    'settings.fontSize.large': 'Large',
    'settings.fontSize.selected': 'Selected size',
    'settings.language': 'Language',
    'settings.language.th': 'ไทย',
    'settings.language.en': 'English',
    'settings.language.selected': 'Selected language',
    'settings.preview': 'Preview Text',
    'settings.preview.title': 'User Management System',
    'settings.preview.subtitle': 'User management and access control system',
    'settings.autoSave': 'Settings are saved automatically when changed',
    'settings.password': 'Change Password',
    'settings.password.desc': 'Change your password for security',
    'settings.password.current': 'Current Password',
    'settings.password.new': 'New Password',
    'settings.password.confirm': 'Confirm New Password',
    'settings.password.button': 'Change Password',
    
    // Logo
    'logo.subtitle': 'Admin Panel',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.save': 'Save',
    
    // Privacy Policy
    'privacy.title': 'Privacy Policy',
    'privacy.subtitle': 'We value your privacy and personal data. This policy explains how we collect, use, and protect your information.',
    'privacy.lastUpdated': 'Last Updated',
    
    // Information Collection
    'privacy.collection.title': 'Information We Collect',
    'privacy.collection.description': 'We collect information to provide you with better and safer services',
    'privacy.collection.personal.title': 'Personal Information',
    'privacy.collection.personal.name': 'Full Name',
    'privacy.collection.personal.email': 'Email Address',
    'privacy.collection.personal.username': 'Username',
    'privacy.collection.personal.role': 'Role and Access Permissions',
    'privacy.collection.technical.title': 'Technical Information',
    'privacy.collection.technical.ip': 'IP Address',
    'privacy.collection.technical.browser': 'Browser Information',
    'privacy.collection.technical.device': 'Device Information',
    'privacy.collection.technical.activity': 'Usage Logs',
    
    // How We Use Information
    'privacy.usage.title': 'How We Use Information',
    'privacy.usage.description': 'We use your information for the following purposes',
    'privacy.usage.service.title': 'Service Provision',
    'privacy.usage.service.authentication': 'Identity verification and login',
    'privacy.usage.service.authorization': 'Access control and permissions',
    'privacy.usage.service.personalization': 'Customizing user experience',
    'privacy.usage.security.title': 'Security',
    'privacy.usage.security.monitoring': 'Monitoring and preventing unusual activities',
    'privacy.usage.security.fraud': 'Fraud and abuse prevention',
    'privacy.usage.security.compliance': 'Legal and regulatory compliance',
    'privacy.usage.improvement.title': 'System Improvement',
    'privacy.usage.improvement.analytics': 'Usage analytics',
    'privacy.usage.improvement.performance': 'Performance optimization',
    'privacy.usage.improvement.features': 'New feature development',
    
    // Data Protection
    'privacy.protection.title': 'Data Protection',
    'privacy.protection.description': 'We use multiple layers of security measures to protect your data',
    'privacy.protection.technical.title': 'Technical Measures',
    'privacy.protection.technical.encryption.title': 'Data Encryption',
    'privacy.protection.technical.encryption.description': 'All data is encrypted both in transit and at rest',
    'privacy.protection.technical.access.title': 'Access Control',
    'privacy.protection.technical.access.description': 'Multi-layered access control and authentication systems',
    'privacy.protection.technical.audit.title': 'Auditing',
    'privacy.protection.technical.audit.description': 'All data access is logged and monitored',
    'privacy.protection.organizational.title': 'Organizational Measures',
    'privacy.protection.organizational.access.title': 'Limited Access',
    'privacy.protection.organizational.access.description': 'Only authorized personnel can access data',
    'privacy.protection.organizational.retention.title': 'Data Retention',
    'privacy.protection.organizational.retention.description': 'Data is kept only for as long as necessary',
    'privacy.protection.organizational.backup.title': 'Data Backup',
    'privacy.protection.organizational.backup.description': 'Secure backup systems and data recovery',
    
    // Your Rights
    'privacy.rights.title': 'Your Rights',
    'privacy.rights.description': 'You have rights to control your personal data',
    'privacy.rights.access.title': 'Right to Access',
    'privacy.rights.access.description': 'Request to view your personal data we hold',
    'privacy.rights.correction.title': 'Right to Correction',
    'privacy.rights.correction.description': 'Correct inaccurate or incomplete data',
    'privacy.rights.deletion.title': 'Right to Deletion',
    'privacy.rights.deletion.description': 'Request deletion of your personal data',
    'privacy.rights.contact.title': 'Contact Us',
    'privacy.rights.contact.description': 'Contact us about your data concerns',
    
    // Contact Information
    'privacy.contact.title': 'Contact Information',
    'privacy.contact.description': 'If you have questions about this privacy policy or wish to exercise your rights',
    'privacy.contact.methods.title': 'Contact Methods',
    'privacy.contact.methods.email': 'Email',
    'privacy.contact.methods.response': 'Response Time',
    'privacy.contact.methods.responseTime': 'Within 7 business days',
    'privacy.contact.policy.title': 'Policy Changes',
    'privacy.contact.policy.description': 'We reserve the right to update this policy periodically',
    'privacy.contact.policy.updates': 'Significant changes will be communicated in advance',
    
    // Footer
    'privacy.footer.version': 'Version',
    'privacy.footer.effective': 'Effective Date',
    'privacy.footer.notice': 'This policy is part of our Terms of Service',
    
    // Terms of Service
    'terms.title': 'Terms of Service',
    'terms.subtitle': 'Terms and conditions for using the ads169th System that users must accept and comply with.',
    'terms.lastUpdated': 'Last Updated',
    
    // Acceptance
    'terms.acceptance.title': 'Acceptance of Terms',
    'terms.acceptance.description': 'Using the system means you accept all terms and conditions',
    'terms.acceptance.content': 'By accessing and using the ads169th System in any form, you acknowledge that you have read, understood, and agree to be bound by all terms and conditions of service. If you do not agree with any of these terms, please discontinue use immediately.',
    'terms.acceptance.note': 'Note: These terms may be updated periodically and will take effect immediately upon publication.',
    
    // Service Description
    'terms.service.title': 'Service Description',
    'terms.service.description': 'ads169th System is a user management and access control system',
    'terms.service.features.title': 'Core System Features',
    'terms.service.features.authentication': 'Authentication and login system',
    'terms.service.features.management': 'User management and access control',
    'terms.service.features.monitoring': 'Activity tracking and logging',
    'terms.service.features.reporting': 'Reporting and analytics system',
    'terms.service.availability.title': 'Service Availability',
    'terms.service.availability.content': 'We strive to provide stable and available services, but cannot guarantee 100% uptime without interruptions.',
    'terms.service.availability.maintenance': 'The system may be temporarily unavailable for maintenance and updates.',
    
    // User Responsibilities
    'terms.responsibilities.title': 'User Responsibilities',
    'terms.responsibilities.description': 'What users must do and must not do',
    'terms.responsibilities.account.title': 'Account Management',
    'terms.responsibilities.account.security.title': 'Security',
    'terms.responsibilities.account.security.description': 'Keep your username and password secure and do not share them with others',
    'terms.responsibilities.account.accuracy.title': 'Accuracy',
    'terms.responsibilities.account.accuracy.description': 'Provide accurate and up-to-date information at all times',
    'terms.responsibilities.account.compliance.title': 'Compliance',
    'terms.responsibilities.account.compliance.description': 'Follow organizational policies and procedures',
    'terms.responsibilities.prohibited.title': 'Prohibited Activities',
    'terms.responsibilities.prohibited.unauthorized': 'Accessing unauthorized data',
    'terms.responsibilities.prohibited.interference': 'Interfering with or disrupting system operations',
    'terms.responsibilities.prohibited.malicious': 'Using the system for harmful or illegal purposes',
    'terms.responsibilities.prohibited.violation': 'Violating others\' rights or privacy policies',
    
    // Privacy and Data
    'terms.privacy.title': 'Privacy and Data',
    'terms.privacy.description': 'Protection of personal data and privacy',
    'terms.privacy.content': 'Use of this system is subject to our Privacy Policy, which explains how we collect, use, and protect your data.',
    'terms.privacy.reference.title': 'Reference',
    'terms.privacy.reference.content': 'Please read our Privacy Policy to learn more',
    'terms.privacy.reference.link': 'Read Privacy Policy',
    
    // Limitations and Disclaimers
    'terms.limitations.title': 'Limitations and Disclaimers',
    'terms.limitations.description': 'Limitations of liability and warranties',
    'terms.limitations.liability.title': 'Limitation of Liability',
    'terms.limitations.liability.content': 'We shall not be liable for any damages arising from the use of the system, except in cases of direct negligence by us.',
    'terms.limitations.warranty.title': 'Disclaimer of Warranties',
    'terms.limitations.warranty.content': 'The system is provided "as is" without any warranties, express or implied.',
    'terms.limitations.important.title': 'Important Note',
    'terms.limitations.important.content': 'These limitations may not apply in some jurisdictions. Please consult relevant local laws.',
    
    // Termination
    'terms.termination.title': 'Termination',
    'terms.termination.description': 'Conditions for terminating system usage',
    'terms.termination.content': 'We reserve the right to terminate or suspend your account access in the following cases:',
    'terms.termination.reasons.violation': 'Violation of terms of service',
    'terms.termination.reasons.security': 'Actions that threaten system security',
    'terms.termination.reasons.discretion': 'Other reasons at our discretion',
    
    // Contact and Changes
    'terms.contact.title': 'Contact and Changes',
    'terms.contact.description': 'Contact information and policy for term modifications',
    'terms.contact.support.title': 'Support Contact',
    'terms.contact.support.content': 'If you have questions about these terms of service, please contact us',
    'terms.contact.support.email': 'Email',
    'terms.contact.changes.title': 'Changes to Terms',
    'terms.contact.changes.content': 'We reserve the right to modify these terms periodically',
    'terms.contact.changes.notification': 'Significant changes will be communicated in advance',
    
    // Footer
    'terms.footer.version': 'Version',
    'terms.footer.effective': 'Effective Date',
    'terms.footer.notice': 'These terms are part of the overall service agreement',
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('th')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Load language from localStorage
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && (savedLanguage === 'th' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage)
    }
    setMounted(true)
    
    // Listen for language changes from other components
    const handleLanguageChange = (event: CustomEvent) => {
      if (event.detail && (event.detail === 'th' || event.detail === 'en')) {
        setLanguageState(event.detail)
      }
    }
    
    window.addEventListener('languageChanged', handleLanguageChange as EventListener)
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
    // Broadcast change to all components
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }))
  }

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
