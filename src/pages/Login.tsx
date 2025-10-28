import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock, User } from "lucide-react";
import loginBanner from "@/assets/login-banner.jpg";
import jmTestLogo from "@/assets/jm-test-logo.png";

const Login = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login API call
    setTimeout(() => {
      if (login && password) {
        toast({
          title: "Login Successful",
          description: "Welcome to CalMapp",
        });
        navigate("/");
      } else {
        toast({
          title: "Login Failed",
          description: "Please enter both login and password",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-secondary to-background">
      {/* Header */}
      <header className="w-full bg-card border-b shadow-sm py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Left - JM Test Systems & CalMapp */}
            <div className="text-left space-y-2">
              <img src={jmTestLogo} alt="JM Test Systems" className="h-10" />
              <h2 className="text-xl font-semibold text-primary">CalMapp</h2>
            </div>
            
            {/* Right - Details */}
            <div className="text-right space-y-0.5">
              <p className="text-sm text-muted-foreground">
                Calibration Management and Processing Program
              </p>
              <p className="text-xs text-muted-foreground">Version 3.0.46 - 10/10/2025</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          {/* Login Card with Image */}
          <Card className="border-2 shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left Side - Image */}
            <div className="hidden md:block relative">
              <img
                src={loginBanner}
                alt="Calibration equipment"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                  <h3 className="text-3xl font-bold text-white">
                    Welcome Back
                  </h3>
                  <p className="text-lg text-white/90">
                    Professional calibration management at your fingertips
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="p-8 md:p-12">
              <CardHeader className="space-y-1 p-0 mb-8">
                <CardTitle className="text-2xl">Sign In</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login" className="text-sm font-medium">
                      Login
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login"
                        type="text"
                        placeholder="Enter your login"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </form>

                <div className="mt-4 text-center">
                  <a href="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
              </CardContent>
            </div>
          </div>
        </Card>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground mt-8">
            TEST SYSTEM (do not use for live data)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
