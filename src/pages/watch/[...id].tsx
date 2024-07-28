import AccountPage from "@/components/account";
import Chat from "@/components/chat";
import Loader from "@/components/loader";
import MovieCard from "@/components/movieCard";
import ThetaPlayer from "@/components/thetaPlayer";
import {
  ProposalDetails,
  ProposalState,
  useThetreContext,
} from "@/context/thetreContext";
import { useWalletContext } from "@/context/walletContext";
import { getFileURL, startStream } from "@/utils/theta";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const WatchPage: React.FC = () => {
  const router = useRouter();

  const playerRef = useRef<HTMLVideoElement>(null);
  const [movie, setMovie] = useState<ProposalDetails | undefined>(undefined);
  const { proposalDetails, fetchProposals, setLoader, getVideo, buyTicket } =
    useThetreContext();
  const { access, signer, balance, subscribed } = useWalletContext();
  const [isAuth, setAuth] = useState<boolean>(false);
  const [details, setDetails] = useState<any>("");
  const [login, setLogin] = useState<boolean>(false);
  const requestFunds = useRef(() => {});
  const changePage = useRef(() => {});

  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 3;

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const handleNextPage = () => {
    if (
      currentPage <
      Math.ceil(
        proposalDetails.filter((proposal) =>
          [
            ProposalState.Succeeded,
            ProposalState.Executed,
            ProposalState.Queued,
          ].includes(Number(proposal.proposalState))
        ).length / moviesPerPage
      )
    ) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const onPlay = () => {
    playerRef.current?.play();
  };

  const onSeek = (time: number) => {
    if (playerRef.current) {
      if (playerRef.current.currentTime !== time) {
        playerRef.current.currentTime = time;
      }
    }
  };

  const onPause = () => {
    playerRef.current?.pause();
  };

  const setRequestFunds = (func: any) => {
    requestFunds.current = func;
  };

  const setChangePage = (func: any) => {
    changePage.current = func;
  };

  useEffect(() => {
    if (router.isReady && router.query.id![0]) {
      if (proposalDetails.length > 0) {
        proposalDetails.map(async (proposal) => {
          if (proposal.id === router.query.id![0]) {
            if (proposal.data.isDRMEnabled  && (!subscribed || proposal.data.livestreamData)) {
              const videoId = await getVideo(proposal.data.title as string);
              setMovie({
                ...proposal,
                data: { ...proposal.data, movieLink: videoId },
              });
            } else setMovie(proposal);
          }
        });
      } else {
        (async () => {
          await setLoader(async () => {
            await fetchProposals();
            setMovie(
              await proposalDetails.map(async (proposal) => {
                if (proposal.id === router.query.id![0]) {
                  if (proposal.data.isDRMEnabled  && (!subscribed || proposal.data.livestreamData)) {
                    const videoId = await getVideo(
                      proposal.data.title as string
                    );
                    return {
                      ...proposal,
                      data: { ...proposal.data, movieLink: videoId },
                    };
                  } else return proposal;
                }
              })[0]
            );
          });
        })();
      }
    }
  }, [router.isReady, router.query.id, proposalDetails, subscribed]);

  useEffect(() => {
    if (movie && signer) {
      (async () => {
        if (movie.proposer === (await signer.getAddress())) {
          setAuth(true);
        }
      })();
    }
  }, [movie, signer]);
  if (!movie) {
    return <Loader />;
  }

  return (
    <div className="h-screen bg-bg-blue flex lg:flex-row flex-col">
      {!signer && (
        <AccountPage isOpen={true} onClose={() => {}} login={login} setLogin={setLogin} />
      )}
      <div className="w-full lg:h-screen lg:overflow-y-scroll flex-grow">
        {movie.data.isDRMEnabled ? (
          <ThetaPlayer
            playerRef={playerRef}
            videoId={movie.data.movieLink as string}
            type="DRM"
            poster={getFileURL(
              JSON.parse(movie.data.coverLink as string).result.key,
              JSON.parse(movie.data.coverLink as string).result.relpath
            )}
            styles={`w-full h-96 lg:h-[70vh]`}
          />
        ) : (
          <video
            controls
            className="w-full h-96 lg:h-[70vh] bg-black"
            ref={playerRef}
            poster={getFileURL(
              JSON.parse(movie.data.coverLink as string).result.key,
              JSON.parse(movie.data.coverLink as string).result.relpath
            )}
          >
            <source
              src={getFileURL(
                JSON.parse(movie.data.movieLink as string).result.key,
                JSON.parse(movie.data.movieLink as string).result.relpath
              )}
            />
          </video>
        )}
        <div>
            <div className="text-left px-6 text-white text-2xl mt-4">More from Thetre</div>
          <div
            className="grid grid-cols-3 gap-4 p-4 w-full justify-center"
            id="moreMovies"
          >
            {proposalDetails
              .filter((proposal) =>
                [
                  ProposalState.Succeeded,
                  ProposalState.Executed,
                  ProposalState.Queued,
                ].includes(Number(proposal.proposalState))
              )
              .slice(indexOfFirstMovie, indexOfLastMovie)
              .map((proposal, index) => (
                <MovieCard
                  key={index}
                  proposal={proposal}
                  access={access}
                  muted
                  changePage={changePage.current}
                />
              ))}
          </div>
          <div className="flex justify-center items-center space-x-4 p-4">
            <button
              className={`px-4 py-2 text-white ${
                currentPage === 1 ? "bg-gray-400" : "bg-blue-600"
              } rounded`}
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-white">{`Page ${currentPage} of ${Math.ceil(
              proposalDetails.filter((proposal) =>
                [
                  ProposalState.Succeeded,
                  ProposalState.Executed,
                  ProposalState.Queued,
                ].includes(Number(proposal.proposalState))
              ).length / moviesPerPage
            )}`}</span>
            <button
              className={`px-4 py-2 text-white ${
                currentPage ===
                Math.ceil(
                  proposalDetails.filter((proposal) =>
                    [
                      ProposalState.Succeeded,
                      ProposalState.Executed,
                      ProposalState.Queued,
                    ].includes(Number(proposal.proposalState))
                  ).length / moviesPerPage
                )
                  ? "bg-gray-400"
                  : "bg-blue-600"
              } rounded`}
              onClick={handleNextPage}
              disabled={
                currentPage ===
                Math.ceil(
                  proposalDetails.filter((proposal) =>
                    [
                      ProposalState.Succeeded,
                      ProposalState.Executed,
                      ProposalState.Queued,
                    ].includes(Number(proposal.proposalState))
                  ).length / moviesPerPage
                )
              }
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full p-2 lg:w-auto gap-2">
        <Chat
          room={router.query.id![1]}
          onPlay={onPlay}
          onSeek={onSeek}
          onPause={onPause}
          playerRef={playerRef}
          requestFunds={requestFunds}
          setRequestFunds={setRequestFunds}
          changePage={changePage}
          setChangePage={setChangePage}
        />
        <div className="p-4 lg:flex lg:flex-col gap-2 hidden lg:w-[550px] lg:border lg:border-gray-500/50 p-4 h-[40vh] overflow-y-scroll rounded-lg space-y-10">
          <div>
            <p className="text-white font-bold text-2xl p-2 rounded-xl text-center">
              {movie.data.title}
            </p>

            <p className="font-bold text-white pb-2">{movie.data.description}</p>
            <p className="font-bold text-white">Genre: {movie.data.genre}</p>
            <p className="font-bold text-white">Starring: {movie.data.cast.split(",").splice(0, 3).join(",")}</p>
          </div>
          <div className="flex flex-col gap-2">
            {!access.includes(movie.data.title) && movie.data.isDRMEnabled && !subscribed ? (
                <button
                    className="text-white bg-thetre-blue p-2 rounded-lg"
                    onClick={() => buyTicket(movie.data.title)}
                >
                    Buy Pass for 10TFUEL
                </button>
            ) : (
              <button className="text-green-500 p-2 rounded-lg">
                You Have Access to this movie
              </button>
            )}

            <button
                className="text-white bg-thetre-blue p-2 rounded-lg"
                onClick={() => requestFunds.current()}
            >
                Request TFUEL in Chat ({balance})
            </button>
            {isAuth && movie.data.screeningType === "Live Screening" && (
              <div className="flex flex-col gap-2">
                <button
                  className="text-white bg-thetre-blue p-2 rounded-lg"
                  onClick={async () =>
                    setDetails(
                      await startStream(movie.data.movieLink as string)
                    )
                  }
                >
                  Start Stream
                </button>
                <div className="text-white">
                  <p>Stream Server - {details["stream_server"]}</p>
                  <p>Stream Key - {details["stream_key"]}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
