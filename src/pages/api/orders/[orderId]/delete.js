export default async function handler(req, res) {
  console.log("IN CANCEL ORDER API");
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { orderId } = req.query;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Call backend API to cancel the order
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${orderId}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response from backend:', errorData); 
      return res.status(response.status).json(errorData);
    }
    return res.status(200).send("Order deleted successfully");
  } catch (error) {
    console.error('Error canceling order:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}