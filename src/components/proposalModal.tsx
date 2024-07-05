import { GENRES } from '@/utils/constants';
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
    movieFile: null as File | null,
    trailerFile: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : null });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, name: string) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setForm({ ...form, [name]: file });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
      <div className=" bg-bg-image bg-cover bg-no-repeat rounded-lg w-full max-w-5xl text-white">
        <div className='backdrop-blur-[100px]	p-6'>
        <h2 className="text-2xl mb-4 text-center">Movie Listing Proposal</h2>
        <form onSubmit={handleSubmit}>
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
          <div className="grid grid-cols-3 gap-4 mb-4">
            <label className="block text-left">Upload Movie</label>
            <div 
              className="col-span-2 border border-dashed border-gray-500 p-4 text-center rounded bg-transparent text-white"
              onDrop={(e) => handleDrop(e, 'movieFile')}
              onDragOver={handleDragOver}
            >
              <input type="file" name="movieFile" onChange={handleFileChange} className="hidden" id="movieFile" />
              <label htmlFor="movieFile" className="cursor-pointer text-blue-400">
                {form.movieFile ? form.movieFile.name : 'Drag & drop or Choose a file to upload'}
              </label>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <label className="block text-left">Upload Trailer</label>
            <div 
              className="col-span-2 border border-dashed border-gray-500 p-4 text-center rounded bg-transparent text-white"
              onDrop={(e) => handleDrop(e, 'trailerFile')}
              onDragOver={handleDragOver}
            >
              <input type="file" name="trailerFile" onChange={handleFileChange} className="hidden" id="trailerFile" />
              <label htmlFor="trailerFile" className="cursor-pointer text-blue-400">
                {form.trailerFile ? form.trailerFile.name : 'Drag & drop or Choose a file to upload'}
              </label>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-2 items-center">
            <button type="submit" className="px-4 py-2 rounded text-white w-96 bg-[#4B4BFF] font-bold cursor-pointer">Submit</button>
            <button type="button" onClick={onClose} className="px-4 py-2 bg-transparent border border-red-700 rounded text-red-700 w-96 font-bold cursor-pointer">Cancel</button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default Modal;
