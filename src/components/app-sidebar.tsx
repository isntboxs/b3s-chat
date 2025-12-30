"use client";

import {
  Settings,
  User,
  LogIn,
  Plus,
  History,
  LogOut,
  Trash2,
  ChevronUp,
  Sparkles,
  Bell,
  CreditCard,
  UserCircle,
  MoreHorizontal,
  Pin,
  Edit,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/components/providers/auth-provider";
import { useChatHistory } from "@/hooks/use-chat-history";
import { useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

// Chat menu item component
interface ChatMenuItemProps {
  session: {
    id: string;
    title: string;
    pinned: boolean;
    updated_at: string;
  };
  isActive: boolean;
  onLoad: (id: string) => void;
  onPin: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
}

function ChatMenuItem({
  session,
  isActive,
  onLoad,
  onPin,
  onDelete,
  onRename,
}: ChatMenuItemProps) {
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(session.title);

  const handleRename = () => {
    if (newTitle.trim() && newTitle !== session.title) {
      onRename(session.id, newTitle.trim());
    }
    setRenameDialogOpen(false);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${session.title}"?`)) {
      onDelete(session.id);
    }
  };

  return (
    <>
      <SidebarMenuItem className="group/menu-item">
        <SidebarMenuButton
          onClick={() => onLoad(session.id)}
          isActive={isActive}
          tooltip={session.title}
          className="w-full"
          size="sm"
        >
          <div className="flex items-center gap-2 w-full overflow-hidden">
            {session.pinned && (
              <Pin className="h-3 w-3 text-muted-foreground shrink-0" />
            )}
            <span className="truncate text-xs flex-1">{session.title}</span>
          </div>
        </SidebarMenuButton>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuAction showOnHover>
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </SidebarMenuAction>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onPin(session.id);
              }}
            >
              <Pin className="mr-2 h-4 w-4" />
              {session.pinned ? "Unpin" : "Pin"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setRenameDialogOpen(true);
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Chat</DialogTitle>
            <DialogDescription>
              Enter a new name for this chat conversation.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Chat Title</Label>
              <Input
                id="title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleRename();
                  }
                }}
                placeholder="Enter chat title..."
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRenameDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleRename}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Helper function to group chats by date
function groupChatsByDate(
  sessions: Array<{
    id: string;
    title: string;
    updated_at: string;
    pinned: boolean;
  }>
) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);

  const groups: Record<string, typeof sessions> = {
    Today: [],
    Yesterday: [],
    "Last 7 days": [],
    Older: [],
  };

  sessions.forEach((session) => {
    const sessionDate = new Date(session.updated_at);
    const sessionDay = new Date(
      sessionDate.getFullYear(),
      sessionDate.getMonth(),
      sessionDate.getDate()
    );

    if (sessionDay.getTime() === today.getTime()) {
      groups.Today.push(session);
    } else if (sessionDay.getTime() === yesterday.getTime()) {
      groups.Yesterday.push(session);
    } else if (sessionDate >= lastWeek) {
      groups["Last 7 days"].push(session);
    } else {
      groups.Older.push(session);
    }
  });

  return groups;
}

export function AppSidebar() {
  const { user, signOut } = useAuth();
  const {
    sessions,
    currentSessionId,
    createNewChat,
    loadChat,
    deleteChat,
    togglePin,
    updateTitle,
    isLoading,
  } = useChatHistory();

  // Separate pinned and unpinned sessions
  const pinnedSessions = sessions.filter((s) => s.pinned);
  const unpinnedSessions = sessions.filter((s) => !s.pinned);
  const groupedUnpinned = groupChatsByDate(unpinnedSessions);

  return (
    <Sidebar className="border-r border-sidebar-border">
      {/* Header with New Chat button */}
      <SidebarHeader className="p-4">
        <Button
          className="w-full justify-start gap-3 font-medium"
          variant="default"
          onClick={createNewChat}
          disabled={isLoading}
        >
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
            {isLoading ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                Loading...
              </div>
            ) : !user ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                Login to save chat history
              </div>
            ) : sessions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No chat history yet
              </div>
            ) : (
              <ScrollArea className="h-[calc(100vh-220px)] pr-2">
                <SidebarMenu className="space-y-1 pr-1">
                  {/* Pinned Section */}
                  {pinnedSessions.length > 0 && (
                    <div className="mb-6">
                      <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">
                        Pinned
                      </div>
                      <div className="space-y-0.5">
                        {pinnedSessions.map((session) => (
                          <ChatMenuItem
                            key={session.id}
                            session={session}
                            isActive={currentSessionId === session.id}
                            onLoad={loadChat}
                            onPin={togglePin}
                            onDelete={deleteChat}
                            onRename={updateTitle}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Date-grouped sections */}
                  {Object.entries(groupedUnpinned).map(
                    ([group, groupSessions]) =>
                      groupSessions.length > 0 && (
                        <div key={group} className="mb-6">
                          <div className="px-3 py-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                            {group}
                          </div>
                          <div className="space-y-0.5">
                            {groupSessions.map((session) => (
                              <ChatMenuItem
                                key={session.id}
                                session={session}
                                isActive={currentSessionId === session.id}
                                onLoad={loadChat}
                                onPin={togglePin}
                                onDelete={deleteChat}
                                onRename={updateTitle}
                              />
                            ))}
                          </div>
                        </div>
                      )
                  )}
                </SidebarMenu>
              </ScrollArea>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      {/* Account Section in Footer */}
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted border overflow-hidden">
                      {user.user_metadata.avatar_url ? (
                        <img
                          src={user.user_metadata.avatar_url}
                          alt="Avatar"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="size-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex flex-col overflow-hidden flex-1 min-w-0 text-left">
                      <span className="text-sm font-medium truncate">
                        {user.user_metadata.full_name ||
                          user.email?.split("@")[0]}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </span>
                    </div>
                    <ChevronUp className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  align="end"
                  className="w-[--radix-popper-anchor-width] min-w-56"
                >
                  <DropdownMenuItem className="cursor-pointer">
                    <Sparkles className="size-4" />
                    <span>Upgrade to Pro</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <UserCircle className="size-4" />
                    <span>Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="size-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Bell className="size-4" />
                    <span>Notifications</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <CreditCard className="size-4" />
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={signOut}
                  >
                    <LogOut className="size-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <SidebarMenuButton
                asChild
                size="lg"
                className="cursor-pointer"
                tooltip="Login to your account"
              >
                <Link to="/login">
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                      <User className="size-4 text-muted-foreground" />
                    </div>
                    <div className="flex flex-col overflow-hidden flex-1">
                      <span className="text-sm font-medium">Guest</span>
                      <span className="text-xs text-muted-foreground">
                        Click to login
                      </span>
                    </div>
                    <LogIn className="size-4 text-muted-foreground" />
                  </div>
                </Link>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
