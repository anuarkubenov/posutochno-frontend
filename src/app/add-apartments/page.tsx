"use client";

import React, { useState } from "react";
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

const ApartmentForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const allOptions = {
    // Поля безопасности
    intercom: false,
    videoIntercom: false,
    electronicLocks: false,
    parking: false,
    nearbyParking: false,

    // Удобства
    internet: false,
    tv: false,
    washing_machine: false,
    microwave: false,
    iron: false,
    dishes: false,
    air_conditioner: false,
    dishwasher: false,
    elevator: false,
    coffee_machine: false,

    // Ванная комната
    shower: false,
    bathtub: false,
    jacuzzi: false,
    towels: false,
    bathrobe: false,
    slippers: false,
    hairdryer: false,
    shampoo: false,
    shower_gel: false,

    // Подходит для
    non_smokers: false,
    parties: false,
    business_trip_documents: false,
    overnight_stay: false,
    with_kids: false,
    with_pets: false,
  };

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

    // Обрабатываем Checkbox.Group для плоского списка
    const processFlatCheckboxes = (
      options: { value: string }[],
      selectedValues: string[]
    ) => {
      return options.reduce((acc, option) => {
        acc[option.value] = selectedValues.includes(option.value);
        return acc;
      }, {} as { [key: string]: boolean });
    };

    // Обработка всех чекбоксов в один плоский объект
    const checkboxValues = {
      ...processFlatCheckboxes(securityOptions, values.security || []),
      ...processFlatCheckboxes(amenitiesOptions, values.amenities || []),
      ...processFlatCheckboxes(bathroomOptions, values.bathroom || []),
      ...processFlatCheckboxes(suitabilityOptions, values.suitability || []),
    };

    const processedValues = {
      ...allOptions,
      ...values,
      ...checkboxValues, // Добавляем обработанные значения чекбоксов
    };

    delete processedValues.security;
    delete processedValues.amenities;
    delete processedValues.bathroom;
    delete processedValues.suitability;


    const formData = new FormData();

    Object.keys(processedValues).forEach((key) => {
      if (key === "photos") {
        processedValues.photos?.forEach((file: any) => {
          formData.append("photos", file.originFileObj); // Загружаем файлы
        });
      } else if (key === "main_photo") {
        formData.append(
          "main_photo",
          processedValues.main_photo?.fileList[0]?.originFileObj
        );
      } else if (key === "video") {
        formData.append("video", values?.video?.originFileObj || values.video);
      } else if (Array.isArray(processedValues[key])) {
        formData.append(key, JSON.stringify(processedValues[key])); // Для массивов, например, удобств
      } else {
        formData.append(key, processedValues[key]); // Для остальных данных
      }
    });

    console.log('processedValues', processedValues)

    try {
      const response = await axios.post(
        "http://localhost:3000/apartments",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      message.success("Apartment added successfully!");
      form.resetFields(); // Очистка формы
    } catch (error) {
      console.error("Error adding apartment:", error);
      message.error("Failed to add apartment. Please try again.");
    } finally {
      setLoading(false);
    }
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
        label="Название"
        rules={[{ required: true, message: "Название обязательно" }]}
      >
        <Input placeholder="Введите название" />
      </Form.Item>

      <Form.Item name="description" label="Описание">
        <Input.TextArea placeholder="Введите описание" rows={4} />
      </Form.Item>

      <Form.Item
        name="price"
        label="Цена"
        rules={[{ required: true, message: "Цена обязательна" }]}
      >
        <InputNumber
          placeholder="Введите цену"
          min={0}
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item
        name="rooms"
        label="Количество комнат"
        rules={[{ required: true, message: "Количество комнат обязательно" }]}
      >
        <InputNumber
          placeholder="Введите количество комнат"
          min={1}
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item name="floor" label="Этаж">
        <Input placeholder="Введите этаж (например, 1, 2, Цокольный)" />
      </Form.Item>

      <Form.Item
        name="area"
        label="Площадь (м²)"
        rules={[{ required: true, message: "Площадь обязательна" }]}
      >
        <InputNumber
          placeholder="Введите площадь в м²"
          min={1}
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item
        name="condition"
        label="Состояние"
        rules={[{ required: true, message: "Состояние обязательно" }]}
      >
        <Input placeholder="Введите состояние (например, Новое, Отремонтированное)" />
      </Form.Item>

      <Form.Item
        name="city"
        label="Город"
        rules={[{ required: true, message: "Город обязателен" }]}
      >
        <Input placeholder="Введите город" />
      </Form.Item>

      <Form.Item name="street" label="Улица">
        <Input placeholder="Введите улицу" />
      </Form.Item>

      <Form.Item name="house_number" label="Номер дома">
        <Input placeholder="Введите номер дома" />
      </Form.Item>

      <Form.Item
        name="latitude"
        label="Широта"
        rules={[{ required: true, message: "Широта обязательна" }]}
      >
        <InputNumber
          placeholder="Введите широту"
          min={-90}
          max={90}
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item
        name="longitude"
        label="Долгота"
        rules={[{ required: true, message: "Долгота обязательна" }]}
      >
        <InputNumber
          placeholder="Введите долготу"
          min={-180}
          max={180}
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item name="check_in_time" label="Время заезда">
        <Input placeholder="Введите время заезда (например, 14:00)" />
      </Form.Item>

      <Form.Item name="check_out_time" label="Время выезда">
        <Input placeholder="Введите время выезда (например, 12:00)" />
      </Form.Item>

      <Form.Item name="main_photo" label="Главное фото">
        <Upload
          listType="picture"
          maxCount={1}
          beforeUpload={() => false} // Запрещаем автоматическую загрузку
        >
          <Button icon={<UploadOutlined />}>Загрузить главное фото</Button>
        </Upload>
      </Form.Item>

      <Form.Item
        name="photos"
        label="Фотографии"
        valuePropName="fileList"
        getValueFromEvent={(e) => e && e.fileList}
      >
        <Upload multiple listType="picture" beforeUpload={() => false}>
          <Button icon={<UploadOutlined />}>Загрузить фотографии</Button>
        </Upload>
      </Form.Item>

      <Form.Item
        name="video"
        label="Видео"
        valuePropName="file"
        getValueFromEvent={(e) => e && e.file}
      >
        <Upload accept="video/mp4" beforeUpload={() => false} maxCount={1}>
          <Button icon={<UploadOutlined />}>Загрузить видео</Button>
        </Upload>
      </Form.Item>

      {/* Security */}
      <Form.Item name="security" label="Безопасность">
        <Checkbox.Group options={securityOptions} />
      </Form.Item>

      {/* Amenities */}
      <Form.Item name="amenities" label="Удобства">
        <Checkbox.Group options={amenitiesOptions} />
      </Form.Item>

      {/* Bathroom */}
      <Form.Item name="bathroom" label="Ванная комната">
        <Checkbox.Group options={bathroomOptions} />
      </Form.Item>

      {/* Suitability */}
      <Form.Item name="suitability" label="Подходит для">
        <Checkbox.Group options={suitabilityOptions} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Отправить
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ApartmentForm;
