import axiosClient from "./axiosClient";

const userApi = {
  register: (data) => {
    const url = "/user/register";
    return axiosClient.post(url, data);
  },

  login: (data) => {
    const url = "/user/login";
    return axiosClient.post(url, data, {
      withCredentials: true,
    });
  },

  refreshToken: () => {
    const url = "/user/refreshTk";
    return axiosClient.get(url, {
      withCredentials: true,
    });
  },

  googleLogin: (data) => {
    const url = "/user/google";
    return axiosClient.post(url, data, {
      withCredentials: true,
    });
  },

  navInfo: ()=>{
    const url = "/user/navInfo";
    return axiosClient.get(url,{
      withCredentials: true,
    })
  },

  logout: ()=>{
    const url = "/user/logout";
    return axiosClient.post(url, null, {
      withCredentials: true,
    });
  },

  changeAccount: (data)=>{
    const url = "/user/changeAccount";
    return axiosClient.patch(url, data,{
      withCredentials: true,
    });
  },
  
  uploadAvatar: (data)=>{
    const url = "/user/uploadAvatar"; 
    return axiosClient.patch(url, data,{
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });
  },

  updateInfo: (data)=>{
    const url = "/user/updateInfo"; 
    return axiosClient.patch(url, data,{
      withCredentials: true,
    });
  },
};

export default userApi;
