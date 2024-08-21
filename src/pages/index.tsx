import Sidebar from "@/components/sidebar";
import Loader from "@/components/loader";
import MovieCard from "@/components/movieCard";
import MovieSlider from "@/components/movieSlider";
import { ProposalState, useThetreContext } from "@/context/thetreContext";
import { useWalletContext } from "@/context/walletContext";
import { useEffect, useRef } from "react";
import { useState } from "react";
import Navbar from "@/components/navbar";

export default function Home() {
  const { proposalDetails, fetchProposals, setLoader, loading } =
    useThetreContext();
  const { access } = useWalletContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const moviesPerPage = 4;

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

  useEffect(() => {
    (async () => {
      await setLoader(fetchProposals);
    })();
  }, []);

  const lastScrollY = useRef(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      console.log(currentScrollY)
      if (currentScrollY > lastScrollY.current) {
        setOpacity(Math.min(1, currentScrollY / 500));
        document.getElementById("prevnext")?.scrollIntoView({ behavior: "smooth" });
      } else {
        setOpacity(Math.max(0, 1 - currentScrollY / 500));
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (loading) {
    return <Loader loading={true}/>;
  }
  return (
    <div  onScroll={() => {console.log("here"); document.getElementById("prevnext")?.scrollIntoView(true)}}>
      <div className="lg:hidden"><Loader loading={false}/></div>

      {/* <Sidebar
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
      /> */}
      <main className="h-[100vh] fixed inset-0" id="slider">
        <MovieSlider
          scroll={lastScrollY.current === 0}
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
      <div className="h-screen w-full overflow-y-scroll" style={{ opacity: opacity }}>
        <div className="absolute top-[100vh]">
          <p className="text-white text-4xl p-4">Explore</p>
          <div
            className="grid grid-cols-4 gap-4 p-4 w-full justify-center"
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
          <div className="flex items-center">
            <div className="inline-flex justify-center items-center space-x-4 relative bg-black/50 backdrop-blur-xl rounded-md p-2 mx-auto" id="prevnext">
              <button
                className={`px-4 py-2 text-white ${
                  currentPage === 1 ? "bg-gray-600" : "bg-blue-600"
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
                    ? "bg-gray-600"
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
      </div>
    </div>
  );
}
