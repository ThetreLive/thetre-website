import Loader from "@/components/loader";
import ThetaPlayer from "@/components/thetaPlayer";
import { ProposalDetails, useThetreContext } from "@/context/thetreContext";
import { getFileURL } from "@/utils/theta";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const Proposal: React.FC = () => {
  const router = useRouter();
  const [proposal, setProposal] = useState<ProposalDetails | undefined>(undefined);
  const { proposalDetails, fetchProposals, setLoader, castVote } = useThetreContext();
  const playerRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (router.isReady && router.query.id) {
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
  }, [router.isReady, router.query.id, proposalDetails]);

  if (!proposal) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-bg-blue p-8 text-white">
      <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold underline decoration-thetre-blue mb-6 text-center">
          {proposal.data.title}
        </h1>
        <div className="mb-6">
          {proposal.data.isDRMEnabled ? (
            <ThetaPlayer
              poster={getFileURL(
                JSON.parse(proposal.data.coverLink as string).result.key,
                JSON.parse(proposal.data.coverLink as string).result.relpath
              )}
              playerRef={playerRef}
              videoId={proposal.data.movieLink as string}
              type="DRM"
              styles="w-full h-96"
            />
          ) : (
            <video
              poster={getFileURL(
                JSON.parse(proposal.data.coverLink as string).result.key,
                JSON.parse(proposal.data.coverLink as string).result.relpath
              )}
              controls
              className="w-full h-96 bg-black"
            >
              <source
                src={getFileURL(
                  JSON.parse(proposal.data.movieLink as string).result.key,
                  JSON.parse(proposal.data.movieLink as string).result.relpath
                )}
              />
            </video>
          )}
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Details</h2>
          <p className="mb-2">
            <span className="font-bold underline decoration-thetre-blue">Description:</span> {proposal.data.description}
          </p>
          <p className="mb-2">
            <span className="font-bold underline decoration-thetre-blue">Genre:</span> {proposal.data.genre}
          </p>
          <p className="mb-2">
            <span className="font-bold underline decoration-thetre-blue">Cast:</span> {proposal.data.cast}
          </p>
          <p className="mb-2">
            <span className="font-bold underline decoration-thetre-blue">Directed By:</span> {proposal.data.director}
          </p>
          <p className="mb-2">
            <span className="font-bold underline decoration-thetre-blue">Produced By:</span> {proposal.data.producer}
          </p>
          <p className="mb-2">
            <span className="font-bold underline decoration-thetre-blue">Available On:</span> {proposal.data.platforms}
          </p>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Trailer</h2>
          <video controls className="w-full h-64 bg-black">
            <source
              src={getFileURL(
                JSON.parse(proposal.data.trailerLink as string).result.key,
                JSON.parse(proposal.data.trailerLink as string).result.relpath
              )}
            />
          </video>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Cover Image</h2>
          <div className="flex justify-center items-center h-64 bg-gray-700">
            <img
              className="max-h-full max-w-full"
              src={getFileURL(
                JSON.parse(proposal.data.coverLink as string).result.key,
                JSON.parse(proposal.data.coverLink as string).result.relpath
              )}
              alt="Cover Page"
            />
          </div>
        </div>
        <div className="flex justify-center space-x-4">
          <button
            className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700"
            onClick={async () => await castVote(router.query.id as string, 1)}
          >
            Approve
          </button>
          <button
            className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700"
            onClick={async () => await castVote(router.query.id as string, 0)}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default Proposal;
