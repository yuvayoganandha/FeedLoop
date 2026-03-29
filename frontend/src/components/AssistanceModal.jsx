import React from 'react';
import { X, HelpCircle, Mail, MessageSquare, PhoneCall, BookOpen } from 'lucide-react';

const AssistanceModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center animate-fade-in p-4">
       <div className="bg-white rounded-3xl p-10 w-full max-w-md shadow-2xl relative animate-scale-in border border-[#dadce0]">
           <button onClick={onClose} className="absolute top-6 right-6 text-[#5f6368] hover:text-[#202124] bg-[#f8f9fa] rounded-full p-2 border border-[#dadce0] transition-colors"><X className="h-5 w-5" /></button>
           
           <div className="text-center mb-8 flex flex-col items-center">
              <div className="h-14 w-14 bg-[#e8f0fe] rounded-2xl flex items-center justify-center text-[#4285f4] mb-4 shadow-sm border border-[#4285f4]/20">
                 <HelpCircle className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-[#202124] tracking-tight mb-2">Assistance Center</h3>
              <p className="text-sm text-[#5f6368] font-medium leading-relaxed">How can we help facilitate your rescue mission today?</p>
           </div>
           
           <div className="space-y-4">
              <button className="w-full bg-[#f8f9fa] border border-[#dadce0] rounded-2xl p-4 flex items-center space-x-4 hover:bg-white hover:border-[#4285f4]/50 hover:shadow-md transition-all group">
                 <div className="h-10 w-10 bg-white rounded-xl shadow-sm border border-[#dadce0] flex items-center justify-center text-[#5f6368] group-hover:text-[#4285f4] transition-colors">
                    <BookOpen className="h-5 w-5" />
                 </div>
                 <div className="text-left flex-1">
                     <p className="font-bold text-[#202124] tracking-tight text-sm">Operation Guidelines</p>
                     <p className="text-[11px] font-medium text-[#70757a] uppercase tracking-wider mt-1">Read the protocol</p>
                 </div>
              </button>

              <button className="w-full bg-[#f8f9fa] border border-[#dadce0] rounded-2xl p-4 flex items-center space-x-4 hover:bg-white hover:border-[#34a853]/50 hover:shadow-md transition-all group">
                 <div className="h-10 w-10 bg-white rounded-xl shadow-sm border border-[#dadce0] flex items-center justify-center text-[#5f6368] group-hover:text-[#34a853] transition-colors">
                    <MessageSquare className="h-5 w-5" />
                 </div>
                 <div className="text-left flex-1">
                     <p className="font-bold text-[#202124] tracking-tight text-sm">Live Dispatch</p>
                     <p className="text-[11px] font-medium text-[#70757a] uppercase tracking-wider mt-1">Chat with support</p>
                 </div>
              </button>

              <button className="w-full bg-[#f8f9fa] border border-[#dadce0] rounded-2xl p-4 flex items-center space-x-4 hover:bg-white hover:border-[#ea4335]/50 hover:shadow-md transition-all group">
                 <div className="h-10 w-10 bg-white rounded-xl shadow-sm border border-[#dadce0] flex items-center justify-center text-[#5f6368] group-hover:text-[#ea4335] transition-colors">
                    <Mail className="h-5 w-5" />
                 </div>
                 <div className="text-left flex-1">
                     <p className="font-bold text-[#202124] tracking-tight text-sm">Email Support</p>
                     <p className="text-[11px] font-medium text-[#70757a] uppercase tracking-wider mt-1">Response in 24h</p>
                 </div>
              </button>
           </div>
       </div>
    </div>
  );
};

export default AssistanceModal;
