// pages/api/products.js
import { IncomingForm } from 'formidable';
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false, // Tắt bodyParser mặc định để xử lý FormData
  },
};

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  const {productId} = req.query;

  const form = new IncomingForm();
  
  try {
    // Parse FormData từ yêu cầu
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    // Tạo FormData mới bằng form-data
    const formDataToSend = new FormData();

    for (const [key, value] of Object.entries(fields)) {
      
      if (Array.isArray(value)) {
        // Xử lý các trường đặc biệt
        if (key === 'firstCategories' || key === 'secondCategories' || key === 'removeImages') {
          try {
            // Thử parse JSON nếu có
            const parsedValue = JSON.parse(value[0]);
            console.log('parsedValue:', parsedValue);
            for(const item of parsedValue) {
              formDataToSend.append(key, item);
            }
            // formDataToSend.append(key, parsedValue);
          } catch {
            // Nếu không parse được, gửi nguyên bản
            formDataToSend.append(key, value[0]);
          }
        }
        // Các trường thông thường khác
        else {
          formDataToSend.append(key, value[0]);
        }
      } else {
        // Xử lý tương tự cho trường không phải array
        if (key === 'firstCategoryName' || key === 'secondCategoryName' || key === 'removeImages') {
          formDataToSend.append(key, value === 'null' ? null : value);
        } else if (key === 'firstCategories' || key === 'secondCategories' || key === 'removeImages') {
          try {
            formDataToSend.append(key, JSON.stringify(JSON.parse(value)));
          } catch {
            formDataToSend.append(key, value);
          }
        } else {
          formDataToSend.append(key, value);
        }
      }
    }
    // Xử lý file (coverImage, video, images)
    if (files.coverImage && files.coverImage[0]) {
      formDataToSend.append(
        'coverImage', 
        fs.createReadStream(files.coverImage[0].filepath), 
        {
          filename: files.coverImage[0].originalFilename,
          contentType: files.coverImage[0].mimetype,
        }
      );
    }
    
    if (files.video && files.video[0]) {
      formDataToSend.append(
        'video', 
        fs.createReadStream(files.video[0].filepath), 
        {
          filename: files.video[0].originalFilename,
          contentType: files.video[0].mimetype,
        }
      );
    }
    
    if (files.newImages) {
      // Chuẩn hóa thành mảng trong mọi trường hợp
      const images = Array.isArray(files.newImages) ? files.newImages : [files.newImages];
      
      for (const image of images) {
        // Kiểm tra cả 2 trường hợp: image là object trực tiếp hoặc nằm trong mảng
        const imgObj = Array.isArray(image) ? image[0] : image;
        
        if (imgObj && imgObj.filepath) {
          formDataToSend.append(
            'newImages', 
            fs.createReadStream(imgObj.filepath), 
            {
              filename: imgObj.originalFilename,
              contentType: imgObj.mimetype,
            }
          );
        }
      }
    }
    console.log('formDataToSend:', formDataToSend);
    
    // // Lấy accessToken từ header hoặc fields
    const accessToken = req.headers.authorization?.replace('Bearer ', '') || fields.accessToken;
    if (!accessToken) {
      return res.status(401).json({ message: 'Missing access token' });
    }

    // // Gửi yêu cầu đến backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://exclusion-info-pcs-tsunami.trycloudflare.com';
    const response = await fetch(`${backendUrl}/api/products/${productId}`, {
      method: 'PUT',
      body: formDataToSend,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...formDataToSend.getHeaders(), // Thêm header Content-Type: multipart/form-data
      },
    });

    // const result = await response.json();

    if (!response.ok) {
      console.error('Backend Error:', result);
      return res.status(response.status).json(result);
    }

    // console.log('Backend Response:', result);

    return res.status(200).json("Cập nhật sản phẩm thành công");
  } catch (error) {
    console.error('Proxy Error:', error);
    if (error.code === 1009 || error.message.includes('size limit')) {
      return res.status(413).json({ message: 'Kích thước request vượt quá giới hạn cho phép.' });
    }
    if (error.code === 'ERR_INVALID_ARG_TYPE') {
      return res.status(400).json({ message: 'Dữ liệu file không hợp lệ.' });
    }
    return res.status(500).json({ 
      message: 'Internal Server Error', 
      error: error.message 
    });
  }
}