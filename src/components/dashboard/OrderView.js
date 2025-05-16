'use client'

import React, { useState, useEffect } from 'react';
import { orderApi } from '@/services/api/order';
import { useAuth } from '@/context/AuthContext';
import { Table, Tabs, Tag, Button, Pagination, message, Modal, Descriptions, Empty } from 'antd';
import '@ant-design/v5-patch-for-react-19';

const ORDER_STATES = [
  { key: 'PENDING', label: 'Chờ xử lý' },
  { key: 'TRANSPORTING', label: 'Đang vận chuyển' },
  { key: 'DELIVERED', label: 'Đã giao hàng' },
  { key: 'SUCCEEDED', label: 'Hoàn thành' },
  { key: 'RETURNED', label: 'Trả hàng' },
];

export default function OrderView() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('PENDING');
  const [pagination, setPagination] = useState({ page: 1, size: 10, total: 0 });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { authState, user } = useAuth();

  // Fetch orders with pagination and filtering
  const fetchOrders = async (orderState = activeTab, page = 1, size = pagination.size) => {
    setLoading(true);
    setError(null);
    try {
      const res = await orderApi.getVendorOrders(
        user.userId,
        authState.token,
        { orderState, page: page - 1, size },
      );
      console.log('Fetched orders:', res);
      setOrders(res.content || []);
      setPagination({
        page: (res.pageable?.pageNumber || 0) + 1,
        size: res.pageable?.pageSize || size,
        total: res.totalElements || 0,
      });
    } catch (err) {
      setError(err.message || 'Lỗi khi tải đơn hàng');
      setOrders([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (authState.token && user?.userId) {
      fetchOrders(activeTab, 1, pagination.size);
    }
    // eslint-disable-next-line
  }, [authState.token, user, activeTab]);

  // Handle tab change (orderState)
  const handleTabChange = (key) => {
    setActiveTab(key);
    fetchOrders(key, 1, pagination.size);
  };

  // Handle pagination change
  const handlePageChange = (page, pageSize) => {
    fetchOrders(activeTab, page, pageSize);
  };

  // Handle printing order
  const handlePrintOrder = (order) => {


  };

  // Handle order confirmation
  const handleConfirmOrder = async (orderId) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/handle-success`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Lỗi khi xác nhận đơn hàng');
      }

      message.success('Đã xác nhận đơn hàng thành công');
      fetchOrders();
    } catch (err) {
      message.error(err.message || 'Lỗi khi xác nhận đơn hàng');
    }
  };

  // Vendor actions
  const handleProcessOrder = async (orderId) => {
    try {
      // await orderApi.updateOrderStatus(orderId, 'TRANSPORTING', authState.token);
      message.success('Đã xử lý đơn hàng');
      fetchOrders();
    } catch (err) {
      message.error('Lỗi khi xử lý đơn hàng');
    }
  };
  const handleCancelOrder = async (orderId) => {
    Modal.confirm({
      title: 'Xác nhận hủy đơn hàng',
      content: 'Bạn có chắc chắn muốn hủy đơn hàng này?',
      onOk: async () => {
        try {
          await orderApi.updateOrderStatus(orderId, 'CANCELLED', authState.token);
          message.success('Đã hủy đơn hàng');
          fetchOrders();
        } catch (err) {
          message.error('Lỗi khi hủy đơn hàng');
        }
      },
    });
  };
  const handleMarkPaid = async (orderId) => {
    try {
      await orderApi.updateOrderStatus(orderId, 'SUCCEEDED', authState.token);
      message.success('Đã xác nhận nhận tiền');
      fetchOrders();
    } catch (err) {
      message.error('Lỗi khi xác nhận nhận tiền');
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (id) => <span className="font-mono">{id?.slice(0, 8)}</span>,
    },
    {
      title: 'Người nhận',
      dataIndex: 'deliveryAddress',
      key: 'recipientName',
      render: (deliveryAddress) => deliveryAddress?.recipientName || '-',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (v) => `₫${(v || 0).toLocaleString()}`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'orderState',
      key: 'orderState',
      render: (state) => {
        const colorMap = {
          PENDING: 'blue',
          TRANSPORTING: 'orange',
          DELIVERED: 'green',
          SUCCEEDED: 'gold',
          RETURNED: 'red',
        };
        const label = ORDER_STATES.find((s) => s.key === state)?.label || state;
        return <Tag color={colorMap[state] || 'default'}>{label}</Tag>;
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => date ? new Date(date).toLocaleString('vi-VN') : '-',
    },
    {
      title: 'Hành động',
      key: 'actions', render: (_, order) => {
        if (order.orderState === 'PENDING') {
          return <>
            <Button type="primary" size="small" className="mr-2">Xử lý đơn hàng</Button>
            <Button danger size="small" onClick={() => handleCancelOrder(order.orderId)}>Hủy đơn hàng</Button>
          </>;
        }
        if (order.orderState === 'DELIVERED') {
          return <Button type="primary" size="small" onClick={() => handleConfirmOrder(order.orderId)}>Đã nhận được tiền</Button>;
        }
        return null;
      },
    },
  ];

  // Row click: show order details
  const onRow = (record) => ({
    onClick: () => {
      setSelectedOrder(record);
      setModalVisible(true);
    },
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Quản lý đơn hàng</h1>
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        items={ORDER_STATES.map((s) => ({ key: s.key, label: s.label }))}
        className="mb-4"
      />
      <div className="bg-white rounded-lg shadow p-6">
        <Table
          columns={columns}
          dataSource={orders}
          loading={loading}
          rowKey="orderId"
          pagination={false}
          onRow={onRow}
          locale={{ emptyText: error ? <span className="text-red-500">{error}</span> : <Empty description="Không có đơn hàng" /> }}
        />
        <div className="flex justify-end mt-4">
          <Pagination
            current={pagination.page}
            pageSize={pagination.size}
            total={pagination.total}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      </div>
      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        title={`Chi tiết đơn hàng #${selectedOrder?.orderId?.slice(0, 8)}`}
        footer={
          selectedOrder && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="default">In đơn hàng</Button>
              {selectedOrder.orderState === 'PENDING' && (
                <Button type="primary" className="ml-2" onClick={() => {
                  handleConfirmOrder(selectedOrder.orderId);
                  setModalVisible(false);
                }}>Xác nhận đơn hàng</Button>
              )}
            </div>
          )
        }
        width={600}
      >
        {selectedOrder && (
          <Descriptions bordered column={1} size="middle">
            <Descriptions.Item label="Người nhận">{selectedOrder.deliveryAddress?.recipientName || '-'}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{selectedOrder.deliveryAddress?.recipientPhone || '-'}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ giao hàng">{selectedOrder.deliveryAddress?.recipientAddress || '-'}</Descriptions.Item>
            <Descriptions.Item label="Tổng tiền">₫{(selectedOrder.totalPrice || 0).toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag>{ORDER_STATES.find(s => s.key === selectedOrder.orderState)?.label || selectedOrder.orderState}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">{selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString('vi-VN') : '-'}</Descriptions.Item>
            <Descriptions.Item label="Sản phẩm">
              <ul className="pl-4 list-disc">
                {selectedOrder.orderDetails?.map((item, idx) => (
                  <li key={idx}>
                    {item.productName} x {item.quantity} ({item.firstCategory}{item.secondCategory ? ', ' + item.secondCategory : ''})
                  </li>
                ))}
              </ul>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}