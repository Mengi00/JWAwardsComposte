import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Voting from "@/pages/Voting";
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminCategories from "@/pages/admin/Categories";
import AdminDJs from "@/pages/admin/DJs";
import AdminAssignments from "@/pages/admin/Assignments";
import AdminVoters from "@/pages/admin/Voters";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/votar" component={Voting} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/categories" component={AdminCategories} />
      <Route path="/admin/djs" component={AdminDJs} />
      <Route path="/admin/assignments" component={AdminAssignments} />
      <Route path="/admin/voters" component={AdminVoters} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
