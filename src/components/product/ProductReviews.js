// import { useState, useEffect } from "react";
// import { message, Rate, Pagination, Empty } from "antd";
// import { useAuth } from "@/context/AuthContext";

// export default function ProductReviews({ productId }) {
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [pagination, setPagination] = useState({
//     page: 0,
//     size: 5,
//     totalElements: 0,
//     totalPages: 0,
//   });
//   const { authState } = useAuth();

//   const fetchReviews = async (page = 0, size = 5) => {
//     try {
//       setLoading(true);
//       const response = await fetch(`/api/reviews/product/${productId}/get?page=${page}&size=${size}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${authState.token}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch reviews");
//       }

//       const data = await response.json();
//       console.log("Fetched reviews:", data);
//       setReviews(data.content);
//       setPagination({
//         page: data.page,
//         size: data.size,
//         totalElements: data.totalElements,
//         totalPages: data.totalPages,
//       });
//     } catch (err) {
//       console.error("Error fetching reviews:", err);
//       message.error("Không thể tải đánh giá sản phẩm");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (productId && authState.token) {
//       fetchReviews();
//     }
//   }, [productId, authState.token]);

//   const handlePageChange = (page) => {
//     fetchReviews(page - 1, pagination.size); // Ant Design pagination is 1-based, API is 0-based
//   };

//   if (loading) {
//     return <div className="text-center py-8">Đang tải đánh giá...</div>;
//   }

//   return (
//     <div className="mt-8 pt-8 border-t">
//       <h2 className="text-black text-lg font-medium mb-4">
//         Đánh giá sản phẩm ({pagination.totalElements})
//       </h2>

//       {reviews.length > 0 ? (
//         <div className="space-y-6">
//           {reviews.map((review) => (
//             <div key={review.reviewId} className="border-b pb-4">
//               <div className="flex items-center gap-3">
//                 <div className="bg-gray-200 rounded-full h-10 w-10 flex items-center justify-center">
//                   <i className="fas fa-user text-gray-500"></i>
//                 </div>
//                 <div>
//                   <p className="text-gray-600 font-medium">
//                     {(review.customer && review.customer.fullName) ? review.customer.fullName : "Khách hàng ẩn danh"}
//                   </p>
//                   <Rate disabled defaultValue={review.rating} className="text-sm" />
//                 </div>
//               </div>
//               <p className="mt-2 text-black">{review.comment}</p>
//             </div>
//           ))}

//           {pagination.totalPages > 1 && (
//             <div className="flex justify-center mt-6">
//               <Pagination
//                 current={pagination.page + 1}
//                 total={pagination.totalElements}
//                 pageSize={pagination.size}
//                 onChange={handlePageChange}
//                 showSizeChanger={false}
//               />
//             </div>
//           )}
//         </div>
//       ) : (
//         <Empty description="Chưa có đánh giá nào cho sản phẩm này" />
//       )}
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { message, Rate, Pagination, Empty, Input, Button, Form } from "antd";
import { useAuth } from "@/context/AuthContext";

const { TextArea } = Input;

export default function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [existingReview, setExistingReview] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  });
  const { authState, user } = useAuth();
  const [form] = Form.useForm();

  // Fetch reviews
  const fetchReviews = async (page = 0, size = 10) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/reviews/product/${productId}?page=${page}&size=${size}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const data = await response.json();
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

  // Fetch average rating
  const fetchAvgRating = async () => {
    try {
      const response = await fetch(
        `/api/reviews/product/${productId}/avg-rating`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch average rating");
      }

      const data = await response.json();
      setAvgRating(data || 0);
    } catch (err) {
      console.error("Error fetching average rating:", err);
      message.error("Không thể tải đánh giá trung bình");
    }
  };

  // Check if user has purchased the product
  const checkPurchase = async () => {
    try {
      const response = await fetch(
        `/api/orders/check-purchase/${productId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to check purchase status");
      }

      const data = await response.json();
      setHasPurchased(data.hasPurchased || false);
    } catch (err) {
      console.error("Error checking purchase status:", err);
      setHasPurchased(false);
    }
  };

  // Check if user has already reviewed
  const checkExistingReview = async () => {
    try {
      const userReview = reviews.find(
        (review) => review.customer?.customerId === user?.userId
      );
      if (userReview) {
        setExistingReview(userReview);
        form.setFieldsValue({
          rating: userReview.rating,
          comment: userReview.comment,
        });
      } else {
        setExistingReview(null);
        form.resetFields();
      }
    } catch (err) {
      console.error("Error checking existing review:", err);
    }
  };

  // Submit or update review
  const handleReviewSubmit = async (values) => {
    try {
      const payload = {
        rating: values.rating,
        comment: values.comment,
        ...(existingReview ? {} : { productId, customerId: user.userId }),
      };

      const url = existingReview
        ? `/api/reviews/${existingReview.reviewId}`
        : `/api/reviews`;
      const method = existingReview ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit review");
      }

      message.success(
        existingReview
          ? "Cập nhật đánh giá thành công"
          : "Gửi đánh giá thành công"
      );
      fetchReviews(pagination.page, pagination.size); // Refresh reviews
      fetchAvgRating(); // Refresh average rating
      checkExistingReview(); // Refresh existing review
      if (!existingReview) {
        form.resetFields();
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      message.error(`Lỗi: ${err.message}`);
    }
  };

  useEffect(() => {
    if (productId && authState.token) {
      fetchReviews();
      fetchAvgRating();
      if (user?.userId) {
        checkPurchase();
      }
    }
  }, [productId, authState.token, user]);

  useEffect(() => {
    if (reviews.length > 0 && user?.userId) {
      checkExistingReview();
    }
  }, [reviews, user]);

  if (loading) {
    return <div className="text-center py-8">Đang tải đánh giá...</div>;
  }

  return (
    <div className="mt-8 pt-8 border-t">
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-2xl font-medium text-black">
          Đánh giá sản phẩm ({pagination.totalElements})
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-[#ee4d2d] text-lg">{avgRating.toFixed(1)}</span>
          <Rate disabled value={Math.round(avgRating)} className="text-sm" />
        </div>
      </div>

      {hasPurchased && authState.isAuthenticated && (
        <div className="mb-6 bg-white p-4 rounded shadow-sm">
          <h3 className="text-lg font-medium text-black mb-2">
            {existingReview ? "Chỉnh sửa đánh giá" : "Viết đánh giá của bạn"}
          </h3>
          <Form
            form={form}
            onFinish={handleReviewSubmit}
            layout="vertical"
            initialValues={{ rating: 0, comment: "" }}
          >
            <Form.Item
              name="rating"
              label="Đánh giá"
              rules={[{ required: true, message: "Vui lòng chọn số sao" }]}
            >
              <Rate />
            </Form.Item>
            <Form.Item
              name="comment"
              label="Nhận xét"
              rules={[{ required: true, message: "Vui lòng nhập nhận xét" }]}
            >
              <TextArea rows={4} placeholder="Nhập nhận xét của bạn" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                {existingReview ? "Cập nhật đánh giá" : "Gửi đánh giá"}
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}

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
                    {(review.customer && review.customer.fullName) ||
                      "Khách hàng ẩn danh"}
                  </p>
                  <Rate disabled value={review.rating} className="text-sm" />
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
                onChange={(page) => fetchReviews(page - 1, pagination.size)}
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
