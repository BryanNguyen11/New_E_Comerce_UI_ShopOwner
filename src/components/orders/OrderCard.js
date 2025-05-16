import { Card, Button, Tag, Divider } from "antd";
import { formatCurrency, formatDate } from "@/utils/formatters";

export default function OrderCard({ order, onCancel, onChangeState, onReview }) {
  const getStatusTag = (status) => {
    const statusConfig = {
      PENDING: { color: "blue", text: "Chờ xác nhận" },
      TRANSPORTING: { color: "orange", text: "Đang vận chuyển" },
      DELIVERED: { color: "green", text: "Đã giao" },
      SUCCEEDED: { color: "green", text: "Hoàn thành" },
      RETURNED: { color: "red", text: "Trả hàng" },
    };

    const config = statusConfig[status] || { color: "default", text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  return (
    <Card className="mb-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium">Đơn hàng #{order.orderId.substring(0, 8)}</h3>
          {getStatusTag(order.orderState)}
        </div>
        <span className="text-gray-500">
          {formatDate(order.createdAt)}
        </span>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div>
          <p className="text-gray-500">Người bán:</p>
          <p className="font-medium">{order.vendor?.shopName || order.vendor?.fullName}</p>
        </div>
        <div>
          <p className="text-gray-500">Địa chỉ nhận hàng:</p>
          <p>{order.deliveryAddress.recipientName}, {order.deliveryAddress.recipientPhone}</p>
          <p>{order.deliveryAddress.recipientAddress}</p>
        </div>
      </div>

      <Divider style={{ margin: '12px 0' }} />

      {order.orderDetails.map((item, index) => (
        <div key={index} className="flex justify-between items-center py-3">
          <div className="flex gap-4">
            <img 
              src={item.productImage} 
              alt={item.productName} 
              className="w-16 h-16 object-cover border"
            />
            <div>
              <h4 className="font-medium">{item.productName}</h4>
              <p className="text-gray-500">
                {item.firstCategory && `${item.firstCategory}, `}
                {item.secondCategory}
              </p>
              <p>Số lượng: {item.quantity}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium text-lg">{formatCurrency(item.price)}</p>
            {order.orderState === "DELIVERED" && onReview && (
              <Button 
                type="link" 
                onClick={() => onReview(item)}
                className="p-0"
              >
                Đánh giá
              </Button>
            )}
          </div>
        </div>
      ))}

      <Divider style={{ margin: '12px 0' }} />

      <div className="flex justify-between items-center">
        <div>
          <span className="text-gray-500">Tổng tiền:</span>
          <span className="font-medium text-lg ml-2">{formatCurrency(order.totalPrice)}</span>
        </div>
        <div className="space-x-4">
          {onCancel && (
            <Button type="primary" danger onClick={onCancel}>
              Hủy đơn hàng
            </Button>
          )}
          {onChangeState && (
            <Button type="primary" onClick={onChangeState}>
              Đã nhận hàng
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}