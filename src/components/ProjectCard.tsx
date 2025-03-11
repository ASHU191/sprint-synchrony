
import React from "react";
import { useProject } from "@/context/ProjectContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  isApplicationOpen: boolean;
  applicationDeadline: Date;
  isApplied: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  description,
  deadline,
  isApplicationOpen,
  applicationDeadline,
  isApplied,
}) => {
  const { applyToProject, loading } = useProject();
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  const handleApply = async () => {
    await applyToProject(id);
  };
  
  const isApplicationDeadlinePassed = new Date(applicationDeadline) < new Date();
  
  return (
    <Card className="glass-card overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-medium">{title}</CardTitle>
          {isApplicationOpen && !isApplicationDeadlinePassed ? (
            <Badge className="bg-green-500/10 text-green-700 hover:bg-green-500/20 border border-green-500/20">
              Open for Applications
            </Badge>
          ) : (
            <Badge variant="secondary">Closed</Badge>
          )}
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          Application Deadline: {formatDate(applicationDeadline)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground/80 mb-2">{description}</p>
        <p className="text-sm text-foreground/70">
          Project Deadline: <span className="font-medium">{formatDate(deadline)}</span>
        </p>
      </CardContent>
      <CardFooter>
        {isApplied ? (
          <Button variant="outline" disabled className="w-full">
            Already Applied
          </Button>
        ) : (
          <Button
            className="w-full button-hover"
            disabled={loading || !isApplicationOpen || isApplicationDeadlinePassed}
            onClick={handleApply}
          >
            {loading ? "Applying..." : "Apply Now"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
