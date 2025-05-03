
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Greeting from './greeting';
import Clock from './clock';
import WeatherWidget from './weather-widget';
import SearchBar from './search-bar';
import ServicesGrid from './services-grid';
import Announcements from './announcements';
import Helpdesk from './helpdesk';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { LogOut, UserCog } from "lucide-react";

interface DashboardProps {
  userName: string;
  onLogout?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userName, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const goToAdmin = () => {
    navigate('/admin');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Taskbar style layout for time and weather at the very top */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <Clock />
          <WeatherWidget />
        </div>
      </div>
      
      {/* Add padding to account for the fixed taskbar */}
      <div className="pt-14">
        <header className="mb-8 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <Greeting userName={userName} />
            <div className="flex gap-2">
              {userName === 'admin' && (
                <Button 
                  variant="outline" 
                  onClick={goToAdmin}
                  className="flex items-center gap-2"
                >
                  <UserCog className="h-4 w-4" />
                  Admin Panel
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
          
          <div className="w-full">
            <SearchBar />
          </div>
        </header>
        
        <div className="mb-8">
          <section>
            <h2 className="text-xl font-semibold mb-4 text-white/80">Your Services</h2>
            <ServicesGrid />
          </section>
        </div>
        
        <div className="mb-8">
          <section>
            <h2 className="text-xl font-semibold mb-4 text-white/80">Announcements</h2>
            <Announcements />
          </section>
        </div>
        
        <div className="mb-8">
          <section>
            <h2 className="text-xl font-semibold mb-4 text-white/80">Helpdesk</h2>
            <Helpdesk />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
