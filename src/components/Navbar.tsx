import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Upload, MessageCircle, Menu, User, LogOut } from 'lucide-react';
import AuthDialog from './AuthDialog';
import UploadDialog from './UploadDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Navbar() {
  const [showAuth, setShowAuth] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === 'SIGNED_IN' && session?.user) {
        // Check if user needs onboarding
        checkUserProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserProfile = async (userId: string) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!profile || !profile.tone) {
      // User needs onboarding
      window.location.href = '/onboarding';
    } else {
      // User can go to dashboard
      window.location.href = '/dashboard';
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-lg border-b border-border/30">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                FlertaAI
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Button
                    onClick={() => setShowUpload(true)}
                    className="btn-primary hidden sm:flex"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <User className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => window.location.href = '/dashboard'}>
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Sair
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => setShowAuth(true)}
                    variant="ghost"
                    className="hidden sm:inline-flex"
                  >
                    Entrar
                  </Button>
                  <Button
                    onClick={() => setShowAuth(true)}
                    className="btn-primary"
                  >
                    Começar Grátis
                  </Button>
                </>
              )}

              <Button variant="ghost" size="icon" className="sm:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <AuthDialog open={showAuth} onOpenChange={setShowAuth} />
      <UploadDialog open={showUpload} onOpenChange={setShowUpload} />
    </>
  );
}