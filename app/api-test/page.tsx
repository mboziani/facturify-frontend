'use client';

export default function ApiTestPage() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const testConnection = async () => {
        const testEmail = `test${Date.now()}@test.com`;

        try {
            console.log('Testing connection to:', apiUrl || 'http://localhost:3000');

            const response = await fetch(`${apiUrl || 'http://localhost:3000'}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: testEmail,
                    password: 'Test123456',
                    firstName: 'API',
                    lastName: 'Test'
                })
            });

            const data = await response.json();

            alert(`✅ SUCCESS!\n\nStatus: ${response.status}\n\nUser Created:\n${JSON.stringify(data.user, null, 2)}\n\nTokens received: ${!!data.tokens}`);
        } catch (error: any) {
            alert(`❌ ERROR!\n\n${error.message}\n\nCheck console for details`);
            console.error('Connection test failed:', error);
        }
    };

    return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>🔍 API Connection Test</h1>

            <div style={{ background: '#f3f4f6', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Configuration</h2>
                <p><strong>NEXT_PUBLIC_API_URL:</strong> <code style={{ background: '#fff', padding: '4px 8px', borderRadius: '4px' }}>{apiUrl || '❌ NOT SET'}</code></p>
                <p><strong>Expected:</strong> <code style={{ background: '#fff', padding: '4px 8px', borderRadius: '4px' }}>http://localhost:3001</code></p>
                <p style={{ marginTop: '10px', color: apiUrl === 'http://localhost:3001' ? 'green' : 'red' }}>
                    {apiUrl === 'http://localhost:3001' ? '✅ Configuration Correct!' : '❌ Configuration Incorrect!'}
                </p>
            </div>

            <button
                onClick={testConnection}
                style={{
                    background: 'linear-gradient(to right, #6366f1, #8b5cf6)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '16px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                }}
            >
                🧪 Test Backend Connection
            </button>

            <div style={{ marginTop: '30px', background: '#fef3c7', padding: '20px', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>💡 Instructions:</h3>
                <ol style={{ lineHeight: '1.8' }}>
                    <li>Open Browser DevTools (F12)</li>
                    <li>Go to Console tab</li>
                    <li>Click the "Test Backend Connection" button above</li>
                    <li>Check the result</li>
                </ol>
            </div>

            <div style={{ marginTop: '20px', background: '#e0f2fe', padding: '20px', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>✅ If Successful:</h3>
                <p>You'll see an alert with status 201 and user data.</p>
                <p style={{ marginTop: '10px' }}><strong>Next:</strong> Go back to /register and try signing up!</p>
            </div>

            <div style={{ marginTop: '20px', background: '#fee2e2', padding: '20px', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>❌ If Failed:</h3>
                <p><strong>Check:</strong></p>
                <ul style={{ lineHeight: '1.8' }}>
                    <li>Is backend running? (Should show "🚀 Backend running on http://localhost:3001")</li>
                    <li>Is NEXT_PUBLIC_API_URL correct above?</li>
                    <li>Did you restart frontend after changing .env.local?</li>
                </ul>
            </div>
        </div>
    );
}
