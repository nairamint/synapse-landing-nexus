import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { FeatureGrid } from '../features/FeatureGrid';

interface HeroContentProps {
  animate: boolean;
  onGetAccess: () => void;
  onLearnMore: (e: React.MouseEvent) => void;
}

export const HeroContent: React.FC<HeroContentProps> = ({ animate, onGetAccess, onLearnMore }) => {
  return (
    <div className={`w-full text-center transition-all duration-700 ease-out ${animate ? 'opacity-100' : 'opacity-0 translate-y-6'}`}>
      <h1 className="heading-xl">
        <span className="inline-block relative bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-700 bg-clip-text text-transparent animate-text">
          <span className="animate-gradient-text">Become a Trusted Expert in the Age of AI-Driven GRC</span>
        </span>
      </h1>
      
      <p className="mt-6 text-lg md:text-xl text-gray-700 max-w-xl mx-auto md:mx-0 leading-relaxed">
        Join a global network of professionals for exclusive beta testing of future solutions, comprehensive regulatory insights and personalized career resilience tools to upskill, adapt, and lead the way in shaping the future of GRC.
      </p>
      
      <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
        <div onClick={onGetAccess} className="cursor-pointer">
          <Button className="bg-synapse-primary hover:bg-synapse-secondary text-white px-8 py-6 text-lg rounded-lg flex items-center gap-2 hover-lift">
            Get Early Access <ArrowRight size={18} />
          </Button>
        </div>
        <a href="#features" onClick={onLearnMore}>
          <Button variant="outline" className="border-synapse-primary text-synapse-primary hover:bg-synapse-primary/5 px-8 py-6 text-lg rounded-lg hover-lift">
            Learn More
          </Button>
        </a>
      </div>
      
      <div className="mt-8 flex items-center justify-center text-sm text-gray-300">
        <span className="flex items-center">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
          Join 50+ early adopters in our private pilot
        </span>
      </div>
      
      <FeatureGrid animate={animate} className="mt-12" />
      
      <div className="mt-12 pt-12 border-t border-white/10">
        <span className="text-gray-300">
          <span role="img" aria-label="gift">🎁</span> <strong>Limited time offer:</strong> Join the waitlist for a chance to get 3 months of Premium Plan access—<strong>free!</strong>
        </span>
      </div>
    </div>
  );
};
