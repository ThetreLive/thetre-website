import Loader from "@/components/loader";
import ThetaPlayer from "@/components/thetaPlayer";
import { ProposalDetails, useThetreContext } from "@/context/thetreContext";
import { useWalletContext } from "@/context/walletContext";
import { getFileURL } from "@/utils/theta";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const Proposal: React.FC = () => {
  const router = useRouter();
  const [proposal, setProposal] = useState<ProposalDetails | undefined>(undefined);
  const [isWatching, setIsWatching] = useState(false);
  const [isWatchingTrailer, setIsWatchingTrailer] = useState(false);
  const { power } = useWalletContext();
  const { proposalDetails, fetchProposals, setLoader, castVote } = useThetreContext();
  const playerRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (router.isReady && router.query.id) {
      if (power === "0") { router.replace("/"); return;}
      if (proposalDetails.length > 0) {
        const foundProposal = proposalDetails.find((proposal) => proposal.id === router.query.id);
        setProposal(foundProposal);
      } else {
        (async () => {
          await setLoader(async () => {
            await fetchProposals();
            const foundProposal = proposalDetails.find((proposal) => proposal.id === router.query.id);
            setProposal(foundProposal);
          });
        })();
      }
    }
  }, [router.isReady, router.query.id, proposalDetails, power]);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.onended = () => {
        setIsWatching(false);
        setIsWatchingTrailer(false);
      };
    }
  }, [isWatching, isWatchingTrailer]);

  if (!proposal) {
    return <Loader loading={true}/>;
  }

  return (
    <div className="h-screen w-screen bg-bg-thetre text-white">
      <div className="lg:hidden"><Loader loading={false}/></div>
      <div className={`rounded-lg shadow-lg ${isWatching || isWatchingTrailer ? 'bg-gray-800' : 'bg-transparent'}`}>
        {!isWatching && !isWatchingTrailer ? (
          <div className="relative h-screen w-screen">
            <Image
              className="absolute top-0 left-0 h-full w-full object-cover"
              src={getFileURL(
                JSON.parse(proposal.data.coverLink as string).result.key,
                JSON.parse(proposal.data.coverLink as string).result.relpath
              )}
              alt="Cover Page"
              fill
            />
            <div className="absolute top-[100px] left-[100px] w-[600px] z-100 h-[300px]">
                <Image
                    src={getFileURL(
                      JSON.parse(proposal.data.logoLink as string).result.key,
                      JSON.parse(proposal.data.logoLink as string).result.relpath
                    )}
                    alt="Overlay Image"
                    className="object-contain"
                    fill
                />
            </div>
            <div className="relative z-10 flex lg:items-center items-end h-full px-16">
              <div className="text-left text-white lg:w-1/2 bg-black bg-opacity-50 lg:p-8 p-4 rounded-lg backdrop-blur-xl relative top-[100px]">
                <p className="text-lg mb-2">{proposal.data.description}</p>
                <p className="text-lg"><strong>Genre:</strong> {proposal.data.genre}</p>
                <p className="text-lg"><strong>Cast:</strong> {proposal.data.cast}</p>
                <p className="text-lg"><strong>Directed By:</strong> {proposal.data.director}</p>
                <p className="text-lg"><strong>Produced By:</strong> {proposal.data.producer}</p>
                <p className="text-lg mb-2"><strong>Available On:</strong> {proposal.data.platforms}</p>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-4 w-full">
                    <button
                      className="bg-custom-radial px-6 py-3 font-bold rounded-xl"
                      onClick={() => setIsWatching(true)}
                    >
                      Watch Movie
                    </button>
                    <button
                      className="bg-gray-700 px-4 py-2 rounded-xl"
                      onClick={() => setIsWatchingTrailer(true)}
                    >
                      Watch Trailer
                    </button>
                  </div>
                  <div className="flex space-x-4 mt-4">
                    <button
                      className="bg-green-500 text-white font-bold py-2 px-4 rounded-xl hover:bg-green-700"
                      onClick={async () => await castVote(router.query.id as string, 1)}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 text-white font-bold py-2 px-4 rounded-xl hover:bg-red-700"
                      onClick={async () => await castVote(router.query.id as string, 0)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {isWatching ? (
              proposal.data.isDRMEnabled ? (
            <ThetaPlayer
              poster={getFileURL(
                JSON.parse(proposal.data.coverLink as string).result.key,
                JSON.parse(proposal.data.coverLink as string).result.relpath
              )}
              playerRef={playerRef}
              videoId={proposal.data.movieLink as string}
              type="DRM"
                  styles="w-screen h-screen"
            />
          ) : (
            <video
                  ref={playerRef}
              poster={getFileURL(
                JSON.parse(proposal.data.coverLink as string).result.key,
                JSON.parse(proposal.data.coverLink as string).result.relpath
              )}
              controls
                  className="w-screen h-screen bg-black"
            >
              <source
                src={getFileURL(
                  JSON.parse(proposal.data.movieLink as string).result.key,
                  JSON.parse(proposal.data.movieLink as string).result.relpath
                )}
              />
            </video>
              )
            ) : (
              <video
                ref={playerRef}
                poster={getFileURL(
                  JSON.parse(proposal.data.coverLink as string).result.key,
                  JSON.parse(proposal.data.coverLink as string).result.relpath
                )}
                controls
                className="w-screen h-screen bg-black"
              >
            <source
              src={getFileURL(
                JSON.parse(proposal.data.trailerLink as string).result.key,
                JSON.parse(proposal.data.trailerLink as string).result.relpath
              )}
            />
          </video>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Proposal;
