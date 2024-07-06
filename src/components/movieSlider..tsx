import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';

const movies = [
  {
    title: 'Painkiller',
    genre: 'Action, Drama, Thriller',
    rating: '8.2',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    image: 'https://rose-melodic-felidae-510.mypinata.cloud/ipfs/QmVzdkmorYbK1NrLhwGFGNQRs65otVZGxS1hTKubfUbYux',
  },
  {
    title: 'Another Movie',
    genre: 'Comedy, Drama',
    rating: '7.5',
    description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    image: 'https://rose-melodic-felidae-510.mypinata.cloud/ipfs/QmVzdkmorYbK1NrLhwGFGNQRs65otVZGxS1hTKubfUbYux',
  },
  // Add more movies as needed
];

const MovieSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    appendDots: (dots: any) => (
      <div>
        <ul style={{ margin: "0px" }}> {dots} </ul>
      </div>
    ),
  };


  function SampleNextArrow(props: any) {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} text-white`}
        style={{ ...style, display: 'block' }}
        onClick={onClick}
      />
    );
  }

  function SamplePrevArrow(props: any) {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} text-white`}
        style={{ ...style, display: 'block' }}
        onClick={onClick}
      />
    );
  }

  return (
    <div className="relative h-screen">
      <Slider {...settings}>
        {movies.map((movie, index) => (
          <div key={index} className="relative h-screen">
            <img src={movie.image} alt={movie.title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0"></div>
            <div className="relative z-10 flex md:items-center items-end h-full px-16">
              <div className="text-left text-white md:w-1/3 bg-black bg-opacity-50 p-8 rounded-lg backdrop-blur-xl">
                <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>
                <p className="text-lg mb-4">{movie.genre}</p>
                <p className="text-sm mb-8">Rating: {movie.rating}</p>
                <p className="mb-8">{movie.description}</p>
                <div className="flex space-x-4">
                  <button className="bg-custom-radial px-6 py-3 font-bold rounded-full">Watch now</button>
                  <button className="bg-gray-700 px-4 py-2 rounded-full">Trailer</button>
                  <button className="bg-gray-700 px-4 py-2 rounded-full">More</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default MovieSlider;
