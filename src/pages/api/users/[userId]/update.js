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
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  const { userId } = req.query;

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

    // Xử lý các trường dữ liệu
    Object.entries(fields).forEach(([key, value]) => {
      // Bỏ qua các giá trị undefined hoặc null
      if (value === undefined || value === null) {
        return;
      }

      // Xử lý trường hợp giá trị là mảng
      if (Array.isArray(value)) {
        // Nếu bạn muốn gửi từng phần tử riêng lẻ
        value.forEach((item, index) => {
          formDataToSend.append(`${key}`, item);
        });
        // Hoặc nếu bạn muốn gửi dưới dạng JSON string
        // formDataToSend.append(key, JSON.stringify(value));
      } else {
        // Xử lý trường hợp giá trị bình thường
        formDataToSend.append(key, value);
      }
    });

    console.log('File:', files);

    // Xử lý file upload
    if (files.userImg && files.userImg[0]) {
      formDataToSend.append(
        'userImg', 
        fs.createReadStream(files.userImg[0].filepath), 
        {
          filename: files.userImg[0].originalFilename,
          contentType: files.userImg[0].mimetype,
        }
      );
    }
    else if (files.userImg) {
      
      // Nếu chỉ có một file
      formDataToSend.append(
        'userImg', 
        fs.createReadStream(files.userImg.filepath), 
        {
          filename: files.userImg.originalFilename,
          contentType: files.userImg.mimetype,
        }
      );
    }


    console.log('FormData:', formDataToSend); 

    // Lấy accessToken
    const accessToken = req.headers.authorization?.replace('Bearer ', '') || fields.accessToken;
    if (!accessToken) {
      return res.status(401).json({ message: 'Missing access token' });
    }

    // Gửi yêu cầu đến backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://exclusion-info-pcs-tsunami.trycloudflare.com';
    const response = await fetch(`${backendUrl}/api/users/${userId}`, {
      method: 'PUT',
      body: formDataToSend,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...formDataToSend.getHeaders(),
      },
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Backend Error:', result);
      return res.status(response.status).json(result);
    }

    return res.status(200).json({ 
      success: true,
      message: "Cập nhật thông tin thành công",
      data: result 
    });
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