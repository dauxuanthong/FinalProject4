import axiosClient from "./axiosClient";

const conversationApi = {
  contact: (data) => {
    const url = "/conversation/contact";
    return axiosClient.post(url, data, {
      withCredentials: true,
    });
  },
  myConversationList: () => {
    const url = "/conversation/myConversationList";
    return axiosClient.get(url, {
      withCredentials: true,
    });
  },
  partnerInfo: (id) => {
    const url = `/conversation/partnerInfo/${id}`;
    return axiosClient.get(url, {
      withCredentials: true,
    });
  },
  getConversationDetail: (param) => {
    const url = `/conversation/getConversationDetail/${param}`;
    return axiosClient.get(url, {
      withCredentials: true,
    });
  },
  sendMessage: (data) => {
    const url = "/conversation/sendMessage";
    return axiosClient.post(url, data, {
      withCredentials: true,
    });
  },
  sendImgMessage: (data, param) => {
    const url = `/conversation/sendImgMessage/${param}`;
    return axiosClient.post(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
  },
  getImageListMedia: (param) => {
    const url = `/conversation/getImageListMedia/${param}`;
    return axiosClient.get(url, {
      withCredentials: true,
    });
  },
};
export default conversationApi;
