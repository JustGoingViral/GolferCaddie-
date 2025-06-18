import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const [location] = useLocation();
  
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        {/* Logo and Title */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mr-3">
              <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v6m0 6v6"/>
                <path d="m15.5 3.5-3 3-3-3"/>
                <path d="m20.5 8.5-3 3-3-3"/>
              </svg>
            </div>
            <h1 className="font-bold text-2xl text-neutral-900">OnlyGolfers-AI</h1>
          </div>
          <div className="rounded-full bg-neutral-100 w-10 h-10 flex items-center justify-center overflow-hidden">
            <img src="https://i.pravatar.cc/150?img=5" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <nav className="flex space-x-2 flex-wrap">
          <Link href="/">
            <Button 
              variant={location === "/" ? "default" : "outline"} 
              size="default"
              className={`flex items-center space-x-2 px-6 py-3 ${
                location === "/" 
                  ? "bg-green-600 hover:bg-green-700 text-white" 
                  : "bg-white hover:bg-green-50 text-neutral-700 border-neutral-200"
              }`}
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <span className="font-medium">Players</span>
            </Button>
          </Link>
          
          <Link href="/fantasy">
            <Button 
              variant={location === "/fantasy" ? "default" : "outline"} 
              size="default"
              className={`flex items-center space-x-2 px-6 py-3 ${
                location === "/fantasy" 
                  ? "bg-green-600 hover:bg-green-700 text-white" 
                  : "bg-white hover:bg-green-50 text-neutral-700 border-neutral-200"
              }`}
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5"/>
                <line x1="12" y1="22" x2="12" y2="15.5"/>
                <polyline points="2,8.5 12,15.5 22,8.5"/>
                <polyline points="2,8.5 12,2 22,8.5"/>
              </svg>
              <span className="font-medium">Fantasy</span>
            </Button>
          </Link>
          
          <Link href="/caddie">
            <Button 
              variant={location === "/caddie" ? "default" : "outline"} 
              size="default"
              className={`flex items-center space-x-2 px-6 py-3 ${
                location === "/caddie" 
                  ? "bg-green-600 hover:bg-green-700 text-white" 
                  : "bg-white hover:bg-green-50 text-neutral-700 border-neutral-200"
              }`}
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
              <span className="font-medium">Caddie</span>
            </Button>
          </Link>
          
          <Link href="/ai">
            <Button 
              variant={location === "/ai" ? "default" : "outline"} 
              size="default"
              className={`flex items-center space-x-2 px-6 py-3 ${
                location === "/ai" 
                  ? "bg-green-600 hover:bg-green-700 text-white" 
                  : "bg-white hover:bg-green-50 text-neutral-700 border-neutral-200"
              }`}
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <path d="M12 17h.01"/>
              </svg>
              <span className="font-medium">AI Tools</span>
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}