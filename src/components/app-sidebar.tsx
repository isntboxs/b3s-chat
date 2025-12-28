"use client";

import {
  MessageSquare,
  Settings,
  User,
  LogIn,
  Plus,
  History,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

// Mock chat history data - replace with actual data from your backend
const chatHistory = [
  { id: "1", title: "How to learn React", date: "Today" },
  { id: "2", title: "JavaScript async/await", date: "Today" },
  { id: "3", title: "CSS Grid layout tips", date: "Yesterday" },
  { id: "4", title: "TypeScript generics", date: "Yesterday" },
  { id: "5", title: "Node.js best practices", date: "Last week" },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-sidebar-border">
      {/* Header with New Chat button */}
      <SidebarHeader className="p-4">
        <Button className="w-full justify-start gap-3" variant="outline">
          <Plus className="size-5" />
          New Chat
        </Button>
      </SidebarHeader>

      <SidebarSeparator />

      {/* Chat History Section */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 px-3">
            <History className="size-4" />
            Chat History
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-3">
              {chatHistory.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton
                    asChild
                    className="cursor-pointer"
                    tooltip={chat.title}
                  >
                    <div className="flex items-center gap-3">
                      <MessageSquare className="size-4 shrink-0 text-muted-foreground" />
                      <div className="flex flex-col overflow-hidden">
                        <span className="truncate text-sm">{chat.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {chat.date}
                        </span>
                      </div>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Settings Section */}
        <SidebarGroup>
        <SidebarMenuButton>
          <SidebarGroupLabel className="flex items-center gap-2 px-4">
            <Settings className="size-4" />
            Settings
          </SidebarGroupLabel>
        </SidebarMenuButton>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Settings className="size-4 text-muted-foreground" />
                    <span>Preferences</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      {/* Account Section in Footer */}
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="cursor-pointer"
              tooltip="Login to your account"
            >
              <div className="flex items-center gap-3 w-full">
                <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                  <User className="size-4 text-muted-foreground" />
                </div>
                <div className="flex flex-col overflow-hidden flex-1">
                  <span className="text-sm font-medium">Guest User</span>
                  <span className="text-xs text-muted-foreground">
                    Click to login
                  </span>
                </div>
                <LogIn className="size-4 text-muted-foreground" />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
