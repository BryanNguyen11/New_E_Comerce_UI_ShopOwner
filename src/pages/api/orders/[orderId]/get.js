export default async function handler(req, res) {

  if (req.method !== 'GET' ) {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
  const targetUrl = `${backendUrl}/api/orders/${req.query.orderId}`;

  const response = await fetch(targetUrl, {
    method: req.method,
    headers: {
      ...req.headers,
      host: undefined, // Loại bỏ header host để tránh xung đột
    },
  });

  if (!response.ok){
    const errorData = await response.json();
    console.log(errorData)
    return res.status(response.status).json({ message: errorData.message || 'Error' });
  }

  const data = await response.json();
  res.status(response.status).json(data);
}