import { BACKEND_URL } from "@/utils/constants";

export default async function handler(req, res) {
  try {
    if (req.method !== "PUT") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const { voucherId } = req.query;
    const voucherData = req.body;
    
    console.log("voucherData ", voucherData);

    // Basic validation
    if (!voucherId) {
      return res.status(400).json({ message: "Voucher ID is required" });
    }    // Pass the request to your backend API
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || BACKEND_URL || "https://exclusion-info-pcs-tsunami.trycloudflare.com";
    
    // Forward the request to the backend
    const response = await fetch(`${backendUrl}/api/vouchers/${voucherId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": req.headers.authorization || "",
      },
      body: JSON.stringify(voucherData),
    });

    if (!response.ok) {
      const errorData = await response.json();
        console.error("Error updating voucher:", errorData);
      return res.status(response.status).json({ message: "Failed to update voucher", error: errorData });
    }

    // Get response data
    const data = await response.json();

    // Return the response with the same status
    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Error updating voucher:", error);
    return res.status(500).json({ message: "Failed to update voucher", error: error.message });
  }
}
