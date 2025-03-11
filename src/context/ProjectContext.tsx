import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface Project {
  _id: string;
  title: string;
  description: string;
  deadline: Date;
  isApplicationOpen: boolean;
  applicationDeadline: Date;
}

interface Submission {
  _id: string;
  projectId: string;
  userId: string;
  description: string;
  files: string[];
  links: string[];
  submittedAt: Date;
  status: "pending" | "approved" | "rejected";
  feedback?: string;
}

interface UserProject {
  _id: string;
  userId: string;
  projectId: string;
  appliedAt: Date;
  deadline: Date;
  submissionId?: string;
}

interface ProjectContextType {
  projects: Project[];
  userProjects: UserProject[];
  submissions: Submission[];
  loading: boolean;
  fetchProjects: () => Promise<void>;
  fetchUserProjects: () => Promise<void>;
  applyToProject: (projectId: string) => Promise<void>;
  submitProject: (projectId: string, data: Omit<Submission, "_id" | "userId" | "projectId" | "submittedAt" | "status">) => Promise<void>;
  fetchSubmissions: (projectId?: string) => Promise<void>;
  approveSubmission: (submissionId: string, feedback?: string) => Promise<void>;
  rejectSubmission: (submissionId: string, feedback: string) => Promise<void>;
  addUserToProject: (userId: string, projectId: string) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [userProjects, setUserProjects] = useState<UserProject[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);

  const mockProjects: Project[] = [
    {
      _id: "project1",
      title: "Web Development Challenge",
      description: "Build a responsive web application using React",
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      isApplicationOpen: true,
      applicationDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
    {
      _id: "project2",
      title: "Mobile App Innovation",
      description: "Create a mobile app concept for health tracking",
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      isApplicationOpen: true,
      applicationDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },
    {
      _id: "project3",
      title: "AI Image Generator",
      description: "Build an AI-powered image generation tool",
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      isApplicationOpen: true,
      applicationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  ];

  const mockUserProjects: UserProject[] = [
    {
      _id: "user-project-1",
      userId: "user123",
      projectId: "project1",
      appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      submissionId: undefined,
    },
  ];

  const mockSubmissions: Submission[] = [
    {
      _id: "submission1",
      projectId: "project2",
      userId: "user456",
      description: "I've created a health tracking app that focuses on mental wellness",
      files: ["file1.pdf", "screenshot1.jpg"],
      links: ["https://github.com/user/project", "https://demo-site.com"],
      submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: "pending",
    },
  ];

  const fetchProjects = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setProjects(mockProjects);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to fetch projects");
      setLoading(false);
    }
  };

  const fetchUserProjects = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      setTimeout(() => {
        const userProjectsFiltered = mockUserProjects.filter(
          (up) => up.userId === user._id
        );
        setUserProjects(userProjectsFiltered);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching user projects:", error);
      toast.error("Failed to fetch your projects");
      setLoading(false);
    }
  };

  const applyToProject = async (projectId: string) => {
    if (!user) return;
    
    setLoading(true);
    try {
      setTimeout(() => {
        const newUserProject: UserProject = {
          _id: `user-project-${Date.now()}`,
          userId: user._id,
          projectId,
          appliedAt: new Date(),
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        };
        
        setUserProjects([...userProjects, newUserProject]);
        toast.success("Successfully applied to project");
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error applying to project:", error);
      toast.error("Failed to apply to project");
      setLoading(false);
    }
  };

  const submitProject = async (
    projectId: string,
    data: Omit<Submission, "_id" | "userId" | "projectId" | "submittedAt" | "status">
  ) => {
    if (!user) return;
    
    setLoading(true);
    try {
      setTimeout(() => {
        const newSubmission: Submission = {
          _id: `submission-${Date.now()}`,
          userId: user._id,
          projectId,
          ...data,
          submittedAt: new Date(),
          status: "pending",
        };
        
        setSubmissions([...submissions, newSubmission]);
        
        const updatedUserProjects = userProjects.map((up) => {
          if (up.projectId === projectId && up.userId === user._id) {
            return { ...up, submissionId: newSubmission._id };
          }
          return up;
        });
        
        setUserProjects(updatedUserProjects);
        toast.success("Project submitted successfully");
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error submitting project:", error);
      toast.error("Failed to submit project");
      setLoading(false);
    }
  };

  const fetchSubmissions = async (projectId?: string) => {
    if (!user || user.role !== "admin") return;
    
    setLoading(true);
    try {
      setTimeout(() => {
        if (projectId) {
          const filteredSubmissions = mockSubmissions.filter(
            (s) => s.projectId === projectId
          );
          setSubmissions(filteredSubmissions);
        } else {
          setSubmissions(mockSubmissions);
        }
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast.error("Failed to fetch submissions");
      setLoading(false);
    }
  };

  const approveSubmission = async (submissionId: string, feedback?: string) => {
    if (!user || user.role !== "admin") return;
    
    setLoading(true);
    try {
      setTimeout(() => {
        const updatedSubmissions = submissions.map((s) => {
          if (s._id === submissionId) {
            return { ...s, status: "approved" as const, feedback };
          }
          return s;
        });
        
        setSubmissions(updatedSubmissions);
        toast.success("Submission approved");
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error approving submission:", error);
      toast.error("Failed to approve submission");
      setLoading(false);
    }
  };

  const rejectSubmission = async (submissionId: string, feedback: string) => {
    if (!user || user.role !== "admin") return;
    
    setLoading(true);
    try {
      setTimeout(() => {
        const updatedSubmissions = submissions.map((s) => {
          if (s._id === submissionId) {
            return { ...s, status: "rejected" as const, feedback };
          }
          return s;
        });
        
        setSubmissions(updatedSubmissions);
        toast.success("Submission rejected");
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error rejecting submission:", error);
      toast.error("Failed to reject submission");
      setLoading(false);
    }
  };

  const addUserToProject = async (userId: string, projectId: string) => {
    if (!user || user.role !== "admin") return;
    
    setLoading(true);
    try {
      setTimeout(() => {
        const newUserProject: UserProject = {
          _id: `user-project-${Date.now()}`,
          userId,
          projectId,
          appliedAt: new Date(),
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        };
        
        const alreadyExists = mockUserProjects.some(
          (up) => up.userId === userId && up.projectId === projectId
        );
        
        if (!alreadyExists) {
          mockUserProjects.push(newUserProject);
          toast.success("User added to project successfully");
        } else {
          toast.error("User already added to this project");
        }
        
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error adding user to project:", error);
      toast.error("Failed to add user to project");
      setLoading(false);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        userProjects,
        submissions,
        loading,
        fetchProjects,
        fetchUserProjects,
        applyToProject,
        submitProject,
        fetchSubmissions,
        approveSubmission,
        rejectSubmission,
        addUserToProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
