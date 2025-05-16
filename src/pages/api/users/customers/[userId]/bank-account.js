export default async function handler(req, res) {

  if (req.method !== 'POST' ) {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
  const targetUrl = `${backendUrl}/api/users/customers/${req.query.userId}/bank-account`;

  const response = await fetch(targetUrl, {
    method: req.method,
    headers: {
      ...req.headers,
      host: undefined, // Loại bỏ header host để tránh xung đột
    },
    body: JSON.stringify(req.body)
  });
  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error from backend:', errorData);
    return res.status(response.status).json(errorData);
  }

  res.status(response.status).send('OK');
}