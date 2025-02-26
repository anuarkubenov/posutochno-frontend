import axios from "axios";
import EditApartmentForm from "../../components/EditApartmentForm";

export async function generateStaticParams() {
  // Вы можете реализовать API-запрос для предварительной генерации доступных ID
  return [];
}

export default async function EditApartmentPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  if (!id) {
    return <div>Error: Apartment ID is missing.</div>;
  }

  // Загрузка данных для формы редактирования с использованием axios
  const fetchApartmentData = async (id: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/apartments/${id}`);

      console.log('response.data', response.data)
      return response.data;
    } catch (error) {
      console.error("Error fetching apartment data:", error);
      throw new Error("Failed to fetch apartment data");
    }
  };

  let apartmentData;

  try {
    apartmentData = await fetchApartmentData(id);
  } catch (error) {
    console.error("Error fetching apartment data:", error);
    return <div>Error loading apartment details. Please try again later.</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Edit Apartment #{id}</h1>
      <EditApartmentForm apartment={apartmentData} id={id} />
    </div>
  );
}
