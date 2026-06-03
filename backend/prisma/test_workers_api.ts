async function main() {
  try {
    const baseUrl = process.env.BACKEND_URL || 'https://faceshield-edgeai-backend.onrender.com';
    const loginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'nick.fury@fencein.app',
        password: 'fencein@SA001'
      })
    });
    const loginData = await loginRes.json() as any;
    const token = loginData.token;
    console.log('Login successful, token retrieved.');

    const workersRes = await fetch(`${baseUrl}/api/v1/workers`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const workers = await workersRes.json() as any[];

    console.log('Returned workers count:', workers.length);
    console.log('Workers list:', workers.map((w: any) => ({
      email: w.email,
      tenantId: w.tenantId,
      role: w.role
    })));
  } catch (error: any) {
    console.error('Error fetching workers API:', error.message);
  }
}

main();
 