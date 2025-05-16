export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  // const { productId } = req.query;
  const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/vendor/${req.query.userId}`);
  
  const queryParams = new URLSearchParams();
  for (const [key, value] of Object.entries(req.query)) {
    // Bỏ qua productId vì đã có trong URL
    if (key === 'userId') {
      continue;
    }
    if (Array.isArray(value)) {
      // Xử lý trường hợp mảng (ví dụ: ?category=1&category=2)
      value.forEach(v => queryParams.append(key, v));
    } else {
      queryParams.append(key, value);
    }
  }

  // Thêm query parameters vào URL
  url.search = queryParams.toString();
  let headers;
  if (req.headers.authorization === undefined) {
    headers = {
      'Content-Type': 'application/json',
    };
  }
  else{
    headers = {
      'Content-Type': 'application/json',
      Authorization: `${req.headers.authorization}`,
    };
  }

  const data = await fetch(url, {
    method: 'GET',
    headers: headers,
  });
  try{
  const response = await data.json();;
  if (!response) {
    return res.status(404).json({ message: 'Product not found' });
  }
  return res.status(200).json(response);
  }
  catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}