"use client";
import { useAuth } from '@/context/AuthContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Modal, Form, Input, Button, Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import '@ant-design/v5-patch-for-react-19';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardHomePage() {

  const {user, authState} = useAuth();
  const [isVendor, setIsVendor] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Form state for shop registration
  const [form] = Form.useForm();
  const [shopImage, setShopImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchVendorData = async () => {
    if (!user?.userId || !authState.token) return;

    try {
      const response = await fetch(`/api/users/vendors/${user.userId}/info`, {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch vendor data');
      }

      const data = await response.json();
      console.log('Fetched vendor data:', data);
      if (data.shopName == null){
        setIsVendor(false);
      }
      // return data;
    } catch (error) {
      console.error('Error fetching vendor data:', error);
    }
  }

  useEffect(() => {
    if (!user){
      return;
    }
    fetchVendorData();
  },[user]);

  useEffect(() => {
    if (!isVendor){
      setShowModal(true);
    }
    console.log('isVendor:', isVendor);
  }, [isVendor]);

  // Handle shop image upload
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return false;
    }
    
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
      return false;
    }
    return false; // Return false to prevent auto-upload
  };

  const handleImageChange = (info) => {
    if (info.file) {
      setShopImage(info.file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result);
        
        // Upload image immediately after selection
        uploadShopImage(info.file);
      };
      reader.readAsDataURL(info.file);
    }
  };

  const uploadShopImage = async (imageFile) => {
    if (!imageFile) return;
    
    // Create FormData for sending file only
    const formData = new FormData();
    formData.append('shopImage', imageFile);
    
    console.log('Uploading shop image...');
    
    // Simulated image upload success
    setTimeout(() => {
      console.log('Shop image uploaded successfully!');
      message.success('Ảnh cửa hàng đã được tải lên');
    }, 1000);
    
    // Commented real API call for image upload
    // try {
    //   const response = await fetch('/api/vendor/upload-image', {
    //     method: 'POST',
    //     headers: {
    //       Authorization: `Bearer ${authState.token}`,
    //     },
    //     body: formData, // Using FormData for file upload
    //   });
    //
    //   if (!response.ok) throw new Error('Failed to upload image');
    //   const result = await response.json();
    //   console.log('Image upload result:', result);
    //   message.success('Ảnh cửa hàng đã được tải lên');
    // } catch (error) {
    //   console.error('Error uploading shop image:', error);
    //   message.error('Không thể tải lên ảnh. Vui lòng thử lại.');
    // }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </div>
  );

  // Handle form submission
  const handleSubmit = async (values) => {
    if (!shopImage) {
      message.error('Vui lòng tải lên hình ảnh cửa hàng');
      return;
    }
    
    setLoading(true);

    try {
      // Create JSON data object for shop info (not FormData)
      const shopData = {
        shopName: values.shopName,
        shopDescription: values.shopDescription
      };

      console.log('Shop data to send:', shopData);

      await fetch(`/api/users/vendors/${user.userId}/become-vendor`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authState.token}`,
          "Content-Type": "application/json",
        },
      })

      // Real API call would be:
      const response = await fetch(`/api/users/vendors/${user.userId}/shop-update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`,
        },
        body: JSON.stringify(shopData), // Using JSON for data
      });
      //
      if (!response.ok) throw new Error('Failed to register shop');
      const result = await response.json();
      message.success('Đăng ký cửa hàng thành công!');
      setIsVendor(true);
      setShowModal(false);
      setLoading(false);
      
    } catch (error) {
      console.error('Error registering shop:', error);
      message.error('Đã xảy ra lỗi khi đăng ký cửa hàng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const businessOverview = {
    revenue: 18300,
  };

  const inventoryOverview = {
    total_stock: 868,
    delivered: 200,
  };

  const voucherOverview = {
    total_vouchers: 50,
  };

  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Số lượng sản phẩm bán ra',
        data: [480, 470, 520, 420, 430, 400, 470, 420, 430, 420, 450, 460],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Revenue Overview */}
      <div className="col-span-4 bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-medium mb-4 text-black">Doanh thu</h2>
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 p-3 rounded">
            <i className="fas fa-chart-line text-purple-500"></i>
          </div>
          <div>
            <div className="text-lg font-medium text-green-600">đ {businessOverview.revenue}</div>
            <div className="text-sm text-black">Tổng doanh thu</div>
          </div>
        </div>
      </div>

      {/* Inventory Overview */}
      <div className="col-span-4 bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-medium mb-4 text-black">Tổng quan kho hàng</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-3 rounded">
              <i className="fas fa-box text-orange-500"></i>
            </div>
            <div>
              <div className="text-lg font-medium text-black">{inventoryOverview.total_stock}</div>
              <div className="text-sm text-black">Số lượng tồn kho</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-3 rounded">
              <i className="fas fa-truck text-indigo-500"></i>
            </div>
            <div>
              <div className="text-lg font-medium text-black">{inventoryOverview.delivered}</div>
              <div className="text-sm text-black">Số lượng đã giao</div>
            </div>
          </div>
        </div>
      </div>

      {/* Voucher Overview */}
      <div className="col-span-4 bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-medium mb-4 text-black">Tổng quan voucher</h2>
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-3 rounded">
            <i className="fas fa-ticket-alt text-blue-500"></i>
          </div>
          <div>
            <div className="text-lg font-medium text-black">{voucherOverview.total_vouchers}</div>
            <div className="text-sm text-black">Số lượng voucher hiện có</div>
          </div>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="col-span-12 bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-medium mb-4 text-black">Số lượng sản phẩm bán ra trong năm</h2>
        <div className="h-[300px]">
          <Bar
            data={salesData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.1)',
                  },
                },
                x: {
                  grid: {
                    display: false,
                  },
                },
              },
              plugins: {
                legend: {
                  position: 'bottom',
                },
              },
            }}
          />
        </div>
      </div>

      {/* Shop Registration Modal */}
      <Modal
        title="Đăng ký thông tin cửa hàng"
        open={showModal}
        onCancel={() => {}} // Empty function to prevent closing by pressing Escape/clicking outside
        footer={null}
        closable={false} // Prevent the "X" close button
        maskClosable={false} // Prevent closing by clicking outside
        centered
      >
        <div className="py-4">
          <p className="mb-6 text-gray-600">
            Vui lòng cung cấp thông tin về cửa hàng của bạn để tiếp tục sử dụng dịch vụ.
          </p>
          
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="shopName"
              label="Tên cửa hàng"
              rules={[{ required: true, message: 'Vui lòng nhập tên cửa hàng' }]}
            >
              <Input placeholder="Nhập tên cửa hàng của bạn" />
            </Form.Item>
            
            <Form.Item
              name="shopDescription"
              label="Mô tả cửa hàng"
              rules={[{ required: true, message: 'Vui lòng nhập mô tả cửa hàng' }]}
            >
              <Input.TextArea 
                placeholder="Mô tả ngắn về cửa hàng của bạn" 
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
            </Form.Item>
            
            <Form.Item
              label="Ảnh cửa hàng"
              required
              rules={[{ required: true, message: 'Vui lòng tải lên ảnh cửa hàng' }]}
            >
              <Upload
                name="shopImage"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={handleImageChange}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="shop" style={{ width: '100%' }} />
                ) : (
                  uploadButton
                )}
              </Upload>
              <div className="text-xs text-gray-500 mt-1">
                Tải lên hình ảnh đại diện cho cửa hàng của bạn (tối đa 2MB)
              </div>
            </Form.Item>
            
            <Form.Item className="mt-6">
              <Button 
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Đăng ký cửa hàng
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
}