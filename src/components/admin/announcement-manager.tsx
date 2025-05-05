
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Bell, Calendar, Edit, Megaphone, Plus, Tag, Tags, Trash2 } from "lucide-react";

// Mock data for announcements
const mockAnnouncements = [
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

// Mock data for tags
const mockTags = [
  { id: 1, name: "service", color: "blue" },
  { id: 2, name: "maintenance", color: "red" },
  { id: 3, name: "media", color: "purple" },
  { id: 4, name: "new", color: "green" },
  { id: 5, name: "storage", color: "yellow" },
  { id: 6, name: "upgrade", color: "orange" }
];

const AnnouncementManager = () => {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [tags, setTags] = useState(mockTags);
  const [isAddingAnnouncement, setIsAddingAnnouncement] = useState(false);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [selectedTag, setSelectedTag] = useState<any>(null);
  
  // Form states
  const [newAnnouncementTitle, setNewAnnouncementTitle] = useState("");
  const [newAnnouncementType, setNewAnnouncementType] = useState("announcement");
  const [newAnnouncementContent, setNewAnnouncementContent] = useState("");
  const [selectedTagsForAnnouncement, setSelectedTagsForAnnouncement] = useState<string[]>([]);
  
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("blue");

  // Reset form states
  const resetAnnouncementForm = () => {
    setNewAnnouncementTitle("");
    setNewAnnouncementType("announcement");
    setNewAnnouncementContent("");
    setSelectedTagsForAnnouncement([]);
    setSelectedAnnouncement(null);
  };

  const resetTagForm = () => {
    setNewTagName("");
    setNewTagColor("blue");
    setSelectedTag(null);
  };

  // Handle announcement actions
  const handleAddAnnouncement = () => {
    if (!newAnnouncementTitle || !newAnnouncementContent) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newAnnouncement = {
      id: announcements.length > 0 ? Math.max(...announcements.map(a => a.id)) + 1 : 1,
      title: newAnnouncementTitle,
      date: new Date().toISOString().split('T')[0],
      type: newAnnouncementType,
      content: newAnnouncementContent,
      tags: selectedTagsForAnnouncement
    };

    setAnnouncements([...announcements, newAnnouncement]);
    toast({
      title: "Announcement Added",
      description: "Your announcement has been added successfully"
    });

    setIsAddingAnnouncement(false);
    resetAnnouncementForm();
  };

  const handleEditAnnouncement = (announcement: any) => {
    setSelectedAnnouncement(announcement);
    setNewAnnouncementTitle(announcement.title);
    setNewAnnouncementType(announcement.type);
    setNewAnnouncementContent(announcement.content);
    setSelectedTagsForAnnouncement([...announcement.tags]);
    setIsAddingAnnouncement(true);
  };

  const handleUpdateAnnouncement = () => {
    if (!selectedAnnouncement) return;

    const updatedAnnouncement = {
      ...selectedAnnouncement,
      title: newAnnouncementTitle,
      type: newAnnouncementType,
      content: newAnnouncementContent,
      tags: selectedTagsForAnnouncement
    };

    const updatedAnnouncements = announcements.map(a => 
      a.id === selectedAnnouncement.id ? updatedAnnouncement : a
    );

    setAnnouncements(updatedAnnouncements);
    toast({
      title: "Announcement Updated",
      description: "The announcement has been updated successfully"
    });

    setIsAddingAnnouncement(false);
    resetAnnouncementForm();
  };

  const handleDeleteAnnouncement = (id: number) => {
    const filteredAnnouncements = announcements.filter(a => a.id !== id);
    setAnnouncements(filteredAnnouncements);
    toast({
      title: "Announcement Deleted",
      description: "The announcement has been deleted successfully"
    });
  };

  // Handle tag actions
  const handleAddTag = () => {
    if (!newTagName) {
      toast({
        title: "Error",
        description: "Please enter a tag name",
        variant: "destructive"
      });
      return;
    }

    if (tags.some(tag => tag.name.toLowerCase() === newTagName.toLowerCase())) {
      toast({
        title: "Error",
        description: "A tag with this name already exists",
        variant: "destructive"
      });
      return;
    }

    const newTag = {
      id: tags.length > 0 ? Math.max(...tags.map(t => t.id)) + 1 : 1,
      name: newTagName,
      color: newTagColor
    };

    setTags([...tags, newTag]);
    toast({
      title: "Tag Added",
      description: "Your tag has been added successfully"
    });

    setIsAddingTag(false);
    resetTagForm();
  };

  const handleEditTag = (tag: any) => {
    setSelectedTag(tag);
    setNewTagName(tag.name);
    setNewTagColor(tag.color);
    setIsAddingTag(true);
  };

  const handleUpdateTag = () => {
    if (!selectedTag) return;

    if (tags.some(tag => tag.name.toLowerCase() === newTagName.toLowerCase() && tag.id !== selectedTag.id)) {
      toast({
        title: "Error",
        description: "A tag with this name already exists",
        variant: "destructive"
      });
      return;
    }

    const updatedTag = {
      ...selectedTag,
      name: newTagName,
      color: newTagColor
    };

    const updatedTags = tags.map(t => 
      t.id === selectedTag.id ? updatedTag : t
    );

    setTags(updatedTags);
    
    // Update tag references in announcements
    const updatedAnnouncements = announcements.map(announcement => ({
      ...announcement,
      tags: announcement.tags.map((tagName: string) => 
        tagName === selectedTag.name ? newTagName : tagName
      )
    }));
    
    setAnnouncements(updatedAnnouncements);

    toast({
      title: "Tag Updated",
      description: "The tag has been updated successfully"
    });

    setIsAddingTag(false);
    resetTagForm();
  };

  const handleDeleteTag = (tagName: string) => {
    const filteredTags = tags.filter(t => t.name !== tagName);
    setTags(filteredTags);
    
    // Remove tag from all announcements
    const updatedAnnouncements = announcements.map(announcement => ({
      ...announcement,
      tags: announcement.tags.filter((tag: string) => tag !== tagName)
    }));
    
    setAnnouncements(updatedAnnouncements);

    toast({
      title: "Tag Deleted",
      description: "The tag has been deleted successfully"
    });
  };

  const toggleTagSelection = (tagName: string) => {
    if (selectedTagsForAnnouncement.includes(tagName)) {
      setSelectedTagsForAnnouncement(selectedTagsForAnnouncement.filter(t => t !== tagName));
    } else {
      setSelectedTagsForAnnouncement([...selectedTagsForAnnouncement, tagName]);
    }
  };

  const getTagColor = (tagName: string) => {
    const tag = tags.find(t => t.name === tagName);
    return tag ? tag.color : "gray";
  };

  const getBadgeVariant = (tagColor: string) => {
    switch (tagColor) {
      case "blue": return "default";
      case "red": return "destructive";
      case "green": return "success";
      case "orange": return "warning";
      case "yellow": return "yellow";
      case "purple": return "purple";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Announcements Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5" />
                Manage Announcements
              </CardTitle>
              <CardDescription>Create and manage announcements for user dashboard</CardDescription>
            </div>
            <Dialog open={isAddingAnnouncement} onOpenChange={setIsAddingAnnouncement}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Announcement
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>
                    {selectedAnnouncement ? "Edit Announcement" : "Add New Announcement"}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedAnnouncement 
                      ? "Update the announcement details below" 
                      : "Fill out the form below to create a new announcement."}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title" 
                      value={newAnnouncementTitle}
                      onChange={(e) => setNewAnnouncementTitle(e.target.value)}
                      placeholder="Enter announcement title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select value={newAnnouncementType} onValueChange={setNewAnnouncementType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select announcement type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="announcement">Announcement</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="update">Update</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea 
                      id="content" 
                      value={newAnnouncementContent}
                      onChange={(e) => setNewAnnouncementContent(e.target.value)}
                      placeholder="Enter announcement content"
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-2 p-2 border rounded-md">
                      {tags.map((tag) => (
                        <Badge 
                          key={tag.id} 
                          variant={selectedTagsForAnnouncement.includes(tag.name) 
                            ? getBadgeVariant(tag.color) 
                            : "outline"
                          }
                          className="cursor-pointer"
                          onClick={() => toggleTagSelection(tag.name)}
                        >
                          {tag.name}
                        </Badge>
                      ))}
                      {tags.length === 0 && (
                        <span className="text-sm text-muted-foreground">No tags available</span>
                      )}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setIsAddingAnnouncement(false);
                      resetAnnouncementForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={selectedAnnouncement ? handleUpdateAnnouncement : handleAddAnnouncement}
                  >
                    {selectedAnnouncement ? "Update" : "Add"} Announcement
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {announcements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No announcements found
                  </TableCell>
                </TableRow>
              ) : (
                announcements.map((announcement) => (
                  <TableRow key={announcement.id}>
                    <TableCell>{announcement.title}</TableCell>
                    <TableCell>
                      <Badge variant={
                        announcement.type === "maintenance" ? "destructive" : 
                        announcement.type === "update" ? "default" : 
                        "secondary"
                      }>
                        {announcement.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{announcement.date}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {announcement.tags.map((tag: string) => (
                          <Badge 
                            key={tag} 
                            variant={getBadgeVariant(getTagColor(tag))}
                            className="mr-1"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditAnnouncement(announcement)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteAnnouncement(announcement.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Tags Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Tags className="h-5 w-5" />
                Manage Tags
              </CardTitle>
              <CardDescription>Create and manage tags for announcements</CardDescription>
            </div>
            <Dialog open={isAddingTag} onOpenChange={setIsAddingTag}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Tag
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>
                    {selectedTag ? "Edit Tag" : "Add New Tag"}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedTag 
                      ? "Update the tag details below" 
                      : "Create a new tag to organize announcements."}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="tagName">Tag Name</Label>
                    <Input 
                      id="tagName" 
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      placeholder="Enter tag name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tagColor">Color</Label>
                    <Select value={newTagColor} onValueChange={setNewTagColor}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tag color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blue">Blue</SelectItem>
                        <SelectItem value="red">Red</SelectItem>
                        <SelectItem value="green">Green</SelectItem>
                        <SelectItem value="orange">Orange</SelectItem>
                        <SelectItem value="yellow">Yellow</SelectItem>
                        <SelectItem value="purple">Purple</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="mt-2">
                      <Badge variant={getBadgeVariant(newTagColor)}>Preview</Badge>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setIsAddingTag(false);
                      resetTagForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={selectedTag ? handleUpdateTag : handleAddTag}>
                    {selectedTag ? "Update" : "Add"} Tag
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Preview</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tags.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No tags found
                  </TableCell>
                </TableRow>
              ) : (
                tags.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell>{tag.name}</TableCell>
                    <TableCell className="capitalize">{tag.color}</TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(tag.color)}>
                        {tag.name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditTag(tag)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteTag(tag.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnnouncementManager;
