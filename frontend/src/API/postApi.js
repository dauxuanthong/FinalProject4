import axiosClient from "./axiosClient";

const postApi = {
  getType: () => {
    const url = "/post/getType";
    return axiosClient.get(url, { withCredentials: true });
  },

  normalPostImg: (data) => {
    const url = "/post/normalUploadImg";
    return axiosClient.post(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
  },

  normalPostInfo: (data) => {
    const url = "/post/normalUploadInfo";
    return axiosClient.post(url, data, {
      withCredentials: true,
    });
  },

  auctionPostInfo: (data) => {
    const url = "/post/auctionUploadInfo";
    return axiosClient.post(url, data, {
      withCredentials: true,
    });
  },

  getMyPost: () => {
    const url = "/post/myPost";
    return axiosClient.get(url, {
      withCredentials: true,
    });
  },

  deletePost: (data) => {
    const url = "/post/delete";
    return axiosClient.delete(url, data, {
      withCredentials: true,
    });
  },

  getAllPost: () => {
    const url = "/post/allPost";
    return axiosClient.get(url);
  },

  normalPostDetail: (param) => {
    const url = `/post/normalPostDetail/${param}`;
    return axiosClient.get(url, {
      withCredentials: true,
    });
  },

  auctionPostDetail: (param) => {
    const url = `/post/auctionPostDetail/${param}`;
    return axiosClient.get(url, {
      withCredentials: true,
    });
  },
};

export default postApi;
