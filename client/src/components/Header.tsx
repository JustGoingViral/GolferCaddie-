import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Volleyball } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Volleyball className="text-secondary mr-2 h-6 w-6" />
          <h1 className="font-heading font-bold text-xl text-neutral-900">AI Caddie</h1>
        </div>
        <div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="material-icons">menu</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
