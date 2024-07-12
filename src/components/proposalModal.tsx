import { GENRES } from '@/utils/constants';
import { getFileURL } from '@/utils/theta';
import Image from 'next/image';
import { useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    genre: '',
    producer: '',
    cast: '',
    director: '',
    platforms: '',
    movieLink: '',
    trailerLink: '',
    coverLink: ''
  });

  const [step, setStep] = useState(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const jsonToLink = (jsonData: string) => {
    return getFileURL(JSON.parse(jsonData).result.key, JSON.parse(jsonData).result.relpath)
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70" onClick={onClose}>
      <div className="bg-bg-image bg-cover bg-no-repeat rounded-lg w-full max-w-5xl text-white transition-transform transform duration-300" onClick={e => e.stopPropagation()}>
        <div className="backdrop-blur-[100px] p-6" style={{ height: '600px' }}>
          <h2 className="text-2xl mb-4 text-center">Movie Listing Proposal</h2>
          <form onSubmit={handleSubmit} className="h-full flex flex-col justify-between">
            <div className='h-full flex flex-col justify-center'>
              {step === 1 && (
                <div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <label htmlFor="title" className="block text-left">Title</label>
                    <input type="text" name="title" id="title" value={form.title} onChange={handleChange} className="col-span-2 p-2 border-b-2 border-gray-500 rounded bg-transparent text-white" />
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <label htmlFor="description" className="block text-left">Description</label>
                    <textarea name="description" id="description" value={form.description} onChange={handleChange} className="col-span-2 p-2 border-b-2 border-gray-500 rounded bg-transparent text-white"></textarea>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <label htmlFor="genre" className="block text-left">Genre</label>
                    <select name="genre" id="genre" value={form.genre} onChange={handleChange} className="col-span-2 p-2 border-b-2 border-gray-500 rounded bg-transparent text-white">
                      <option value="" className='bg-gray-700'>Select a genre</option>
                      {GENRES.map((genre) => (
                        <option key={genre} value={genre} className='bg-gray-700'>{genre}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <label htmlFor="producer" className="block text-left">Producer</label>
                    <input type="text" name="producer" id="producer" value={form.producer} onChange={handleChange} className="col-span-2 p-2 border-b-2 border-gray-500 rounded bg-transparent text-white" />
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <label htmlFor="cast" className="block text-left">Cast(separated by commas)</label>
                    <input type="text" name="cast" id="cast" value={form.cast} onChange={handleChange} className="col-span-2 p-2 border-b-2 border-gray-500 rounded bg-transparent text-white" />
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <label htmlFor="director" className="block text-left">Director Name</label>
                    <input type="text" name="director" id="director" value={form.director} onChange={handleChange} className="col-span-2 p-2 border-b-2 border-gray-500 rounded bg-transparent text-white" />
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <label htmlFor="platforms" className="block text-left">Platforms on which the movie is already listed(if any)</label>
                    <input type="text" name="platforms" id="platforms" value={form.platforms} onChange={handleChange} className="col-span-2 p-2 border-b-2 border-gray-500 rounded bg-transparent text-white" />
                  </div>
                </div>
              )}
              {step === 2 && (
                <div>
                  <p className='mb-4 text-center'>Run this command in your terminal to upload movie(replace with your path)</p>
                  <div className="mb-4 bg-gray-700 relative">
                    <code>
                      {`curl -X POST -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"edgestore.PutFile","params":[{"path": "<PATH-TO-MOVIE>"}],"id":1}' https://p2p.thetre.live/rpc`}
                    </code>
                    <div className='absolute top-1 right-1'>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                      </svg>

                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <input type="text" name="movieLink" id="movieLink" value={form.movieLink} placeholder='Paste the response' onChange={handleChange} className="col-span-3 text-center p-2 border-b-2 border-gray-500 rounded bg-transparent text-white" />
                  </div>
                  <div className="flex items-center justify-center gap-4 mb-4">
                    {form.movieLink.length > 0 ? (
                      <video src={jsonToLink(form.movieLink)} controls className='w-96 h-64'></video>
                    ) : (
                      <div className='w-full bg-gray-800 flex items-center justify-center' style={{height: "200px"}}>No Video</div>

                    )}
                  </div>
                </div>
              )}
              {step === 3 && (
                <div>
                  <p className='mb-4 text-center'>Run this command in your terminal to upload trailer(replace with your path)</p>
                  <div className="mb-4 bg-gray-700 relative">
                    <code>
                      {`curl -X POST -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"edgestore.PutFile","params":[{"path": "<PATH-TO-TRAILER>"}],"id":1}' https://p2p.thetre.live/rpc`}
                    </code>
                    <div className='absolute top-1 right-1'>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                      </svg>

                    </div>

                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <input type="text" name="trailerLink" id="trailerLink" value={form.trailerLink} placeholder='Paste the response' onChange={handleChange} className="col-span-3 text-center p-2 border-b-2 border-gray-500 rounded bg-transparent text-white" />
                  </div>
                  <div className="flex items-center justify-center gap-4 mb-4">
                    {form.trailerLink.length > 0 ? (
                      <video src={jsonToLink(form.trailerLink)} controls className='w-96 h-64'></video>
                    ) : (
                      <div className='w-full bg-gray-800 flex items-center justify-center' style={{height: "200px"}}>No Trailer</div>

                    )}
                  </div>
                </div>
              )}
              {step === 4 && (
                <div>
                  <p className='mb-4 text-center'>Run this command in your terminal to upload cover(replace with your path)</p>
                  <div className="mb-4 bg-gray-700 relative">
                    <code>
                      {`curl -X POST -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"edgestore.PutFile","params":[{"path": "<PATH-TO-COVER>"}],"id":1}' https://p2p.thetre.live/rpc`}
                    </code>
                    <div className='absolute top-1 right-1'>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                      </svg>

                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <input type="text" name="coverLink" id="coverLink" value={form.coverLink} placeholder='Paste the response' onChange={handleChange} className="col-span-3 text-center p-2 border-b-2 border-gray-500 rounded bg-transparent text-white" />
                  </div>
                  <div className="flex items-center justify-center gap-4 mb-4">
                    {form.coverLink.length > 0 ? (
                      <Image src={jsonToLink(form.coverLink)} height={300} width={300} alt="Cover" className='text-center'></Image>
                    ) : (
                      <div className='w-full bg-gray-800 flex items-center justify-center' style={{height: "200px"}}>No Cover</div>

                    )}
                  </div>
                </div>
              )}
            </div>
            <div>

              {step === 4 && (
                <div className="flex justify-center mt-4">
                  <button type="submit" className="px-4 py-2 rounded text-white w-96 bg-[#4B4BFF] font-bold cursor-pointer">Submit</button>
                </div>
              )}
              <div className="flex justify-center gap-4 mt-4">
                <button type="button" onClick={handlePrev} disabled={step === 1} className="px-4 py-2 rounded text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
                  </svg>

                </button>
                <div className="flex items-center">
                  {[1, 2, 3, 4].map((s) => (
                    <div
                      key={s}
                      className={`w-3 h-3 rounded-full mx-1 ${step === s ? 'bg-thetre-blue' : 'bg-gray-500'}`}
                    ></div>
                  ))}
                </div>
                <button type="button" onClick={handleNext} disabled={step === 4} className="px-4 py-2 rounded text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                  </svg>

                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Modal;
