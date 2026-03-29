import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  MapPin, 
  Clock, 
  Package, 
  CheckCircle2, 
  ArrowLeft, 
  Activity, 
  Zap, 
  TrendingUp, 
  History, 
  PhoneCall,
  CheckCircle,
  RefreshCw,
  Trash2,
  Edit3,
  X,
  Save,
  ChevronRight,
  Filter,
  Download,
  User as UserIcon
} from 'lucide-react';
import { API_ENDPOINTS } from '../config';
import { formatDistanceToNow } from 'date-fns';

const UserDashboard = ({ user, onBack, onUpdateProfile }) => {
  const [activity, setActivity] = useState({ donations: [], claims: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('donations'); // 'donations' or 'claims'
  const [editingFood, setEditingFood] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchActivity = async () => {
    try {
      const res = await fetch(`${API_ENDPOINTS.USER}/activity`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setActivity(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  const handleComplete = async (foodId) => {
    if (!window.confirm('Mark this donation as successfully collected?')) return;
    
    setUpdating(true);
    try {
      const res = await fetch(`${API_ENDPOINTS.FOOD}/${foodId}/complete`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) fetchActivity();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateFood = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await fetch(`${API_ENDPOINTS.FOOD}/${editingFood._id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editingFood)
      });
      if (res.ok) {
        setEditingFood(null);
        fetchActivity();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="flex-1 flex items-center justify-center bg-[#f8f9fa]">
        <div className="flex flex-col items-center">
            <RefreshCw className="h-10 w-10 text-google-blue animate-spin mb-4" />
            <p className="text-sm font-bold text-[#5f6368] uppercase tracking-[0.3em]">Synchronizing Archive...</p>
        </div>
    </div>
  );

  const totalImpact = activity.donations.length + activity.claims.length;

  return (
    <div className="flex-1 bg-[#f8f9fa] h-full overflow-y-auto custom-scrollbar font-sans">
      <div className="max-w-6xl mx-auto px-8 py-10">
        
        {/* Superior Header Navigation */}
        <div className="flex items-center justify-between mb-12">
            <button 
                onClick={onBack}
                className="group flex items-center space-x-3 text-[#5f6368] hover:text-google-blue transition-all"
            >
                <div className="h-10 w-10 bg-white border border-[#dadce0] rounded-full flex items-center justify-center group-hover:shadow-md transition-shadow">
                    <ArrowLeft className="h-5 w-5" />
                </div>
                <span className="font-bold text-sm tracking-tight">Return to Operation</span>
            </button>
            <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 text-xs font-bold text-[#5f6368] bg-white border border-[#dadce0] rounded-full hover:bg-[#f1f3f4] transition-colors shadow-sm">
                   <Download className="h-4 w-4" />
                   <span>EXPORT DATA</span>
                </button>
                <div className="h-10 w-10 bg-[#e8f0fe] rounded-full flex items-center justify-center text-google-blue border border-[#4285f4]/20">
                   <Trophy className="h-5 w-5" />
                </div>
            </div>
        </div>

        {/* Impact Scoreboard (Material Style) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 animate-fade-in-up">
            <div className="bg-white p-8 rounded-[2rem] border border-[#dadce0] shadow-sm flex flex-col items-center text-center text-google-yellow">
                <p className="text-[#5f6368] text-[10px] font-black uppercase tracking-[0.2em] mb-3">Impact Level</p>
                <p className="text-5xl font-black text-[#202124] tracking-tighter mb-2">{user.rating?.toFixed(1) || '0.0'}</p>
                <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map(i => <Trophy key={i} className={`h-3 w-3 ${i <= user.rating ? 'fill-current' : 'opacity-20'}`} />)}
                </div>
            </div>
            
            <div className="bg-white p-8 rounded-[2rem] border border-[#dadce0] shadow-sm group hover:border-google-blue/30 transition-all cursor-default">
                <div className="h-12 w-12 bg-[#e8f0fe] rounded-2xl flex items-center justify-center text-google-blue mb-6 shadow-sm">
                   <TrendingUp className="h-6 w-6" />
                </div>
                <p className="text-3xl font-black text-[#202124] tracking-tighter">{totalImpact}</p>
                <p className="text-[10px] font-black text-[#70757a] uppercase tracking-widest mt-1">Total Operations</p>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-[#dadce0] shadow-sm group hover:border-[#34a853]/30 transition-all cursor-default">
                <div className="h-12 w-12 bg-[#e6f4ea] rounded-2xl flex items-center justify-center text-google-green mb-6 shadow-sm">
                   <History className="h-6 w-6" />
                </div>
                <p className="text-3xl font-black text-[#202124] tracking-tighter">{activity.donations.filter(d => d.status === 'completed').length}</p>
                <p className="text-[10px] font-black text-[#70757a] uppercase tracking-widest mt-1">Resource Rescues</p>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-[#dadce0] shadow-sm group hover:border-[#ea4335]/30 transition-all cursor-default">
                <div className="h-12 w-12 bg-[#fce8e6] rounded-2xl flex items-center justify-center text-google-red mb-6 shadow-sm">
                   <Activity className="h-6 w-6" />
                </div>
                <p className="text-3xl font-black text-[#202124] tracking-tighter">{activity.claims.length}</p>
                <p className="text-[10px] font-black text-[#70757a] uppercase tracking-widest mt-1">Claims Facilitated</p>
            </div>
        </div>

        {/* Tabbed Activity Tracker (Google Material Tabs) */}
        <div className="bg-white rounded-[2.5rem] border border-[#dadce0] shadow-sm overflow-hidden animate-fade-in relative">
            <div className="flex border-b border-[#f1f3f4] shrink-0 bg-[#fff] z-10 sticky top-0">
                <button 
                  onClick={() => setActiveTab('donations')}
                  className={`flex-1 py-6 font-bold text-xs tracking-[0.2em] transition-all relative ${activeTab === 'donations' ? 'text-google-blue' : 'text-[#70757a] hover:bg-[#f8f9fa]'}`}
                >
                    POSTED DONATIONS
                    {activeTab === 'donations' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-google-blue rounded-t-full" />}
                </button>
                <button 
                  onClick={() => setActiveTab('claims')}
                  className={`flex-1 py-6 font-bold text-xs tracking-[0.2em] transition-all relative ${activeTab === 'claims' ? 'text-google-blue' : 'text-[#70757a] hover:bg-[#f8f9fa]'}`}
                >
                    ACTIVE CLAIMS
                    {activeTab === 'claims' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-google-blue rounded-t-full" />}
                </button>
            </div>

            <div className="p-10 min-h-[500px]">
                {activeTab === 'donations' ? (
                    <div className="space-y-6">
                        {activity.donations.length > 0 ? activity.donations.map(food => (
                            <div key={food._id} className="bg-[#f8f9fa] border border-[#dadce0] rounded-2xl p-6 hover:shadow-md hover:bg-white transition-all group">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-5 overflow-hidden">
                                        <div className="h-16 w-16 shrink-0 bg-white border border-[#dadce0] rounded-xl overflow-hidden shadow-sm">
                                            {food.image ? <img src={food.image} className="w-full h-full object-cover" /> : <Package className="h-6 w-6 text-[#dadce0] mx-auto mt-4" />}
                                        </div>
                                        <div className="overflow-hidden">
                                            <div className="flex items-center space-x-3 mb-1 overflow-hidden">
                                                <h4 className="text-lg font-bold text-[#202124] tracking-tight truncate">{food.name}</h4>
                                                <span className={`text-[9px] shrink-0 font-black px-3 py-1 rounded-full uppercase tracking-widest ${food.status === 'completed' ? 'bg-[#e6f4ea] text-google-green' : food.status === 'claimed' ? 'bg-[#e8f0fe] text-google-blue' : 'bg-[#fff] border border-[#dadce0] text-[#70757a]'}`}>
                                                    {food.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-4 text-[11px] font-bold text-[#5f6368] uppercase tracking-widest overflow-hidden">
                                               <div className="flex items-center space-x-1 shrink-0"><Clock className="h-3.5 w-3.5 text-[#4285f4]" /> <span>{formatDistanceToNow(new Date(food.createdAt), { addSuffix: true })}</span></div>
                                               <div className="flex items-center space-x-1 overflow-hidden"><MapPin className="h-3.5 w-3.5 shrink-0 text-[#ea4335]" /> <span className="truncate">{food.location?.address || 'Nearby'}</span></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 shrink-0 ml-4">
                                        {food.status === 'claimed' && (
                                            <button 
                                                onClick={() => handleComplete(food._id)}
                                                className="flex items-center space-x-2 px-5 py-2.5 bg-google-green hover:bg-green-600 text-white rounded-full text-xs font-bold shadow-sm transition-all active:scale-95"
                                            >
                                                <CheckCircle className="h-4 w-4" />
                                                <span>CONFIRM HANDOFF</span>
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => setEditingFood(food)}
                                            className="p-3 bg-white border border-[#dadce0] text-[#5f6368] hover:text-google-blue rounded-xl transition-all shadow-sm"
                                        >
                                            <Edit3 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-24 opacity-40">
                                <Zap className="h-16 w-16 mx-auto mb-6 text-[#dadce0]" />
                                <p className="text-sm font-bold tracking-[0.2em] text-[#5f6368] uppercase">Zero donation history detected.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {activity.claims.length > 0 ? activity.claims.map(food => (
                            <div key={food._id} className="bg-[#f8f9fa] border border-[#dadce0] rounded-2xl p-6 hover:shadow-md hover:bg-white transition-all group">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-5 overflow-hidden">
                                      <div className="h-16 w-16 shrink-0 bg-white border border-[#dadce0] rounded-xl overflow-hidden shadow-sm">
                                          {food.image ? <img src={food.image} className="w-full h-full object-cover" /> : <Package className="h-6 w-6 text-[#dadce0] mx-auto mt-4" />}
                                      </div>
                                      <div className="overflow-hidden">
                                          <div className="flex items-center space-x-3 mb-1 overflow-hidden">
                                              <h4 className="text-lg font-bold text-[#202124] tracking-tight truncate">{food.name}</h4>
                                              <span className="text-[9px] shrink-0 font-black px-3 py-1 rounded-full uppercase tracking-widest bg-[#e8f0fe] text-google-blue border border-[#4285f4]/20">CLAIMED</span>
                                          </div>
                                          <div className="flex items-center space-x-4 text-[11px] font-bold text-[#5f6368] uppercase tracking-widest overflow-hidden">
                                             <div className="flex items-center space-x-1 truncate max-w-[150px]"><UserIcon className="h-3.5 w-3.5 shrink-0 text-[#4285f4]" /> <span>Donor: {food.donor?.name || 'Anonymous'}</span></div>
                                             <div className="flex items-center space-x-1 truncate max-w-[150px]"><PhoneCall className="h-3.5 w-3.5 shrink-0 text-[#34a853]" /> <span>{food.phone || food.donor?.phone || 'Contact Required'}</span></div>
                                          </div>
                                      </div>
                                  </div>
                                  <div className="flex items-center space-x-3 shrink-0 ml-4">
                                      <a href={`tel:${food.phone || food.donor?.phone || ''}`} className="p-3 shrink-0 bg-google-green text-white rounded-xl inline-flex items-center justify-center shadow-sm hover:shadow-md transition-all active:scale-95">
                                          <PhoneCall className="h-5 w-5" />
                                      </a>
                                      <button className="flex items-center space-x-2 px-6 py-2.5 bg-white border border-[#dadce0] text-[#5f6368] hover:text-google-blue rounded-full text-xs font-bold transition-all shadow-sm">
                                          <span>DIRECTIONS</span>
                                          <ChevronRight className="h-4 w-4" />
                                      </button>
                                  </div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-24 opacity-40">
                                <History className="h-16 w-16 mx-auto mb-6 text-[#dadce0]" />
                                <p className="text-sm font-bold tracking-[0.2em] text-[#5f6368] uppercase">No active claims in operation.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Superior Edit Modal (Material Style) */}
      {editingFood && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in-up overflow-hidden">
                  <div className="bg-white px-8 py-6 border-b border-[#f1f3f4] flex items-center justify-between">
                      <h3 className="text-xl font-bold text-[#202124] tracking-tight">Mission Update</h3>
                      <button onClick={() => setEditingFood(null)} className="p-2 hover:bg-[#f1f3f4] rounded-full transition-colors text-[#5f6368]"><X className="h-5 w-5" /></button>
                  </div>
                  <form onSubmit={handleUpdateFood} className="p-10 space-y-8">
                      <div className="space-y-2">
                          <label className="text-[10px] font-black text-[#70757a] uppercase tracking-widest ml-1">Asset Designation</label>
                          <input 
                              className="input-dark !rounded-lg"
                              value={editingFood.name}
                              onChange={e => setEditingFood({...editingFood, name: e.target.value})}
                              placeholder="Update item name..."
                          />
                      </div>
                      <div className="space-y-2">
                          <label className="text-[10px] font-black text-[#70757a] uppercase tracking-widest ml-1">Current Quantity</label>
                          <input 
                              className="input-dark !rounded-lg"
                              value={editingFood.quantity}
                              onChange={e => setEditingFood({...editingFood, quantity: e.target.value})}
                              placeholder="e.g. 10 kg, 5 meals"
                          />
                      </div>
                      <div className="flex space-x-3 pt-4">
                          <button type="button" onClick={() => setEditingFood(null)} className="flex-1 py-3 text-[#5f6368] font-bold text-sm tracking-widest hover:bg-[#f1f3f4] rounded-xl transition-all">ABORT</button>
                          <button 
                            type="submit" 
                            disabled={updating}
                            className="flex-1 py-3 bg-google-blue text-white font-bold text-sm tracking-widest rounded-xl shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50"
                          >
                              {updating ? 'SYNCING...' : 'SAVE CHANGES'}
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default UserDashboard;
