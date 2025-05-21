export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart-detail`;
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${req.headers.authorization}`,
    },
    body: JSON.stringify(req.body),
  })
    .then((response) => {
      if (!response.ok) {
        response.json().then((errorData) => {
          console.error('Error response from backend:', errorData);
        });
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    });
}