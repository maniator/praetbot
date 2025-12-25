import { getCookies } from '../../bin/cookies.js';

export default async function UsersPage() {
  let cookies: Record<string, number> = {};
  let error: string | null = null;

  try {
    cookies = await getCookies();
  } catch {
    error = 'Failed to fetch cookies';
  }

  return (
    <main>
      <h1>Users</h1>
      {error ? (
        <p style={{ color: 'red' }}>Error: {error}</p>
      ) : (
        <div>
          {Object.keys(cookies).length === 0 ? (
            <p>No users found</p>
          ) : (
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #ccc' }}>
                  <th style={{ padding: '8px', textAlign: 'left' }}>User</th>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Cookies</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(cookies)
                  .sort(([, a], [, b]) => b - a)
                  .map(([userId, count]) => (
                    <tr key={userId} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '8px' }}>
                        <code>{userId}</code>
                      </td>
                      <td style={{ padding: '8px' }}>{count}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </main>
  );
}
