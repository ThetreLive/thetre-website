import { ProposalDetails, useThetreContext } from '@/context/thetreContext';
import { getFileURL } from '@/utils/theta';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';
import LivestreamSchedule from './schedule';
import { useWalletContext } from '@/context/walletContext';

interface Props {
    proposal: ProposalDetails,
    access: string[],
    muted: boolean,
    changePage: any
}

const MovieCard: React.FC<Props> = ({ proposal, access, muted, changePage }) => {
    const { buyTicket } = useThetreContext();
    const [isHovered, setIsHovered] = useState(false);
    const [isHoverDelayPassed, setIsHoverDelayPassed] = useState(false);
    const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [viewSchedule, setViewSchedule] = useState(false);
    const [countDown, setCountDown] = useState("");
    const { subscribed } = useWalletContext()
    useEffect(() => {
        let interval: any;
        if (proposal) {
            if (proposal.data.livestreamData) {
                const livestreamData: ProposalDetails["data"]["livestreamData"] = JSON.parse(JSON.parse(proposal.data.livestreamData as any));
                const startDate = new Date(livestreamData?.selectedDates[0]!);
                const endDate = new Date(livestreamData?.selectedDates[1]!);
                const screeningTimes = livestreamData?.screeningTimes;
                const callbackFn = () => {
                    const {closestTime, closestDifference} = findClosestTime(screeningTimes!, startDate, endDate);
                    if (closestTime) {
                        setCountDown(timeString(closestDifference));
                    }
                }
                callbackFn()
                interval = setInterval(callbackFn, 60000)
                
            }
        }
        return () => clearInterval(interval);
    }, [proposal])

    const timeString = (time: number) => {
        const totalSeconds = Math.floor(time / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const totalHours = Math.floor(totalMinutes / 60);

        // Calculate remaining minutes and seconds
        const hours = totalHours;
        const minutes = totalMinutes % 60;

        // Format the result as hh:mm
        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');

        return `${formattedHours}:${formattedMinutes}`;
    }

    const convertUTCToLocal = (utcDate: Date) => {
        return new Intl.DateTimeFormat(navigator.language, {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(utcDate);
      };
    
      const findClosestTime = (screeningTimes: string[], startDate: Date, endDate: Date) => {
        const currentTimeUTC = new Date();
    
        let closestTime = null;
        let closestDifference = Infinity;
    
        for (const time of screeningTimes) {
          for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            const [hours, minutes] = time.split(':').map(Number);
            const screeningTimeUTC = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes));
            
            const difference = screeningTimeUTC.getTime() - currentTimeUTC.getTime();
    
            if (difference > 0 && difference < closestDifference) {
              closestDifference = difference;
              closestTime = screeningTimeUTC;
            }
          }
        }
    
        return {closestTime, closestDifference};
      };

    const coverURL = getFileURL(
        JSON.parse(proposal.data.coverLink as string).result.key,
        JSON.parse(proposal.data.coverLink as string).result.relpath
    );

    const logoURL = getFileURL(
        JSON.parse(proposal.data.logoLink as string).result.key,
        JSON.parse(proposal.data.logoLink as string).result.relpath
    );

    const trailerURL = getFileURL(
        JSON.parse(proposal.data.trailerLink as string).result.key,
        JSON.parse(proposal.data.trailerLink as string).result.relpath
    );

    useEffect(() => {
        if (isHovered) {
            hoverTimeoutRef.current = setTimeout(() => {
                setIsHoverDelayPassed(true);
            }, 3000);
        } else {
            setIsHoverDelayPassed(false);
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
                hoverTimeoutRef.current = null;
            }
        }
    }, [isHovered]);

    const handleTrailerClick = () => {
        setIsTrailerPlaying(true);
        if (videoRef.current) {
            videoRef.current.play();
        }
    };

    const handleVideoEnd = () => {
        setIsTrailerPlaying(false);
    };

    return (
        <>
          <div className="bg-black/50 backdrop-blur-xl border border-gray-400/40 text-white rounded-lg shadow-lg p-4 flex-1 relative flex flex-col justify-between">
            <div 
              className='w-full h-48 relative overflow-hidden rounded-t-lg'
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {(isHoverDelayPassed || isTrailerPlaying) ? (
                <video
                  ref={videoRef}
                  src={trailerURL}
                  className="w-full h-full object-cover transition-opacity duration-300"
                  autoPlay
                  controls
                  muted={muted}
                  onEnded={handleVideoEnd}
                />
              ) : (
                <>
                  <Image
                    src={coverURL}
                    alt={proposal.data.title}
                    className="w-full h-full object-cover transition-opacity duration-300"
                    fill
                  />
                  <div className="absolute top-2 left-2 w-[200px] h-[130px]">
                    <Image
                      src={logoURL}
                      alt="Overlay Image"
                      className="object-contain"
                      fill
                    />
                  </div>
                </>
              )}
            </div>
            <div className="p-4 flex flex-col justify-between flex-1">
              <div>
                <h2 className="text-xl font-bold mb-2">{proposal.data.title}</h2>
                <div className='flex flex-row justify-between items-center pb-1'>
                  <p className="text-gray-200">Genre - {proposal.data.genre}</p>
      
                  {proposal.data.livestreamData ? (
                    <button 
                      onClick={() => setViewSchedule(true)}
                      className="bg-gray-700 px-2 py-1 rounded-xl"
                    >
                      View Schedule
                    </button>
                  ) : <div></div>}
                </div>
                <p className="text-gray-200">{proposal.data.description.slice(0, 100)}...</p>
              </div>
              <div className="flex justify-between items-center mt-4 gap-2">
                {(access.includes(proposal.data.title) || subscribed) || !proposal.data.isDRMEnabled ? (
                  <>
                    {changePage ? (
                      <button 
                        onClick={() => changePage(proposal.id)} 
                        className="bg-custom-radial px-6 py-3 font-bold rounded-lg"
                      >
                        {(proposal.data.livestreamData && access.includes(proposal.data.title)) ? "Next Screening in " + countDown : "Watch Now"}
                      </button>
                    ) : (
                      <Link 
                        href={`/watch/${proposal.id}`} 
                        className="bg-custom-radial px-6 py-3 font-bold rounded-lg"
                      >
                        {(proposal.data.livestreamData && access.includes(proposal.data.title)) ? "Next Screening in " + countDown : "Watch Now"}
                      </Link>
                    )}
                  </>
                ) : (
                  <button 
                    onClick={() => buyTicket(proposal.data.title)} 
                    className="bg-custom-radial px-6 py-3 font-bold rounded-xl"
                  >
                    Buy Pass for 10TFUEL
                  </button>
                )}
                <button 
                  onClick={handleTrailerClick}
                  className="bg-gray-700 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex-1"
                >
                  Trailer
                </button>
              </div>
            </div>
          </div>
      
          {proposal.data.livestreamData && viewSchedule && (
            <LivestreamSchedule 
              livestreamData={JSON.parse(JSON.parse(proposal.data.livestreamData! as any))} 
              onClose={() => setViewSchedule(false)} 
            />
          )}
        </>
      );
      
};

export default MovieCard;
