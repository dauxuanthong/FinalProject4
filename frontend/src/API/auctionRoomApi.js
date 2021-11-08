import axiosClient from "./axiosClient";

const auctionRoomApi = {
  joinAuctionRoom: (data) => {
    const url = "/auctionRoom/join";
    return axiosClient.post(url, data, {
      withCredentials: true,
    });
  },

  functionData: (param) => {
    const url = `/auctionRoom/functionData/${param}`;
    return axiosClient.get(url, {
      withCredentials: true,
    });
  },

  bid: (roomId) => {
    const url = `/auctionRoom/bid`;
    return axiosClient.post(url, roomId, {
      withCredentials: true,
    });
  },

  upPrice: (data) => {
    const url = `/auctionRoom/upPrice`;
    return axiosClient.post(url, data, {
      withCredentials: true,
    });
  },

  history: (roomId) => {
    const url = `/auctionRoom/history/${roomId}`;
    return axiosClient.get(url, {
      withCredentials: true,
    });
  },

  applyAutoBid: (data) => {
    const url = `/auctionRoom/applyAutoBid`;
    return axiosClient.post(url, data, {
      withCredentials: true,
    });
  },
};

export default auctionRoomApi;
