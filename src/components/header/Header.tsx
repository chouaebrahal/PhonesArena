"use client";
import Link from "next/link";
import { Menu, FolderSearch, Search, X, ChevronRight, Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import IconsClient from "../icons/IconsClient";
import Image from "next/image";
import { searchPosts } from "@/lib/queries";

// Define BrandNode type locally since it's not fully defined in types file
interface BrandNode {
  id: string;
  name: string;
  slug: string;
  image: {
    sourceUrl: string;
    altText: string;
  };
}





// Types for search results
interface SearchResult {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: {
    node: {
      altText: string;
      sourceUrl: string;
    };
  };
  brands: {
    nodes: Array<{
      name: string;
      slug: string;
    }>;
  };
}

const navItems = [
  { name: "Home", href: "/" },
  { name: "Brands", href: "/brands" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const navItems2 = [
  { name: "browse", icon: "FolderSearch", href: "/" },
  { name: "search", icon: "Search", href: "/blog" },
  { name: "Menu", icon: "Menu", href: "/about" },
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
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
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
    // Use your existing GraphQL setup
    const results = await searchPosts(query); // Your search function
    setSearchResults(results);
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
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="bg-[#fafafc] w-full max-w-4xl rounded-3xl shadow-2xl border border-gray-200 max-h-[90vh] overflow-hidden transform transition-all duration-300 ease-out scale-100 translate-y-0">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 px-8 py-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Search className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Search Posts</h2>
                  <p className="text-white/80 text-sm">Find what you're looking for</p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Search Input */}
          <div className="p-8 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for posts, brands, or topics..."
                value={searchQuery}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none text-lg placeholder-gray-400 transition-colors"
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
          <div className="flex-1 overflow-y-auto max-h-[calc(90vh-240px)]">
            {!hasSearched ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-8">
                <div className="p-4 bg-gray-100 rounded-2xl mb-4">
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
                      href={`/brands/${post.slug}`}
                      onClick={onClose}
                      className="group block p-4 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <div className="flex gap-4">
                        {/* Post Image */}
                        {post.featuredImage && (
                          <div className="flex-shrink-0 relative w-20 h-20 bg-gray-200 rounded-xl overflow-hidden">
                            <Image
                              src={post.featuredImage.node.sourceUrl}
                              alt={post.featuredImage.node.altText}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        )}
                        
                        {/* Post Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                            {post.title}
                          </h3>
                          
                          {/* Brands */}
                          {post.brands?.nodes && post.brands.nodes.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {post.brands.nodes.map((brand) => (
                                <span
                                  key={brand.slug}
                                  className="inline-flex items-center px-2 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium"
                                >
                                  {brand.name}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          {/* Excerpt */}
                          {post.excerpt && (
                            <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                              {post.excerpt.replace(/<[^>]*>/g, '').substring(0, 120)}...
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
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
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
  categories: BrandNode[] | null;
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
                    href={`/phones?brand=${brand.slug}`}
                    onClick={onClose}
                    className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                  >
                    {/* Brand Image */}
                    <div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                      <Image
                        src={brand.image?.sourceUrl || "../favicon.ico"}
                        alt={brand.image?.altText || brand.slug}
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
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out group-hover:w-full"
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

const Header = () => {
  const [isCategoryOverlayOpen, setIsCategoryOverlayOpen] = useState(false);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [categories, setCategories] = useState<BrandNode[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch categories when overlay opens for the first time
  useEffect(() => {
    const fetchCategories = async () => {
      if (isCategoryOverlayOpen && !categories) {
        setIsLoading(true);
        try {
          // Fetch brands from API endpoint
          const response = await fetch('/api/brands');
          const brandsData = await response.json();
          setCategories(brandsData);
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

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCategoryOverlayOpen(false);
        setIsSearchOverlayOpen(false);
      }
      // Ctrl+K or Cmd+K for search
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

  const handleNavClick = (item: typeof navItems2[0], e: React.MouseEvent) => {
    if (item.name === "browse") {
      handleBrowseClick(e);
    } else if (item.name === "search") {
      handleSearchClick(e);
    }
    // Handle other nav items normally
  };

  return (
    <>
      <header className="w-full relative">
        <div className="container mx-auto">
          <nav className="flex justify-center items-center g-4 w-full py-4">
            <ul className="hidden lg:flex gap-8">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-[var(--primary)] text-[12px] font-semibold px-4 py-2 rounded transition-colors duration-300 hover:text-[var(--secondary)]"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className="logo w-full">
              <Link href="/">
                <h1 className="text-[var(--secondary)]/20 text-center text-2xl lg:text-4xl font-bold  hover:text-[var(--primary)] transition-colors duration-300 ease">
                  CR
                </h1>
              </Link>
              <Menu size={"16px"} className="lg:hidden" />
            </div>
            
            <div className="">
              <ul className="hidden lg:flex gap-8">
                {navItems2.map((item) => (
                  <li key={item.name}>
                    {item.name === "browse" || item.name === "search" ? (
                      <button
                        onClick={(e) => handleNavClick(item, e)}
                        className="flex space-x-0.5 text-[var(--primary)] items-center text-[12px] font-semibold px-4 py-2 rounded transition-colors duration-300 hover:text-[var(--secondary)]"
                      >
                        <IconsClient
                          name={item.icon as any}
                          size={12}
                          className=""
                        />
                        <span>{item.name}</span>
                        {item.name === "search" && (
                          <span className="ml-2 text-xs opacity-60">⌘K</span>
                        )}
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className="flex space-x-0.5 text-[var(--primary)] items-center text-[12px] font-semibold px-4 py-2 rounded transition-colors duration-300 hover:text-[var(--secondary)]"
                      >
                        <IconsClient
                          name={item.icon as any}
                          size={14}
                          className=""
                        />
                        <span>{item.name}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </header>

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