export default async function handler(req, res) {

  if (req.method !== 'POST' ) {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const backendUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL || "http://localhost:8080";
  const targetUrl = `${backendUrl}/auth/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}}/account/credentials/password`;

  const response = await fetch(targetUrl, {
    method: req.method,
    headers: {
      ...req.headers,
      host: undefined, // Loại bỏ header host để tránh xung đột
    }
  });

  if (!response.ok){
    const errorData = await response.json();
    console.log(errorData)
    return res.status(response.status).json({ message: errorData.message || 'Error' });
  }

  res.status(response.status).send("OKE")

}