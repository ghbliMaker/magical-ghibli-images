
import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from location state or default to "/"
  const from = location.state?.from || "/";

  useEffect(() => {
    // If user is already logged in, redirect to the requested page
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      // Auth context will handle redirect and toast
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      // Auth state change will handle the redirect
    } catch (error) {
      console.error("Google login error:", error);
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-md py-8 md:py-12 px-4">
        <div className="flex flex-col items-center mb-6">
          <h1 className="font-display text-2xl md:text-3xl font-bold">Log in</h1>
          <p className="text-muted-foreground mt-2 text-center">
            Continue your magical journey
          </p>
        </div>

        <Card className="border-primary/10 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-xl">Welcome back</CardTitle>
            <CardDescription className="text-center">
              Choose your preferred login method
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <Button 
                variant="outline" 
                className="bg-white relative" 
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <img 
                    src="https://www.svgrepo.com/show/475656/google-color.svg" 
                    className="h-5 w-5 mr-2" 
                    alt="Google logo" 
                  />
                )}
                Continue with Google
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with email
                  </span>
                </div>
              </div>
              
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    disabled={isLoading}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin mr-2" />
                      Logging in...
                    </>
                  ) : (
                    "Log in"
                  )}
                </Button>
              </form>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline font-semibold">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
