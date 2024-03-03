import axios from "axios";

const axiosClient = axios.create({
  baseURL: `http://localhost:5000`,
});

axiosClient.interceptors.response.use((response) => {
  //   const navigate = useNavigate();
  if (
    response.data.message === "Please login" ||
    response.data.message === "Invalid token"
  ) {
    localStorage.removeItem("userRole");
    window.location.reload();
  }
  return response;
});

export default axiosClient;
