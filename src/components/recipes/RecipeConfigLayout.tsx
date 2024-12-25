import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RecipeConfigLayoutProps {
  title: string;
  children: React.ReactNode;
}

const RecipeConfigLayout = ({ title, children }: RecipeConfigLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-recipe-green text-white p-8">
      <Button 
        variant="ghost" 
        className="mb-6 text-white hover:bg-white/10"
        onClick={() => navigate('/')}
      >
        <ChevronLeft className="w-5 h-5 mr-2" />
        Back to Templates
      </Button>
      
      {/* Pre-built template banner */}
      <div className="bg-recipe-navy/90 backdrop-blur-sm text-sm text-white/90 px-4 py-2 rounded-lg mb-6 inline-flex items-center gap-2">
        <span>This is a pre-built template</span>
      </div>

      <Card className="w-full max-w-4xl mx-auto p-8 bg-recipe-darkGreen/95 backdrop-blur-sm shadow-xl border-none">
        <h2 className="text-2xl font-semibold mb-8 text-white">{title}</h2>
        {children}
      </Card>

      {/* Google Sheets icon and Help button */}
      <div className="fixed bottom-4 left-4 flex items-center gap-2 text-white/90">
        <img 
          src="/lovable-uploads/55c54574-060a-410d-8dd8-64cf691dc4bb.png" 
          alt="Google Sheets" 
          className="w-8 h-8"
        />
        <span>Google Sheets</span>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="fixed bottom-4 right-4 text-white hover:bg-white/10 rounded-full bg-[#6B46C1] hover:bg-[#6B46C1]/90"
      >
        <HelpCircle className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default RecipeConfigLayout;