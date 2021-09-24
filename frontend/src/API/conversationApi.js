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
  getConversationDetail: (param) => {
    const url = `/conversation/getConversationDetail/${param}`;
    return axiosClient.get(url, {
      withCredentials: true,
    });
  },
};
export default conversationApi;
