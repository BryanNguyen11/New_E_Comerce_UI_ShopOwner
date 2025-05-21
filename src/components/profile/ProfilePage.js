// "use client";

// import React, { useState, useEffect } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { message, Spin, Tabs, Form, Input, Button, Upload, Select, List, Popconfirm, DatePicker, InputNumber } from "antd";
// import {
//   LoadingOutlined,
//   PlusOutlined,
//   EditOutlined,
//   SaveOutlined,
//   UserOutlined,
//   MailOutlined,
//   PhoneOutlined,
//   LockOutlined,
//   BankOutlined,
//   HomeOutlined,
//   DeleteOutlined,
// } from "@ant-design/icons";
// import "@ant-design/v5-patch-for-react-19";
// import moment from "moment";

// const { Option } = Select;

// const ProfilePage = () => {
//   const { user, authState, refreshToken } = useAuth();
//   const [userProfile, setUserProfile] = useState(null);
//   const [userType, setUserType] = useState(null); 
//   const [loading, setLoading] = useState(true);
//   const [editingPersonalInfo, setEditingPersonalInfo] = useState(false);
//   const [personalForm] = Form.useForm();
//   const [passwordForm] = Form.useForm();
//   const [bankForm] = Form.useForm();
//   const [addressForm] = Form.useForm();
//   const [imageUrl, setImageUrl] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [addresses, setAddresses] = useState([]);
//   const [editingAddressId, setEditingAddressId] = useState(null);

//   // Load user profile and addresses
//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       if (!user?.userId || !authState?.token) {
//         // Use user data as fallback
//         if (user) {
//           setUserProfile({
//             userId: user.userId,
//             fullName: user.fullName || "",
//             username: user.username || "",
//             email: user.email || "",
//             phoneNumber: user.phoneNumber || "",
//             createdAt: user.createdAt || new Date().toISOString(),
//             orderCount: 0,
//             address: [],
//             bank: null,
//           });
//           setImageUrl(user.imgUrl || null);
//           setAddresses(user.address || []);
//           const nameParts = user.fullName ? user.fullName.split(" ") : ["", ""];
//           personalForm.setFieldsValue({
//             email: user.email,
//             firstName: nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : "",
//             lastName: nameParts.length > 1 ? nameParts[nameParts.length - 1] : user.fullName,
//             phoneNumber: user.phoneNumber,
//           });
//           bankForm.setFieldsValue({
//             bankNumber: user.bank?.bankNumber || "",
//             dueDate: user.bank?.dueDate ? moment(user.bank.dueDate) : null,
//             ownerName: user.bank?.ownerName || "",
//             address: user.bank?.address || "",
//             zipCode: user.bank?.zipCode || null,
//           });
//         }
//         setLoading(false);
//         return;
//       }

//       const endpoints = [
//         { type: "customer", url: `/api/users/customers/${user.userId}` },
//         { type: "vendor", url: `/api/users/vendors/${user.userId}` },
//         { type: "user", url: `/api/users/${user.userId}` },
//       ];

//       let fetchedProfile = null;
//       let fetchedType = null;

//       for (const { type, url } of endpoints) {
//         try {
//           const response = await fetch(url, {
//             headers: {
//               Authorization: `Bearer ${authState.token}`,
//             },
//           });

//           if (response.ok) {
//             const data = await response.json();
//             fetchedProfile = data;
//             fetchedType = type;
//             break;
//           } else {
//             const errorText = await response.text();
//             console.error(`API Error (${type}):`, response.status, errorText);
//           }
//         } catch (error) {
//           console.error(`Error fetching ${type} profile:`, error);
//         }
//       }

//       if (fetchedProfile) {
//         setUserProfile(fetchedProfile);
//         setUserType(fetchedType);
//         setImageUrl(fetchedProfile.imgUrl || user.imgUrl || null);
//         setAddresses(fetchedProfile.address || []);

//         let firstName = "",
//           lastName = "";
//         if (fetchedProfile.fullName) {
//           const nameParts = fetchedProfile.fullName.split(" ");
//           if (nameParts.length > 1) {
//             firstName = nameParts.slice(0, -1).join(" ");
//             lastName = nameParts[nameParts.length - 1];
//           } else {
//             firstName = fetchedProfile.fullName;
//           }
//         }

//         personalForm.setFieldsValue({
//           email: fetchedProfile.email || user.email,
//           firstName,
//           lastName,
//           phoneNumber: fetchedProfile.phoneNumber || user.phoneNumber,
//         });
//         bankForm.setFieldsValue({
//           bankNumber: fetchedProfile.bank?.bankNumber || "",
//           dueDate: fetchedProfile.bank?.dueDate ? moment(fetchedProfile.bank.dueDate) : null,
//           ownerName: fetchedProfile.bank?.ownerName || "",
//           address: fetchedProfile.bank?.address || "",
//           zipCode: fetchedProfile.bank?.zipCode || null,
//         });
//       } else {
//         // Fallback to user data
//         message.error("Không thể tải thông tin hồ sơ từ server");
//         if (user) {
//           setUserProfile({
//             userId: user.userId,
//             fullName: user.fullName || "",
//             username: user.username || "",
//             email: user.email || "",
//             phoneNumber: user.phoneNumber || "",
//             createdAt: user.createdAt || new Date().toISOString(),
//             orderCount: 0,
//             address: [],
//             bank: null,
//           });
//           setImageUrl(user.imgUrl || null);
//           setAddresses(user.address || []);
//           const nameParts = user.fullName ? user.fullName.split(" ") : ["", ""];
//           personalForm.setFieldsValue({
//             email: user.email,
//             firstName: nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : "",
//             lastName: nameParts.length > 1 ? nameParts[nameParts.length - 1] : user.fullName,
//             phoneNumber: user.phoneNumber,
//           });
//           bankForm.setFieldsValue({
//             bankNumber: user.bank?.bankNumber || "",
//             dueDate: user.bank?.dueDate ? moment(user.bank.dueDate) : null,
//             ownerName: user.bank?.ownerName || "",
//             address: user.bank?.address || "",
//             zipCode: user.bank?.zipCode || null,
//           });
//         }
//       }

//       setLoading(false);
//     };

//     fetchUserProfile();
//   }, [user, authState?.token, personalForm, bankForm]);

//   // Fetch updated user profile after bank or address update
//   const fetchUpdatedProfile = async () => {
//     try {
//       let token = authState.token;
//       if (!token) {
//         token = await refreshToken();
//         if (!token) {
//           throw new Error("Không thể làm mới token. Vui lòng đăng nhập lại.");
//         }
//       }

//       const response = await fetch(`/api/users/customers/${user.userId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Failed to fetch updated profile: ${response.status} - ${errorText}`);
//       }

//       const updatedProfile = await response.json();
//       setUserProfile(updatedProfile);
//       setAddresses(updatedProfile.address || []);
//       bankForm.setFieldsValue({
//         bankNumber: updatedProfile.bank?.bankNumber || "",
//         dueDate: updatedProfile.bank?.dueDate ? moment(updatedProfile.bank.dueDate) : null,
//         ownerName: updatedProfile.bank?.ownerName || "",
//         address: updatedProfile.bank?.address || "",
//         zipCode: updatedProfile.bank?.zipCode || null,
//       });
//       return updatedProfile;
//     } catch (error) {
//       console.error("Error fetching UPDATED_PROFILE:", error);
//       message.error(`Không thể tải thông tin mới: ${error.message}`);
//       return null;
//     }
//   };

//   // Handle personal info form submission
//   const handlePersonalInfoSubmit = async (values) => {
//     try {
//       let token = authState.token;
//       if (!token) {
//         token = await refreshToken();
//         if (!token) {
//           throw new Error("Không thể làm mới token. Vui lòng đăng nhập lại.");
//         }
//       }

//       const fullName = `${values.firstName} ${values.lastName}`.trim();
//       const formData = new FormData();
//       formData.append("firstName", values.firstName);
//       formData.append("lastName", values.lastName);
//       formData.append("email", values.email);
//       formData.append("phoneNumber", values.phoneNumber);

//       if (values.userImg?.file?.originFileObj instanceof File) {
//         formData.append("userImg", values.userImg.file.originFileObj);
//       }

//       console.log("formData:", [...formData.entries()]);

//       setUploading(true);

//       const response = await fetch(`/api/users/${user.userId}`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(
//           `Failed to update profile: ${response.status} - ${JSON.stringify(errorData)}`
//         );
//       }

//       const updatedUser = await response.json();
//       setUserProfile((prev) => ({
//         ...prev,
//         ...updatedUser,
//         fullName,
//       }));

//       message.success("Cập nhật thông tin cá nhân thành công");
//       setEditingPersonalInfo(false);
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       message.error(`Cập nhật thông tin thất bại: ${error.message}`);
//       setUserProfile((prev) => ({
//         ...prev,
//         fullName: `${values.firstName} ${values.lastName}`.trim(),
//         email: values.email,
//         phoneNumber: values.phoneNumber,
//       }));
//       message.info("Thông tin đã được cập nhật tạm thời trên giao diện");
//       setEditingPersonalInfo(false);
//     } finally {
//       setUploading(false);
//     }
//   };

//   // Handle password change
//   const handlePasswordSubmit = async (values) => {
//     try {
//       let token = authState.token;
//       if (!token) {
//         token = await refreshToken();
//         if (!token) {
//           throw new Error("Không thể làm mới token. Vui lòng đăng nhập lại.");
//         }
//       }

//       const response = await fetch("/auth/change-password", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           currentPassword: values.currentPassword,
//           newPassword: values.newPassword,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(
//           `Failed to change password: ${response.status} - ${JSON.stringify(errorData)}`
//         );
//       }

//       message.success("Đổi mật khẩu thành công");
//       passwordForm.resetFields();
//     } catch (error) {
//       console.error("Error changing password:", error);
//       message.error(`Đổi mật khẩu thất bại: ${error.message}`);
//     }
//   };

//   // Handle bank account submission
//   const handleBankSubmit = async (values) => {
//     try {
//       let token = authState.token;
//       if (!token) {
//         token = await refreshToken();
//         if (!token) {
//           throw new Error("Không thể làm mới token. Vui lòng đăng nhập lại.");
//         }
//       }

//       // Map form values to backend DTO
//       const bankData = {
//         bankNumber: values.bankNumber,
//         dueDate: values.dueDate ? values.dueDate.format("YYYY-MM-DD") : null,
//         ownerName: values.ownerName,
//         address: values.address,
//         zipCode: values.zipCode, // Keep as number
//       };

//       console.log("Bank payload:", bankData);

//       const response = await fetch(`/api/users/customers/${user.userId}/bank-account`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(bankData),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(
//           `Failed to update bank account: ${response.status} - ${JSON.stringify(errorData)}`
//         );
//       }

//       const success = await response.json();
//       if (success) {
//         // Fetch updated profile to get latest bank data
//         const updatedProfile = await fetchUpdatedProfile();
//         if (updatedProfile) {
//           message.success("Cập nhật tài khoản ngân hàng thành công");
//         } else {
//           // Fallback to local update
//           setUserProfile((prev) => ({
//             ...prev,
//             bank: bankData,
//           }));
//           message.info("Thông tin ngân hàng đã được cập nhật tạm thời trên giao diện");
//         }
//       } else {
//         throw new Error("Failed to update bank account");
//       }
//     } catch (error) {
//       console.error("Error updating bank account:", error);
//       message.error(`Cập nhật tài khoản ngân hàng thất bại: ${error.message}`);
//       setUserProfile((prev) => ({
//         ...prev,
//         bank: {
//           bankNumber: values.bankNumber,
//           dueDate: values.dueDate ? values.dueDate.format("YYYY-MM-DD") : null,
//           ownerName: values.ownerName,
//           address: values.address,
//           zipCode: values.zipCode,
//         },
//       }));
//       message.info("Thông tin ngân hàng đã được cập nhật tạm thời trên giao diện");
//     }
//   };

//   // Handle address submission
//   const handleAddressSubmit = async (values) => {
//     try {
//       let token = authState.token;
//       if (!token) {
//         token = await refreshToken();
//         if (!token) {
//           throw new Error("Không thể làm mới token. Vui lòng đăng nhập lại.");
//         }
//       }

//       // Map form values to backend DTO
//       const addressData = {
//         recipientName: values.recipientName,
//         recipientPhone: values.recipientPhone,
//         recipientAddress: values.recipientAddress,
//         addressType: values.addressType,
//       };

//       console.log("Address payload:", addressData);

//       const url = editingAddressId
//         ? `/api/users/customers/${user.userId}/address/${editingAddressId}`
//         : `/api/users/customers/${user.userId}/address`;
//       const method = editingAddressId ? "PUT" : "POST";

//       const response = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(addressData),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(
//           `Failed to ${editingAddressId ? "update" : "add"} address: ${response.status} - ${JSON.stringify(errorData)}`
//         );
//       }

//       // Fetch updated profile to get latest address data
//       const updatedProfile = await fetchUpdatedProfile();
//       if (updatedProfile) {
//         message.success(`${editingAddressId ? "Cập nhật" : "Thêm"} địa chỉ thành công`);
//       } else {
//         // Fallback to local update
//         if (!editingAddressId) {
//           const tempAddress = {
//             addressId: `temp-${Date.now()}`,
//             ...addressData,
//           };
//           setAddresses((prev) => [...prev, tempAddress]);
//           setUserProfile((prev) => ({
//             ...prev,
//             address: [...(prev.address || []), tempAddress],
//           }));
//         } else {
//           setAddresses((prev) =>
//             prev.map((addr) =>
//               addr.addressId === editingAddressId ? { ...addr, ...addressData } : addr
//             )
//           );
//           setUserProfile((prev) => ({
//             ...prev,
//             address: prev.address.map((addr) =>
//               addr.addressId === editingAddressId ? { ...addr, ...addressData } : addr
//             ),
//           }));
//         }
//         message.info(`Địa chỉ đã được ${editingAddressId ? "cập nhật" : "thêm"} tạm thời trên giao diện`);
//       }

//       addressForm.resetFields();
//       setEditingAddressId(null);
//     } catch (error) {
//       console.error(`Error ${editingAddressId ? "updating" : "adding"} address:`, error);
//       message.error(`${editingAddressId ? "Cập nhật" : "Thêm"} địa chỉ thất bại: ${error.message}`);
//       if (!editingAddressId) {
//         const tempAddress = {
//           addressId: `temp-${Date.now()}`,
//           ...addressData,
//         };
//         setAddresses((prev) => [...prev, tempAddress]);
//         setUserProfile((prev) => ({
//           ...prev,
//           address: [...(prev.address || []), tempAddress],
//         }));
//       } else {
//         setAddresses((prev) =>
//           prev.map((addr) =>
//             addr.addressId === editingAddressId ? { ...addr, ...addressData } : addr
//           )
//         );
//         setUserProfile((prev) => ({
//           ...prev,
//           address: prev.address.map((addr) =>
//             addr.addressId === editingAddressId ? { ...addr, ...addressData } : addr
//           ),
//         }));
//       }
//       message.info(`Địa chỉ đã được ${editingAddressId ? "cập nhật" : "thêm"} tạm thời trên giao diện`);
//       addressForm.resetFields();
//       setEditingAddressId(null);
//     }
//   };

//   // Handle address edit
//   const handleAddressEdit = (address) => {
//     addressForm.setFieldsValue({
//       recipientName: address.recipientName || "",
//       recipientPhone: address.recipientPhone || "",
//       recipientAddress: address.recipientAddress || "",
//       addressType: address.addressType || "NORMAL",
//     });
//     setEditingAddressId(address.addressId);
//   };

//   // Handle address deletion
//   const handleAddressDelete = async (addressId) => {
//     try {
//       let token = authState.token;
//       if (!token) {
//         token = await refreshToken();
//         if (!token) {
//           throw new Error("Không thể làm mới token. Vui lòng đăng nhập lại.");
//         }
//       }

//       const response = await fetch(`/api/users/customers/${user.userId}/address/${addressId}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(
//           `Failed to delete address: ${response.status} - ${JSON.stringify(errorData)}`
//         );
//       }

//       // Fetch updated profile
//       const updatedProfile = await fetchUpdatedProfile();
//       if (updatedProfile) {
//         message.success("Xóa địa chỉ thành công");
//       } else {
//         // Fallback to local update
//         setAddresses((prev) => prev.filter((addr) => addr.addressId !== addressId));
//         setUserProfile((prev) => ({
//           ...prev,
//           address: prev.address.filter((addr) => addr.addressId !== addressId),
//         }));
//         message.info("Địa chỉ đã được xóa tạm thời trên giao diện");
//       }
//     } catch (error) {
//       console.error("Error deleting address:", error);
//       message.error(`Xóa địa chỉ thất bại: ${error.message}`);
//       setAddresses((prev) => prev.filter((addr) => addr.addressId !== addressId));
//       setUserProfile((prev) => ({
//         ...prev,
//         address: prev.address.filter((addr) => addr.addressId !== addressId),
//       }));
//       message.info("Địa chỉ đã được xóa tạm thời trên giao diện");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
//       </div>
//     );
//   }

//   if (!userProfile) {
//     return (
//       <div className="text-center p-8">
//         <h2 className="text-xl font-semibold text-red-500">
//           Không thể tải thông tin người dùng
//         </h2>
//         <p className="mt-2">Vui lòng đăng nhập để xem thông tin cá nhân</p>
//       </div>
//     );
//   }

//   const tabItems = [
//     {
//       key: "personal",
//       label: "Thông tin cá nhân",
//       children: (
//         <div>
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold">Thông tin cá nhân</h2>
//             <Button
//               type={editingPersonalInfo ? "primary" : "default"}
//               icon={editingPersonalInfo ? <SaveOutlined /> : <EditOutlined />}
//               onClick={() => {
//                 if (editingPersonalInfo) {
//                   personalForm.submit();
//                 } else {
//                   setEditingPersonalInfo(true);
//                 }
//               }}
//             >
//               {editingPersonalInfo ? "Lưu" : "Sửa"}
//             </Button>
//           </div>

//           <Form
//             form={personalForm}
//             layout="vertical"
//             onFinish={handlePersonalInfoSubmit}
//             disabled={!editingPersonalInfo}
//           >
//             <Form.Item name="userImg" hidden>
//               <Input />
//             </Form.Item>

//             <Form.Item
//               label="Họ"
//               name="firstName"
//               rules={[{ required: true, message: "Vui lòng nhập họ" }]}
//             >
//               <Input prefix={<UserOutlined />} placeholder="Nhập họ" />
//             </Form.Item>

//             <Form.Item
//               label="Tên"
//               name="lastName"
//               rules={[{ required: true, message: "Vui lòng nhập tên" }]}
//             >
//               <Input prefix={<UserOutlined />} placeholder="Nhập tên" />
//             </Form.Item>

//             <Form.Item
//               label="Email"
//               name="email"
//               rules={[
//                 { required: true, message: "Vui lòng nhập email" },
//                 { type: "email", message: "Email không hợp lệ" },
//               ]}
//             >
//               <Input prefix={<MailOutlined />} placeholder="Nhập email" />
//             </Form.Item>

//             <Form.Item
//               label="Số điện thoại"
//               name="phoneNumber"
//               rules={[
//                 { required: true, message: "Vui lòng nhập số điện thoại" },
//               ]}
//             >
//               <Input
//                 prefix={<PhoneOutlined />}
//                 placeholder="Nhập số điện thoại"
//               />
//             </Form.Item>

//             <Form.Item className="mb-0">
//               {editingPersonalInfo && (
//                 <Button
//                   type="default"
//                   onClick={() => {
//                     personalForm.resetFields();
//                     setEditingPersonalInfo(false);
//                   }}
//                   className="mr-2"
//                 >
//                   Hủy
//                 </Button>
//               )}
//             </Form.Item>
//           </Form>
//         </div>
//       ),
//     },
//     {
//       key: "password",
//       label: "Đổi mật khẩu",
//       children: (
//         <div>
//           <h2 className="text-xl font-semibold mb-4">Đổi mật khẩu</h2>
//           <Form
//             form={passwordForm}
//             layout="vertical"
//             onFinish={handlePasswordSubmit}
//           >
//             <Form.Item
//               label="Mật khẩu hiện tại"
//               name="currentPassword"
//               rules={[{ required: true, message: "Vui lòng nhập mật khẩu hiện tại" }]}
//             >
//               <Input.Password
//                 prefix={<LockOutlined />}
//                 placeholder="Nhập mật khẩu hiện tại"
//               />
//             </Form.Item>

//             <Form.Item
//               label="Mật khẩu mới"
//               name="newPassword"
//               rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới" }]}
//             >
//               <Input.Password
//                 prefix={<LockOutlined />}
//                 placeholder="Nhập mật khẩu mới"
//               />
//             </Form.Item>

//             <Form.Item
//               label="Xác nhận mật khẩu mới"
//               name="confirmPassword"
//               dependencies={["newPassword"]}
//               rules={[
//                 { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
//                 ({ getFieldValue }) => ({
//                   validator(_, value) {
//                     if (!value || getFieldValue("newPassword") === value) {
//                       return Promise.resolve();
//                     }
//                     return Promise.reject(new Error("Mật khẩu xác nhận không khớp"));
//                   },
//                 }),
//               ]}
//             >
//               <Input.Password
//                 prefix={<LockOutlined />}
//                 placeholder="Xác nhận mật khẩu mới"
//               />
//             </Form.Item>

//             <Form.Item>
//               <Button type="primary" htmlType="submit">
//                 Đổi mật khẩu
//               </Button>
//             </Form.Item>
//           </Form>
//         </div>
//       ),
//     },
//     {
//       key: "bank",
//       label: "Tài khoản ngân hàng",
//       children: (
//         <div>
//           <h2 className="text-xl font-semibold mb-4">Tài khoản ngân hàng</h2>
//           <Form
//             form={bankForm}
//             layout="vertical"
//             onFinish={handleBankSubmit}
//           >
//             <Form.Item
//               label="Số tài khoản"
//               name="bankNumber"
//               rules={[{ required: true, message: "Vui lòng nhập số tài khoản" }]}
//             >
//               <Input
//                 prefix={<BankOutlined />}
//                 placeholder="Nhập số tài khoản"
//               />
//             </Form.Item>

//             <Form.Item
//               label="Ngày hết hạn"
//               name="dueDate"
//               rules={[{ required: true, message: "Vui lòng chọn ngày hết hạn" }]}
//             >
//               <DatePicker
//                 format="YYYY-MM-DD"
//                 placeholder="Chọn ngày hết hạn"
//                 style={{ width: "100%" }}
//               />
//             </Form.Item>

//             <Form.Item
//               label="Chủ tài khoản"
//               name="ownerName"
//               rules={[{ required: true, message: "Vui lòng nhập tên chủ tài khoản" }]}
//             >
//               <Input
//                 prefix={<UserOutlined />}
//                 placeholder="Nhập tên chủ tài khoản"
//               />
//             </Form.Item>

//             <Form.Item
//               label="Địa chỉ ngân hàng"
//               name="address"
//               rules={[{ required: true, message: "Vui lòng nhập địa chỉ ngân hàng" }]}
//             >
//               <Input
//                 prefix={<HomeOutlined />}
//                 placeholder="Nhập địa chỉ ngân hàng"
//               />
//             </Form.Item>

//             <Form.Item
//               label="Mã bưu điện"
//               name="zipCode"
//               rules={[
//                 { required: true, message: "Vui lòng nhập mã bưu điện" },
//                 {
//                   validator(_, value) {
//                     if (!value || /^\d+$/.test(value)) {
//                       return Promise.resolve();
//                     }
//                     return Promise.reject(new Error("Mã bưu điện phải là số nguyên"));
//                   },
//                 },
//               ]}
//             >
//               <InputNumber
//                 min={0}
//                 prefix={<HomeOutlined />}
//                 placeholder="Nhập mã bưu điện"
//                 style={{ width: "100%" }}
//               />
//             </Form.Item>

//             <Form.Item>
//               <Button type="primary" htmlType="submit">
//                 Cập nhật tài khoản ngân hàng
//               </Button>
//             </Form.Item>
//           </Form>
//         </div>
//       ),
//     },
//     {
//       key: "address",
//       label: "Địa chỉ",
//       children: (
//         <div>
//           <h2 className="text-xl font-semibold mb-4">
//             {editingAddressId ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
//           </h2>
//           <Form
//             form={addressForm}
//             layout="vertical"
//             onFinish={handleAddressSubmit}
//           >
//             <Form.Item
//               label="Tên người nhận"
//               name="recipientName"
//               rules={[{ required: true, message: "Vui lòng nhập tên người nhận" }]}
//             >
//               <Input
//                 prefix={<UserOutlined />}
//                 placeholder="Nhập tên người nhận"
//               />
//             </Form.Item>

//             <Form.Item
//               label="Số điện thoại người nhận"
//               name="recipientPhone"
//               rules={[{ required: true, message: "Vui lòng nhập số điện thoại người nhận" }]}
//             >
//               <Input
//                 prefix={<PhoneOutlined />}
//                 placeholder="Nhập số điện thoại người nhận"
//               />
//             </Form.Item>

//             <Form.Item
//               label="Địa chỉ"
//               name="recipientAddress"
//               rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
//             >
//               <Input
//                 prefix={<HomeOutlined />}
//                 placeholder="Nhập địa chỉ"
//               />
//             </Form.Item>

//             <Form.Item
//               label="Loại địa chỉ"
//               name="addressType"
//               rules={[{ required: true, message: "Vui lòng chọn loại địa chỉ" }]}
//             >
//               <Select placeholder="Chọn loại địa chỉ">
//                 <Option value="DEFAULT">Mặc định</Option>
//                 <Option value="NORMAL">Bình thường</Option>
//               </Select>
//             </Form.Item>

//             <Form.Item>
//               <Button type="primary" htmlType="submit">
//                 {editingAddressId ? "Cập nhật địa chỉ" : "Thêm địa chỉ"}
//               </Button>
//               {editingAddressId && (
//                 <Button
//                   type="default"
//                   onClick={() => {
//                     addressForm.resetFields();
//                     setEditingAddressId(null);
//                   }}
//                   className="ml-2"
//                 >
//                   Hủy
//                 </Button>
//               )}
//             </Form.Item>
//           </Form>

//           <h2 className="text-xl font-semibold mt-8 mb-4">Danh sách địa chỉ</h2>
//           <List
//             dataSource={addresses}
//             renderItem={(address) => (
//               <List.Item
//                 actions={[
//                   <Button
//                     type="link"
//                     onClick={() => handleAddressEdit(address)}
//                   >
//                     Cập nhật
//                   </Button>,
//                   <Popconfirm
//                     title="Bạn có chắc muốn xóa địa chỉ này?"
//                     onConfirm={() => handleAddressDelete(address.addressId)}
//                     okText="Có"
//                     cancelText="Không"
//                   >
//                     <Button type="link" danger icon={<DeleteOutlined />}>
//                       Xóa
//                     </Button>
//                   </Popconfirm>,
//                 ]}
//               >
//                 <div>
//                   <p>
//                     <strong>{address.recipientName || "Chưa cập nhật"}</strong>: {address.recipientAddress || "Chưa cập nhật"}
//                   </p>
//                   <p>Số điện thoại: {address.recipientPhone || "Chưa cập nhật"}</p>
//                   <p>Loại: {address.addressType}</p>
//                 </div>
//               </List.Item>
//             )}
//           />
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-5xl">
//       <div className="flex flex-col md:flex-row gap-6">
//         {/* Left sidebar */}
//         <div className="w-full md:w-1/3">
//           <div className="bg-white rounded-lg shadow-md p-6 text-center">
//             <div className="relative w-32 h-32 mx-auto mb-4">
//               <img
//                 src={imageUrl || "/images/avatar1.jpg"}
//                 alt="Profile"
//                 className="w-full h-full object-cover rounded-full"
//               />
//               {editingPersonalInfo && (
//                 <Upload
//                   name="avatar"
//                   accept="image/*"
//                   listType="picture-circle"
//                   className="absolute inset-0 opacity-0 hover:opacity-50 flex justify-center items-center bg-black bg-opacity-20 rounded-full cursor-pointer"
//                   showUploadList={false}
//                   beforeUpload={(file) => {
//                     const isLt6M = file.size / 1024 / 1024 < 6;
//                     if (!isLt6M) {
//                       message.error("Ảnh phải nhỏ hơn 6MB!");
//                       return Upload.LIST_IGNORE;
//                     }
//                     const isImage = file.type.startsWith("image/");
//                     if (!isImage) {
//                       message.error("Chỉ được upload file ảnh!");
//                       return Upload.LIST_IGNORE;
//                     }
//                     return false;
//                   }}
//                   onChange={(info) => {
//                     const { file } = info;
//                     if (file.status === "uploading") {
//                       setUploading(true);
//                       return;
//                     }
//                     const fileObj = file.originFileObj || file;
//                     if (!fileObj) {
//                       console.error("No valid file object available");
//                       setUploading(false);
//                       return;
//                     }
//                     const reader = new FileReader();
//                     reader.onload = (e) => {
//                       setImageUrl(e.target.result);
//                       setUploading(false);
//                     };
//                     reader.onerror = () => {
//                       console.error("File reading failed");
//                       setUploading(false);
//                     };
//                     if (fileObj instanceof Blob) {
//                       reader.readAsDataURL(fileObj);
//                     } else {
//                       try {
//                         const blob = new Blob([fileObj], {
//                           type: file.type || "image/jpeg",
//                         });
//                         reader.readAsDataURL(blob);
//                       } catch (error) {
//                         console.error("Error creating blob:", error);
//                         setUploading(false);
//                       }
//                     }
//                     personalForm.setFieldsValue({
//                       userImg: {
//                         file: {
//                           ...file,
//                           originFileObj: fileObj,
//                           name: file.name,
//                           uid: file.uid,
//                           size: file.size,
//                           type: file.type,
//                         },
//                       },
//                     });
//                   }}
//                 >
//                   <div>
//                     <PlusOutlined />
//                     <div className="mt-1">Upload</div>
//                   </div>
//                 </Upload>
//               )}
//             </div>

//             <h2 className="text-2xl font-semibold">{userProfile.fullName}</h2>
//             <p className="text-gray-500 mb-4">{userProfile.username}</p>
//             <p className="text-gray-500 mb-4">Loại người dùng: {userType || "Không xác định"}</p>

//             <div className="text-left mb-4 space-y-2">
//               <div className="flex items-center">
//                 <MailOutlined className="mr-2 text-gray-400" />
//                 <span>{userProfile.email}</span>
//               </div>
//               <div className="flex items-center">
//                 <PhoneOutlined className="mr-2 text-gray-400" />
//                 <span>{userProfile.phoneNumber || "Chưa cập nhật"}</span>
//               </div>
//               <div className="flex items-center">
//                 <BankOutlined className="mr-2 text-gray-400" />
//                 <span>
//                   {userProfile.bank?.bankNumber && userProfile.bank?.ownerName
//                     ? `${userProfile.bank.ownerName} - ${userProfile.bank.bankNumber}`
//                     : "Chưa cập nhật tài khoản ngân hàng"}
//                 </span>
//               </div>
//               <div className="flex items-center">
//                 <HomeOutlined className="mr-2 text-gray-400" />
//                 <span>
//                   {userProfile.address?.length > 0
//                     ? userProfile.address
//                         .map(
//                           (addr) =>
//                             `${addr.recipientName || "Chưa cập nhật"}: ${addr.recipientAddress || "Chưa cập nhật"}`
//                         )
//                         .join("; ")
//                     : "Chưa cập nhật địa chỉ"}
//                 </span>
//               </div>
//             </div>

//             <div className="border-t pt-4 mt-2">
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-500">Thành viên từ:</span>
//                 <span className="font-medium">
//                   {new Date(userProfile.createdAt).toLocaleDateString("vi-VN")}
//                 </span>
//               </div>
//               <div className="flex justify-between text-sm mt-1">
//                 <span className="text-gray-500">Số lượng đơn hàng:</span>
//                 <span className="font-medium">
//                   {userProfile.orderCount || 0}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Main content */}
//         <div className="w-full md:w-2/3">
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <Tabs items={tabItems} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;


"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { message, Spin, Tabs, Form, Input, Button, Upload, Select, List, Popconfirm, DatePicker, InputNumber } from "antd";
import {
  LoadingOutlined,
  PlusOutlined,
  EditOutlined,
  SaveOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  BankOutlined,
  HomeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import "@ant-design/v5-patch-for-react-19";
import moment from "moment";

const { Option } = Select;

const ProfilePage = () => {
  const { user, authState, refreshToken } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [userType, setUserType] = useState(null); // customer, vendor, user
  const [loading, setLoading] = useState(true);
  const [editingPersonalInfo, setEditingPersonalInfo] = useState(false);
  const [personalForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [bankForm] = Form.useForm();
  const [addressForm] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [editingAddressId, setEditingAddressId] = useState(null);

  // Load user profile and addresses
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.userId || !authState?.token) {
        // Use user data as fallback
        if (user) {
          setUserProfile({
            userId: user.userId,
            fullName: user.fullName || "",
            username: user.username || "",
            email: user.email || "",
            phoneNumber: user.phoneNumber || "",
            createdAt: user.createdAt || new Date().toISOString(),
            orderCount: 0,
            address: [],
            bank: null,
          });
          setImageUrl(user.imgUrl || null);
          setAddresses(user.address || []);
          const nameParts = user.fullName ? user.fullName.split(" ") : ["", ""];
          personalForm.setFieldsValue({
            email: user.email,
            firstName: nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : "",
            lastName: nameParts.length > 1 ? nameParts[nameParts.length - 1] : user.fullName,
            phoneNumber: user.phoneNumber,
          });
          bankForm.setFieldsValue({
            bankNumber: user.bank?.bankNumber || "",
            dueDate: user.bank?.dueDate ? moment(user.bank.dueDate) : null,
            ownerName: user.bank?.ownerName || "",
            address: user.bank?.address || "",
            zipCode: user.bank?.zipCode || null,
          });
        }
        setLoading(false);
        return;
      }

      const endpoints = [
        { type: "customer", url: `/api/users/customers/${user.userId}` },
        { type: "vendor", url: `/api/users/vendors/${user.userId}` },
        { type: "user", url: `/api/users/${user.userId}` },
      ];

      let fetchedProfile = null;
      let fetchedType = null;

      for (const { type, url } of endpoints) {
        try {
          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            fetchedProfile = data;
            fetchedType = type;
            break;
          } else {
            const errorText = await response.text();
            console.error(`API Error (${type}):`, response.status, errorText);
          }
        } catch (error) {
          console.error(`Error fetching ${type} profile:`, error);
        }
      }

      if (fetchedProfile) {
        setUserProfile(fetchedProfile);
        setUserType(fetchedType);
        setImageUrl(fetchedProfile.imgUrl || user.imgUrl || null);
        setAddresses(fetchedProfile.address || []);

        let firstName = "",
          lastName = "";
        if (fetchedProfile.fullName) {
          const nameParts = fetchedProfile.fullName.split(" ");
          if (nameParts.length > 1) {
            firstName = nameParts.slice(0, -1).join(" ");
            lastName = nameParts[nameParts.length - 1];
          } else {
            firstName = fetchedProfile.fullName;
          }
        }

        personalForm.setFieldsValue({
          email: fetchedProfile.email || user.email,
          firstName,
          lastName,
          phoneNumber: fetchedProfile.phoneNumber || user.phoneNumber,
        });
        bankForm.setFieldsValue({
          bankNumber: fetchedProfile.bank?.bankNumber || "",
          dueDate: fetchedProfile.bank?.dueDate ? moment(fetchedProfile.bank.dueDate) : null,
          ownerName: fetchedProfile.bank?.ownerName || "",
          address: fetchedProfile.bank?.address || "",
          zipCode: fetchedProfile.bank?.zipCode || null,
        });
      } else {
        // Fallback to user data
        message.error("Không thể tải thông tin hồ sơ từ server");
        if (user) {
          setUserProfile({
            userId: user.userId,
            fullName: user.fullName || "",
            username: user.username || "",
            email: user.email || "",
            phoneNumber: user.phoneNumber || "",
            createdAt: user.createdAt || new Date().toISOString(),
            orderCount: 0,
            address: [],
            bank: null,
          });
          setImageUrl(user.imgUrl || null);
          setAddresses(user.address || []);
          const nameParts = user.fullName ? user.fullName.split(" ") : ["", ""];
          personalForm.setFieldsValue({
            email: user.email,
            firstName: nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : "",
            lastName: nameParts.length > 1 ? nameParts[nameParts.length - 1] : user.fullName,
            phoneNumber: user.phoneNumber,
          });
          bankForm.setFieldsValue({
            bankNumber: user.bank?.bankNumber || "",
            dueDate: user.bank?.dueDate ? moment(user.bank.dueDate) : null,
            ownerName: user.bank?.ownerName || "",
            address: user.bank?.address || "",
            zipCode: user.bank?.zipCode || null,
          });
        }
      }

      setLoading(false);
    };

    fetchUserProfile();
  }, [user, authState?.token, personalForm, bankForm]);

  // Fetch updated user profile after bank or address update
  const fetchUpdatedProfile = async () => {
    try {
      let token = authState.token;
      if (!token) {
        token = await refreshToken();
        if (!token) {
          throw new Error("Không thể làm mới token. Vui lòng đăng nhập lại.");
        }
      }

      const response = await fetch(`/api/users/customers/${user.userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch updated profile: ${response.status} - ${errorText}`);
      }

      const updatedProfile = await response.json();
      setUserProfile(updatedProfile);
      setAddresses(updatedProfile.address || []);
      bankForm.setFieldsValue({
        bankNumber: updatedProfile.bank?.bankNumber || "",
        dueDate: updatedProfile.bank?.dueDate ? moment(updatedProfile.bank.dueDate) : null,
        ownerName: updatedProfile.bank?.ownerName || "",
        address: updatedProfile.bank?.address || "",
        zipCode: updatedProfile.bank?.zipCode || null,
      });
      return updatedProfile;
    } catch (error) {
      console.error("Error fetching UPDATED_PROFILE:", error);
      message.error(`Không thể tải thông tin mới: ${error.message}`);
      return null;
    }
  };

  // Handle personal info form submission
  const handlePersonalInfoSubmit = async (values) => {
    try {
      let token = authState.token;
      if (!token) {
        token = await refreshToken();
        if (!token) {
          throw new Error("Không thể làm mới token. Vui lòng đăng nhập lại.");
        }
      }

      const fullName = `${values.firstName} ${values.lastName}`.trim();
      const formData = new FormData();
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("email", values.email);
      formData.append("phoneNumber", values.phoneNumber);

      if (values.userImg?.file?.originFileObj instanceof File) {
        formData.append("userImg", values.userImg.file.originFileObj);
      }

      console.log("formData:", [...formData.entries()]);

      setUploading(true);

      const response = await fetch(`/api/users/${user.userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to update profile: ${response.status} - ${JSON.stringify(errorData)}`
        );
      }

      const updatedUser = await response.json();
      setUserProfile((prev) => ({
        ...prev,
        ...updatedUser,
        fullName,
      }));

      message.success("Cập nhật thông tin cá nhân thành công");
      setEditingPersonalInfo(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error(`Cập nhật thông tin thất bại: ${error.message}`);
      setUserProfile((prev) => ({
        ...prev,
        fullName: `${values.firstName} ${values.lastName}`.trim(),
        email: values.email,
        phoneNumber: values.phoneNumber,
      }));
      message.info("Thông tin đã được cập nhật tạm thời trên giao diện");
      setEditingPersonalInfo(false);
    } finally {
      setUploading(false);
    }
  };

  // Handle password change
  const handlePasswordSubmit = async (values) => {
    try {
      let token = authState.token;
      if (!token) {
        token = await refreshToken();
        if (!token) {
          throw new Error("Không thể làm mới token. Vui lòng đăng nhập lại.");
        }
      }

      const response = await fetch("/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to change password: ${response.status} - ${JSON.stringify(errorData)}`
        );
      }

      message.success("Đổi mật khẩu thành công");
      passwordForm.resetFields();
    } catch (error) {
      console.error("Error changing password:", error);
      message.error(`Đổi mật khẩu thất bại: ${error.message}`);
    }
  };

  // Handle bank account submission
  const handleBankSubmit = async (values) => {
    try {
      let token = authState.token;
      if (!token) {
        token = await refreshToken();
        if (!token) {
          throw new Error("Không thể làm mới token. Vui lòng đăng nhập lại.");
        }
      }

      // Map form values to backend DTO
      const bankData = {
        bankNumber: values.bankNumber,
        dueDate: values.dueDate ? values.dueDate.format("YYYY-MM-DD") : null,
        ownerName: values.ownerName,
        address: values.address,
        zipCode: values.zipCode, // Keep as number
      };

      console.log("Bank payload:", bankData);

      const response = await fetch(`/api/users/customers/${user.userId}/bank-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bankData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to update bank account: ${response.status} - ${JSON.stringify(errorData)}`
        );
      }

      const success = await response.json();
      if (success) {
        // Fetch updated profile to get latest bank data
        const updatedProfile = await fetchUpdatedProfile();
        if (updatedProfile) {
          message.success("Cập nhật tài khoản ngân hàng thành công");
        } else {
          // Fallback to local update
          setUserProfile((prev) => ({
            ...prev,
            bank: bankData,
          }));
          message.info("Thông tin ngân hàng đã được cập nhật tạm thời trên giao diện");
        }
      } else {
        throw new Error("Failed to update bank account");
      }
    } catch (error) {
      console.error("Error updating bank account:", error);
      message.error(`Cập nhật tài khoản ngân hàng thất bại: ${error.message}`);
      setUserProfile((prev) => ({
        ...prev,
        bank: {
          bankNumber: values.bankNumber,
          dueDate: values.dueDate ? values.dueDate.format("YYYY-MM-DD") : null,
          ownerName: values.ownerName,
          address: values.address,
          zipCode: values.zipCode,
        },
      }));
      message.info("Thông tin ngân hàng đã được cập nhật tạm thời trên giao diện");
    }
  };

  // Handle address submission
  const handleAddressSubmit = async (values) => {
    try {
      let token = authState.token;
      if (!token) {
        token = await refreshToken();
        if (!token) {
          throw new Error("Không thể làm mới token. Vui lòng đăng nhập lại.");
        }
      }

      // Map form values to backend DTO
      const addressData = {
        recipientName: values.recipientName,
        recipientPhone: values.recipientPhone,
        recipientAddress: values.recipientAddress,
        addressType: values.addressType,
      };

      console.log("Address payload:", addressData);

      const url = editingAddressId
        ? `/api/users/customers/${user.userId}/address/${editingAddressId}`
        : `/api/users/customers/${user.userId}/address`;
      const method = editingAddressId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addressData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to ${editingAddressId ? "update" : "add"} address: ${response.status} - ${JSON.stringify(errorData)}`
        );
      }

      // Fetch updated profile to get latest address data
      const updatedProfile = await fetchUpdatedProfile();
      if (updatedProfile) {
        message.success(`${editingAddressId ? "Cập nhật" : "Thêm"} địa chỉ thành công`);
      } else {
        // Fallback to local update
        if (!editingAddressId) {
          const tempAddress = {
            addressId: `temp-${Date.now()}`,
            ...addressData,
          };
          setAddresses((prev) => [...prev, tempAddress]);
          setUserProfile((prev) => ({
            ...prev,
            address: [...(prev.address || []), tempAddress],
          }));
        } else {
          setAddresses((prev) =>
            prev.map((addr) =>
              addr.addressId === editingAddressId ? { ...addr, ...addressData } : addr
            )
          );
          setUserProfile((prev) => ({
            ...prev,
            address: prev.address.map((addr) =>
              addr.addressId === editingAddressId ? { ...addr, ...addressData } : addr
            ),
          }));
        }
        message.info(`Địa chỉ đã được ${editingAddressId ? "cập nhật" : "thêm"} tạm thời trên giao diện`);
      }

      addressForm.resetFields();
      setEditingAddressId(null);
    } catch (error) {
      console.error(`Error ${editingAddressId ? "updating" : "adding"} address:`, error);
      message.error(`${editingAddressId ? "Cập nhật" : "Thêm"} địa chỉ thất bại: ${error.message}`);
      if (!editingAddressId) {
        const tempAddress = {
          addressId: `temp-${Date.now()}`,
          ...addressData,
        };
        setAddresses((prev) => [...prev, tempAddress]);
        setUserProfile((prev) => ({
          ...prev,
          address: [...(prev.address || []), tempAddress],
        }));
      } else {
        setAddresses((prev) =>
          prev.map((addr) =>
            addr.addressId === editingAddressId ? { ...addr, ...addressData } : addr
          )
        );
        setUserProfile((prev) => ({
          ...prev,
          address: prev.address.map((addr) =>
            addr.addressId === editingAddressId ? { ...addr, ...addressData } : addr
          ),
        }));
      }
      message.info(`Địa chỉ đã được ${editingAddressId ? "cập nhật" : "thêm"} tạm thời trên giao diện`);
      addressForm.resetFields();
      setEditingAddressId(null);
    }
  };

  // Handle address edit
  const handleAddressEdit = (address) => {
    addressForm.setFieldsValue({
      recipientName: address.recipientName || "",
      recipientPhone: address.recipientPhone || "",
      recipientAddress: address.recipientAddress || "",
      addressType: address.addressType || "NORMAL",
    });
    setEditingAddressId(address.addressId);
  };

  // Handle address deletion
  const handleAddressDelete = async (addressId) => {
    try {
      let token = authState.token;
      if (!token) {
        token = await refreshToken();
        if (!token) {
          throw new Error("Không thể làm mới token. Vui lòng đăng nhập lại.");
        }
      }

      const response = await fetch(`/api/users/customers/${user.userId}/address/${addressId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to delete address: ${response.status} - ${JSON.stringify(errorData)}`
        );
      }

      // Fetch updated profile
      const updatedProfile = await fetchUpdatedProfile();
      if (updatedProfile) {
        message.success("Xóa địa chỉ thành công");
      } else {
        // Fallback to local update
        setAddresses((prev) => prev.filter((addr) => addr.addressId !== addressId));
        setUserProfile((prev) => ({
          ...prev,
          address: prev.address.filter((addr) => addr.addressId !== addressId),
        }));
        message.info("Địa chỉ đã được xóa tạm thời trên giao diện");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      message.error(`Xóa địa chỉ thất bại: ${error.message}`);
      setAddresses((prev) => prev.filter((addr) => addr.addressId !== addressId));
      setUserProfile((prev) => ({
        ...prev,
        address: prev.address.filter((addr) => addr.addressId !== addressId),
      }));
      message.info("Địa chỉ đã được xóa tạm thời trên giao diện");
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
      key: "password",
      label: "Đổi mật khẩu",
      children: (
        <div>
          <h2 className="text-xl font-semibold mb-4">Đổi mật khẩu</h2>
          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={handlePasswordSubmit}
          >
            <Form.Item
              label="Mật khẩu hiện tại"
              name="currentPassword"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu hiện tại" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập mật khẩu hiện tại"
              />
            </Form.Item>

            <Form.Item
              label="Mật khẩu mới"
              name="newPassword"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới" }]}
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
                    return Promise.reject(new Error("Mật khẩu xác nhận không khớp"));
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
                Đổi mật khẩu
              </Button>
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
          <h2 className="text-xl font-semibold mb-4">Tài khoản ngân hàng</h2>
          <Form
            form={bankForm}
            layout="vertical"
            onFinish={handleBankSubmit}
          >
            <Form.Item
              label="Số tài khoản"
              name="bankNumber"
              rules={[{ required: true, message: "Vui lòng nhập số tài khoản" }]}
            >
              <Input
                prefix={<BankOutlined />}
                placeholder="Nhập số tài khoản"
              />
            </Form.Item>

            <Form.Item
              label="Ngày hết hạn"
              name="dueDate"
              rules={[{ required: true, message: "Vui lòng chọn ngày hết hạn" }]}
            >
              <DatePicker
                format="YYYY-MM-DD"
                placeholder="Chọn ngày hết hạn"
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              label="Chủ tài khoản"
              name="ownerName"
              rules={[{ required: true, message: "Vui lòng nhập tên chủ tài khoản" }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Nhập tên chủ tài khoản"
              />
            </Form.Item>

            <Form.Item
              label="Địa chỉ ngân hàng"
              name="address"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ ngân hàng" }]}
            >
              <Input
                prefix={<HomeOutlined />}
                placeholder="Nhập địa chỉ ngân hàng"
              />
            </Form.Item>

            <Form.Item
              label="Mã bưu điện"
              name="zipCode"
              rules={[
                { required: true, message: "Vui lòng nhập mã bưu điện" },
                {
                  validator(_, value) {
                    if (!value || /^\d+$/.test(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Mã bưu điện phải là số nguyên"));
                  },
                },
              ]}
            >
              <InputNumber
                min={0}
                prefix={<HomeOutlined />}
                placeholder="Nhập mã bưu điện"
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Cập nhật tài khoản ngân hàng
              </Button>
            </Form.Item>
          </Form>
        </div>
      ),
    },
    {
      key: "address",
      label: "Địa chỉ",
      children: (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {editingAddressId ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
          </h2>
          <Form
            form={addressForm}
            layout="vertical"
            onFinish={handleAddressSubmit}
          >
            <Form.Item
              label="Tên người nhận"
              name="recipientName"
              rules={[{ required: true, message: "Vui lòng nhập tên người nhận" }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Nhập tên người nhận"
              />
            </Form.Item>

            <Form.Item
              label="Số điện thoại người nhận"
              name="recipientPhone"
              rules={[{ required: true, message: "Vui lòng nhập số điện thoại người nhận" }]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="Nhập số điện thoại người nhận"
              />
            </Form.Item>

            <Form.Item
              label="Địa chỉ"
              name="recipientAddress"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
            >
              <Input
                prefix={<HomeOutlined />}
                placeholder="Nhập địa chỉ"
              />
            </Form.Item>

            <Form.Item
              label="Loại địa chỉ"
              name="addressType"
              rules={[{ required: true, message: "Vui lòng chọn loại địa chỉ" }]}
            >
              <Select placeholder="Chọn loại địa chỉ">
                <Option value="DEFAULT">Mặc định</Option>
                <Option value="NORMAL">Bình thường</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                {editingAddressId ? "Cập nhật địa chỉ" : "Thêm địa chỉ"}
              </Button>
              {editingAddressId && (
                <Button
                  type="default"
                  onClick={() => {
                    addressForm.resetFields();
                    setEditingAddressId(null);
                  }}
                  className="ml-2"
                >
                  Hủy
                </Button>
              )}
            </Form.Item>
          </Form>

          <h2 className="text-xl font-semibold mt-8 mb-4">Danh sách địa chỉ</h2>
          <List
            dataSource={addresses}
            renderItem={(address) => (
              <List.Item
                actions={[
                  <Button
                    type="link"
                    onClick={() => handleAddressEdit(address)}
                  >
                    Cập nhật
                  </Button>,
                  <Popconfirm
                    title="Bạn có chắc muốn xóa địa chỉ này?"
                    onConfirm={() => handleAddressDelete(address.addressId)}
                    okText="Có"
                    cancelText="Không"
                  >
                    <Button type="link" danger icon={<DeleteOutlined />}>
                      Xóa
                    </Button>
                  </Popconfirm>,
                ]}
              >
                <div>
                  <p>
                    <strong>{address.recipientName || "Chưa cập nhật"}</strong>: {address.recipientAddress || "Chưa cập nhật"}
                  </p>
                  <p>Số điện thoại: {address.recipientPhone || "Chưa cập nhật"}</p>
                  <p>Loại: {address.addressType}</p>
                </div>
              </List.Item>
            )}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
          </div>
        ) : !userProfile ? (
          <div className="text-center p-8">
            <h2 className="text-xl font-semibold text-red-500">
              Không thể tải thông tin người dùng
            </h2>
            <p className="mt-2">Vui lòng đăng nhập để xem thông tin cá nhân</p>
          </div>
        ) : (
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
                        accept="image/*"
                        listType="picture-circle"
                        className="absolute inset-0 opacity-0 hover:opacity-50 flex justify-center items-center bg-black bg-opacity-20 rounded-full cursor-pointer"
                        showUploadList={false}
                        beforeUpload={(file) => {
                          const isLt6M = file.size / 1024 / 1024 < 6;
                          if (!isLt6M) {
                            message.error("Ảnh phải nhỏ hơn 6MB!");
                            return Upload.LIST_IGNORE;
                          }
                          const isImage = file.type.startsWith("image/");
                          if (!isImage) {
                            message.error("Chỉ được upload file ảnh!");
                            return Upload.LIST_IGNORE;
                          }
                          return false;
                        }}
                        onChange={(info) => {
                          const { file } = info;
                          if (file.status === "uploading") {
                            setUploading(true);
                            return;
                          }
                          const fileObj = file.originFileObj || file;
                          if (!fileObj) {
                            console.error("No valid file object available");
                            setUploading(false);
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            setImageUrl(e.target.result);
                            setUploading(false);
                          };
                          reader.onerror = () => {
                            console.error("File reading failed");
                            setUploading(false);
                          };
                          if (fileObj instanceof Blob) {
                            reader.readAsDataURL(fileObj);
                          } else {
                            try {
                              const blob = new Blob([fileObj], {
                                type: file.type || "image/jpeg",
                              });
                              reader.readAsDataURL(blob);
                            } catch (error) {
                              console.error("Error creating blob:", error);
                              setUploading(false);
                            }
                          }
                          personalForm.setFieldsValue({
                            userImg: {
                              file: {
                                ...file,
                                originFileObj: fileObj,
                                name: file.name,
                                uid: file.uid,
                                size: file.size,
                                type: file.type,
                              },
                            },
                          });
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
                  <p className="text-gray-500 mb-4">Loại người dùng: {userType || "Không xác định"}</p>

                  <div className="text-left mb-4 space-y-2">
                    <div className="flex items-center">
                      <MailOutlined className="mr-2 text-gray-400" />
                      <span>{userProfile.email}</span>
                    </div>
                    <div className="flex items-center">
                      <PhoneOutlined className="mr-2 text-gray-400" />
                      <span>{userProfile.phoneNumber || "Chưa cập nhật"}</span>
                    </div>
                    <div className="flex items-center">
                      <BankOutlined className="mr-2 text-gray-400" />
                      <span>
                        {userProfile.bank?.bankNumber && userProfile.bank?.ownerName
                          ? `${userProfile.bank.ownerName} - ${userProfile.bank.bankNumber}`
                          : "Chưa cập nhật tài khoản ngân hàng"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <HomeOutlined className="mr-2 text-gray-400" />
                      <span>
                        {userProfile.address?.length > 0
                          ? userProfile.address
                              .map(
                                (addr) =>
                                  `${addr.recipientName || "Chưa cập nhật"}: ${addr.recipientAddress || "Chưa cập nhật"}`
                              )
                              .join("; ")
                          : "Chưa cập nhật địa chỉ"}
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
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;
