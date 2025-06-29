
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

interface HeroContentProps {
  animate: boolean;
  onGetAccess: () => void;
  onInvite: () => void;
}

export const HeroContent: React.FC<HeroContentProps> = ({ animate, onGetAccess, onInvite }) => {
  return (
    <div className={`w-full pb-10 md:pb-0 text-left transition-all duration-700 ease-out ${animate ? 'opacity-100' : 'opacity-0 translate-y-6'}`}>
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] text-gray-900 mb-4">
        <div className="flex flex-col">
          <span className="block bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-700 bg-clip-text text-transparent drop-shadow-sm">Transform</span>
          <span className="block bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-700 bg-clip-text text-transparent drop-shadow-sm">Your Expertise</span>
          <span className="block bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-700 bg-clip-text text-transparent drop-shadow-sm">With GRC</span>
          <span className="block bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-700 bg-clip-text text-transparent drop-shadow-sm">Agents</span>
        </div>
      </h1>
      
      <p className="mt-4 text-base md:text-lg text-gray-700 max-w-md leading-relaxed font-normal">
        Join a global network of professionals to boost your expertise with GRC agents, exclusive testing of future solutions, comprehensive regulatory insights and personalized career resilience tools to upskill, adapt, and lead the way in shaping the future of GRC.
      </p>
      
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <div onClick={onGetAccess} className="cursor-pointer">
          <Button className="flex items-center gap-2">
            Join Waitlist <ArrowRight size={16} />
          </Button>
        </div>
      </div>
      
      <div className="mt-4 flex items-center text-sm text-gray-500 space-x-6">
        <span className="flex items-center">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
          GRC Innovation Hub
        </span>
        <span className="flex items-center">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
          Join early adopters in our private pilot
        </span>
      </div>
    </div>
  );
};
