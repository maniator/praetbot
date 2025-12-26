export const dynamic = 'force-dynamic';

import { getCookies, CookieUser } from '@/lib/cookies';

export default async function UsersPage() {
  let users: CookieUser[] = [];
  let error: string | null = null;

  try {
    users = await getCookies();
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
          {users.length === 0 ? (
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
                {users
                  .sort((a, b) => (b.cookies ?? 0) - (a.cookies ?? 0))
                  .map((user) => (
                    <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '8px' }}>
                        <strong>{user.name}</strong>
                        <br />
                        <small style={{ color: '#666' }}>ID: {user.id}</small>
                      </td>
                      <td style={{ padding: '8px' }}>{user.cookies ?? 0}</td>
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
