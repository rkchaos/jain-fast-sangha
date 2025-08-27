import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlogScreen } from "@/components/screens/BlogScreen";
import { CommunityNewsScreen } from "@/components/screens/CommunityNewsScreen";

export function ResourcesScreen() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-foreground">Resources</h1>
          <p className="text-muted-foreground mt-1">Discover spiritual insights and community updates</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Tabs defaultValue="blogs" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="blogs">Blogs</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
          </TabsList>

          <TabsContent value="blogs" className="mt-6">
            <BlogScreen />
          </TabsContent>

          <TabsContent value="news" className="mt-6">
            <CommunityNewsScreen />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}