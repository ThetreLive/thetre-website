import Navbar from "@/components/navbar";
import Link from "next/link";

const Plans = () => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-bg-blue text-white">
        <div className="w-full max-w-6xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Plans</h1>
          </div>
          <div className="flex flex-col md:flex-row justify-around gap-8">
            <div className="border border-1 border-gray-300/40 text-white rounded-lg p-8 shadow-lg flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold text-thetre-blue mb-4">
                  Pay-per Movie DRM
                </h2>
                <h3 className="text-4xl font-bold mb-6">10 TFUEL/movie</h3>
                <ul className="text-left mb-6">
                  <li className="flex items-center mb-2">
                    <span className="text-green-500 mr-2">&#10003;</span>{" "}
                    Chatroom access
                  </li>
                  <li className="flex items-center mb-2">
                    <span className="text-green-500 mr-2">&#10003;</span> Access
                    to the chosen movie
                  </li>
                  <li className="flex items-center mb-2">
                    <span className="text-green-500 mr-2">&#10003;</span>{" "}
                    Recommended for occasional viewers
                  </li>
                </ul>
              </div>
              <Link
                href="/"
                className="bg-thetre-blue text-white px-6 py-3 rounded-lg w-full block text-center"
              >
                Try now
              </Link>
            </div>
            <div className="border border-1 border-gray-300/40 text-white rounded-lg p-8 shadow-lg flex-1">
              <h2 className="text-xl font-semibold text-thetre-blue mb-4">
                Subscription Based DRM (coming soon)
              </h2>
              <h3 className="text-4xl font-bold mb-6">?? TFUEL/month</h3>
              <ul className="text-left mb-6">
                <li className="flex items-center mb-2">
                  <span className="text-green-500 mr-2">&#10003;</span> Chatroom
                  access
                </li>
                <li className="flex items-center mb-2">
                  <span className="text-green-500 mr-2">&#10003;</span>{" "}
                  Unlimited movie access
                </li>
                <li className="flex items-center mb-2">
                  <span className="text-green-500 mr-2">&#10003;</span>{" "}
                  Recommended for binge watchers
                </li>
                <li className="flex items-center mb-2">
                  <span className="text-red-500 mr-2">&#10007;</span>{" "}
                  Livescreening access
                </li>
              </ul>
              <button
                className="bg-thetre-blue bg-opacity-40 text-white px-6 py-3 rounded-lg cursor-not-allowed w-full"
                disabled
              >
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Plans;
