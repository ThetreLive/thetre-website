import { ProposalData, useThetreContext } from '@/context/thetreContext';
import { GENRES } from '@/utils/constants';
import { getFileURL } from '@/utils/theta';
import Image from 'next/image';
import { useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const {createProposal} = useThetreContext()
  const [form, setForm] = useState<ProposalData>({
    title: '',
    description: '',
    genre: '',
    producer: '',
    cast: '',
    director: '',
    platforms: '',
    movieLink: '',
    trailerLink: '',
    coverLink: '',
    isDRMEnabled: true,
    screeningType: 'Recorded'
  });
  const [isDRMEnabled, setIsDRMEnabled] = useState(true);
  const [screeningType, setScreeningType] = useState<'Recorded' | 'Live Screening'>('Recorded');

  const [step, setStep] = useState(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
    await createProposal({...form, isDRMEnabled, screeningType});
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : "" });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70" onClick={onClose}>
      <div className="bg-bg-blue rounded-lg w-full max-w-5xl text-white transition-transform transform duration-300" onClick={e => e.stopPropagation()}>
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
                  <label className="block text-center mb-8">Upload Movie</label>
                  <div 
                    className="flex items-center justify-center border border-dashed border-gray-500 h-36 p-4 text-center rounded bg-transparent text-white"
                  >
                    <input type="file" name="movieLink" onChange={handleFileChange} className="hidden" id="movieLink" />
                    <label htmlFor="movieLink" className="cursor-pointer text-blue-400">
                      {form.movieLink instanceof File ? form.movieLink.name : 'Choose a file to upload'}
                    </label>
                  </div>
                  <div className="flex items-center justify-between space-x-4 p-4">
                    <div className="flex items-center">
                      <input 
                        id="enable-drm" 
                        type="checkbox" 
                        className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                        checked={isDRMEnabled}
                        onChange={() => setIsDRMEnabled(!isDRMEnabled)}
                      />
                      <label htmlFor="enable-drm" className="text-white">Enable DRM</label>
                    </div>
                    <div className='flex items-center space-x-2'>

                    {isDRMEnabled && (
                      <>
                    <div className="flex items-center space-x-1">
                      <input 
                        id="live-screening" 
                        type="radio" 
                        name="screeningType" 
                        value="Live Screening" 
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" 
                        checked={screeningType === 'Live Screening'}
                        onChange={(e) => setScreeningType("Live Screening")}
                      />
                      <label htmlFor="live-screening" className="text-white">Live Screening</label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <input 
                        id="recorded" 
                        type="radio" 
                        name="screeningType" 
                        value="Recorded" 
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" 
                        checked={screeningType === 'Recorded'}
                        onChange={(e) => setScreeningType("Recorded")}
                      />
                      <label htmlFor="recorded" className="text-white">Recorded</label>
                    </div>
                      </>
                    )}
                    </div>

                  </div>
                </div>
              )}
              {step === 3 && (
                <div>
                  <label className="block text-center mb-8">Upload Trailer</label>
                  <div 
                    className="flex items-center justify-center border border-dashed border-gray-500 h-36 p-4 text-center rounded bg-transparent text-white"
                  >
                    <input type="file" name="trailerLink" onChange={handleFileChange} className="hidden" id="trailerLink" />
                    <label htmlFor="trailerLink" className="cursor-pointer text-blue-400">
                      {form.trailerLink instanceof File ? form.trailerLink.name : 'Choose a file to upload'}
                    </label>
                  </div>
                </div>
              )}
              {step === 4 && (
                <div>
                  <label className="block text-center mb-8">Upload Cover</label>
                  <div 
                    className="flex items-center justify-center border border-dashed border-gray-500 h-36 p-4 text-center rounded bg-transparent text-white"
                  >
                    <input type="file" name="coverLink" onChange={handleFileChange} className="hidden" id="coverLink" />
                    <label htmlFor="coverLink" className="cursor-pointer text-blue-400">
                      {form.coverLink instanceof File ? form.coverLink.name : 'Choose a file to upload'}
                    </label>
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
