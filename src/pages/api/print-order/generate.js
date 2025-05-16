export default async function handler(req, res) {

  if (req.method !== 'POST' ) {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
  const targetUrl = `${backendUrl}/api/print-order/generate`;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        ...req.headers,
        host: undefined, // Loại bỏ header host để tránh xung đột
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error from backend:', errorData);
      return res.status(response.status).json(errorData);
    }

    // Check content type to handle PDF files
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/pdf')) {
      // Handle PDF file
      const pdfBuffer = await response.arrayBuffer();
      
      // Set appropriate headers for PDF response
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="order.pdf"');
      res.setHeader('Content-Length', Buffer.byteLength(pdfBuffer));
      
      // Send the PDF data
      return res.send(Buffer.from(pdfBuffer));
    } else {
      // Handle normal response
      const data = await response.text();
      return res.status(response.status).send(data);
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}