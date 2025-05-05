
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, Megaphone, Tag } from "lucide-react";

// Mock announcements data
const announcements = [
  {
    id: 1,
    title: "Jellyfin Maintenance",
    date: "2025-05-03",
    type: "maintenance",
    content: "Jellyfin will be undergoing maintenance on Saturday between 2-4 AM. Service may be intermittently unavailable during this time.",
    tags: ["service", "maintenance"]
  },
  {
    id: 2,
    title: "New Radio Station Added",
    date: "2025-05-01",
    type: "update",
    content: "A new Lo-Fi radio station has been added to the collection. Enjoy some relaxing beats while you work!",
    tags: ["media", "new"]
  },
  {
    id: 3,
    title: "Storage Upgrade Complete",
    date: "2025-04-29",
    type: "announcement",
    content: "The storage upgrade has been completed successfully! We now have an additional 8TB of space for new movies and TV shows.",
    tags: ["storage", "upgrade"]
  }
];

// Map to determine badge variants based on tag type
const tagVariants: Record<string, "default" | "destructive" | "secondary" | "outline" | "purple" | "success" | "warning" | "yellow"> = {
  service: "default",
  maintenance: "destructive",
  media: "purple",
  new: "success",
  storage: "warning",
  upgrade: "yellow"
};

const Announcements = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            Announcements & Updates
          </CardTitle>
          <CardDescription>Latest news and updates about NYA Services</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {announcements.map((announcement) => (
          <Alert key={announcement.id} className="bg-white/5 border-white/10">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center justify-between">
                <AlertTitle className="font-semibold text-base flex items-center gap-2">
                  {announcement.type === "maintenance" && <Bell className="h-4 w-4" />}
                  {announcement.type === "update" && <Bell className="h-4 w-4" />}
                  {announcement.type === "announcement" && <Megaphone className="h-4 w-4" />}
                  {announcement.title}
                </AlertTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={
                    announcement.type === "maintenance" ? "destructive" : 
                    announcement.type === "update" ? "default" : 
                    "secondary"
                  }>
                    {announcement.type}
                  </Badge>
                  <span className="text-xs flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3 w-3" /> {announcement.date}
                  </span>
                </div>
              </div>
              <AlertDescription className="text-sm">
                {announcement.content}
              </AlertDescription>
              {announcement.tags && announcement.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {announcement.tags.map((tag: string) => (
                    <Badge 
                      key={tag} 
                      variant={tagVariants[tag] || "secondary"}
                      className="text-xs flex items-center gap-1"
                    >
                      <Tag className="h-3 w-3" /> {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </Alert>
        ))}
      </CardContent>
    </Card>
  );
};

export default Announcements;
