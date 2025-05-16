"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Tabs, Pagination, message, Button, Modal, Rate, Input, Empty } from "antd";
import OrderCard from "@/components/orders/OrderCard";
import '@ant-design/v5-patch-for-react-19';

const { TextArea } = Input;

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("PENDING");
  const [pagination, setPagination] = useState({
    page: 0,
    size: 5,
    totalElements: 0,
    totalPages: 0,
  });
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const { authState, user } = useAuth();

  const fetchOrders = async (orderState = activeTab, page = 0) => {
    if (!user?.userId || !authState.token) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `/api/orders/customer/${user.userId}?page=${page}&size=${pagination.size}&orderState=${orderState}`,
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data.content);
      setPagination({
        page: data.page,
        size: data.size,
        totalElements: data.totalElements,
        totalPages: data.totalPages,
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.userId) {
      fetchOrders(activeTab);
    }
  }, [user?.userId, authState.token, activeTab]);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handlePageChange = (page) => {
    fetchOrders(activeTab, page - 1); // API uses 0-based pages
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authState.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to cancel order");
      }

      message.success("Hủy đơn hàng thành công");
      fetchOrders(activeTab);
    } catch (error) {
      console.error("Error canceling order:", error);
      message.error("Không thể hủy đơn hàng");
    }
  };

  const handleChangeOrderState = async (orderId, newState) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/update-state`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authState.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderState: newState }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order state");
      }

      message.success("Cập nhật trạng thái đơn hàng thành công");
      fetchOrders(activeTab);
    } catch (error) {
      console.error("Error updating order state:", error);
      message.error("Không thể cập nhật trạng thái đơn hàng");
    }
  };

  const openReviewModal = (product) => {
    setSelectedProduct(product);
    setReviewModalVisible(true);
    setRating(5);
    setComment("");
  };

  const handleReviewSubmit = async () => {
    if (!selectedProduct) return;

    setSubmittingReview(true);
    try {
      const response = await fetch("/api/reviews/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authState.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating: rating,
          comment: comment,
          productId: selectedProduct.productId,
          customerId: user.userId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      message.success("Gửi đánh giá thành công");
      setReviewModalVisible(false);
    } catch (error) {
      console.error("Error submitting review:", error);
      message.error("Không thể gửi đánh giá");
    } finally {
      setSubmittingReview(false);
    }
  };

  function renderOrderList(orderState) {
    if (loading) {
      return <div className="py-8 text-center">Đang tải...</div>;
    }

    if (orders.length === 0) {
      return (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Không tìm thấy đơn hàng nào"
        />
      );
    }

    return (
      <div>
        <div className="space-y-4 mb-6">
          {orders.map((order) => (
            <OrderCard
              key={order.orderId}
              order={order}
              onCancel={orderState === "PENDING" ? () => handleCancelOrder(order.orderId) : null}
              onChangeState={orderState === "TRANSPORTING" ? () => handleChangeOrderState(order.orderId, "DELIVERED") : null}
              onReview={orderState === "DELIVERED" ? (productDetail) => openReviewModal(productDetail) : null}
            />
          ))}
        </div>

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
    );
  }

  const tabItems = [
    {
      key: "PENDING",
      label: "Chờ xác nhận",
      children: renderOrderList("PENDING")
    },
    {
      key: "TRANSPORTING",
      label: "Đang vận chuyển",
      children: renderOrderList("TRANSPORTING")
    },
    {
      key: "DELIVERED",
      label: "Đã giao hàng",
      children: renderOrderList("DELIVERED")
    },
    {
      key: "SUCCEEDED",
      label: "Hoàn thành",
      children: renderOrderList("SUCCEEDED")
    },
    {
      key: "RETURNED",
      label: "Trả hàng",
      children: renderOrderList("RETURNED")
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Đơn hàng của tôi</h1>

      <Tabs activeKey={activeTab} onChange={handleTabChange} items={tabItems} destroyOnHidden />

      <Modal
        title="Đánh giá sản phẩm"
        open={reviewModalVisible}
        onCancel={() => setReviewModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setReviewModalVisible(false)}>
            Hủy
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={submittingReview}
            onClick={handleReviewSubmit}
          >
            Gửi đánh giá
          </Button>,
        ]}
      >
        {selectedProduct && (
          <div>
            <div className="flex items-center gap-4 mb-4">
              <img 
                src={selectedProduct.productImage} 
                alt={selectedProduct.productName} 
                className="w-16 h-16 object-cover"
              />
              <div>
                <h3 className="font-medium">{selectedProduct.productName}</h3>
                <p className="text-gray-500 text-sm">
                  {selectedProduct.firstCategory && `${selectedProduct.firstCategory}, `}
                  {selectedProduct.secondCategory}
                </p>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="mb-2">Đánh giá:</p>
              <Rate value={rating} onChange={setRating} />
            </div>
            
            <div>
              <p className="mb-2">Nhận xét:</p>
              <TextArea 
                rows={4} 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Hãy chia sẻ trải nghiệm của bạn về sản phẩm này"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}