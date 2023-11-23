import { gifAxios } from "./baseAxios";

export const getTrendGif = async (limit: number = 25) => {
  const giphy = {
    apiKey: "6qyUD0EpEB5XLEbCpYSSxDockO1xG7pY",
    tag: "fail",
    type: "random",
    rating: "pg-13",
  };

  let giphyURL = encodeURI(giphy.type + "?api_key=" + giphy.apiKey + "&tag=" + giphy.tag + "&rating=" + giphy.rating);

  const res = await gifAxios.get(giphyURL);
  return res.data.data.images.original.url;
};
