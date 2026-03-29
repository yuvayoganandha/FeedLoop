import React, { useState } from 'react';
import { X, HelpCircle, BookOpen, ChevronRight, ArrowLeft, ShieldCheck, Info, MapPin } from 'lucide-react';

const AssistanceModal = ({ isOpen, onClose }) => {
  const [view, setView] = useState('menu'); // 'menu' or 'guidelines'

  if (!isOpen) return null;

  const guidelines = [
    {
      title: "Hygienic Protocol",
      content: "Ensure all surplus items are handled with gloves. Perishables must have been stored at correct temperatures until the moment of rescue. Do not donate items past their absolute consumption safety date.",
      icon: <ShieldCheck className="h-5 w-5 text-google-green" />
    },
    {
      title: "Packaging Logic",
      content: "Use eco-friendly, leak-proof containers. Label clearly with preparation date and potential allergens (Nuts, Dairy, Gluten) to ensure safe redistribution.",
      icon: <Info className="h-5 w-5 text-google-blue" />
    },
    {
      title: "Handoff Precision",
      content: "Mark exact coordinates. Use the 'Confirm Handoff' button once the rescue is completed to update the network's live status.",
      icon: <MapPin className="h-5 w-5 text-google-red" />
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center animate-fade-in p-4">
       <div className={`bg-white rounded-[2.5rem] shadow-2xl relative animate-scale-in border border-[#dadce0] transition-all duration-300 overflow-hidden ${view === 'menu' ? 'max-w-md w-full p-10' : 'max-w-2xl w-full p-12'}`}>
           <button 
              onClick={onClose} 
              className="absolute top-6 right-6 text-[#5f6368] hover:text-[#202124] bg-[#f8f9fa] rounded-full p-2 border border-[#dadce0] transition-colors z-10"
           >
              <X className="h-5 w-5" />
           </button>
           
           {view === 'menu' ? (
             <div className="animate-fade-in">
                <div className="text-center mb-8 flex flex-col items-center">
                    <div className="h-14 w-14 bg-[#e8f0fe] rounded-2xl flex items-center justify-center text-[#4285f4] mb-4 shadow-sm border border-[#4285f4]/20">
                        <HelpCircle className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#202124] tracking-tight mb-2">Assistance Center</h3>
                    <p className="text-sm text-[#5f6368] font-medium leading-relaxed">How can we help facilitate your rescue mission today?</p>
                </div>
                
                <div className="space-y-4">
                    <button 
                        onClick={() => setView('guidelines')}
                        className="w-full bg-[#f8f9fa] border border-[#dadce0] rounded-2xl p-6 flex items-center justify-between hover:bg-white hover:border-[#4285f4]/50 hover:shadow-md transition-all group"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="h-10 w-10 bg-white rounded-xl shadow-sm border border-[#dadce0] flex items-center justify-center text-[#5f6368] group-hover:text-[#4285f4] transition-colors">
                                <BookOpen className="h-5 w-5" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-[#202124] tracking-tight text-sm">Operation Guidelines</p>
                                <p className="text-[11px] font-medium text-[#70757a] uppercase tracking-wider mt-1">Read the safety protocol</p>
                            </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-[#dadce0] group-hover:text-google-blue group-hover:translate-x-1 transition-all" />
                    </button>
                    
                    <div className="bg-[#fcfcfc] border border-dashed border-[#dadce0] rounded-2xl p-6 text-center">
                        <p className="text-[10px] font-black text-[#70757a] uppercase tracking-widest mb-2">Notice</p>
                        <p className="text-xs text-[#5f6368] font-medium italic">Direct support channels are currently offline. Please refer to our documented protocols for assistance.</p>
                    </div>
                </div>
             </div>
           ) : (
             <div className="animate-fade-in">
                <button 
                    onClick={() => setView('menu')}
                    className="flex items-center space-x-2 text-google-blue font-bold text-xs uppercase tracking-widest mb-8 hover:underline group"
                >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Center</span>
                </button>
                
                <h3 className="text-3xl font-bold text-[#202124] tracking-tight mb-2">Safety Protocols</h3>
                <p className="text-[#5f6368] font-medium mb-10 pb-6 border-b border-[#f1f3f4]">Follow these mandatory guidelines to ensure a secure and hygienic surplus redistribution chain.</p>
                
                <div className="grid grid-cols-1 gap-6">
                    {guidelines.map((item, idx) => (
                        <div key={idx} className="flex items-start space-x-5 p-6 bg-[#f8f9fa] rounded-2xl border border-[#dadce0]">
                            <div className="h-10 w-10 shrink-0 bg-white rounded-xl shadow-sm border border-[#dadce0] flex items-center justify-center">
                                {item.icon}
                            </div>
                            <div>
                                <h4 className="font-bold text-[#202124] text-sm mb-1">{item.title}</h4>
                                <p className="text-xs text-[#5f6368] leading-relaxed font-medium">{item.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
           )}
       </div>
    </div>
  );
};

export default AssistanceModal;
