import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import { API_ENDPOINTS } from '../config';

const RatingModal = ({ isOpen, onClose, foodId, donorName, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  if (!isOpen) return null;

  const handleSubmit = async () => {
      if (rating === 0) return setError('Please select a star rating');
      setError('');
      setLoading(true);

      try {
          const res = await fetch(`${API_ENDPOINTS.FOOD}/${foodId}/rate`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({ rating, review })
          });
          const data = await res.json();
          if(!res.ok) throw new Error(data.message || 'Error submitting rating');
          onSuccess();
          onClose();
      } catch(err) {
           setError(err.message);
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center animate-fade-in p-4">
       <div className="bg-white rounded-3xl p-10 w-full max-w-sm shadow-2xl relative animate-scale-in border border-[#dadce0]">
           <button onClick={onClose} className="absolute top-6 right-6 text-[#5f6368] hover:text-[#202124] bg-[#f8f9fa] rounded-full p-2 border border-[#dadce0] transition-colors"><X className="h-5 w-5" /></button>
           
           <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-[#202124] tracking-tight mb-2">Rate {donorName || 'the Donor'}</h3>
              <p className="text-sm text-[#5f6368] font-medium leading-relaxed">Closing the mission circle with feedback</p>
           </div>
           
           {error && <p className="text-[#c5221f] text-xs mb-6 font-bold uppercase tracking-widest text-center bg-[#fce8e6] p-3 rounded-xl border border-[#f1b4af] animate-shake">{error}</p>}
           
           <div className="flex justify-center space-x-3 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                      key={star}
                      type="button"
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                  >
                      <Star className={`h-10 w-10 ${star <= (hover || rating) ? 'text-google-yellow fill-current drop-shadow-sm' : 'text-[#f1f3f4]'}`} />
                  </button>
              ))}
           </div>
           
           <div className="mb-8">
               <textarea 
                   rows="3" 
                   value={review}
                   onChange={e => setReview(e.target.value)}
                   placeholder="Say something nice about the rescue..."
                   className="input-dark !rounded-2xl"
               />
           </div>

           <button 
               onClick={handleSubmit} 
               disabled={loading || rating === 0}
               className="w-full bg-google-blue hover:bg-blue-600 text-white font-black py-4 rounded-2xl shadow-lg hover:shadow-blue-500/20 transition-all text-xs tracking-widest disabled:opacity-50"
           >
               {loading ? 'SUBMITTING...' : 'INITIALIZE FEEDBACK'}
           </button>
       </div>
    </div>
  );
};

export default RatingModal;
