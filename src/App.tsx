import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Book as BookIcon, 
  User, 
  Search, 
  ArrowLeft, 
  Menu, 
  X, 
  ChevronRight,
  BookOpen,
  Home,
  Loader2
} from 'lucide-react';
import { booksMetadata, authorBio, BookMetadata, BookData, Section } from './data';

type View = 'home' | 'reader' | 'author';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedBook, setSelectedBook] = useState<BookMetadata | null>(null);
  const [selectedBookData, setSelectedBookData] = useState<BookData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const filteredBooks = useMemo(() => {
    return booksMetadata.filter(book => 
      book.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleBookClick = async (book: BookMetadata) => {
    setSelectedBook(book);
    setCurrentView('reader');
    setIsLoading(true);
    setSelectedBookData(null);
    window.scrollTo(0, 0);

    try {
      const response = await fetch(book.dataUrl);
      if (!response.ok) throw new Error('Failed to fetch book data');
      const data: BookData = await response.json();
      setSelectedBookData(data);
    } catch (error) {
      console.error('Error fetching book data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateTo = (view: View) => {
    setCurrentView(view);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => navigateTo('home')}
            id="app-logo"
          >
            <BookIcon className="w-6 h-6 text-accent" />
            <h1 className="text-lg md:text-xl font-bold truncate">
              আল্লামা এমএ জলিল রহ. গ্রন্থসমগ্র
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => navigateTo('home')}
              className={`flex items-center gap-1 hover:text-accent transition-colors ${currentView === 'home' ? 'text-accent' : ''}`}
              id="nav-home"
            >
              <Home className="w-4 h-4" />
              হোম
            </button>
            <button 
              onClick={() => navigateTo('author')}
              className={`flex items-center gap-1 hover:text-accent transition-colors ${currentView === 'author' ? 'text-accent' : ''}`}
              id="nav-author"
            >
              <User className="w-4 h-4" />
              লেখক পরিচিতি
            </button>
          </div>

          <button 
            className="md:hidden p-2" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            id="mobile-menu-toggle"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-primary text-white border-t border-white/10 absolute top-16 left-0 w-full z-40 shadow-xl"
            id="mobile-menu"
          >
            <div className="p-4 flex flex-col gap-4">
              <button onClick={() => navigateTo('home')} className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg">
                <Home className="w-5 h-5" /> হোম
              </button>
              <button onClick={() => navigateTo('author')} className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg">
                <User className="w-5 h-5" /> লেখক পরিচিতি
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8">
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
              id="home-view"
            >
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-primary">স্বাগতম</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  অধ্যক্ষ হাফেয মাওলানা মুহাম্মদ আবদুল জলিল (রহ.)-এর অমূল্য রচনাবলী ডিজিটাল লাইব্রেরি।
                </p>
                
                <div className="max-w-md mx-auto relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder="বই খুঁজুন..." 
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    id="book-search-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                {filteredBooks.map((book) => (
                  <motion.div 
                    key={book.id}
                    whileHover={{ y: -5 }}
                    className="group cursor-pointer"
                    onClick={() => handleBookClick(book)}
                    id={`book-card-${book.id}`}
                  >
                    <div className="aspect-[3/4] bg-white rounded-xl overflow-hidden book-shadow mb-3 relative">
                      <img 
                        src={book.coverImage} 
                        alt={book.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <BookOpen className="text-white w-10 h-10" />
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors text-sm md:text-base line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{book.author}</p>
                  </motion.div>
                ))}
              </div>
              
              {filteredBooks.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                  কোন বই পাওয়া যায়নি।
                </div>
              )}
            </motion.div>
          )}

          {currentView === 'reader' && selectedBook && (
            <motion.div 
              key="reader"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-5xl mx-auto space-y-8"
              id="reader-view"
            >
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => navigateTo('home')}
                  className="flex items-center gap-2 text-primary font-medium hover:underline"
                  id="back-to-home"
                >
                  <ArrowLeft className="w-4 h-4" /> ফিরে যান
                </button>
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  <p className="text-gray-500 font-medium">বইয়ের তথ্য লোড হচ্ছে...</p>
                </div>
              ) : selectedBookData ? (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  {/* Sidebar / Table of Contents */}
                  <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white rounded-2xl p-4 shadow-md border border-black/5 sticky top-24">
                      <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
                        <Menu className="w-4 h-4" /> সূচীপত্র
                      </h3>
                      <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                        {selectedBookData.sections.map((section) => (
                          <a 
                            key={section.section_id}
                            href={`#section-${section.section_id}`}
                            className="block p-2 text-sm text-gray-600 hover:bg-accent/20 hover:text-primary rounded-lg transition-colors"
                          >
                            {section.heading}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Main Reading Area */}
                  <div className="lg:col-span-3 space-y-8">
                    <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-black/5 space-y-8">
                      <div className="flex flex-col md:flex-row gap-8 items-start border-b border-gray-100 pb-8">
                        <div className="w-full md:w-40 aspect-[3/4] rounded-xl overflow-hidden shadow-md shrink-0">
                          <img 
                            src={selectedBook.coverImage} 
                            alt={selectedBook.title} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-grow space-y-4">
                          <div className="space-y-1">
                            <h2 className="text-3xl font-bold text-primary leading-tight">{selectedBookData.book.title_bangla}</h2>
                            {selectedBookData.book.title_arabic && (
                              <p className="text-2xl arabic-text text-secondary">{selectedBookData.book.title_arabic}</p>
                            )}
                          </div>
                          <p className="text-gray-600 flex items-center gap-2">
                            <User className="w-4 h-4" /> {selectedBookData.book.author}
                          </p>
                          <p className="text-sm text-gray-400">মোট অধ্যায়: {selectedBookData.book.total_sections}</p>
                        </div>
                      </div>

                      <div className="pt-4 space-y-16">
                        {selectedBookData.sections.map((section) => (
                          <div key={section.section_id} className="space-y-6 scroll-mt-24" id={`section-${section.section_id}`}>
                            <h4 className="text-2xl font-bold text-primary border-l-4 border-accent pl-4 py-1 bg-accent/5">
                              {section.heading}
                            </h4>
                            <div className="space-y-6 text-gray-800 leading-relaxed text-lg md:text-xl font-sans">
                              {section.paragraphs.map((para, idx) => (
                                <p key={idx} className="whitespace-pre-wrap text-justify">{para}</p>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 text-red-500">
                  বইয়ের তথ্য লোড করা সম্ভব হয়নি।
                </div>
              )}
            </motion.div>
          )}

          {currentView === 'author' && (
            <motion.div 
              key="author"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto space-y-8"
              id="author-view"
            >
              <button 
                onClick={() => navigateTo('home')}
                className="flex items-center gap-2 text-primary font-medium hover:underline"
                id="author-back-to-home"
              >
                <ArrowLeft className="w-4 h-4" /> ফিরে যান
              </button>

              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-black/5 space-y-10">
                <div className="flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left">
                  <div className="w-48 h-48 rounded-full bg-accent/20 flex items-center justify-center border-4 border-accent overflow-hidden shrink-0">
                    <img 
                      src="https://raw.githubusercontent.com/appsabswer/MAJalilBooks/main/assat/writer.png" 
                      alt="Author" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold text-primary">{authorBio.heading}</h2>
                    <div className="h-1 w-20 bg-accent mx-auto md:mx-0 rounded-full"></div>
                    <p className="text-xl text-gray-600 font-medium">অধ্যক্ষ হাফেয মাওলানা মুহাম্মদ আবদুল জলিল (রহ.)</p>
                  </div>
                </div>

                <div className="space-y-6 text-gray-800 leading-relaxed text-lg">
                  {authorBio.paragraphs.map((para, idx) => (
                    <p key={idx} className="whitespace-pre-wrap">{para}</p>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookIcon className="w-6 h-6 text-accent" />
              <span className="text-xl font-bold">গ্রন্থসমগ্র</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              আল্লামা এমএ জলিল রহ.-এর রচনাবলী বিশ্বব্যাপী পাঠকদের কাছে পৌঁছে দেওয়ার একটি ক্ষুদ্র প্রচেষ্টা।
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-lg">লিঙ্কসমূহ</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><button onClick={() => navigateTo('home')} className="hover:text-accent transition-colors">হোম</button></li>
              <li><button onClick={() => navigateTo('author')} className="hover:text-accent transition-colors">লেখক পরিচিতি</button></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-lg">যোগাযোগ</h4>
            <p className="text-gray-400 text-sm">
              ইমেইল: admin@abswer.com<br />
              ডেভেলপার: <a href="https://about.abswer.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Abswer IT</a>
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-white/10 text-center text-gray-500 text-xs">
          © {new Date().getFullYear()} আল্লামা এমএ জলিল রহ. গ্রন্থসমগ্র। সর্বস্বত্ব সংরক্ষিত।
        </div>
      </footer>
    </div>
  );
}

