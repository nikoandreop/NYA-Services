
import React from 'react';
import Greeting from './greeting';
import Clock from './clock';
import WeatherWidget from './weather-widget';
import SearchBar from './search-bar';
import ServicesGrid from './services-grid';
import Announcements from './announcements';
import Helpdesk from './helpdesk';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface DashboardProps {
  userName: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userName }) => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-8">
        <Greeting userName={userName} />
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="md:col-span-2">
          <SearchBar />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Clock />
          <WeatherWidget />
        </div>
      </div>
      
      <div className="mb-8">
        <Announcements />
      </div>
      
      <Tabs defaultValue="services" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="helpdesk">Helpdesk</TabsTrigger>
        </TabsList>
        <TabsContent value="services">
          <section>
            <h2 className="text-xl font-semibold mb-4 text-white/80">Your Services</h2>
            <ServicesGrid />
          </section>
        </TabsContent>
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
