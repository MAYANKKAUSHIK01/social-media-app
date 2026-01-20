'use client';

import { useEffect, useState } from 'react';
import { useNotificationSocket } from '@/hooks/useSocket';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { jwtDecode } from 'jwt-decode';
import { Send, UserPlus, LogOut, Home, X } from 'lucide-react'; 
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// STRICT TYPING
interface Post {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  author: {
    username: string;
  };
}

interface DecodedToken {
  sub: string;
  username: string;
  exp: number;
}

export default function Timeline() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState({ title: '', description: '' });
  const [targetUsername, setTargetUsername] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  
  // Mobile Toggle State
  const [showMobileFollow, setShowMobileFollow] = useState(false);
  
  const router = useRouter();

  // --- Auth & Setup ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }
    try {
      const decoded = jwtDecode(token) as DecodedToken;
      setUserId(decoded.sub);
      setUsername(decoded.username);
    } catch (error) {
      router.push('/');
    }
  }, [router]);

  useNotificationSocket(userId);

  // --- Data Fetching ---
  const fetchTimeline = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('http://localhost:3000/posts/timeline', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Fetch error", error);
    }
  };

  useEffect(() => { fetchTimeline(); }, []);

  // --- Handlers ---
  const handlePost = async () => {
    if (!newPost.title.trim() || !newPost.description.trim()) {
      toast.error("Title and description are required");
      return;
    }
    
    try {
      const res = await fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify(newPost),
      });

      if (res.ok) {
        toast.success("Post sent successfully!");
        setNewPost({ title: '', description: '' });
        setTimeout(fetchTimeline, 500); 
      } else {
        toast.error("Failed to send post");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  const handleFollow = async () => {
    if (!targetUsername.trim()) return;

    try {
      const res = await fetch(`http://localhost:3000/users/${targetUsername}/follow`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (res.ok) {
        toast.success(`Following @${targetUsername}`);
        setTargetUsername('');
        setShowMobileFollow(false);
        setTimeout(fetchTimeline, 500);
      } else {
        toast.error("User not found");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const getInitials = (name: string) => name?.substring(0, 2).toUpperCase() || '??';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex justify-center pb-16 md:pb-0">
      
      {/* Responsive Container Logic:
        - w-full: Always take full width
        - max-w-7xl: Limit width on giant screens
        - flex: Enable sidebar/feed layout
        - justify-center: Center everything
      */}
      <div className="w-full xl:max-w-7xl flex min-h-screen bg-white md:bg-transparent">
        
        {/* === LEFT SIDEBAR === 
            - hidden on mobile
            - flex on md (Tablet): width 80px (Icon only)
            - lg (Laptop): width 250px (Full text)
        */}
        <div className="hidden md:flex flex-col p-4 border-r border-slate-200 sticky top-0 h-screen justify-between bg-white z-20 
                        w-[88px] lg:w-[250px]">
          <div className="space-y-6">
            {/* Logo: Hidden on tablet, shown on laptop+ */}
            <h1 className="text-2xl font-bold px-4 hidden lg:block text-indigo-600 tracking-tight">SocialApp</h1>
            {/* Logo Icon: Shown on tablet only */}
            <div className="lg:hidden flex justify-center">
              <div className="w-8 h-8 bg-indigo-600 rounded-full"></div>
            </div>

            <nav className="space-y-2 flex flex-col items-center lg:items-start">
              <div 
                className="flex items-center gap-4 p-3 rounded-full bg-indigo-50 font-bold w-fit lg:pr-8 cursor-pointer text-indigo-700"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <Home className="w-6 h-6" />
                <span className="text-lg hidden lg:block">Home</span>
              </div>
            </nav>
          </div>
          
          <div className="flex items-center gap-3 p-3 hover:bg-slate-100 rounded-full cursor-pointer transition justify-center lg:justify-start" onClick={handleLogout}>
             <Avatar className="w-10 h-10 border border-slate-200">
               <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">{getInitials(username)}</AvatarFallback>
             </Avatar>
             <div className="flex-1 overflow-hidden hidden lg:block">
               <p className="font-bold truncate text-sm">{username}</p>
               <p className="text-xs text-slate-500">Log out</p>
             </div>
             {/* Logout Icon: Shown on Laptop only (Tablet uses avatar click) */}
             <LogOut className="w-5 h-5 text-slate-400 hidden lg:block" />
          </div>
        </div>

        {/* === MAIN FEED === 
            - flex-1: Take remaining space
            - max-w-[600px]: Standard reading width
            - w-full: Ensure it fills space on mobile
            - border-x: Borders on both sides on desktop
        */}
        <div className="flex-1 w-full max-w-[600px] border-r border-slate-200 bg-white">
          
          {/* MOBILE HEADER */}
          <div className="md:hidden sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 p-3 flex justify-between items-center shadow-sm">
             <Avatar className="w-8 h-8">
               <AvatarFallback className="bg-indigo-600 text-white text-xs">{getInitials(username)}</AvatarFallback>
             </Avatar>
             <h1 className="font-bold text-lg text-indigo-600">Home</h1>
             <Button variant="ghost" size="icon" onClick={() => setShowMobileFollow(!showMobileFollow)}>
               {showMobileFollow ? <X className="w-6 h-6" /> : <UserPlus className="w-6 h-6 text-slate-700" />}
             </Button>
          </div>

          {/* MOBILE FOLLOW BOX */}
          {showMobileFollow && (
            <div className="md:hidden p-4 bg-slate-50 border-b border-slate-200 animate-in slide-in-from-top-2">
              <div className="flex gap-2">
                <Input 
                   placeholder="Enter username..." 
                   className="bg-white"
                   value={targetUsername}
                   onChange={e => setTargetUsername(e.target.value)}
                />
                <Button size="icon" className="bg-indigo-600" onClick={handleFollow}>
                  <UserPlus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* DESKTOP HEADER */}
          <div className="hidden md:block p-4 border-b border-slate-200 backdrop-blur-md sticky top-0 z-10 bg-white/90">
            <h2 className="font-bold text-lg text-slate-800">Home</h2>
          </div>

          {/* COMPOSER */}
          <div className="p-4 border-b border-slate-200 flex gap-4 bg-white">
             <Avatar className="hidden md:block">
               <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">{getInitials(username)}</AvatarFallback>
             </Avatar>
             <div className="flex-1 space-y-3">
               <Input 
                 className="bg-transparent border-none text-lg placeholder:text-slate-400 focus-visible:ring-0 px-0 font-medium" 
                 placeholder="Subject / Title" 
                 value={newPost.title}
                 onChange={e => setNewPost({...newPost, title: e.target.value})}
               />
               <textarea 
                 className="w-full bg-transparent border-none resize-none outline-none text-slate-700 placeholder:text-slate-400 min-h-[60px]"
                 placeholder="What's happening?"
                 value={newPost.description} 
                 onChange={e => setNewPost({...newPost, description: e.target.value})}
               />
               <div className="flex justify-end pt-2 border-t border-slate-50">
                 <Button onClick={handlePost} size="sm" className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 shadow-md">
                   <Send className="w-4 h-4 mr-2" /> Post
                 </Button>
               </div>
             </div>
          </div>

          {/* FEED ITEMS */}
          <div className="bg-slate-50 min-h-screen">
            {posts.length === 0 ? (
              <div className="p-10 text-center">
                <div className="bg-white p-6 rounded-2xl shadow-sm inline-block">
                  <p className="text-slate-500 mb-2">It's quiet here...</p>
                  <p className="text-sm text-slate-400">Follow people to see their posts!</p>
                </div>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post._id} className="p-4 border-b border-slate-200 bg-white hover:bg-slate-50 transition cursor-pointer">
                  <div className="flex gap-4">
                    <Avatar>
                      <AvatarFallback className="bg-slate-100 text-slate-600 font-medium">{getInitials(post.author?.username)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                         <span className="font-bold text-slate-900">{post.author?.username}</span>
                         <span className="text-slate-400 text-sm">· {new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="font-bold text-slate-800 mb-1 text-[15px]">{post.title}</h3>
                      <p className="text-slate-600 whitespace-pre-wrap leading-relaxed text-[15px]">{post.description}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* === RIGHT SIDEBAR === 
            - hidden on mobile AND tablet/laptop (md/lg)
            - block on XL screens (>1280px)
            This prevents the "squashed" layout on 1100px screens.
        */}
        <div className="hidden xl:block w-[350px] p-4 pl-8 sticky top-0 h-screen bg-white/50 border-l border-slate-200">
          <div className="bg-white rounded-xl p-4 space-y-4 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-lg text-slate-800">Follow Users</h3>
            <div className="flex gap-2">
              <Input 
                 placeholder="Search username..." 
                 className="bg-slate-50 border-slate-200 focus-visible:ring-indigo-500"
                 value={targetUsername}
                 onChange={e => setTargetUsername(e.target.value)}
              />
              <Button size="icon" className="bg-slate-900 text-white hover:bg-slate-800 shrink-0" onClick={handleFollow}>
                <UserPlus className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-xs text-slate-500">
              Try searching for "user1"
            </p>
          </div>
        </div>

      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 flex justify-around p-3 z-50 shadow-lg pb-safe">
        <Home className="w-6 h-6 text-indigo-600" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
        <LogOut className="w-6 h-6 text-slate-400" onClick={handleLogout} />
      </div>

    </div>
  );
}