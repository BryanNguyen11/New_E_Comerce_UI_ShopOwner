import { useState, useEffect } from "react";
import { message, Rate, Pagination, Empty } from "antd";
import { useAuth } from "@/context/AuthContext";

export default function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 5,
    totalElements: 0,
    totalPages: 0,
  });
  const { authState } = useAuth();

  const fetchReviews = async (page = 0, size = 5) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/reviews/product/${productId}/get?page=${page}&size=${size}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const data = await response.json();
      console.log("Fetched reviews:", data);
      setReviews(data.content);
      setPagination({
        page: data.page,
        size: data.size,
        totalElements: data.totalElements,
        totalPages: data.totalPages,
      });
    } catch (err) {
      console.error("Error fetching reviews:", err);
      message.error("Không thể tải đánh giá sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId && authState.token) {
      fetchReviews();
    }
  }, [productId, authState.token]);

  const handlePageChange = (page) => {
    fetchReviews(page - 1, pagination.size); // Ant Design pagination is 1-based, API is 0-based
  };

  if (loading) {
    return <div className="text-center py-8">Đang tải đánh giá...</div>;
  }

  return (
    <div className="mt-8 pt-8 border-t">
      <h2 className="text-black text-lg font-medium mb-4">
        Đánh giá sản phẩm ({pagination.totalElements})
      </h2>

      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.reviewId} className="border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="bg-gray-200 rounded-full h-10 w-10 flex items-center justify-center">
                  <i className="fas fa-user text-gray-500"></i>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">
                    {(review.customer && review.customer.fullName) ? review.customer.fullName : "Khách hàng ẩn danh"}
                  </p>
                  <Rate disabled defaultValue={review.rating} className="text-sm" />
                </div>
              </div>
              <p className="mt-2 text-black">{review.comment}</p>
            </div>
          ))}

          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination
                current={pagination.page + 1}
                total={pagination.totalElements}
                pageSize={pagination.size}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          )}
        </div>
      ) : (
        <Empty description="Chưa có đánh giá nào cho sản phẩm này" />
      )}
    </div>
  );
}