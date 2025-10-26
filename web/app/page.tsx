"use client";
import React, { useState, useMemo } from 'react';
import { Search, Grid, Layers } from 'lucide-react';
import { supabase } from './components/supabase';

let { data: images, error } = await supabase
  .from('images')
  .select('*')

const mockImages = images ? images.map(img => ({
  id: img.id,
  title: img.title,
  src: `data:image/jpeg;base64,${img.src}`,
})) : [];

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

interface Project {
  id: number;
  name: string;
  description: string;
  goals: string;
  component_ids: number[];
  created_at: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [newProjectGoals, setNewProjectGoals] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Load projects from Supabase
  React.useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setProjects(data);
  };

  const createProject = async () => {
    if (!newProjectName.trim()) return;

    const { data, error } = await supabase
      .from('projects')
      .insert([{
        name: newProjectName,
        description: newProjectDescription,
        goals: newProjectGoals,
        component_ids: []
      }])
      .select();

    if (data) {
      setProjects([data[0], ...projects]);
      setSelectedProject(data[0]);
      setIsCreatingProject(false);
      setNewProjectName('');
      setNewProjectDescription('');
      setNewProjectGoals('');
    }
  };

  const deleteProject = async (projectId: number) => {
    await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);
    
    setProjects(projects.filter(p => p.id !== projectId));
    if (selectedProject?.id === projectId) {
      setSelectedProject(null);
      setMessages([]);
    }
  };

  const toggleComponent = async (componentId: number) => {
    if (!selectedProject) return;

    const componentIds = selectedProject.component_ids || [];
    const newComponentIds = componentIds.includes(componentId)
      ? componentIds.filter(id => id !== componentId)
      : [...componentIds, componentId];

    const { data } = await supabase
      .from('projects')
      .update({ component_ids: newComponentIds })
      .eq('id', selectedProject.id)
      .select();

    if (data) {
      const updatedProject = data[0];
      setSelectedProject(updatedProject);
      setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !selectedProject || isSending) return;

    const userMessage: Message = { role: 'user', content: inputMessage };
    setMessages([...messages, userMessage]);
    setInputMessage('');
    setIsSending(true);

    try {
      // Get selected components
      const selectedComponents = mockImages.filter(img => 
        selectedProject.component_ids?.includes(img.id)
      );

      // Call Gemini API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          projectContext: {
            name: selectedProject.name,
            description: selectedProject.description,
            goals: selectedProject.goals,
            components: selectedComponents.map(c => c.title)
          }
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const aiMessage: Message = {
          role: 'assistant',
          content: data.message
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        const errorMessage: Message = {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.'
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const selectedComponents = selectedProject 
    ? mockImages.filter(img => selectedProject.component_ids?.includes(img.id))
    : [];

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex gap-6 h-[calc(100vh-8rem)]">
          {/* Sidebar - Projects List */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 h-full overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Projects</h2>
                <button
                  onClick={() => setIsCreatingProject(true)}
                  className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
                >
                  <Layers className="w-5 h-5" />
                </button>
              </div>

              {isCreatingProject && (
                <div className="mb-4 p-4 bg-slate-900/50 rounded-xl border border-slate-700">
                  <input
                    type="text"
                    placeholder="Project name"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg mb-2 outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <textarea
                    placeholder="Description"
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg mb-2 outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    rows={2}
                  />
                  <textarea
                    placeholder="Goals"
                    value={newProjectGoals}
                    onChange={(e) => setNewProjectGoals(e.target.value)}
                    className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg mb-3 outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={createProject}
                      className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => setIsCreatingProject(false)}
                      className="px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-300 group relative ${
                      selectedProject?.id === project.id
                        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50'
                        : 'bg-slate-900/50 border border-slate-700 hover:border-slate-600'
                    }`}
                    onClick={() => {
                      setSelectedProject(project);
                      setMessages([]);
                    }}
                  >
                    <h3 className="text-white font-semibold mb-1">{project.name}</h3>
                    <p className="text-slate-400 text-sm line-clamp-2">{project.description}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProject(project.id);
                      }}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-all"
                    >
                      <span className="text-red-400 text-xs">×</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          {selectedProject ? (
            <div className="flex-1 flex gap-6">
              {/* Components Panel */}
              <div className="w-96 flex-shrink-0">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 h-full flex flex-col">
                  <h3 className="text-xl font-bold text-white mb-4">Components</h3>
                  <div className="flex-1 overflow-y-auto space-y-3">
                    {mockImages.map((image) => {
                      const isSelected = selectedProject.component_ids?.includes(image.id);
                      return (
                        <div
                          key={image.id}
                          onClick={() => toggleComponent(image.id)}
                          className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                            isSelected
                              ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50'
                              : 'bg-slate-900/50 border border-slate-700 hover:border-slate-600'
                          }`}
                        >
                          <img
                            src={image.src}
                            alt={image.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="text-white font-medium">{image.title}</h4>
                          </div>
                          {isSelected && (
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                              <span className="text-white text-sm">✓</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Chat Panel */}
              <div className="flex-1">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 h-full flex flex-col">
                  {/* Chat Header */}
                  <div className="p-6 border-b border-slate-700/50">
                    <h3 className="text-2xl font-bold text-white mb-2">{selectedProject.name}</h3>
                    <p className="text-slate-400 text-sm mb-2">{selectedProject.description}</p>
                    {selectedProject.goals && (
                      <p className="text-purple-400 text-sm">
                        <span className="font-semibold">Goals:</span> {selectedProject.goals}
                      </p>
                    )}
                    {selectedComponents.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {selectedComponents.map(comp => (
                          <span key={comp.id} className="px-3 py-1 bg-slate-900/50 rounded-full text-xs text-slate-300 border border-slate-700">
                            {comp.title}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center py-20">
                        <p className="text-slate-400 text-lg">Start a conversation about your project!</p>
                        <p className="text-slate-500 text-sm mt-2">Ask for suggestions, improvements, or guidance.</p>
                      </div>
                    ) : (
                      messages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] p-4 rounded-2xl ${
                              msg.role === 'user'
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                : 'bg-slate-900/50 text-slate-200 border border-slate-700'
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                    {isSending && (
                      <div className="flex justify-start">
                        <div className="bg-slate-900/50 border border-slate-700 p-4 rounded-2xl">
                          <div className="flex gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input */}
                  <div className="p-6 border-t border-slate-700/50">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Ask about your project..."
                        className="flex-1 bg-slate-900/50 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 border border-slate-700"
                        disabled={isSending}
                      />
                      <button
                        onClick={sendMessage}
                        disabled={isSending || !inputMessage.trim()}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Layers className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No Project Selected</h3>
                <p className="text-slate-400">Create or select a project to get started</p>
              </div>
            </div>
          )}
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