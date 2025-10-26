"use client";
import React, { useState, useMemo } from 'react';
import { Search, Grid, Layers } from 'lucide-react';
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kzrfwiglfynrdyofkljs.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY

if (!supabaseKey) {
  throw new Error('Missing SUPABASE_KEY environment variable');
}

export const supabase = createClient(supabaseUrl, supabaseKey)

const mockImages = [
  { id: 1, title: 'Example 1', src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop' },
  { id: 2, title: 'Example 2', src: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&h=600&fit=crop' },
  { id: 3, title: 'Example 3', src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop' },
  { id: 4, title: 'Example 4', src: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=600&fit=crop' },
  { id: 5, title: 'Example 5', src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop' },
  { id: 6, title: 'Example 6', src: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&h=600&fit=crop' },
  { id: 7, title: 'Example 7', src: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop' },
  { id: 8, title: 'Example 8', src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop' },
];

type Page = 'home' | 'projects';

interface NavbarProps {
  currentPage: String;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-slate-900/95 to-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentPage('home')}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
              currentPage === 'home'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Home
          </button>
          
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-2xl shadow-2xl shadow-purple-500/30">
              <img 
                  src={"white_glasses.png"}
                  className="h-6"
              />
              <span className="text-xl font-bold text-white">WalTer</span>
            </div>
          </div>
          
          <button
            onClick={() => setCurrentPage('projects')}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
              currentPage === 'projects'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Projects
          </button>
        </div>
      </div>
    </nav>
  );
};

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative max-w-2xl mx-auto mb-12">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
        <div className="relative bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="flex items-center px-6 py-4">
            <Search className="w-5 h-5 text-purple-400 mr-3" />
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-slate-400 outline-none text-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ImageCard: React.FC<{ image: { id: number; title: string; src: string }; index: number }> = ({ image, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = () => {
    alert(`Requesting Item: "${image.title}"`);
  };
  
  return (
    <div
      className="group relative cursor-pointer"
      style={{
        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="relative overflow-hidden rounded-2xl bg-slate-800 shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-purple-500/30">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
        
        <div className="aspect-[4/3] overflow-hidden relative">
          <img
            src={image.src}
            alt={image.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Request overlay text */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-40">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-3 rounded-full shadow-2xl transform scale-90 group-hover:scale-100 transition-transform duration-500">
              <span className="text-white font-bold text-2xl">Request</span>
            </div>
          </div>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"></div>
        
        <div className="p-6 relative z-30">
          <h3 className="text-xl font-bold text-white mb-2 transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400">
            {image.title}
          </h3>
          <div className={`h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500 ${
            isHovered ? 'w-full' : 'w-0'
          }`}></div>
        </div>
      </div>
    </div>
  );
};

interface HomePageProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const HomePage: React.FC<HomePageProps> = ({ searchTerm, setSearchTerm }) => {
  const filteredImages = useMemo(() => {
    return mockImages.filter(img =>
      img.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 animate-gradient leading-tight">
            Catalogue
          </h1>
        </div>

        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {filteredImages.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 text-xl">No results found for "{searchTerm}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredImages.map((image, index) => (
              <ImageCard key={image.id} image={image} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ProjectsPage = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 animate-gradient leading-tight">
            Projects
          </h1>
          <p className="text-slate-400 text-xl">example</p>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }

        * {
          scrollbar-width: thin;
          scrollbar-color: rgb(147, 51, 234) rgb(15, 23, 42);
        }

        *::-webkit-scrollbar {
          width: 10px;
        }

        *::-webkit-scrollbar-track {
          background: rgb(15, 23, 42);
        }

        *::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, rgb(168, 85, 247), rgb(236, 72, 153));
          border-radius: 10px;
        }
      `}</style>

      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {currentPage === 'home' ? (
        <HomePage searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      ) : (
        <ProjectsPage />
      )}
    </div>
  );
}