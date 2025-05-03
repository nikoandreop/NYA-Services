
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
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="col-span-1">
            <Clock />
          </div>
          <div className="col-span-1">
            <WeatherWidget />
          </div>
          <div className="col-span-2">
            <SearchBar />
          </div>
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
