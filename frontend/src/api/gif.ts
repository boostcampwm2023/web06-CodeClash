import { gifAxios } from "./baseAxios";

const giphy = {
  apiKey: process.env.REACT_APP_GIPHY_API_KEY,
  tag: "fail",
  type: "random",
  rating: "pg-13",
};

// giphy api가 안되면 사용할 gif
const emegencyGif = [
  "https://media0.giphy.com/media/YTJXDIivNMPuNSMgc0/giphy.gif?cid=ecf05e47wx3uwnzvw7qgeaglnnb0m3bbvz5gt5rq8v2ucgzd&ep=v1_gifs_search&rid=giphy.gif&ct=g",
  "https://media0.giphy.com/media/8FD4LPKvrPjgQIwXTZ/giphy.gif?cid=ecf05e47wx3uwnzvw7qgeaglnnb0m3bbvz5gt5rq8v2ucgzd&ep=v1_gifs_search&rid=giphy.gif&ct=g",
  "https://media2.giphy.com/media/3o7aCPbznb29hgOgG4/giphy.gif?cid=ecf05e474atqa3gmgds1egg10dk2iyiovxlh7jcwrrdaph3m&ep=v1_gifs_search&rid=giphy.gif&ct=g",
  "https://media1.giphy.com/media/46sfDHGVoXH333y8Fn/giphy.gif?cid=ecf05e4762gz0o84csi21w8hldg7rk98ll9jqhylp3thdjfm&ep=v1_gifs_search&rid=giphy.gif&ct=g",
  "https://media4.giphy.com/media/Ur5KR1N1E7OSY/giphy.gif?cid=ecf05e474atqa3gmgds1egg10dk2iyiovxlh7jcwrrdaph3m&ep=v1_gifs_search&rid=giphy.gif&ct=g",
];

export const getFailedGif = async (limit: number = 25) => {
  let giphyURL = encodeURI(giphy.type + "?api_key=" + giphy.apiKey + "&tag=" + giphy.tag + "&rating=" + giphy.rating);
  try {
    const res = await gifAxios.get(giphyURL);
    return res.data.data.images.original.url;
  } catch (err) {
    return emegencyGif.sort(() => Math.random() - 0.5)[0];
  }
};
