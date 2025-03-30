
import React from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { User, Settings, Image, CreditCard, LogOut, Crown } from "lucide-react";

const Profile = () => {
  // In a real app, these would come from Supabase
  const user = {
    name: "Chihiro",
    email: "chihiro@example.com",
    avatar: "",
    subscription: "free",
    imagesThisWeek: 7,
    totalImages: 24,
    maxWeeklyImages: 10,
  };

  return (
    <Layout>
      <div className="container py-8 md:py-12 max-w-4xl">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Sidebar */}
          <div className="w-full md:w-1/3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-lg">{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="mt-2">{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
                <div className="mt-2">
                  {user.subscription === "premium" ? (
                    <Badge className="bg-accent text-accent-foreground gap-1">
                      <Crown className="h-3 w-3" /> Premium
                    </Badge>
                  ) : (
                    <Badge variant="outline">Free Plan</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Weekly Usage</span>
                    <span className="font-medium">{user.imagesThisWeek}/{user.maxWeeklyImages}</span>
                  </div>
                  <Progress value={(user.imagesThisWeek / user.maxWeeklyImages) * 100} className="h-2" />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Creations</span>
                  <span>{user.totalImages}</span>
                </div>
              </CardContent>
              <CardFooter className="flex-col space-y-4">
                {user.subscription === "free" && (
                  <Button className="w-full gap-2">
                    <Crown className="h-4 w-4" />
                    Upgrade to Premium
                  </Button>
                )}
                <Button variant="outline" className="w-full gap-2">
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-grow">
            <Tabs defaultValue="creations">
              <TabsList className="mb-6">
                <TabsTrigger value="creations" className="gap-2">
                  <Image className="h-4 w-4" />
                  My Creations
                </TabsTrigger>
                <TabsTrigger value="account" className="gap-2">
                  <User className="h-4 w-4" />
                  Account
                </TabsTrigger>
                <TabsTrigger value="billing" className="gap-2">
                  <CreditCard className="h-4 w-4" />
                  Billing
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="creations">
                <h2 className="font-display text-xl font-bold mb-4">Recent Creations</h2>
                
                {user.totalImages > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }, (_, i) => (
                      <div key={i} className="aspect-square rounded-lg bg-muted overflow-hidden">
                        <img 
                          src={`https://picsum.photos/400/400?random=${i + 20}`} 
                          alt={`Creation ${i}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <Card className="bg-muted/30 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                      <Image className="h-10 w-10 text-muted-foreground mb-4" />
                      <h3 className="font-medium mb-1">No creations yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">Start creating magical images</p>
                      <Button>Create Your First Image</Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="account">
                <h2 className="font-display text-xl font-bold mb-4">Account Settings</h2>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground">
                      Account settings will be available here.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="billing">
                <h2 className="font-display text-xl font-bold mb-4">Subscription Management</h2>
                <Card>
                  <CardContent className="pt-6">
                    {user.subscription === "premium" ? (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-accent text-accent-foreground gap-1">
                            <Crown className="h-3 w-3" /> Premium Plan
                          </Badge>
                          <Badge variant="outline">Active</Badge>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          You're on the Premium plan with unlimited image generation.
                        </p>
                        <Button variant="outline">Manage Subscription</Button>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">Free Plan</Badge>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          You're limited to 10 images per week. Upgrade for unlimited creations.
                        </p>
                        <Button>
                          <Crown className="h-4 w-4 mr-2" />
                          Upgrade to Premium
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
