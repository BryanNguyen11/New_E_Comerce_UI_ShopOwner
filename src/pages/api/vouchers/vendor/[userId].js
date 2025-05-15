export default async function handler(req, res) {


  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  const { userId, page, size } = req.query;
  console.log('userId:', userId);
  const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/vouchers/vendor/${userId}`);
  
  // Add query parameters to URL
  url.searchParams.append('page', page || 0);
  url.searchParams.append('size', size || 10);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${req.headers.authorization}`,
    },
  })

  if (!response.ok) {
    const responseData = await response.json();
    console.error('Error fetching data:', responseData);
    return res.status(response.status).json({ message: 'Error fetching data' });
  }
   
  const data = await response.json();
  // console.log('Data:', data);
  return res.status(200).json(data.content);

}