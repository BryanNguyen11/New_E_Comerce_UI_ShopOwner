export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
    const targetUrl = `${backendUrl}/api/orders`;

    // Xử lý query parameters nếu có
    const queryString = new URLSearchParams(req.query).toString();
    const fullUrl = queryString ? `${targetUrl}?${queryString}` : targetUrl;

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization || '',
        // Loại bỏ header host để tránh xung đột
        host: undefined
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error fetching orders:", errorData);
      return res.status(response.status).json({ 
        message: errorData.message || 'Error fetching orders', 
        error: errorData 
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Server error while fetching orders:", error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
