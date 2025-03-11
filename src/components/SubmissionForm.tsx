
import React, { useState } from "react";
import { useProject } from "@/context/ProjectContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";

interface SubmissionFormProps {
  projectId: string;
  onSubmitSuccess?: () => void;
}

const SubmissionForm: React.FC<SubmissionFormProps> = ({ projectId, onSubmitSuccess }) => {
  const { submitProject, loading } = useProject();
  const [description, setDescription] = useState("");
  const [links, setLinks] = useState<string[]>([""]);
  const [files, setFiles] = useState<string[]>([]);

  const handleAddLink = () => {
    setLinks([...links, ""]);
  };

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const handleRemoveLink = (index: number) => {
    if (links.length > 1) {
      const newLinks = [...links];
      newLinks.splice(index, 1);
      setLinks(newLinks);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // This is a mock implementation - in a real app, you would upload files to a server
      // and get back the URLs or file IDs
      const newFiles = Array.from(e.target.files).map(file => file.name);
      setFiles([...files, ...newFiles]);
      toast.success(`${newFiles.length} file(s) selected`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      toast.error("Please provide a project description");
      return;
    }
    
    // Filter out empty links
    const validLinks = links.filter(link => link.trim() !== "");
    
    try {
      await submitProject(projectId, {
        description,
        links: validLinks,
        files,
      });
      
      // Reset form
      setDescription("");
      setLinks([""]);
      setFiles([]);
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      console.error("Error submitting project:", error);
    }
  };

  return (
    <Card className="glass-card w-full animate-scale-in">
      <CardHeader>
        <CardTitle>Submit Your Project</CardTitle>
        <CardDescription>
          Provide a description, add relevant links, and upload any files related to your project.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your project, approach, and key features..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="input-focus"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Project Links</Label>
            {links.map((link, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  placeholder="https://github.com/yourusername/project"
                  value={link}
                  onChange={(e) => handleLinkChange(index, e.target.value)}
                  className="input-focus"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveLink(index)}
                  disabled={links.length === 1}
                >
                  ✕
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddLink}
              className="mt-2"
            >
              Add Another Link
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="files">Upload Files</Label>
            <Input
              id="files"
              type="file"
              multiple
              onChange={handleFileChange}
              className="input-focus"
            />
            {files.length > 0 && (
              <div className="mt-2">
                <Label>Selected Files:</Label>
                <ul className="text-sm text-muted-foreground">
                  {files.map((file, index) => (
                    <li key={index}>{file}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full button-hover" 
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Project"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SubmissionForm;
