'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: '', password: '' });
  const router = useRouter();

  const handleSubmit = async () => {
    const endpoint = isLogin ? '/auth/login' : '/auth/signup';
    const res = await fetch(`http://localhost:3000${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('token', data.access_token);
      router.push('/timeline');
    } else {
      alert('Error: ' + res.statusText);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{isLogin ? 'Login' : 'Sign Up'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input 
            placeholder="Username" 
            onChange={e => setForm({...form, username: e.target.value})} 
          />
          <Input 
            type="password" 
            placeholder="Password" 
            onChange={e => setForm({...form, password: e.target.value})} 
          />
          <Button className="w-full" onClick={handleSubmit}>
            {isLogin ? 'Login' : 'Sign Up'}
          </Button>
          <p 
            className="text-sm text-center text-blue-500 cursor-pointer"
            onClick={() => setIsLogin(!isLogin)}
          >
            Switch to {isLogin ? 'Sign Up' : 'Login'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}