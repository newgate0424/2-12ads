import { google } from 'googleapis';

// รายชื่อชีตที่ต้องซิงค์
export const SHEET_NAMES = [
  'สาวอ้อย',
  'อลิน',
  'อัญญาC',
  'อัญญาD',
  'สเปชบาร์',
  'บาล้าน',
  'ฟุตบอลแอร์เรีย',
];

// ฟังก์ชันสำหรับการเชื่อมต่อกับ Google Sheets
export async function getGoogleSheetsClient() {
  try {
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const sheetId = process.env.GOOGLE_SHEET_ID;

    if (!clientEmail || !privateKey || !sheetId) {
      throw new Error('Missing Google Sheets credentials in environment variables');
    }

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    return { sheets, sheetId };
  } catch (error) {
    console.error('Error initializing Google Sheets client:', error);
    throw error;
  }
}

// ฟังก์ชันสำหรับดึงข้อมูลจากชีต
export async function getSheetData(sheetName: string) {
  try {
    const { sheets, sheetId } = await getGoogleSheetsClient();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${sheetName}!A:AB`, // คอลัมน์ A ถึง AB (28 คอลัมน์)
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      console.log(`No data found in sheet: ${sheetName}`);
      return [];
    }

    // แปลงข้อมูลเป็น object
    const headers = rows[0];
    const data = rows.slice(1).map((row) => {
      const obj: any = {};
      headers.forEach((header: string, index: number) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });

    return data;
  } catch (error) {
    console.error(`Error fetching data from sheet ${sheetName}:`, error);
    throw error;
  }
}

// ฟังก์ชันสำหรับแปลงข้อมูลจาก Google Sheets เป็นรูปแบบที่ใช้ใน database
export function parseSheetRow(row: any, sheetName: string) {
  // ฟังก์ชันช่วยแปลงค่าเป็นตัวเลข
  const toNumber = (val: any): number => {
    if (val === '' || val === null || val === undefined) return 0;
    const parsed = parseFloat(String(val).replace(/,/g, ''));
    return isNaN(parsed) ? 0 : parsed;
  };

  // ฟังก์ชันช่วยแปลงวันที่จาก DD/MM/YYYY เป็น YYYY-MM-DD
  const toDate = (val: any): Date => {
    if (!val) return new Date();
    
    // ถ้าเป็นรูปแบบ DD/MM/YYYY (จาก Google Sheets)
    if (typeof val === 'string' && val.includes('/')) {
      const parts = val.trim().split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);
        
        // สร้าง Date object ในรูปแบบ YYYY-MM-DD สำหรับ MySQL
        // ใช้ UTC เพื่อหลีกเลี่ยงปัญหา timezone
        const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
        return date;
      }
    }
    
    // ถ้าเป็น Date object หรือ timestamp อื่นๆ
    return new Date(val);
  };

  return {
    team: String(row.team || ''),
    b: row.B ? String(row.B) : null,
    adser: String(row.adser || ''),
    date: toDate(row.date),
    message: toNumber(row.message),
    messageMeta: toNumber(row.message_meta),
    lostMessages: toNumber(row.lost_messages),
    netMessages: toNumber(row.net_messages),
    planSpend: toNumber(row.plan_spend),
    spend: toNumber(row.spend),
    planMessage: toNumber(row.plan_message),
    l: toNumber(row.L),
    deposit: toNumber(row.deposit),
    n: toNumber(row.N),
    turnoverAdser: toNumber(row.turnover_adser),
    p: toNumber(row.P),
    turnover: toNumber(row.turnover),
    cover: toNumber(row.cover),
    pageBlocks7days: toNumber(row.page_blocks7days),
    pageBlocks30days: toNumber(row.page_blocks30days),
    silent: toNumber(row.Silent),
    duplicate: toNumber(row.duplicate),
    hasUser: toNumber(row.has_user),
    spam: toNumber(row.spam),
    blocked: toNumber(row.blocked),
    under18: toNumber(row.under_18),
    over50: toNumber(row.over_50),
    foreign: toNumber(row.foreign),
    sheetName: sheetName,
  };
}

// ฟังก์ชันสำหรับซิงค์ข้อมูลทั้งหมด
export async function syncAllSheets() {
  const results = {
    success: [] as string[],
    failed: [] as { sheet: string; error: string }[],
    totalRecords: 0,
  };

  for (const sheetName of SHEET_NAMES) {
    try {
      const data = await getSheetData(sheetName);
      results.success.push(sheetName);
      results.totalRecords += data.length;
    } catch (error) {
      results.failed.push({
        sheet: sheetName,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return results;
}
