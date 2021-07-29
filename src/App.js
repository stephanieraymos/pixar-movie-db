import React, { useState, useEffect } from "react";
// import Header from "./components/Header";
import Table from "./components/Table";
import useFetch from "./hooks/useFetch";
import { movieURL } from "./urls";

const App = () => {
  // ------ STATE ---------
  const [currentMovie, setCurrentMovie] = useState([]);
  const [currentMovieId, setCurrentMovieId] = useState(null);
  const [details, setDetails] = useState(null);
  const [movieImage, setMovieImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0); // if length -1 no go forward
  const [sortField, setSortField] = useState(null);

  // ------ GETTING MAIN DATA ---------
  const { data: movies } = useFetch(movieURL);

  useEffect(() => {
    if (movies) {
      // console.log(JSON.stringify(data));
      setCurrentMovie(movies.results[currentIndex]);
      console.log(movies.results[currentIndex]);
    }
  }, [movies, currentIndex]);

  useEffect(() => {
    if (movies?.results?.length > 0) {
      setCurrentMovieId(currentMovie.id);
    }
  }, [currentMovie, movies]);
  // -------- END GETTING MAIN DATA ------

  // ------ GETTING DETAILS (PER EACH MOVIE) ---------
  useEffect(() => {
    const getDetails = () => {
      console.log("Calling fetch");
      fetch(
        `https://api.themoviedb.org/3/movie/${currentMovieId}?api_key=51b2550f677015fea635590d341a4cad`
      )
        .then((res) => res.json())
        .then((details) => setDetails(details));
      //  .then((details) => console.log("details", details));
    };

    if (currentMovieId) {
      getDetails();
    }
  }, [currentMovieId]);

  useEffect(() => {
    console.log("details", details);
  }, [details]);
  // -------- END GETTING DETAILS ------

  // ------ GETTING IMAGE ---------
  useEffect(() => {
    const getImage = () => {
      console.log("Calling fetch for image");
      fetch(
        `http://api.themoviedb.org/3/configuration?api_key=51b2550f677015fea635590d341a4cad`
      )
        .then((res) => res.json())
        .then((movieImage) => setMovieImage(movieImage));
      //  .then((details) => console.log("details", details));
    };
    if (currentMovieId) {
      getImage();
    }
  }, [currentMovieId]);

  useEffect(() => {
    console.log("movie image", movieImage);
  }, [movieImage]);
  // -------- END GETTING IMAGE ------

  const handleNext = () => {
    setCurrentIndex(currentIndex + 1);
  };
  const handlePrev = () => {
    setCurrentIndex(currentIndex - 1);
  };

  const handleClick = (currentIndex) => {
    setCurrentIndex(currentIndex);
    console.log("hi", currentIndex);
    console.log(
      movies.results.map((title) => {
        return title.title;
      })
    );
    // console.log("title list", titleList);
  };

  const sortMovies = (a, b) => {
    if (a[sortField] < b[sortField]) {
      return -1;
    }
    if (a[sortField] > b[sortField]) {
      return 1;
    }
    return 0;
  };

  const handleSort = (field) => {
    setSortField(field);
  };

  // OPTIONS FOR DATE PARSING
  const options = { year: "numeric", month: "long", day: "numeric" };

  //Render nothing if there is no details, current movie id or movie image
  if (!currentMovieId || !details || !movieImage) {
    return null;
  }
  return (
    <>
      <div className="App">
        <div
          className="detailOuter"
          style={{
            backgroundImage: `url(${movieImage.images.base_url}${movieImage.images.poster_sizes[5]}${currentMovie.poster_path})`,
            backgroundPosition: "50% 50%",
          }}
        >
          <div className="detailBox">
            <div className="detailText">
              <div className="detailTitle">{currentMovie.title}</div>
              {details.tagline ? (
                <div className="detailField">
                  <div className="detailLabel">Tagline:</div>
                  <div className="detailContent">{details.tagline}</div>
                </div>
              ) : null}

              <div className="detailField">
                <div className="detailLabel">Release Date:</div>
                <div className="detailContent">
                  {new Date(currentMovie.release_date).toLocaleDateString(
                    undefined,
                    options
                  )}
                </div>
              </div>
              <div className="detailField">
                <div className="detailLabel">Companies:</div>
                <div className="detailContent">
                  {details.production_companies
                    .map((prodComp) => {
                      return prodComp.name;
                    })
                    .join(", ")}
                </div>
              </div>
              <div className="detailOverview">{currentMovie.overview}</div>
              {details.homepage ? (
                <div className="detailHomepage">
                  <a
                    href={details.homepage}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {details.homepage}
                    {/* https://movies.disney.com/{currentMovie.title} */}
                  </a>
                </div>
              ) : null}
            </div>

            <div className="detailPoster">
              {/* When I go to next page, clicking image doesn't go to the correct link */}
              <a href={details.homepage} target="_blank" rel="noreferrer">
                <img
                  src={`${movieImage.images.base_url}${movieImage.images.poster_sizes[1]}${currentMovie.poster_path}`}
                  alt=""
                />
              </a>
            </div>
            {currentIndex !== 0 && (
              <span className="badge-switch-left" onClick={() => handlePrev()}>
                <i className="fa fa-chevron-left"></i>
              </span>
            )}
            {currentIndex !== movies.results.length - 1 && (
              <span className="badge-switch-right" onClick={() => handleNext()}>
                <i className="fa fa-chevron-right"></i>
              </span>
            )}
          </div>
        </div>
        {/* );
           })} */}

        {/* The table data will go here. */}

        <div className="tableOuter"></div>
        {/* <Header title="New Pixar Movies" /> */}
        {movies ? (
          <Table
            tableData={movies.results.sort(sortMovies).map((movie) => {
              return [
                movie.title,
                new Date(movie.release_date).toLocaleDateString(
                  undefined,
                  options
                ),
              ];
            })}
            headingColumns={["Title", "Release Date"]}
            title="Pixar Movies"
            breakOn="small"
            onItemClick={handleClick}
            onHeadingClick={handleSort}
            headingColumnFields={["title", "release_date"]}
          />
        ) : null}
        {/* {data
          ? data.results.map((item) => {
              return <pre>{JSON.stringify(item)}</pre>;
            })
          : null} */}
      </div>
    </>
  );
};

export default App;
