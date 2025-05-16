"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  message,
  Spin,
  Tabs,
  Form,
  Input,
  Button,
  Upload,
  DatePicker,
  Modal,
} from "antd";
import {
  LoadingOutlined,
  PlusOutlined,
  EditOutlined,
  SaveOutlined,
  UserOutlined,
  BankOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  LockOutlined,
  CreditCardOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "@ant-design/v5-patch-for-react-19";

const ProfilePage = () => {
  const { user, authState } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingPersonalInfo, setEditingPersonalInfo] = useState(false);
  const [editingBankInfo, setEditingBankInfo] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [personalForm] = Form.useForm();
  const [bankForm] = Form.useForm();
  const [addressForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Load user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.userId || !authState?.token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/users/customers/${user.userId}/info`,
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        setUserProfile(data);
        setImageUrl(data.imgUrl || null);

        // Split fullName into firstName and lastName
        let firstName = "",
          lastName = "";
        if (data.fullName) {
          const nameParts = data.fullName.split(" ");
          nameParts.reverse(); // Reverse the array to get last name first
          if (nameParts.length > 1) {
            firstName = nameParts.pop(); // Last part is the last name
            lastName = nameParts.join(" "); // The rest is the first name
          } else {
            firstName = data.fullName;
          }
        }

        // Initialize form with data
        personalForm.setFieldsValue({
          email: data.email,
          firstName: firstName,
          lastName: lastName,
          address:
            data.address?.find((addr) => addr.addressType === "DEFAULT")
              ?.recipientAddress || "",
           phoneNumber: data.phoneNumber,
        });

        if (data.bank) {
          bankForm.setFieldsValue({
            bankNumber: data.bank.bankNumber,
            dueDate: data.bank.dueDate ? dayjs(data.bank.dueDate) : null,
            ownerName: data.bank.ownerName,
            address: data.bank.address,
            zipCode: data.bank.zipCode,
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        message.error("Không thể tải thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, authState.token]);

  // Handle personal info form submission
  const handlePersonalInfoSubmit = async (values) => {
    try {
      // Combine firstName and lastName into fullName

      // Prepare the form data with file if there's an image change
      const formData = new FormData();
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("email", values.email);
      formData.append("phoneNumber", values.phoneNumber);

      // Handle avatar upload
      if (values.userImg?.file?.originFileObj instanceof File) {
        formData.append("userImg", values.userImg.file.originFileObj);
      }

      console.log("formData: ", formData);

      setUploading(true);

      // API call to update user info
      const response = await fetch(`/api/users/${user.userId}/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      // Get updated user data
      const updatedUser = await response.json();
      setUserProfile((prev) => ({
        ...prev,
        ...updatedUser,
        fullName: values.firstName + " " + values.lastName, // Update the fullName in the profile
      }));

      message.success("Cập nhật thông tin cá nhân thành công");
      setEditingPersonalInfo(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Cập nhật thông tin thất bại");
    } finally {
      setUploading(false);
    }
  };

  // Handle bank info form submission
  const handleBankInfoSubmit = async (values) => {
    try {
      const bankData = {
        bankNumber: values.bankNumber,
        dueDate: values.dueDate?.format("YYYY-MM-DD"),
        ownerName: values.ownerName,
        address: values.address,
        zipCode: values.zipCode,
      };

      const response = await fetch(`/api/users/customers/${user.userId}/bank-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
        body: JSON.stringify(bankData),
      });

      if (!response.ok) {
        throw new Error("Failed to update bank info");
      }
      const res = await fetch(`/api/users/customers/${user.userId}/info`, {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
        method: "GET",
      });
      const updatedBankInfo = await res.json();
      setUserProfile((prev) => ({
        ...prev,
        bank: updatedBankInfo.bank,
      }));
      message.success("Cập nhật thông tin ngân hàng thành công");
      setEditingBankInfo(false);
    } catch (error) {
      console.error("Error updating bank info:", error);
      message.error("Cập nhật thông tin ngân hàng thất bại");
    }
  };

  // Handle address form submission
  const handleAddressSubmit = async (values) => {
    try {
      const addressData = {
        recipientName: values.recipientName,
        recipientPhone: values.recipientPhone,
        recipientAddress: values.recipientAddress,
        isDefault: values.isDefault,
      };

      let url = `/api/users/customers/${user.userId}/create-address`;
      let method = "POST";

      // If editing existing address
      if (currentAddress?.addressId) {
        url = `/api/users/customers/${user.userId}/address/${currentAddress.addressId}/update`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
        body: JSON.stringify(addressData),
      });

      if (!response.ok) {
        throw new Error("Failed to save address");
      }

      // Refresh user profile to get updated addresses
      const refreshResponse = await fetch(
        `/api/users/customers/${user.userId}/info`,
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );

      if (refreshResponse.ok) {
        const updatedProfile = await refreshResponse.json();
        setUserProfile(updatedProfile);
      }

      message.success(
        currentAddress
          ? "Cập nhật địa chỉ thành công"
          : "Thêm địa chỉ mới thành công"
      );
      setAddressModalVisible(false);
      setCurrentAddress(null);
      addressForm.resetFields();
    } catch (error) {
      console.error("Error saving address:", error);
      message.error("Không thể lưu địa chỉ");
    }
  };

  // Handle address deletion
  const handleDeleteAddress = async (addressId) => {
    try {
      const response = await fetch(
        `/api/users/customers/${user.userId}/address/${addressId}/delete`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete address");
      }

      setUserProfile((prev) => ({
        ...prev,
        address: prev.address.filter((addr) => addr.addressId !== addressId),
      }));

      message.success("Xóa địa chỉ thành công");
    } catch (error) {
      console.error("Error deleting address:", error);
      message.error("Không thể xóa địa chỉ");
    }
  };

  // handle change password

  const handleChangePassword = async (values) => {
    try {
      const response = await fetch(
        `/api/users/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authState.token}`,
          },
          body: JSON.stringify({
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
            confirmPassword: values.confirmPassword,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to change password");
      }
      message.success("Đổi mật khẩu thành công");
    } catch (error) {
      console.error("Error changing password:", error);
      message.error("Đổi mật khẩu thất bại");
    }
  };

  // Handle edit address
  const handleEditAddress = (address) => {
    setCurrentAddress(address);
    addressForm.setFieldsValue({
      recipientName: address.recipientName,
      recipientPhone: address.recipientPhone,
      recipientAddress: address.recipientAddress,
      isDefault: address.addressType === "DEFAULT",
    });
    setAddressModalVisible(true);
  };

  const handleAddNewAddress = () => {
    setCurrentAddress(null);
    addressForm.resetFields();
    setAddressModalVisible(true);
  };

  // Handle set default address
  const handleSetDefaultAddress = async (addressId) => {

    const currentAddress = userProfile.address.find(
      (addr) => addr.addressId === addressId
    );

    const otherAddresses = userProfile.address.filter(  
      (addr) => addr.addressId !== addressId
    ).filter(addr => addr.addressType === "DEFAULT");

    
    if (otherAddresses.length > 0) {
      for(const addr of otherAddresses) {
        await fetch(
          `/api/users/customers/${user.userId}/address/${addr.addressId}/update`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authState.token}`,
            },
            body: JSON.stringify({ ...addr, addressType: "NORMAL" }),
          }
        );
      }
    }

    try {
      const response = await fetch(
        `/api/users/customers/${user.userId}/address/${addressId}/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authState.token}`,
          },
          body: JSON.stringify({...currentAddress, addressType: "DEFAULT" }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update default address");
      }

      // Update addresses in local state
      const updatedAddresses = userProfile.address.map((addr) => ({
        ...addr,
        addressType: addr.addressId === addressId ? "DEFAULT" : "NORMAL",
      }));

      setUserProfile((prev) => ({ ...prev, address: updatedAddresses }));
      message.success("Đã đặt địa chỉ mặc định");
    } catch (error) {
      console.error("Error setting default address:", error);
      message.error("Không thể đặt địa chỉ mặc định");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold text-red-500">
          Không thể tải thông tin người dùng
        </h2>
        <p className="mt-2">Vui lòng đăng nhập để xem thông tin cá nhân</p>
      </div>
    );
  }

  const tabItems = [
    {
      key: "personal",
      label: "Thông tin cá nhân",
      children: (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Thông tin cá nhân</h2>
            <Button
              type={editingPersonalInfo ? "primary" : "default"}
              icon={editingPersonalInfo ? <SaveOutlined /> : <EditOutlined />}
              onClick={() => {
                if (editingPersonalInfo) {
                  personalForm.submit();
                } else {
                  setEditingPersonalInfo(true);
                }
              }}
            >
              {editingPersonalInfo ? "Lưu" : "Sửa"}
            </Button>
          </div>

          <Form
            form={personalForm}
            layout="vertical"
            onFinish={handlePersonalInfoSubmit}
            disabled={!editingPersonalInfo}
          >
            <Form.Item name="userImg" hidden>
              <Input />
            </Form.Item>

            <Form.Item
              label="Họ"
              name="firstName"
              rules={[{ required: true, message: "Vui lòng nhập họ" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Nhập họ" />
            </Form.Item>

            <Form.Item
              label="Tên"
              name="lastName"
              rules={[{ required: true, message: "Vui lòng nhập tên" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Nhập tên" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Nhập email" />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phoneNumber"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
              ]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="Nhập số điện thoại"
              />
            </Form.Item>

            <Form.Item className="mb-0">
              {editingPersonalInfo && (
                <Button
                  type="default"
                  onClick={() => {
                    personalForm.resetFields();
                    setEditingPersonalInfo(false);
                  }}
                  className="mr-2"
                >
                  Hủy
                </Button>
              )}
            </Form.Item>
          </Form>
        </div>
      ),
    },
    {
      key: "bank",
      label: "Tài khoản ngân hàng",
      children: (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Thông tin tài khoản ngân hàng
            </h2>
            <Button
              type={editingBankInfo ? "primary" : "default"}
              icon={editingBankInfo ? <SaveOutlined /> : <EditOutlined />}
              onClick={() => {
                if (editingBankInfo) {
                  bankForm.submit();
                } else {
                  setEditingBankInfo(true);
                }
              }}
            >
              {editingBankInfo ? "Lưu" : "Sửa"}
            </Button>
          </div>

          <Form
            form={bankForm}
            layout="vertical"
            onFinish={handleBankInfoSubmit}
            disabled={!editingBankInfo}
          >
            <Form.Item
              label="Số tài khoản ngân hàng"
              name="bankNumber"
              rules={[
                { required: true, message: "Vui lòng nhập số tài khoản" },
              ]}
            >
              <Input
                prefix={<CreditCardOutlined />}
                placeholder="Nhập số tài khoản"
              />
            </Form.Item>

            <Form.Item
              label="Ngày hết hạn"
              name="dueDate"
              rules={[
                { required: true, message: "Vui lòng chọn ngày hết hạn" },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="DD-MM-YYYY"
                placeholder="Chọn ngày hết hạn"
                prefix={<CalendarOutlined />}
              />
            </Form.Item>

            <Form.Item
              label="Tên chủ tài khoản"
              name="ownerName"
              rules={[
                { required: true, message: "Vui lòng nhập tên chủ tài khoản" },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Nhập tên chủ tài khoản"
              />
            </Form.Item>

            <Form.Item
              label="Địa chỉ ngân hàng và tên ngân hàng"
              name="address"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập địa chỉ và tên ngân hàng",
                },
              ]}
            >
              <Input.TextArea
                placeholder="VD: Ngân hàng BIDV - Chi nhánh Quận 1"
                autoSize={{ minRows: 2, maxRows: 4 }}
              />
            </Form.Item>

            <Form.Item
              label="Mã ZIP"
              name="zipCode"
              rules={[{ required: true, message: "Vui lòng nhập mã ZIP" }]}
            >
              <Input placeholder="Nhập mã ZIP" />
            </Form.Item>

            <Form.Item className="mb-0">
              {editingBankInfo && (
                <Button
                  type="default"
                  onClick={() => {
                    bankForm.resetFields();
                    setEditingBankInfo(false);
                  }}
                  className="mr-2"
                >
                  Hủy
                </Button>
              )}
            </Form.Item>
          </Form>

          {!userProfile.bank && !editingBankInfo && (
            <div className="text-center py-6">
              <BankOutlined
                style={{ fontSize: 48 }}
                className="text-gray-300 mb-3"
              />
              <p className="text-gray-500">
                Bạn chưa thêm thông tin tài khoản ngân hàng
              </p>
              <Button
                type="primary"
                className="mt-3"
                onClick={() => setEditingBankInfo(true)}
              >
                Thêm tài khoản ngân hàng
              </Button>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "addresses",
      label: "Địa chỉ",
      children: (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Địa chỉ giao hàng</h2>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddNewAddress}
            >
              Thêm địa chỉ mới
            </Button>
          </div>

          {userProfile.address && userProfile.address.length > 0 ? (
            <div className="space-y-4">
              {userProfile.address.map((address) => (
                <div
                  key={address.addressId}
                  className={`border rounded-md p-4 ${
                    address.addressType === "DEFAULT"
                      ? "border-blue-500 bg-blue-50"
                      : ""
                  }`}
                >
                  <div className="flex justify-between mb-2">
                    <div className="flex gap-2 items-center">
                      <span className="font-medium">
                        {address.recipientName}
                      </span>
                      <span className="text-gray-500">|</span>
                      <span>{address.recipientPhone}</span>
                    </div>
                    {address.addressType === "DEFAULT" && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        Mặc định
                      </span>
                    )}
                  </div>

                  <p className="text-gray-700">{address.recipientAddress}</p>

                  <div className="flex justify-end gap-2 mt-3">
                    {address.addressType !== "DEFAULT" && (
                      <Button
                        type="text"
                        className="text-blue-500"
                        onClick={() =>
                          handleSetDefaultAddress(address.addressId)
                        }
                      >
                        Đặt làm mặc định
                      </Button>
                    )}
                    <Button
                      type="text"
                      className="text-blue-500"
                      icon={<EditOutlined />}
                      onClick={() => handleEditAddress(address)}
                    >
                      Sửa
                    </Button>
                    {address.addressType !== "DEFAULT" && (
                      <Button
                        type="text"
                        danger
                        onClick={() => handleDeleteAddress(address.addressId)}
                      >
                        Xóa
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <EnvironmentOutlined
                style={{ fontSize: 48 }}
                className="text-gray-300 mb-3"
              />
              <p className="text-gray-500">
                Bạn chưa thêm địa chỉ giao hàng nào
              </p>
              <Button
                type="primary"
                className="mt-3"
                onClick={handleAddNewAddress}
              >
                Thêm địa chỉ mới
              </Button>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "password",
      label: "Đổi mật khẩu",
      children: (
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Đổi mật khẩu</h2>
          </div>

          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={handleChangePassword}
          >
            <Form.Item
              label="Mật khẩu hiện tại"
              name="currentPassword"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu hiện tại" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập mật khẩu hiện tại"
              />
            </Form.Item>

            <Form.Item
              label="Mật khẩu mới"
              name="newPassword"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu mới" },
                { min: 1, message: "Mật khẩu phải có ít nhất 8 ký tự" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập mật khẩu mới"
              />
            </Form.Item>

            <Form.Item
              label="Xác nhận mật khẩu mới"
              name="confirmPassword"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Hai mật khẩu không khớp!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Xác nhận mật khẩu mới"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Cập nhật mật khẩu
              </Button>
            </Form.Item>
          </Form>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left sidebar */}
        <div className="w-full md:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <img
                src={imageUrl || "/images/avatar1.jpg"}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
              {editingPersonalInfo && (
                <Upload
                  name="avatar"
                  accept="image/*" // Chỉ chấp nhận file ảnh
                  listType="picture-circle"
                  className="absolute inset-0 opacity-0 hover:opacity-50 flex justify-center items-center bg-black bg-opacity-20 rounded-full cursor-pointer"
                  showUploadList={false}
                  beforeUpload={(file) => {
                    // Kiểm tra kích thước file (ví dụ: tối đa 2MB)
                    const isLt2M = file.size / 1024 / 1024 < 6;
                    if (!isLt2M) {
                      message.error("Ảnh phải nhỏ hơn 6MB!");
                      return Upload.LIST_IGNORE; // Ngăn không cho upload
                    }

                    // Kiểm tra loại file
                    const isImage = file.type.startsWith("image/");
                    if (!isImage) {
                      message.error("Chỉ được upload file ảnh!");
                      return Upload.LIST_IGNORE;
                    }

                    return false; // Ngăn không cho tự động upload
                  }}
                  onChange={(info) => {
                    console.log("info: ", info);
                    const { status, file } = info;

                    if (status === "uploading") {
                      setUploading(true);
                      return;
                    }

                    // Xử lý khi không có originFileObj
                    const fileObj = file.originFileObj || file; // Sử dụng file nếu không có originFileObj

                    if (!fileObj) {
                      console.error("No valid file object available");
                      setUploading(false);
                      return;
                    }

                    // Tạo preview từ file object
                    const reader = new FileReader();

                    reader.onload = (e) => {
                      setImageUrl(e.target.result);
                      setUploading(false);
                    };

                    reader.onerror = () => {
                      console.error("File reading failed");
                      setUploading(false);
                    };

                    // Kiểm tra nếu fileObj là Blob (có thể đọc trực tiếp)
                    if (fileObj instanceof Blob) {
                      reader.readAsDataURL(fileObj);
                    }
                    // Trường hợp file object không phải Blob (hiếm khi xảy ra)
                    else {
                      try {
                        // Tạo Blob từ dữ liệu file nếu cần
                        const blob = new Blob([fileObj], {
                          type: file.type || "image/jpeg",
                        });
                        reader.readAsDataURL(blob);
                      } catch (error) {
                        console.error("Error creating blob:", error);
                        setUploading(false);
                      }
                    }

                    // Cập nhật form với thông tin file
                    if (personalForm) {
                      personalForm.setFieldsValue({
                        userImg: {
                          file: {
                            ...file, // Giữ nguyên tất cả thông tin gốc
                            originFileObj: fileObj, // Thêm originFileObj nếu cần
                            name: file.name,
                            uid: file.uid,
                            size: file.size,
                            type: file.type,
                          },
                        },
                      });
                    }
                  }}
                >
                  <div>
                    <PlusOutlined />
                    <div className="mt-1">Upload</div>
                  </div>
                </Upload>
              )}
            </div>

            <h2 className="text-2xl font-semibold">{userProfile.fullName}</h2>
            <p className="text-gray-500 mb-4">{userProfile.username}</p>

            <div className="text-left mb-4 space-y-2">
              <div className="flex items-center">
                <MailOutlined className="mr-2 text-gray-400" />
                <span>{userProfile.email}</span>
              </div>
              <div className="flex items-center">
                <PhoneOutlined className="mr-2 text-gray-400" />
                <span>
                  {user.phoneNumber || "Chưa cập nhật"}
                </span>
              </div>
              <div className="flex items-center">
                <EnvironmentOutlined className="mr-2 text-gray-400" />
                <span>
                  {userProfile.address?.find(
                    (addr) => addr.addressType === "DEFAULT"
                  )?.recipientAddress || "Chưa cập nhật"}
                </span>
              </div>
            </div>

            <div className="border-t pt-4 mt-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Thành viên từ:</span>
                <span className="font-medium">
                  {new Date(userProfile.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-500">Số lượng đơn hàng:</span>
                <span className="font-medium">
                  {userProfile.orderCount || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="w-full md:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <Tabs items={tabItems} />
          </div>
        </div>
      </div>

      {/* Address Modal */}
      <Modal
        title={currentAddress ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}
        open={addressModalVisible}
        onCancel={() => setAddressModalVisible(false)}
        footer={null}
      >
        <Form
          form={addressForm}
          layout="vertical"
          onFinish={handleAddressSubmit}
        >
          <Form.Item
            label="Tên người nhận"
            name="recipientName"
            rules={[
              { required: true, message: "Vui lòng nhập tên người nhận" },
            ]}
          >
            <Input placeholder="Nhập tên người nhận" />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="recipientPhone"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="recipientAddress"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
          >
            <Input.TextArea placeholder="Nhập địa chỉ chi tiết" rows={3} />
          </Form.Item>

          <Form.Item name="isDefault" valuePropName="checked">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isDefault"
                className="mr-2"
                onChange={(e) => {
                  addressForm.setFieldsValue({ isDefault: e.target.checked });
                }}
              />
              <label htmlFor="isDefault">Đặt làm địa chỉ mặc định</label>
            </div>
          </Form.Item>

          <div className="flex justify-end gap-2">
            <Button onClick={() => setAddressModalVisible(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit">
              {currentAddress ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfilePage;
