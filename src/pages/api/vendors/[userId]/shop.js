// API route: /api/vendors/[userId]/shop.js
// Trung gian giữa frontend và backend thực sự cho CRUD shop

import cookie from "cookie";

export default async function handler(req, res) {
  const { userId } = req.query;
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!BACKEND_URL) {
    console.error("[API][shop] Thiếu biến môi trường NEXT_PUBLIC_BACKEND_URL");
    return res.status(500).json({ message: "Thiếu biến môi trường NEXT_PUBLIC_BACKEND_URL" });
  }
  if (!userId) {
    return res.status(400).json({ message: "Thiếu userId" });
  }
  // Lấy accessToken từ header hoặc cookie
  let accessToken = req.headers.authorization?.replace("Bearer ", "");
  if (!accessToken && req.headers.cookie) {
    const cookies = cookie.parse(req.headers.cookie);
    accessToken = cookies["accessToken"];
  }
  if (!accessToken) {
    console.error("[API][shop] Không tìm thấy accessToken");
    return res.status(401).json({ message: "Chưa đăng nhập" });
  }
  // Xác định method và endpoint backend
  let backendUrl = `${BACKEND_URL}/api/users/vendors/${userId}/shop-update`;
  let fetchOptions = {
    method: req.method,
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      // Chỉ thêm Content-Type nếu có body (PUT/POST)
      ...(req.method === "PUT" || req.method === "POST" ? { "Content-Type": "application/json" } : {})
    },
  };
  if (req.method === "PUT" || req.method === "POST") {
    // Nếu là PUT/POST, lấy body đúng chuẩn cho backend (Postman gửi JSON, Next.js API có thể parse thành object)
    // Đảm bảo body là JSON string, không phải object
    let bodyData = req.body;
    if (typeof bodyData !== "string") {
      bodyData = JSON.stringify(bodyData);
    }
    fetchOptions.body = bodyData;
  }
  try {
    console.log("[API][shop] Forwarding to backend:", backendUrl);
    console.log("[API][shop] Method:", req.method);
    console.log("[API][shop] Headers:", fetchOptions.headers);
    if (fetchOptions.body) {
      console.log("[API][shop] Body:", fetchOptions.body);
    }
    const backendRes = await fetch(backendUrl, fetchOptions);
    const contentType = backendRes.headers.get("content-type") || "";
    let data;
    if (contentType.includes("application/json")) {
      data = await backendRes.json();
    } else {
      const text = await backendRes.text();
      console.error("[API][shop] Backend trả về HTML hoặc lỗi:", text);
      return res.status(backendRes.status).json({ message: "Lỗi backend hoặc hết phiên", detail: text });
    }
    if (!backendRes.ok) {
      console.error("[API][shop] Backend trả về lỗi:", data);
      return res.status(backendRes.status).json(data);
    }
    res.status(backendRes.status).json(data);
  } catch (err) {
    console.error("[API][shop] Lỗi hệ thống proxy API:", err);
    res.status(500).json({ message: "Lỗi hệ thống proxy API", error: err.message });
  }
}
