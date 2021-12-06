import axiosClient from "./axiosClient";

const searchApi = {
  getAllSearchData: (param) => {
    const url = `/search/${param}`;
    return axiosClient.get(url, {
      withCredentials: true,
    });
  },
  search: (params) => {
    const url = `/search/searchDetail`;
    return axiosClient.get(
      url,
      { params },
      {
        withCredentials: true,
      }
    );
  },
};
export default searchApi;
