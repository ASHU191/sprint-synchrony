import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useProject } from "@/context/ProjectContext";
import Navbar from "@/components/Navbar";
import CountdownTimer from "@/components/CountdownTimer";
import SubmissionForm from "@/components/SubmissionForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const ProjectWorkspace = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { projects, userProjects, fetchProjects, fetchUserProjects } = useProject();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<any>(null);
  const [userProject, setUserProject] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await fetchProjects();
        await fetchUserProjects();
        setLoading(false);
      } catch (error) {
        console.error("Error loading project data:", error);
        toast.error("Failed to load project data");
        setLoading(false);
      }
    };

    loadData();
  }, [projectId]);

  useEffect(() => {
    if (!loading) {
      // Find the project
      const foundProject = projects.find((p) => p._id === projectId);
      setProject(foundProject);

      // Find user's application for this project
      const foundUserProject = userProjects.find((up) => up.projectId === projectId);
      setUserProject(foundUserProject);

      // If user hasn't applied to this project, redirect to dashboard
      if (!foundUserProject && !loading) {
        toast.error("You haven't applied to this project");
        navigate("/user-dashboard");
      }
    }
  }, [projects, userProjects, loading, projectId]);

  const handleDeadlineExpired = () => {
    toast.warning("The deadline for this project has expired");
    // You might want to disable the submission form or redirect the user
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 mt-16">
          <div className="text-center py-12 text-foreground/70">
            Loading project workspace...
          </div>
        </main>
      </div>
    );
  }

  if (!project || !userProject) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 mt-16">
          <div className="text-center py-12 text-foreground/70">
            Project not found or you haven't applied to this project.
          </div>
          <div className="text-center">
            <Button onClick={() => navigate("/user-dashboard")}>
              Return to Dashboard
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
        <div className="max-w-3xl mx-auto">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate("/user-dashboard")}
          >
            ← Back to Dashboard
          </Button>
          
          <Card className="glass-card mb-8 page-transition">
            <CardHeader>
              <CardTitle className="text-2xl font-medium">{project.title}</CardTitle>
              <CardDescription>
                Applied on: {new Date(userProject.appliedAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-foreground/80">
                <h3 className="text-lg font-medium mb-2">Project Description</h3>
                <p>{project.description}</p>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Your Deadline</h3>
                <CountdownTimer 
                  deadline={userProject.deadline} 
                  onExpire={handleDeadlineExpired}
                />
              </div>
            </CardContent>
          </Card>
          
          {!userProject.submissionId ? (
            <SubmissionForm 
              projectId={project._id} 
              onSubmitSuccess={() => navigate("/user-dashboard")}
            />
          ) : (
            <Card className="glass-card page-transition">
              <CardHeader>
                <CardTitle className="text-xl font-medium">Submission Complete</CardTitle>
                <CardDescription>
                  You have already submitted your work for this project.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full button-hover" 
                  onClick={() => navigate("/user-dashboard")}
                >
                  Return to Dashboard
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProjectWorkspace;
