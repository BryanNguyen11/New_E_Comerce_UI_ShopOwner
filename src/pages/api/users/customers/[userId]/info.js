export default async function handler(req, res) {

  if (req.method !== 'GET' ) {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
  const targetUrl = `${backendUrl}/api/users/customers/${req.query.userId}`;


  const response = await fetch(targetUrl, {
    method: req.method,
    headers: {
      ...req.headers,
      host: undefined, // Loại bỏ header host để tránh xung đột
    }
  });

  const data = await response.json();
  res.status(response.status).json(data);
}