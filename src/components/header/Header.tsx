'use client';
import Link from "next/link";
import { Menu, FolderSearch, Search, X, ChevronRight, Loader2 ,LogIn, LogOut } from "lucide-react";
import React, { useState, useEffect } from "react";
import IconsClient from "../icons/IconsClient";
import Image from "next/image";
import {Brand} from "@/lib/types"
import { Phone } from "@/lib/types";
import { useAuthModal } from "@/context/ModalProvider";
import { useSession, signOut } from "next-auth/react";
import { TransitionLink } from "../utils/TransitionLink";

const navItems = [
  { name: "Home", href: "/" },
  { name: "phones", href: "/phones" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const navItems2 = [
  { name: "browse", icon: "FolderSearch", href: "/" },
  { name: "search", icon: "Search", href: "/blog" },
];

// Search Overlay Component
const SearchOverlay = ({ 
  isOpen, 
  onClose
}: { 
  isOpen: boolean; 
  onClose: () => void; 
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Phone[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Reset state when overlay closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setSearchResults([]);
      setHasSearched(false);
      setIsSearching(false);
    }
  }, [isOpen]);

  // Search function
  const performSearch = async (query: string) => {
  if (!query.trim()) {
    setSearchResults([]);
    setHasSearched(false);
    return;
  }

  setIsSearching(true);
  setHasSearched(true);

  try {
    const response = await fetch(`/api/phones?searchTerm=${encodeURIComponent(query)}`);
    const results = await response.json();
    console.log(results);
    setSearchResults(results.data);
  } catch (error) {
    console.error('Search error:', error);
    setSearchResults([]);
  } finally {
    setIsSearching(false);
  }
};

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        performSearch(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Overlay Content */}
      <div className="relative z-10 flex items-center justify-center h-full p-4">
        <div className="bg-[#fafafc] dark:bg-gray-800 w-full h-full shadow-2xl border border-pink-200  overflow-hidden transform transition-all duration-300 ease-out scale-100 translate-y-0">
          
          {/* Header */}
          <div className="bg-[var(--bg-alt)] dark:bg-gray-900 p-4 text-black dark:white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Search className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[var(--primary)]">Search Posts</h2>
                  <p className="text-black dark:text-white/80 text-sm">Find what you're looking for</p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              >
                <X className="w-6 h-6 text-[var(--primary)]" />
              </button>
            </div>
          </div>

          {/* Search Input */}
          <div className="p-8 border-b border-gray-200 dark:border-gray-600">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for posts, brands, or topics..."
                value={searchQuery}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-[var(--primary)] focus:outline-none text-lg placeholder-gray-400 transition-colors"
                autoFocus
              />
              {isSearching && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                </div>
              )}
            </div>
          </div>

          {/* Search Results */}
          <div className="flex-1 overflow-y-auto h-[calc(100vh-300px)]">
            {!hasSearched ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-8">
                <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-2xl mb-4">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Your Search</h3>
                <p className="text-gray-500">Type in the search box above to find posts and content</p>
              </div>
            ) : isSearching ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Searching...</h3>
                <p className="text-gray-500">Finding the best results for "{searchQuery}"</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500">
                    Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
                  </p>
                </div>
                <div className="space-y-4">
                  {searchResults.map((post) => (
                    <Link
                      key={post.id}
                       href={`/phones/${post.slug}`}
                      onClick={onClose}
                      className="group block p-4 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <div className="flex gap-4">
                        {/* Post Image */}
                        {post.primaryImage && (
                          <div className="flex-shrink-0 relative w-20 h-20 bg-gray-200 rounded-xl overflow-hidden">
                            <Image
                              src={post.primaryImage}
                              alt={post.slug}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        )}
                        
                        {/* Post Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                            {post.name}
                          </h3>
                          
                          {/* Brands */}
                         
                            <div className="flex flex-wrap gap-2 mt-2">
                              
                                <span
                                  key={post.brand?.slug}
                                  className="inline-flex items-center px-2 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium"
                                >
                                  {post.brand?.name}
                                </span>
                              
                            </div>
                         
                          
                          {/* Excerpt */}
                          {post.description && (
                            <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                              {post.description}
                            </p>
                          )}
                          
                          {/* Read more indicator */}
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-xs text-gray-400">Click to read more</span>
                            <ChevronRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center px-8">
                <div className="p-4 bg-gray-100 rounded-2xl mb-4">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
                <p className="text-gray-500">
                  No posts found for "{searchQuery}". Try different keywords or check your spelling.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 bg-gray-900 px-8 py-4 border-t border-gray-200 dark:border-gray-600">
            <p className="text-center text-sm text-gray-500">
              {hasSearched && !isSearching ? `${searchResults.length} results` : 'Start typing to search'} • Press Esc to close
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Category Overlay Component (unchanged)
const CategoryOverlay = ({ 
  isOpen, 
  onClose, 
  categories,
  isLoading
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  categories: Brand[] | null;
  isLoading: boolean;
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60  backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Overlay Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="bg-white w-full h-[100vh] shadow-2xl border border-gray-200  overflow-hidden transform transition-all duration-300 ease-out scale-100 translate-y-0">
          
          {/* Header */}
          <div className="bg-[#fafafc] px-8 py-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <FolderSearch className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl text-[var(--primary)] font-bold">Browse Categories</h2>
                  <p className="text-black/80 text-sm">Explore our phone brands</p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              >
                <X className="w-6 h-6 text-[var(--primary)]" />
              </button>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="p-8 overflow-y-auto h-[calc(90vh-120px)]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Categories...</h3>
                <p className="text-gray-500">Please wait while we fetch the latest brands</p>
              </div>
            ) : categories && categories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-6">
                {categories.map((brand, index) => (
                  <Link
                    key={brand.slug}
                    href={`/phones?brandSlug=${brand.slug}`}
                    onClick={onClose}
                    className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                  >
                    {/* Brand Image */}
                    <div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                      <Image
                        src={brand.logo || "../favicon.ico"}
                        alt={brand.slug}
                        fill
                        className="object-cover object-center group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Brand Info */}
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 capitalize group-hover:text-blue-600 transition-colors">
                            {brand.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Explore {brand.name} devices
                          </p>
                        </div>
                        
                        <div className="p-2 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                          <ChevronRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>

                      {/* Progress bar for visual appeal */}
                      <div className="mt-4">
                        <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-pink-600 rounded-full transition-all duration-1000 ease-out group-hover:w-full"
                            style={{ width: `${Math.min(100, (index + 1) * 25)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="p-4 bg-gray-100 rounded-2xl mb-4">
                  <FolderSearch className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Categories Found</h3>
                <p className="text-gray-500">Unable to load brand categories at the moment</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500">
              Found {categories?.length || 0} brands • Click outside to close
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const MobileNav = ({
  isOpen,
  onClose,
  onSearchClick,
  onBrowseClick,
  onLoginClick
}: {
  isOpen: boolean;
  onClose: () => void;
  onSearchClick: (e: React.MouseEvent) => void;
  onBrowseClick: (e: React.MouseEvent) => void;
  onLoginClick: (e: React.MouseEvent) => void;
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-40 transition-opacity duration-300 lg:hidden ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative z-10 flex flex-col w-full max-w-xs h-full bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <Link href="/" onClick={onClose}>
            <h1 className="text-2xl font-bold text-[var(--primary)]">CR</h1>
          </Link>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <nav className="flex flex-col p-4 space-y-2">
            {[...navItems, ...navItems2].map((item) => (
              <li key={item.name} className="list-none">
                {item.name === "browse" ? (
                  <button
                    onClick={(e) => {
                      onBrowseClick(e);
                      onClose();
                    }}
                    className="flex items-center w-full p-3 text-lg font-medium text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <IconsClient name="FolderSearch" size={20} className="mr-3" />
                    <span>Browse</span>
                  </button>
                ) : item.name === "search" ? (
                  <button
                    onClick={(e) => {
                      onSearchClick(e);
                      onClose();
                    }}
                    className="flex items-center w-full p-3 text-lg font-medium text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <IconsClient name="Search" size={20} className="mr-3" />
                    <span>Search</span>
                  </button>
                ) : item.name === "Login" ? (
                  <button 
                    onClick={(e) => { 
                      onLoginClick(e); 
                      onClose(); 
                    }}
                    className="flex items-center w-full p-3 text-lg font-medium text-gray-700 rounded-lg hover:bg-gray-100 dark:text-ray-300 dark:hover:bg-gray-800"
                  >
                    <IconsClient name="LogIn" size={20} className="mr-3" />
                    <span>Login</span>
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center p-3 text-lg font-medium text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-center text-gray-500">© {new Date().getFullYear()} CR Phones</p>
        </div>
      </div>
    </div>
  );
};


const Header = () => {
  const { data: session, status } = useSession();
  const [isCategoryOverlayOpen, setIsCategoryOverlayOpen] = useState(false);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Brand[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { openModal } = useAuthModal();

  // Fetch categories when overlay opens for the first time
  useEffect(() => {
    const fetchCategories = async () => {
      if (isCategoryOverlayOpen && !categories) {
        setIsLoading(true);
        try {
          const response = await fetch('/api/brands');
          const brandsData = await response.json();
          setCategories(brandsData.data);
        } catch (error) {
          console.error('Error fetching brands:', error);
          setCategories([]);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCategories();
  }, [isCategoryOverlayOpen, categories]);

  // Handle keyboard shortcuts and body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCategoryOverlayOpen(false);
        setIsSearchOverlayOpen(false);
        setIsMobileMenuOpen(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOverlayOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleBrowseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsCategoryOverlayOpen(true);
  };

  const handleSearchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSearchOverlayOpen(true);
  };
  
  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openModal();
  };

  const handleNavClick = (item: typeof navItems2[0], e: React.MouseEvent) => {
    if (item.name === "browse") {
      handleBrowseClick(e);
    } else if (item.name === "search") {
      handleSearchClick(e);
    }
  };

  return (
    <>
      <header className="w-full relative z-30">
        <div className="container mx-auto px-4">
          <nav className="flex justify-between items-center w-full py-4">
            {/* Left side: Desktop Nav */}
            <ul className="hidden lg:flex items-center gap-8 flex-1">
              {navItems.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="nav-link text-[var(--primary)] text-sm font-semibold px-3 py-2 rounded-lg transition-colors duration-300 hover:text-[var(--secondary)] hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>

            {/* Left side: Mobile Hamburger */}
            <div className="lg:hidden flex-1">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 text-gray-600 hover:text-[var(--primary)]"
                aria-label="Open menu"
              >
                <Menu size={24} />
              </button>
            </div>

            {/* Center: Logo */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Link href="/">
                <h1 className="text-gray-400/80 text-center text-3xl lg:text-4xl font-bold hover:text-[var(--primary)] transition-all duration-300 ease-in-out">
                  CR
                </h1>
              </Link>
            </div>

            {/* Right side: Desktop Nav & Mobile Actions */}
            <div className="hidden lg:flex items-center justify-end gap-8 flex-1">
              {navItems2.map((item) => (
                <li key={item.name} className="list-none">
                  <button
                    onClick={(e) => handleNavClick(item, e)}
                    className="flex items-center gap-2 text-[var(--primary)] text-sm font-semibold px-3 py-2 rounded-lg transition-colors duration-300 hover:text-[var(--secondary)] hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <IconsClient name={item.icon as any} size={14} />
                    <span>{item.name}</span>
                    {item.name === "search" && (
                      <span className="ml-1 text-xs opacity-60 border border-gray-300 dark:border-gray-600 rounded px-1.5 py-0.5">⌘K</span>
                    )}
                  </button>
                </li>
              ))}
              {status === 'authenticated' ? (
                <li className="list-none flex items-center gap-4">
                  <button
                    onClick={() => signOut()}
                    className="flex items-center gap-2 text-[var(--primary)] text-sm font-semibold px-3 py-2 rounded-lg transition-colors duration-300 hover:text-[var(--secondary)] hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <LogOut size={16} />
                    <span>Sign out</span>
                  </button>
                  <Image src={session.user?.image || ''} alt={session.user?.name || ''} width={32} height={32} className="rounded-full" />
                </li>
              ) : (
                <li className="list-none">
                  <button
                    onClick={handleLoginClick}
                    className="flex items-center gap-2 text-[var(--primary)] text-sm font-semibold px-3 py-2 rounded-lg transition-colors duration-300 hover:text-[var(--secondary)] hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <LogIn size={16} />
                    <span>Login</span>
                  </button>
                </li>
              )}
            </div>
            
            <div className="lg:hidden flex-1 flex justify-end">
               <button
                onClick={handleSearchClick}
                className="p-2 text-gray-600 hover:text-[var(--primary)]"
                aria-label="Search"
              >
                <Search size={24} />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <MobileNav 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
        onSearchClick={handleSearchClick}
        onBrowseClick={handleBrowseClick}
        onLoginClick={handleLoginClick}
      />

      {/* Category Overlay */}
      <CategoryOverlay
        isOpen={isCategoryOverlayOpen}
        onClose={() => setIsCategoryOverlayOpen(false)}
        categories={categories}
        isLoading={isLoading}
      />

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOverlayOpen}
        onClose={() => setIsSearchOverlayOpen(false)}
      />
    </>
  );
};

export default Header;
