export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  const { voucherId } = req.query;
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/vouchers/${voucherId}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: req.headers.authorization || '',
      }
    });
    console.log('Response:', response);
    const data = await response.json();


    if (!response.ok) {
      console.error('Error fetching data:', data);
      return res.status(response.status).json({ message: 'Error fetching data' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}