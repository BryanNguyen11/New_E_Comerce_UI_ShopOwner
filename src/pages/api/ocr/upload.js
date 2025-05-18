// pages/api/products.js
import { IncomingForm } from 'formidable';
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  const form = new IncomingForm();
  
  try {
    // Parse FormData từ yêu cầu
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    // Tạo FormData mới
    const formDataToSend = new FormData();

  

    // Xử lý file upload
    if (files.file && files.file[0]) {
      formDataToSend.append(
        'file', 
        fs.createReadStream(files.file[0].filepath), 
        {
          filename: files.file[0].originalFilename,
          contentType: files.file[0].mimetype,
        }
      );
    }
    else if (files.file) {
      
      // Nếu chỉ có một file
      formDataToSend.append(
        'file', 
        fs.createReadStream(files.file.filepath), 
        {
          filename: files.file.originalFilename,
          contentType: files.file.mimetype,
        }
      );
    }


    console.log('FormData:', formDataToSend); 

    // Gửi yêu cầu đến backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://exclusion-info-pcs-tsunami.trycloudflare.com';
    const response = await fetch(`${backendUrl}/api/ocr/upload`, {
      method: 'POST',
      body: formDataToSend,
      headers: {
        ...formDataToSend.getHeaders(),
      },
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Backend Error:', result);
      return res.status(response.status).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Proxy Error:', error);
    
    if (error.code === 1009 || error.message.includes('size limit')) {
      return res.status(413).json({ 
        success: false,
        message: 'Kích thước request vượt quá giới hạn cho phép.' 
      });
    }
    if (error.code === 'ERR_INVALID_ARG_TYPE') {
      return res.status(400).json({ 
        success: false,
        message: 'Dữ liệu file không hợp lệ.' 
      });
    }
    
    return res.status(500).json({ 
      success: false,
      message: 'Internal Server Error', 
      error: error.message 
    });
  }
}