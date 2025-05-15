export default async function handler(req, res) {
<<<<<<< HEAD


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
=======
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  const { userId } = req.query;
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/vouchers/vendor/${userId}`;
  const data = await fetch(url, {
>>>>>>> e3f9a2c3a42262a408977b26d7ac277caaf4f3c2
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${req.headers.authorization}`,
    },
  })

<<<<<<< HEAD
  if (!response.ok) {
    const responseData = await response.json();
    console.error('Error fetching data:', responseData);
    return res.status(response.status).json({ message: 'Error fetching data' });
  }
   
  const data = await response.json();
  // console.log('Data:', data);
  return res.status(200).json(data.content);

=======
  if (!data.ok) {
    const error = await data.json();
    console.error('Error fetching data:', error);
    return res.status(data.status).json({ message: 'Error fetching data' });
  }
  const response = await data.json();
  return res.status(200).json(response);
>>>>>>> e3f9a2c3a42262a408977b26d7ac277caaf4f3c2
}