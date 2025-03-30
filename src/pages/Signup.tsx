
import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "lucide-react";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to the home page
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signUp(email, password, name);
      // Auth context will handle toast notification
      // Redirect to login page after signup
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      // Auth state change will handle the redirect
    } catch (error) {
      console.error("Google signup error:", error);
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-md py-8 md:py-12 px-4">
        <div className="flex flex-col items-center mb-6">
          <h1 className="font-display text-2xl md:text-3xl font-bold">Create account</h1>
          <p className="text-muted-foreground mt-2 text-center">
            Begin your magical journey
          </p>
        </div>

        <Card className="border-primary/10 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-xl">Sign up</CardTitle>
            <CardDescription className="text-center">
              Get 10 free Ghibli-style images per week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <Button 
                variant="outline" 
                className="bg-white relative" 
                onClick={handleGoogleSignup}
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
                Sign up with Google
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
              
              <form onSubmit={handleEmailSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    type="text" 
                    placeholder="Your name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                    disabled={isLoading}
                  />
                </div>
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
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    disabled={isLoading}
                    minLength={6}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  By signing up, you agree to our{" "}
                  <Link to="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin mr-2" />
                      Creating account...
                    </>
                  ) : (
                    "Sign up"
                  )}
                </Button>
              </form>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline font-semibold">
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Signup;
