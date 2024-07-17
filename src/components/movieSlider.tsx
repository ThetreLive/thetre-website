import { ProposalDetails } from '@/context/thetreContext';
import { getFileURL } from '@/utils/theta';
import Image from 'next/image';
import React from 'react';
import Slider from 'react-slick';

const MovieSlider = (props: { proposalDetails: ProposalDetails[] }) => {  
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
    <div className="h-full">
      <Slider {...settings}>
        {props.proposalDetails.map((movie, index) => (
          <div key={index} className="relative h-full">
            <Image src={getFileURL(JSON.parse(movie.data.coverLink as string).result.key, JSON.parse(movie.data.coverLink as string).result.relpath)} alt={movie.data.title} className="absolute inset-0 w-full h-full object-cover rounded-2xl" fill/>
            <div className="absolute inset-0"></div>
            <div className="relative z-10 flex lg:items-center items-end h-full px-16">
              <div className="text-left text-white lg:w-1/3 bg-black bg-opacity-50 lg:p-8 p-4 rounded-lg backdrop-blur-xl">
                <h1 className="lg:text-5xl text-3xl font-bold mb-4">{movie.data.title}</h1>
                <p className="lg:text-lg text-sm mb-4">{movie.data.genre}</p>
                {/* <p className="text-sm mb-8">Rating: {movie.rating}</p> */}
                <p className="mb-8 lg:text-base text-sm">{movie.data.description}</p>
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
