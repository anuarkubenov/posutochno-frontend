"use client";

import React, { useEffect, useState } from "react";
import { Table, Spin, notification, Image, Button, Popconfirm } from "antd";
import axios from "axios";

const Apartments: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApartments = async () => {
    try {
      const response = await axios.get("http://localhost:3000/apartments");
      setData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      notification.error({
        message: "Error",
        description: "Failed to fetch apartments.",
      });
    }
  };

  useEffect(() => {
    fetchApartments();
  }, []);

  // Функция для удаления квартиры
  const deleteApartment = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/apartments/${id}`);
      notification.success({
        message: "Success",
        description: "Apartment deleted successfully.",
      });
      fetchApartments(); // Обновляем список после удаления
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to delete apartment.",
      });
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `$${price}`,
    },
    {
      title: "Photos",
      dataIndex: "photos",
      key: "photos",
      render: (photos: { path: string }[]) => (
        <div style={{ display: "flex", gap: "10px" }}>
          {photos.map((photo, index) => (
            <Image
              key={index}
              src={`http://localhost:3000/${photo.path}`}
              alt={`Photo ${index + 1}`}
              width={50}
              height={50}
              style={{ objectFit: "cover" }}
            />
          ))}
        </div>
      ),
    },
    {
      title: "Main Photo",
      dataIndex: "main_photo",
      key: "main_photo",
      render: (main_photo: string) => (
        <Image
          src={`http://localhost:3000/${main_photo}`}
          alt="Main Photo"
          width={50}
          height={50}
          style={{ objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Actions", 
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure to delete this apartment?"
          onConfirm={() => deleteApartment(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" danger>
            Delete
          </Button> 
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Apartments</h1>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table dataSource={data} columns={columns} rowKey="id" />
      )}
    </div>
  );
};

export default Apartments;
