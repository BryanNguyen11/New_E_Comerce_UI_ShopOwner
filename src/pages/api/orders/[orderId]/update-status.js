export default async function handler(req, res) {
  try {
    if (req.method !== 'PUT') {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { orderId } = req.query;
    const { status } = req.body;
    
    // Validation
    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
    const targetUrl = `${backendUrl}/api/orders/${orderId}/status`;

    const response = await fetch(targetUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization || '',
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error updating order status:", errorData);
      return res.status(response.status).json({ 
        message: errorData.message || 'Error updating order status', 
        error: errorData 
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Server error while updating order status:", error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
