export default async function handler(req, res) {
  console.log('[1] Starting handler execution');
  
  if (req.method !== 'GET') {
    console.log('[2] Method not allowed, received:', req.method);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { customerId, token } = req.query;
  const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart-detail/customer/${customerId}`);

  console.log('[3] Request details:', {
    customerId,
    token: token ? `${token.substring(0, 5)}...` : 'null',
    backendUrl: url.toString()
  });

  try {
    console.log('[4] Setting SSE headers');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    console.log('[5] Making request to backend with headers:', {
      Accept: 'application/json',
      Authorization: req.headers.authorization ? `${req.headers.authorization.substring(0, 10)}...` : `Bearer ${token.substring(0, 5)}...`
    });

    const response = await fetch(url, {
      headers: {
        'Accept': '*/*',
        'Authorization': req.headers.authorization || `Bearer ${token}`,
      },
    });

    console.log('[6] Backend response status:', response.status);
    
    if (!response.ok) {
      console.log('[7] Backend returned error status:', response.status);
      throw new Error(`Backend returned ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let chunkCount = 0;

    console.log('[8] Starting to read stream');
    
    while (true) {
      console.log(`[9.${chunkCount}] Reading chunk ${chunkCount}`);
      const { done, value } = await reader.read();
      
      if (done) {
        console.log('[10] Stream ended');
        break;
      }
      
      chunkCount++;
      const chunk = decoder.decode(value, { stream: true });
      console.log(`[11.${chunkCount}] Received raw chunk (${chunk.length} chars):`, chunk.substring(0, 50) + (chunk.length > 50 ? '...' : ''));
      
      buffer += chunk;
      console.log(`[12.${chunkCount}] Current buffer (${buffer.length} chars):`, buffer.substring(0, 50) + (buffer.length > 50 ? '...' : ''));

      const lines = buffer.split('\n');
      buffer = lines.pop();
      console.log(`[13.${chunkCount}] Split into ${lines.length} complete lines, buffer remainder:`, buffer);

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        console.log(`[14.${chunkCount}.${i}] Processing line:`, line);
        
        if (line.startsWith('data:')) {
          try {
            const data = line.replace('data:', '').trim();
            console.log(`[15.${chunkCount}.${i}] Extracted data:`, data);
            
            if (data) {
              const parsed = JSON.parse(data);
              console.log(`[16.${chunkCount}.${i}] Parsed object:`, parsed);
              res.write(`data: ${data}\n\n`);
              console.log(`[17.${chunkCount}.${i}] Wrote to client`);
            }
          } catch (e) {
            console.error(`[18.${chunkCount}.${i}] Error parsing:`, e, 'Raw data:', line);
          }
        }
      }
    }

    console.log('[19] Ending response');
    res.end();
  } catch (error) {
    console.error('[20] Caught error:', error);
    
    if (!res.headersSent) {
      console.log('[21] Headers not sent, sending 500 error');
      res.status(500).json({ message: 'Internal Server Error' });
    } else {
      console.log('[22] Headers already sent, sending SSE error');
      res.write(`event: error\ndata: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    }
  }
}