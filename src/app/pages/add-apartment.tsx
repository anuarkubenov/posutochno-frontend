import React from "react";
import { Form, Input, InputNumber, Button, Upload, notification } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const AddApartment: React.FC = () => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    const formData = {
      title: values.title,
      description: values.description,
      price: values.price,
      media: values.media?.fileList.map((file: any) => file.name) || [],
    };

    try {
      const response = await axios.post("http://localhost:3000/apartments", formData);
      if (response.status === 201) {
        notification.success({
          message: "Success",
          description: "Apartment added successfully!",
        });
        form.resetFields();
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to add apartment.",
      });
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto" }}>
      <h1>Add Apartment</h1>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please input the title!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please input the description!" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: "Please input the price!" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="media" label="Upload Media">
          <Upload listType="picture" multiple>
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Apartment
          </Button>
        </Form.Item>
      </Form>
    </div> 
  );
};

export default AddApartment;
 