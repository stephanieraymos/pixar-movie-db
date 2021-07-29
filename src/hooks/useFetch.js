import { useState, useEffect } from "react";
const useFetch = (
  url = "https://api.themoviedb.org/3/company/3-pixar-animation-studios/movies?api_key=51b2550f677015fea635590d341a4cad&page=2",
  options = null
) => {
  const [data, setData] = useState(null);
  const get = () => {
    fetch(url, options)
      .then((res) => res.json())
      .then((data) => setData(data));
  }
  useEffect(() => {
    get()
  }, [])
  return { data, get };
};
export default useFetch;
