"use client";

import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Checkbox,
  Upload,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const EditApartmentForm: React.FC<{ apartment: any; id: string }> = ({
  apartment,
  id,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  console.log("apartment", apartment.photos);

  useEffect(() => {
    if (apartment) {
      // Преобразуем данные для Checkbox.Group
      const transformCheckboxValues = (
        options: { value: string }[],
        data: any
      ) =>
        options.filter((option) => data[option.value]).map((opt) => opt.value);

      form.setFieldsValue({
        ...apartment,
        security: transformCheckboxValues(securityOptions, apartment),
        amenities: transformCheckboxValues(amenitiesOptions, apartment),
        bathroom: transformCheckboxValues(bathroomOptions, apartment),
        suitability: transformCheckboxValues(suitabilityOptions, apartment),
      });
    }
  }, [apartment, form]);

  const securityOptions = [
    { label: "Intercom", value: "intercom" },
    { label: "Video Intercom", value: "videoIntercom" },
    { label: "Electronic Locks", value: "electronicLocks" },
    { label: "Parking", value: "parking" },
    { label: "Nearby Parking", value: "nearbyParking" },
  ];

  const amenitiesOptions = [
    { label: "Internet", value: "internet" },
    { label: "TV", value: "tv" },
    { label: "Washing Machine", value: "washing_machine" },
    { label: "Microwave", value: "microwave" },
    { label: "Iron", value: "iron" },
    { label: "Dishes", value: "dishes" },
    { label: "Air Conditioner", value: "air_conditioner" },
    { label: "Dishwasher", value: "dishwasher" },
    { label: "Elevator", value: "elevator" },
    { label: "Coffee Machine", value: "coffee_machine" },
  ];

  const bathroomOptions = [
    { label: "Shower", value: "shower" },
    { label: "Bathtub", value: "bathtub" },
    { label: "Jacuzzi", value: "jacuzzi" },
    { label: "Towels", value: "towels" },
    { label: "Bathrobe", value: "bathrobe" },
    { label: "Slippers", value: "slippers" },
    { label: "Hairdryer", value: "hairdryer" },
    { label: "Shampoo", value: "shampoo" },
    { label: "Shower Gel", value: "shower_gel" },
  ];

  const suitabilityOptions = [
    { label: "Non-Smokers", value: "non_smokers" },
    { label: "Parties", value: "parties" },
    { label: "Business Trip Documents", value: "business_trip_documents" },
    { label: "Overnight Stay", value: "overnight_stay" },
    { label: "With Kids", value: "with_kids" },
    { label: "With Pets", value: "with_pets" },
  ];

  const onFinish = async (values: any) => {
    setLoading(true);

    // Обработка чекбоксов перед отправкой на бэкенд
    const processCheckboxes = (
      options: { value: string }[],
      selected: string[]
    ) =>
      options.reduce((acc, opt) => {
        acc[opt.value] = selected.includes(opt.value);
        return acc;
      }, {} as { [key: string]: boolean });

    console.log("values", values);

    const processedValues = {
      ...values,
      ...processCheckboxes(securityOptions, values.security || []),
      ...processCheckboxes(amenitiesOptions, values.amenities || []),
      ...processCheckboxes(bathroomOptions, values.bathroom || []),
      ...processCheckboxes(suitabilityOptions, values.suitability || []),
    };

    delete processedValues.security;
    delete processedValues.amenities;
    delete processedValues.bathroom;
    delete processedValues.suitability;

    const formData = new FormData();

    Object.keys(processedValues).forEach((key) => {
      if (key === "photos") {
        const ph =
          processedValues.photos?.fileList || processedValues.photos || [];

        console.log("ph", ph);

        ph.forEach((file: any) => {
          if (file.originFileObj) {
            // Новое фото – передаем как файл
            formData.append("photos", file.originFileObj);
          } else {
            // Старое фото – передаем его данные как строку JSON
            formData.append(
              "existing_photos",
              JSON.stringify({
                id: file.id,
                path: file.path,
                filename: file.filename,
              })
            );
          }
        });
      } else if (key === "main_photo") {
        if (processedValues.main_photo?.fileList?.[0]?.originFileObj) {
          // Если загружен новый файл, отправляем его
          formData.append(
            "main_photo",
            processedValues.main_photo?.fileList[0]?.originFileObj
          );
        } else if (typeof processedValues.main_photo === "string") {
          // Если уже есть сохраненный путь к фото, отправляем как строку
          formData.append("main_photo", processedValues.main_photo);
        }
      } else if (key === "video" && processedValues[key]) {
        if (processedValues.video?.fileList?.[0]?.originFileObj) {
          // Если загружен новый файл, отправляем его
          formData.append(
            "video",
            processedValues.video?.fileList[0]?.originFileObj
          );
        } else if (typeof processedValues.video === "string") {
          // Если уже есть сохраненный путь к фото, отправляем как строку
          formData.append("video", processedValues.video);
        }
      } else if (Array.isArray(processedValues[key])) {
        formData.append(key, JSON.stringify(processedValues[key])); // Для массивов, например, удобств
      } else {
        formData.append(key, processedValues[key]); // Для остальных данных
      }
    });

    console.log("processedValues", processedValues);

    try {
      await axios.patch(`http://localhost:3000/apartments/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("Apartment updated successfully!");
    } catch (error) {
      console.error("Failed to update apartment:", error);
      message.error("Failed to update apartment. Please try again.");
    } finally {
      setLoading(false);
    }

    setLoading(false);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: 600, margin: "0 auto" }}
    >
      <Form.Item
        name="title"
        label="Title"
        rules={[{ required: true, message: "Title is required" }]}
      >
        <Input placeholder="Enter title" />
      </Form.Item>

      <Form.Item name="description" label="Description">
        <Input.TextArea placeholder="Enter description" rows={4} />
      </Form.Item>

      <Form.Item
        name="price"
        label="Price"
        rules={[{ required: true, message: "Price is required" }]}
      >
        <InputNumber
          placeholder="Enter price"
          min={0}
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item
        name="rooms"
        label="Number of Rooms"
        rules={[{ required: true, message: "Number of rooms is required" }]}
      >
        <InputNumber
          placeholder="Enter number of rooms"
          min={1}
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item name="floor" label="Floor">
        <Input placeholder="Enter floor (e.g., 1, 2, Ground)" />
      </Form.Item>

      <Form.Item
        name="area"
        label="Area (m²)"
        rules={[{ required: true, message: "Area is required" }]}
      >
        <InputNumber
          placeholder="Enter area in m²"
          min={1}
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item
        name="condition"
        label="Condition"
        rules={[{ required: true, message: "Condition is required" }]}
      >
        <Input placeholder="Enter condition (e.g., Fresh, Renovated)" />
      </Form.Item>

      <Form.Item
        name="city"
        label="City"
        rules={[{ required: true, message: "City is required" }]}
      >
        <Input placeholder="Enter city" />
      </Form.Item>

      <Form.Item name="street" label="Street">
        <Input placeholder="Enter street" />
      </Form.Item>

      <Form.Item name="house_number" label="House Number">
        <Input placeholder="Enter house number" />
      </Form.Item>

      <Form.Item
        name="latitude"
        label="Latitude"
        rules={[{ required: true, message: "Latitude is required" }]}
      >
        <InputNumber
          placeholder="Enter latitude"
          min={-90}
          max={90}
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item
        name="longitude"
        label="Longitude"
        rules={[{ required: true, message: "Longitude is required" }]}
      >
        <InputNumber
          placeholder="Enter longitude"
          min={-180}
          max={180}
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item name="check_in_time" label="Check-in Time">
        <Input placeholder="Enter check-in time (e.g., 14:00)" />
      </Form.Item>

      <Form.Item name="check_out_time" label="Check-out Time">
        <Input placeholder="Enter check-out time (e.g., 12:00)" />
      </Form.Item>

      <Form.Item name="photos" label="Photos">
        <Upload
          multiple
          listType="picture"
          beforeUpload={() => false}
          defaultFileList={
            apartment?.photos?.map(
              (photo: { id: number; filename: string; path: string }) => ({
                id: photo.id,
                uid: photo.id.toString(),
                name: photo.filename,
                filename: photo.filename,
                status: "done",
                path: photo.path,
                url: `http://localhost:3000/${photo.path}`, // Полный путь к изображению
              })
            ) || []
          }
        >
          <Button icon={<UploadOutlined />}>Upload Photos</Button>
        </Upload>
      </Form.Item>

      <Form.Item name="main_photo" label="Main Photo">
        <Upload
          listType="picture"
          maxCount={1}
          beforeUpload={() => false} // Запрещаем автоматическую загрузку
          defaultFileList={
            apartment?.main_photo
              ? [
                  {
                    uid: "-1",
                    name: "Main Photo",
                    status: "done",
                    url: `http://localhost:3000/${apartment.main_photo}`, // Укажите корректный URL
                  },
                ]
              : []
          }
        >
          <Button icon={<UploadOutlined />}>Upload Main Photo</Button>
        </Upload>
      </Form.Item>

      <Form.Item
        name="video"
        label="Video"
        valuePropName="file"
        getValueFromEvent={(e) => e && e.file}
      >
        <Upload accept="video/mp4" beforeUpload={() => false} maxCount={1}>
          <Button icon={<UploadOutlined />}>Upload Video</Button>
        </Upload>
      </Form.Item>

      <Form.Item name="security" label="Security">
        <Checkbox.Group options={securityOptions} />
      </Form.Item>

      <Form.Item name="amenities" label="Amenities">
        <Checkbox.Group options={amenitiesOptions} />
      </Form.Item>

      <Form.Item name="bathroom" label="Bathroom">
        <Checkbox.Group options={bathroomOptions} />
      </Form.Item>

      <Form.Item name="suitability" label="Suitability">
        <Checkbox.Group options={suitabilityOptions} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Save Changes
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditApartmentForm;
