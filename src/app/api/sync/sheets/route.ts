import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSheetData, parseSheetRow, SHEET_NAMES } from '@/lib/google-sheets';

// POST /api/sync/sheets - ซิงค์ข้อมูลจาก Google Sheets
export async function POST(request: NextRequest) {
  try {
    console.log('Starting Google Sheets sync...');
    
    // ดึงข้อมูลจาก request body (ถ้ามี)
    const body = await request.json().catch(() => ({}));
    const sheetNames = body.sheets || SHEET_NAMES; // ใช้ชีตที่ระบุหรือทั้งหมด

    const results = {
      success: [] as { sheet: string; records: number }[],
      failed: [] as { sheet: string; error: string }[],
      totalRecords: 0,
      totalInserted: 0,
      totalUpdated: 0,
    };

    // วนลูปซิงค์แต่ละชีต
    for (const sheetName of sheetNames) {
      try {
        console.log(`Starting sync for sheet: ${sheetName}`);
        
        // ดึงข้อมูลจาก Google Sheets
        const sheetData = await getSheetData(sheetName);
        
        if (sheetData.length === 0) {
          results.failed.push({
            sheet: sheetName,
            error: 'No data found in sheet',
          });
          continue;
        }

        let inserted = 0;
        let updated = 0;

        // แปลงข้อมูลทั้งหมดก่อน
        const validRows = sheetData
          .map(row => parseSheetRow(row, sheetName))
          .filter(data => data.team && data.adser); // กรองเฉพาะแถวที่มีข้อมูลครบ

        console.log(`Sheet ${sheetName}: Found ${sheetData.length} rows, ${validRows.length} valid rows`);
        
        // Log ตัวอย่างข้อมูล 2 แถวแรก
        if (validRows.length > 0) {
          console.log('Sample data (first row):', JSON.stringify(validRows[0], null, 2));
        }

        // แบ่งข้อมูลเป็น batch (50 แถวต่อ batch เพื่อไม่ให้เกิน query limit)
        const BATCH_SIZE = 50;
        const batches: typeof validRows[] = [];
        
        for (let i = 0; i < validRows.length; i += BATCH_SIZE) {
          batches.push(validRows.slice(i, i + BATCH_SIZE));
        }

        console.log(`Processing ${validRows.length} rows in ${batches.length} batches...`);

        // ประมวลผลทีละ batch
        for (const batch of batches) {
          try {
            // ใช้ Promise.all เพื่อประมวลผลหลายแถวพร้อมกัน
            const results = await Promise.all(
              batch.map(async (parsedData) => {
                try {
                  const result = await prisma.syncData.upsert({
                    where: {
                      team_adser_date_sheetName: {
                        team: parsedData.team,
                        adser: parsedData.adser,
                        date: parsedData.date,
                        sheetName: parsedData.sheetName,
                      },
                    },
                    update: {
                      b: parsedData.b,
                      message: parsedData.message,
                      messageMeta: parsedData.messageMeta,
                      lostMessages: parsedData.lostMessages,
                      netMessages: parsedData.netMessages,
                      planSpend: parsedData.planSpend,
                      spend: parsedData.spend,
                      planMessage: parsedData.planMessage,
                      l: parsedData.l,
                      deposit: parsedData.deposit,
                      n: parsedData.n,
                      turnoverAdser: parsedData.turnoverAdser,
                      p: parsedData.p,
                      turnover: parsedData.turnover,
                      cover: parsedData.cover,
                      pageBlocks7days: parsedData.pageBlocks7days,
                      pageBlocks30days: parsedData.pageBlocks30days,
                      silent: parsedData.silent,
                      duplicate: parsedData.duplicate,
                      hasUser: parsedData.hasUser,
                      spam: parsedData.spam,
                      blocked: parsedData.blocked,
                      under18: parsedData.under18,
                      over50: parsedData.over50,
                      foreign: parsedData.foreign,
                      updatedAt: new Date(),
                    },
                    create: parsedData,
                  });
                  
                  // ตรวจสอบว่าเป็น insert หรือ update
                  const isNew = result.createdAt.getTime() === result.updatedAt.getTime();
                  return { success: true, isNew };
                } catch (error) {
                  console.error(`Error upserting row:`, error);
                  return { success: false, isNew: false };
                }
              })
            );

            // นับจำนวน inserted และ updated
            results.forEach(r => {
              if (r.success) {
                if (r.isNew) {
                  inserted++;
                } else {
                  updated++;
                }
              }
            });
          } catch (batchError) {
            console.error(`Error processing batch in ${sheetName}:`, batchError);
          }
        }

        results.success.push({
          sheet: sheetName,
          records: sheetData.length,
        });
        results.totalRecords += sheetData.length;
        results.totalInserted += inserted;
        results.totalUpdated += updated;

        console.log(`Completed sync for sheet: ${sheetName} (${inserted} inserted, ${updated} updated)`);
      } catch (sheetError) {
        console.error(`Error syncing sheet ${sheetName}:`, sheetError);
        results.failed.push({
          sheet: sheetName,
          error: sheetError instanceof Error ? sheetError.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      message: 'Sync completed',
      results,
    });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      {
        error: 'Failed to sync data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET /api/sync/sheets - ดูสถานะการซิงค์ล่าสุด
export async function GET(request: NextRequest) {
  try {
    console.log('Getting sync status...');
    
    // ดึงสถิติข้อมูล
    const stats = await Promise.all(
      SHEET_NAMES.map(async (sheetName) => {
        const count = await prisma.syncData.count({
          where: { sheetName },
        });
        
        const latest = await prisma.syncData.findFirst({
          where: { sheetName },
          orderBy: { updatedAt: 'desc' },
          select: { updatedAt: true },
        });

        return {
          sheet: sheetName,
          recordCount: count,
          lastUpdated: latest?.updatedAt || null,
        };
      })
    );

    return NextResponse.json({
      stats,
      totalRecords: stats.reduce((sum, s) => sum + s.recordCount, 0),
    });
  } catch (error) {
    console.error('Get sync status error:', error);
    return NextResponse.json(
      {
        error: 'Failed to get sync status',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
