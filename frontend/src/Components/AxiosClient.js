import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API,
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
