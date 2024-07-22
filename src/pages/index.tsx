import Sidebar from "@/components/sidebar";
import Loader from "@/components/loader";
import MovieCard from "@/components/movieCard";
import MovieSlider from "@/components/movieSlider";
import { ProposalState, useThetreContext } from "@/context/thetreContext";
import { useWalletContext } from "@/context/walletContext";
import { useEffect } from "react";
import { useState } from "react";
import Navbar from "@/components/navbar";

export default function Home() {
  const { proposalDetails, fetchProposals, setLoader, loading } =
    useThetreContext();
  const { access } = useWalletContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const moviesPerPage = 3;

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  console.log(indexOfFirstMovie, indexOfLastMovie);
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

  useEffect(() => {
    (async () => {
      await setLoader(fetchProposals);
    })();
  }, []);
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="flex gap-2">
      <Sidebar
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
      />
      <div className="h-screen w-full overflow-y-scroll">
        <Navbar />
        <main className="h-[50vh]" id="slider">
          <MovieSlider
            access={access}
            proposalDetails={proposalDetails.filter((proposal) =>
              [
                ProposalState.Succeeded,
                ProposalState.Executed,
                ProposalState.Queued,
              ].includes(Number(proposal.proposalState))
            )}
          />
        </main>
        <div
          className="grid grid-cols-3 gap-4 p-4 w-full justify-center"
          id="movies"
        >
          {proposalDetails
            .filter((proposal) =>
              selectedGenres.length > 0
                ? selectedGenres.includes(proposal.data.genre)
                : proposal
            )
            .filter((proposal) =>
              [
                ProposalState.Succeeded,
                ProposalState.Executed,
                ProposalState.Queued,
              ].includes(Number(proposal.proposalState))
            )
            .slice(indexOfFirstMovie, indexOfLastMovie)
            .map((proposal, index) => (
              <MovieCard key={index} proposal={proposal} access={access} muted={false} changePage={undefined}/>
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
  );
}
