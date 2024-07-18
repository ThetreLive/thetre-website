import { ProposalDetails, useThetreContext } from '@/context/thetreContext';
import { getFileURL } from '@/utils/theta';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Slider from 'react-slick';

const MovieSlider = (props: { proposalDetails: ProposalDetails[], access: string[] }) => {  
  const { buyTicket } = useThetreContext();
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    appendDots: (dots: any) => (
      <div>
        <ul style={{ margin: "0px" }}> {dots} </ul>
      </div>
    ),
  };


  function NextArrow(props: any) {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} text-white`}
        style={{ ...style, display: 'block' }}
        onClick={onClick}
      />
    );
  }

  function PrevArrow(props: any) {
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
    <div className="h-full"  style={{
      WebkitBoxShadow: 'inset 65px 41px 115px 0px rgba(0,0,0,0.75)',
      MozBoxShadow: 'inset 65px 41px 115px 0px rgba(0,0,0,0.75)',
      boxShadow: 'inset 65px 41px 115px 0px rgba(0,0,0,0.75)',
    }}>
      <Slider {...settings}>
        {props.proposalDetails.slice(0, 3).map((movie, index) => (
          <div key={index} className='relative h-full w-full'>
            <Image src={getFileURL(JSON.parse(movie.data.coverLink as string).result.key, JSON.parse(movie.data.coverLink as string).result.relpath)} alt={movie.data.title} className="absolute inset-0 w-full h-full object-cover" fill/>
            <div className="absolute inset-0"></div>
            <div className="relative z-10 flex lg:items-center items-end h-full px-16">
              <div className="text-left text-white lg:w-1/3 bg-black bg-opacity-50 lg:p-8 p-4 rounded-lg backdrop-blur-xl">
                <h1 className="lg:text-4xl text-2xl font-bold mb-4">{movie.data.title}</h1>
                <p className="lg:text-base text-sm mb-4">{movie.data.genre}</p>
                {/* <p className="text-sm mb-8">Rating: {movie.rating}</p> */}
                <p className="mb-8 text-sm">{movie.data.description}</p>
                <div className="flex space-x-4">
                  {props.access.includes(movie.data.title) || !movie.data.isDRMEnabled ? (
                    <Link href={`/watch/${movie.id}`} className="bg-custom-radial px-6 py-3 font-bold rounded-xl">Watch Now</Link>
                  ) : (
                    <button onClick={() => buyTicket(movie.data.title)} className="bg-custom-radial px-6 py-3 font-bold rounded-xl">Buy Pass for 10TFUEL</button>   
                    )}
                  
                  <button className="bg-gray-700 px-4 py-2 rounded-xl">Trailer</button>
                  <button className="bg-gray-700 px-4 py-2 rounded-xl">More</button>
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
