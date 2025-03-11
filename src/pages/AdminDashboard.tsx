import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useProject } from "@/context/ProjectContext";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const mockUsers = [
  { _id: "user123", name: "John Doe", email: "john@example.com", institute: "MIT", role: "user" },
  { _id: "user456", name: "Jane Smith", email: "jane@example.com", institute: "Stanford", role: "user" },
  { _id: "user789", name: "Bob Johnson", email: "bob@example.com", institute: "Harvard", role: "user" },
];

const AdminDashboard = () => {
  const { user } = useAuth();
  const { 
    projects, 
    submissions, 
    fetchProjects, 
    fetchSubmissions, 
    approveSubmission, 
    rejectSubmission, 
    addUserToProject,
    loading 
  } = useProject();
  
  const [users, setUsers] = useState(mockUsers);
  const [activeTab, setActiveTab] = useState("projects");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  
  const [viewingSubmission, setViewingSubmission] = useState<any>(null);

  useEffect(() => {
    fetchProjects();
    fetchSubmissions();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.institute.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUserToProject = async () => {
    if (!selectedUser || !selectedProject) {
      toast.error("Please select both a user and a project");
      return;
    }
    
    try {
      await addUserToProject(selectedUser, selectedProject);
      setSelectedUser("");
      toast.success("User added to project successfully");
    } catch (error) {
      console.error("Error adding user to project:", error);
      toast.error("Failed to add user to project");
    }
  };

  const handleApproveSubmission = async (submissionId: string) => {
    try {
      await approveSubmission(submissionId, feedbackText);
      setViewingSubmission(null);
      setFeedbackText("");
      fetchSubmissions();
      toast.success("Submission approved successfully");
    } catch (error) {
      console.error("Error approving submission:", error);
      toast.error("Failed to approve submission");
    }
  };

  const handleRejectSubmission = async (submissionId: string) => {
    if (!feedbackText.trim()) {
      toast.error("Please provide feedback for rejection");
      return;
    }
    
    try {
      await rejectSubmission(submissionId, feedbackText);
      setViewingSubmission(null);
      setFeedbackText("");
      fetchSubmissions();
      toast.success("Submission rejected with feedback");
    } catch (error) {
      console.error("Error rejecting submission:", error);
      toast.error("Failed to reject submission");
    }
  };

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 mt-16">
          <div className="max-w-3xl mx-auto text-center py-12">
            <h1 className="text-2xl font-medium mb-4">Access Denied</h1>
            <p className="text-foreground/70 mb-6">
              You don't have permission to access the admin dashboard.
            </p>
            <Button onClick={() => window.location.href = "/"}>
              Return to Home
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 mt-16">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8 page-transition">
            <h1 className="text-3xl font-medium">Admin Dashboard</h1>
            <p className="text-foreground/70">
              Manage projects, users, and submissions
            </p>
          </header>
          
          <Tabs 
            defaultValue="projects" 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="animate-fade-in"
          >
            <TabsList className="mb-6">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="submissions">Submissions</TabsTrigger>
              <TabsTrigger value="add-user">Add User to Project</TabsTrigger>
            </TabsList>
            
            <TabsContent value="projects" className="animate-fade-in">
              {loading ? (
                <div className="text-center py-12 text-foreground/70">
                  Loading projects...
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-12 text-foreground/70">
                  No projects available.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.map((project) => (
                    <Card key={project._id} className="glass-card">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl font-medium">{project.title}</CardTitle>
                          {project.isApplicationOpen ? (
                            <Badge className="bg-green-500/10 text-green-700">Open</Badge>
                          ) : (
                            <Badge variant="secondary">Closed</Badge>
                          )}
                        </div>
                        <CardDescription>
                          Deadline: {new Date(project.deadline).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-foreground/80 mb-2">{project.description}</p>
                        <p className="text-sm text-foreground/70">
                          Application Deadline: {new Date(project.applicationDeadline).toLocaleDateString()}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => {
                            setSelectedProject(project._id);
                            setActiveTab("submissions");
                            fetchSubmissions(project._id);
                          }}
                        >
                          View Submissions
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="users" className="animate-fade-in">
              <div className="mb-6">
                <Input
                  placeholder="Search users by name, email, or institute..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-focus max-w-md"
                />
              </div>
              
              {loading ? (
                <div className="text-center py-12 text-foreground/70">
                  Loading users...
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-12 text-foreground/70">
                  No users found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left p-3 font-medium">Name</th>
                        <th className="text-left p-3 font-medium">Email</th>
                        <th className="text-left p-3 font-medium">Institute</th>
                        <th className="text-left p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user._id} className="border-b border-gray-100 hover:bg-secondary/30 transition-colors">
                          <td className="p-3">{user.name}</td>
                          <td className="p-3">{user.email}</td>
                          <td className="p-3">{user.institute}</td>
                          <td className="p-3">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user._id);
                                setActiveTab("add-user");
                              }}
                            >
                              Add to Project
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="submissions" className="animate-fade-in">
              {viewingSubmission ? (
                <div className="animate-fade-in">
                  <Button 
                    variant="ghost" 
                    className="mb-4"
                    onClick={() => {
                      setViewingSubmission(null);
                      setFeedbackText("");
                    }}
                  >
                    ← Back to Submissions
                  </Button>
                  
                  <Card className="glass-card mb-6">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl font-medium">
                            Submission Details
                          </CardTitle>
                          <CardDescription>
                            Submitted on: {new Date(viewingSubmission.submittedAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        
                        <Badge className={
                          viewingSubmission.status === "approved" ? "bg-green-500/10 text-green-700" :
                          viewingSubmission.status === "rejected" ? "bg-red-500/10 text-red-700" :
                          "bg-amber-500/10 text-amber-700"
                        }>
                          {viewingSubmission.status.charAt(0).toUpperCase() + viewingSubmission.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-foreground/70 mb-1">Project Description</h3>
                        <p className="text-foreground/90">{viewingSubmission.description}</p>
                      </div>
                      
                      {viewingSubmission.links.length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium text-foreground/70 mb-1">Links</h3>
                          <ul className="list-disc pl-5 text-primary">
                            {viewingSubmission.links.map((link: string, index: number) => (
                              <li key={index}>
                                <a href={link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                  {link}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {viewingSubmission.files.length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium text-foreground/70 mb-1">Files</h3>
                          <ul className="list-disc pl-5">
                            {viewingSubmission.files.map((file: string, index: number) => (
                              <li key={index}>{file}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {viewingSubmission.feedback && (
                        <div className="bg-secondary/50 p-4 rounded-md">
                          <h3 className="text-sm font-medium text-foreground/70 mb-1">Feedback</h3>
                          <p className="text-foreground/90">{viewingSubmission.feedback}</p>
                        </div>
                      )}
                      
                      {viewingSubmission.status === "pending" && (
                        <div className="space-y-3 mt-4">
                          <Label htmlFor="feedback">Feedback (optional for approval, required for rejection)</Label>
                          <Textarea
                            id="feedback"
                            placeholder="Provide feedback to the user..."
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            rows={4}
                            className="input-focus"
                          />
                          
                          <div className="flex gap-4 mt-4">
                            <Button 
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white button-hover"
                              onClick={() => handleApproveSubmission(viewingSubmission._id)}
                              disabled={loading}
                            >
                              Approve Submission
                            </Button>
                            <Button 
                              variant="outline" 
                              className="flex-1 text-red-600 border-red-200 hover:bg-red-50 button-hover"
                              onClick={() => handleRejectSubmission(viewingSubmission._id)}
                              disabled={loading || !feedbackText.trim()}
                            >
                              Reject Submission
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ) : loading ? (
                <div className="text-center py-12 text-foreground/70">
                  Loading submissions...
                </div>
              ) : submissions.length === 0 ? (
                <div className="text-center py-12 text-foreground/70">
                  No submissions available.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left p-3 font-medium">Project</th>
                        <th className="text-left p-3 font-medium">User</th>
                        <th className="text-left p-3 font-medium">Submitted On</th>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map((submission) => {
                        const project = projects.find(p => p._id === submission.projectId);
                        const user = users.find(u => u._id === submission.userId);
                        
                        return (
                          <tr key={submission._id} className="border-b border-gray-100 hover:bg-secondary/30 transition-colors">
                            <td className="p-3">{project?.title || "Unknown Project"}</td>
                            <td className="p-3">{user?.name || "Unknown User"}</td>
                            <td className="p-3">{new Date(submission.submittedAt).toLocaleDateString()}</td>
                            <td className="p-3">
                              <Badge className={
                                submission.status === "approved" ? "bg-green-500/10 text-green-700" :
                                submission.status === "rejected" ? "bg-red-500/10 text-red-700" :
                                "bg-amber-500/10 text-amber-700"
                              }>
                                {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setViewingSubmission(submission)}
                              >
                                View Details
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="add-user" className="animate-fade-in">
              <Card className="glass-card max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-xl font-medium">Add User to Project</CardTitle>
                  <CardDescription>
                    Manually assign a user to a project, even after the application deadline
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="select-user">Select User</Label>
                    <Select 
                      value={selectedUser} 
                      onValueChange={setSelectedUser}
                    >
                      <SelectTrigger id="select-user" className="input-focus">
                        <SelectValue placeholder="Select a user" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user._id} value={user._id}>
                            {user.name} ({user.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="select-project">Select Project</Label>
                    <Select 
                      value={selectedProject} 
                      onValueChange={setSelectedProject}
                    >
                      <SelectTrigger id="select-project" className="input-focus">
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project._id} value={project._id}>
                            {project.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full button-hover" 
                    onClick={handleAddUserToProject}
                    disabled={loading || !selectedUser || !selectedProject}
                  >
                    {loading ? "Adding User..." : "Add User to Project"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
