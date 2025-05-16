export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { cartId } = req.query;
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart-detail/${cartId}`;
  fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${req.headers.authorization}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      res.status(200).json("Xoa thanhc cong");
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    });
}