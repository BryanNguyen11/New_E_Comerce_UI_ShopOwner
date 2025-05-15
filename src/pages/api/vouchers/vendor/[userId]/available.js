export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  const { userId } = req.query;
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/vouchers/vendor/${userId}`;
  const data = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${req.headers.authorization}`,
    },
  })

  if (!data.ok) {
    const error = await data.json();
    console.error('Error fetching data:', error);
    return res.status(data.status).json({ message: 'Error fetching data' });
  }
  const response = await data.json();

  console.log("RESPONSE", response)

  return res.status(200).json(response.content);
}