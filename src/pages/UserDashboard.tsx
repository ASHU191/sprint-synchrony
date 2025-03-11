
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useProject } from "@/context/ProjectContext";
import Navbar from "@/components/Navbar";
import ProjectCard from "@/components/ProjectCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CountdownTimer from "@/components/CountdownTimer";
import SubmissionForm from "@/components/SubmissionForm";

const UserDashboard = () => {
  const { user } = useAuth();
  const { projects, userProjects, fetchProjects, fetchUserProjects, loading } = useProject();
  const [activeTab, setActiveTab] = useState("available");

  useEffect(() => {
    fetchProjects();
    fetchUserProjects();
  }, []);

  // Filter out projects that the user has already applied for
  const availableProjects = projects.filter(
    (project) =>
      !userProjects.some((up) => up.projectId === project._id)
  );

  // Get user's applied projects with full project details
  const appliedProjects = userProjects.map((userProject) => {
    const projectDetails = projects.find(
      (p) => p._id === userProject.projectId
    );
    return {
      ...userProject,
      projectDetails,
    };
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 mt-16">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8 page-transition">
            <h1 className="text-3xl font-medium">Welcome, {user?.name}</h1>
            <p className="text-foreground/70">
              Browse available projects or check your applied projects
            </p>
          </header>
          
          <Tabs 
            defaultValue="available" 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="animate-fade-in"
          >
            <TabsList className="mb-6">
              <TabsTrigger value="available">Available Projects</TabsTrigger>
              <TabsTrigger value="applied">
                My Projects
                {appliedProjects.length > 0 && (
                  <Badge className="ml-2 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/10">
                    {appliedProjects.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="available" className="animate-fade-in">
              {loading ? (
                <div className="text-center py-12 text-foreground/70">
                  Loading projects...
                </div>
              ) : availableProjects.length === 0 ? (
                <div className="text-center py-12 text-foreground/70">
                  No available projects at the moment. Check back later.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableProjects.map((project) => (
                    <ProjectCard
                      key={project._id}
                      id={project._id}
                      title={project.title}
                      description={project.description}
                      deadline={project.deadline}
                      isApplicationOpen={project.isApplicationOpen}
                      applicationDeadline={project.applicationDeadline}
                      isApplied={false}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="applied" className="animate-fade-in">
              {loading ? (
                <div className="text-center py-12 text-foreground/70">
                  Loading your projects...
                </div>
              ) : appliedProjects.length === 0 ? (
                <div className="text-center py-12 text-foreground/70">
                  You haven't applied to any projects yet.
                </div>
              ) : (
                <div className="space-y-8">
                  {appliedProjects.map((userProject) => (
                    <Card key={userProject._id} className="glass-card overflow-hidden">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl font-medium">
                              {userProject.projectDetails?.title}
                            </CardTitle>
                            <CardDescription>
                              Applied on: {new Date(userProject.appliedAt).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          
                          <Badge className={userProject.submissionId ? "bg-green-500/10 text-green-700" : "bg-amber-500/10 text-amber-700"}>
                            {userProject.submissionId ? "Submitted" : "In Progress"}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-6">
                        <div className="text-foreground/80">
                          {userProject.projectDetails?.description}
                        </div>
                        
                        <CountdownTimer deadline={userProject.deadline} />
                        
                        {!userProject.submissionId && (
                          <SubmissionForm 
                            projectId={userProject.projectId} 
                            onSubmitSuccess={fetchUserProjects}
                          />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
