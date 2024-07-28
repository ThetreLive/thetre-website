import { ProposalDetails, useThetreContext } from '@/context/thetreContext';
import { getFileURL } from '@/utils/theta';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';
import Slider from 'react-slick';

const MovieSlider = (props: { scroll: boolean, proposalDetails: ProposalDetails[], access: string[] }) => {
    const { buyTicket } = useThetreContext();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [hoverDelayPassed, setHoverDelayPassed] = useState<number | null>(null);
    const [trailerPlayingIndex, setTrailerPlayingIndex] = useState<number | null>(null);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    useEffect(() => {
        if (hoveredIndex !== null) {
            const timer = setTimeout(() => {
                setHoverDelayPassed(hoveredIndex);
            }, 3000);
            return () => clearTimeout(timer);
        } else {
            setHoverDelayPassed(null);
        }
    }, [hoveredIndex]);

    useEffect(() => {
        const handleVideoEnd = () => {
            setTrailerPlayingIndex(null);
        };

        const currentVideoRef = videoRefs.current[trailerPlayingIndex as number];
        if (currentVideoRef) {
            currentVideoRef.addEventListener('ended', handleVideoEnd);
        }

        return () => {
            if (currentVideoRef) {
                currentVideoRef.removeEventListener('ended', handleVideoEnd);
            }
        };
    }, [trailerPlayingIndex]);

    const handleTrailerClick = (index: number) => {
        setTrailerPlayingIndex(index);
        const videoElement = videoRefs.current[index];
        if (videoElement) {
            videoElement.play();
        }
    };

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
        <div className="relative h-full" style={{
            WebkitBoxShadow: 'inset 65px 41px 115px 0px rgba(0,0,0,0.75)',
            MozBoxShadow: 'inset 65px 41px 115px 0px rgba(0,0,0,0.75)',
            boxShadow: 'inset 65px 41px 115px 0px rgba(0,0,0,0.75)',
        }}>
            <Slider {...settings}>
                {props.proposalDetails.slice(0, 3).map((movie, index) => {
                    const coverURL = getFileURL(
                        JSON.parse(movie.data.coverLink as string).result.key,
                        JSON.parse(movie.data.coverLink as string).result.relpath
                    );

                    const logoURL = getFileURL(
                        JSON.parse(movie.data.logoLink as string).result.key,
                        JSON.parse(movie.data.logoLink as string).result.relpath
                    );

                    const trailerURL = getFileURL(
                        JSON.parse(movie.data.trailerLink as string).result.key,
                        JSON.parse(movie.data.trailerLink as string).result.relpath
                    );

                    return (
                        <div
                            key={index}
                            className='relative h-full w-full'
                            onMouseEnter={() => props.scroll && setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <Image
                                src={coverURL}
                                alt={movie.data.title}
                                className="absolute inset-0 w-full h-full object-cover"
                                fill
                            />
                            <div
                                className={`absolute inset-0 bg-gradient opacity-50`}
                                style={{
                                    background: "radial-gradient(circle at 70% center, transparent 25%, rgba(0, 0, 0, 0.5) 50%, black 75%)"
                                }}
                            />
                            {props.scroll && (
                                <div className="absolute top-[100px] left-[100px] w-[600px] z-100 h-[300px]">
                                <Image
                                    src={logoURL}
                                    alt="Overlay Image"
                                    className="object-contain"
                                    fill
                                />
                            </div>

                            )}
                            {(hoverDelayPassed === index || trailerPlayingIndex === index) && props.scroll ? (
                                <video
                                    ref={el => { videoRefs.current[index] = el; }}
                                    src={trailerURL}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    autoPlay
                                    controls
                                />
                            ) : (
                                <div className="relative z-10 flex lg:items-center items-end h-full px-16">
                                    {props.scroll && (
                                        <div className="text-left text-white lg:w-1/3 bg-black bg-opacity-50 lg:p-8 p-4 rounded-lg backdrop-blur-xl relative top-[100px]">
                                            {/* <h1 className="lg:text-4xl text-2xl font-bold mb-4">{movie.data.title}</h1> */}
                                            <p className="lg:text-xl text-xl font-bold mb-4">{movie.data.genre}</p>
                                            <p className="mb-8 text-base">{movie.data.description}</p>
                                            <div className="flex space-x-4">
                                                {props.access.includes(movie.data.title) || !movie.data.isDRMEnabled ? (
                                                    <Link href={`/watch/${movie.id}`} className="bg-custom-radial px-6 py-3 font-bold rounded-xl">Watch Now</Link>
                                                ) : (
                                                    <button onClick={() => buyTicket(movie.data.title)} className="bg-custom-radial px-6 py-3 font-bold rounded-xl">Buy Pass for 10TFUEL</button>
                                                )}
                                                <button onClick={() => handleTrailerClick(index)} className="bg-gray-700 px-4 py-2 rounded-xl">Trailer</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </Slider>
        </div>
    );
};

export default MovieSlider;
