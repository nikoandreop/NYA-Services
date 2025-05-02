
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
      <header className="mb-8 flex justify-between items-center">
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
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="md:col-span-3">
          <SearchBar />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Clock />
          <WeatherWidget />
        </div>
        <div className="md:col-span-2">
          <Announcements />
        </div>
      </div>
      
      <div className="mb-8">
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white/80">Your Services</h2>
          <ServicesGrid />
        </section>
      </div>
      
      <Tabs defaultValue="helpdesk" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="helpdesk">Helpdesk</TabsTrigger>
        </TabsList>
        <TabsContent value="helpdesk">
          <section>
            <h2 className="text-xl font-semibold mb-4 text-white/80">Helpdesk</h2>
            <Helpdesk />
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
