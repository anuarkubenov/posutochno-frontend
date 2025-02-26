import React, { useEffect, useState } from "react";
import { Table, Spin, notification } from "antd";
import axios from "axios";

const Apartments: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchApartments();
  }, []);

  const columns = [
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
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: "Media",
      dataIndex: "media",
      key: "media",
      render: (media: string[]) => (
        <ul>
          {media.map((file, index) => (
            <li key={index}>{file}</li>
          ))}
        </ul>
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
