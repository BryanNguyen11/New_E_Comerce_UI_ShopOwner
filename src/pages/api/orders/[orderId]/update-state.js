export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { orderId } = req.query;
    const { orderState } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!orderState) {
      return res.status(400).json({ message: 'Missing orderState field' });
    }

    // Call backend API to update the order state
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${orderId}/update-state`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({
        orderState,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error updating order state:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}