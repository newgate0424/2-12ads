// Test sync immediately
const testSync = async () => {
  try {
    console.log('Starting sync test...');
    
    const response = await fetch('http://localhost:3000/api/sync/sheets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    });

    const data = await response.json();
    
    console.log('\n=== SYNC RESULTS ===');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.results) {
      console.log('\n=== SUMMARY ===');
      console.log(`Total Records: ${data.results.totalRecords}`);
      console.log(`Total Inserted: ${data.results.totalInserted}`);
      console.log(`Total Updated: ${data.results.totalUpdated}`);
      console.log(`Success: ${data.results.success.length} sheets`);
      console.log(`Failed: ${data.results.failed.length} sheets`);
    }
    
  } catch (error) {
    console.error('Sync test failed:', error);
  }
};

testSync();
