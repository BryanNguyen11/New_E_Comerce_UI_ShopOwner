import { BACKEND_URL } from "@/utils/constants";

export default async function handler(req, res) {
  try {
    // We now have proper endpoints for all voucher operations, so this file will only handle
    // POST requests for creating new vouchers that don't have an ID yet
    if (req.method === "POST") {
      const voucherData = req.body;
      
      // Forward the request to the backend
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || BACKEND_URL || "https://exclusion-info-pcs-tsunami.trycloudflare.com";
      const response = await fetch(`${backendUrl}/api/vouchers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": req.headers.authorization || "",
        },
        body: JSON.stringify(voucherData),
      });
      
      // Get response data
      const data = await response.json();
      
      // Return the response with the same status
      return res.status(response.status).json(data);
    } else {
      // Return 405 Method Not Allowed for any other HTTP method
      return res.status(405).json({ message: "Method not allowed, use specific endpoints for CRUD operations" });
    }
  } catch (error) {
    console.error("Error in vouchers API handler:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

async function handlePutMethod(req, res) {
  try {
    const voucherData = req.body;
    
    // Basic validation
    if (!voucherData.voucherId) {
      return res.status(400).json({ message: "Voucher ID is required" });
    }    // Pass the request to your backend API
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://exclusion-info-pcs-tsunami.trycloudflare.com";
    
    // Forward the request to the backend using the correct endpoint pattern
    // Using the same pattern as the DELETE endpoint: /api/vouchers/:id
    const response = await fetch(`${backendUrl}/api/vouchers/${voucherData.voucherId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": req.headers.authorization || "",
      },
      body: JSON.stringify(voucherData),
    });

    // Get response data
    const data = await response.json();

    // Return the response with the same status
    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Error updating voucher:", error);
    return res.status(500).json({ message: "Failed to update voucher", error: error.message });
  }
}
