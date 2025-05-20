"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Spin, message, Button, Input, Form } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import "@ant-design/v5-patch-for-react-19";

const SellerManagementView = () => {
  const { user, authState } = useAuth();
  const [shopData, setShopData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form] = Form.useForm();

  // Fetch shop info on mount
  useEffect(() => {
    const fetchShop = async () => {
      if (!user?.userId || !authState?.token) {
        setLoading(false);
        setError("Bạn chưa đăng nhập.");
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/users/vendors/${user.userId}/info`, {
          headers: { Authorization: `Bearer ${authState.token}` },
        });
        
        const text = await res.text();
        if (text.trim().startsWith("<!DOCTYPE html") || text.trim().startsWith("<html")) {
          if (res.status === 401 || res.status === 403 || (res.status >= 300 && res.status < 400)) {
            window.location.href = "/login";
            return;
          } else {
            setError("Phiên đăng nhập đã hết hoặc có lỗi hệ thống. Vui lòng đăng nhập lại.");
            setLoading(false);
            return;
          }
        }
        
        let data;
        try {
          data = text ? JSON.parse(text) : null;
        } catch (e) {
          setError("Dữ liệu shop trả về không phải JSON hợp lệ. Nội dung: " + text);
          setLoading(false);
          return;
        }
        
        if (!res.ok) throw new Error((data && data.message) || "Không thể tải thông tin shop");
        if (!data || typeof data !== 'object') {
          setError("API trả về dữ liệu rỗng hoặc không hợp lệ. Nội dung: " + text);
          setLoading(false);
          return;
        }
        
        setShopData(data);
        // Initialize form with data
        form.setFieldsValue({
          shopName: data.shopName || `Shop của ${data.fullName || data.username}`,
          shopDescription: data.shopDescription || "Chưa có mô tả",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchShop();
  }, [user, authState.token, form]);

  const handleSave = async (values) => {
    if (!user?.userId || !authState?.token) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/vendors/${user.userId}/shop`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
        body: JSON.stringify(values),
      });
      
      const text = await res.text();
      if (text.trim().startsWith("<!DOCTYPE html") || text.trim().startsWith("<html")) {
        if (res.status === 401 || res.status === 403 || (res.status >= 300 && res.status < 400)) {
          window.location.href = "/login";
          return;
        } else {
          throw new Error("Phiên đăng nhập đã hết hoặc có lỗi hệ thống. Vui lòng đăng nhập lại.");
        }
      }
      
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        throw new Error("Dữ liệu trả về không hợp lệ");
      }
      
      if (!res.ok) throw new Error(data.message || "Cập nhật thất bại");
      setShopData(data);
      form.setFieldsValue({
        shopName: data.shopName || `Shop của ${data.fullName || data.username}`,
        shopDescription: data.shopDescription || "Chưa có mô tả",
      });
      message.success("Cập nhật thành công");
    } catch (err) {
      setError(err.message);
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center text-red-500 py-8">{error}</div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8 mt-8">
      <div className="flex items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Quản lý Shop</h1>
          <p className="text-gray-500 text-sm">Cập nhật thông tin shop của bạn</p>
        </div>
      </div>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
      >
        <Form.Item
          label="Tên shop"
          name="shopName"
          rules={[{ required: true, message: "Vui lòng nhập tên shop" }]}
        >
          <Input className="font-semibold text-lg" placeholder="Tên shop" />
        </Form.Item>
        
        <Form.Item
          label="Mô tả shop"
          name="shopDescription"
          rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
        >
          <Input.TextArea rows={3} placeholder="Mô tả shop" />
        </Form.Item>
        
        <div className="flex gap-2 mt-4">
          <Button icon={<SaveOutlined />} htmlType="submit" type="primary">
            Lưu thay đổi
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default SellerManagementView;