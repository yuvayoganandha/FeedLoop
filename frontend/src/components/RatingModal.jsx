import React, { useState } from 'react';
import { Star, X } from 'lucide-react';

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
          const res = await fetch(`http://localhost:5000/api/food/${foodId}/rate`, {
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center animate-fade-in p-4">
       <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl relative animate-zoom-in">
           <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-50 rounded-full p-1"><X className="h-5 w-5" /></button>
           
           <h3 className="text-xl font-bold text-gray-800 mb-1">Rate {donorName || 'the Donor'}</h3>
           <p className="text-sm text-gray-500 mb-6">How was the food quality and interaction?</p>
           
           {error && <p className="text-red-500 text-sm mb-4 font-semibold">{error}</p>}
           
           <div className="flex justify-center space-x-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                      key={star}
                      type="button"
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                  >
                      <Star className={`h-10 w-10 ${star <= (hover || rating) ? 'text-orange-400 fill-current drop-shadow-sm' : 'text-gray-200'}`} />
                  </button>
              ))}
           </div>
           
           <div className="mb-6">
               <textarea 
                   rows="3" 
                   value={review}
                   onChange={e => setReview(e.target.value)}
                   placeholder="Say something nice... (optional)"
                   className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all text-gray-800 font-medium"
               />
           </div>

           <button 
               onClick={handleSubmit} 
               disabled={loading || rating === 0}
               className="w-full bg-gradient-to-r from-primary to-orange-500 text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-orange-500/30 transition-all disabled:opacity-50"
           >
               {loading ? 'Submitting...' : 'Submit Rating'}
           </button>
       </div>
    </div>
  );
};

export default RatingModal;
