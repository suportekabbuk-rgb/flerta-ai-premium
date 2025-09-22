import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  MessageCircle, 
  Mic, 
  BarChart3, 
  Clock,
  Heart,
  Settings,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  totalConversations: number;
  successRate: number;
  totalMatches: number;
  recentActivity: Array<{
    id: string;
    type: 'upload' | 'suggestion' | 'match';
    description: string;
    timestamp: string;
  }>;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalConversations: 0,
    successRate: 0,
    totalMatches: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    loadDashboardData();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/');
      return;
    }
    setUser(user);
  };

  const loadDashboardData = async () => {
    try {
      // Load user's conversation stats
      const { data: uploads } = await supabase
        .from('uploads')
        .select('id, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      const { data: suggestions } = await supabase
        .from('suggestions')
        .select('id, accepted, created_at')
        .order('created_at', { ascending: false });

      const totalConversations = uploads?.length || 0;
      const acceptedSuggestions = suggestions?.filter(s => s.accepted === true).length || 0;
      const totalSuggestions = suggestions?.length || 0;
      const successRate = totalSuggestions > 0 ? Math.round((acceptedSuggestions / totalSuggestions) * 100) : 0;

      // Mock recent activity
      const recentActivity = [
        {
          id: '1',
          type: 'upload' as const,
          description: 'Nova conversa analisada - Tinder',
          timestamp: '2 horas atrás'
        },
        {
          id: '2', 
          type: 'suggestion' as const,
          description: '5 sugestões geradas para Maria',
          timestamp: '3 horas atrás'
        },
        {
          id: '3',
          type: 'match' as const,
          description: 'Match confirmado! 🎉',
          timestamp: '1 dia atrás'
        }
      ];

      setStats({
        totalConversations,
        successRate,
        totalMatches: 3, // Mock data
        recentActivity
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      icon: Upload,
      title: 'Upload Screenshot',
      description: 'Analise nova conversa',
      action: () => {}, // TODO: Open upload dialog
      color: 'bg-primary'
    },
    {
      icon: Mic,
      title: 'Nota de Voz',
      description: 'Grave uma mensagem',
      action: () => {}, // TODO: Open voice recorder
      color: 'bg-accent'
    },
    {
      icon: MessageCircle,
      title: 'Texto Direto',
      description: 'Cole uma conversa',
      action: () => {}, // TODO: Open text dialog
      color: 'bg-success'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-lg border-b border-border/30 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">FlertaAI</h1>
            <p className="text-sm text-muted">Olá, {user?.user_metadata?.name || 'Usuário'}! 👋</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 pb-20">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="surface-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted">Conversas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-primary" />
                <span className="text-2xl font-bold text-foreground">{stats.totalConversations}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="surface-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted">Taxa de Sucesso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-success" />
                <span className="text-2xl font-bold text-foreground">{stats.successRate}%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Ações Rápidas</h2>
          <div className="grid gap-4">
            {quickActions.map((action, index) => (
              <Card 
                key={index}
                className="surface-card cursor-pointer hover:scale-[1.02] transition-transform"
                onClick={action.action}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`${action.color} p-3 rounded-xl`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{action.title}</h3>
                      <p className="text-sm text-muted">{action.description}</p>
                    </div>
                    <Plus className="w-5 h-5 text-muted" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Atividade Recente</h2>
          <div className="space-y-3">
            {stats.recentActivity.map((activity) => (
              <Card key={activity.id} className="surface-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{activity.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 text-muted" />
                        <span className="text-xs text-muted">{activity.timestamp}</span>
                        <Badge 
                          variant="secondary"
                          className="h-5 text-xs"
                        >
                          {activity.type === 'upload' ? 'Upload' : 
                           activity.type === 'suggestion' ? 'IA' : 'Match'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-lg border-t border-border/30 px-4 py-2 safe-area-inset-bottom">
        <div className="flex justify-around items-center h-16">
          <Button variant="ghost" size="sm" className="flex-col gap-1 h-auto py-2">
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs">Dashboard</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-col gap-1 h-auto py-2">
            <Upload className="w-5 h-5" />
            <span className="text-xs">Upload</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-col gap-1 h-auto py-2">
            <MessageCircle className="w-5 h-5" />
            <span className="text-xs">Conversas</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-col gap-1 h-auto py-2">
            <Heart className="w-5 h-5" />
            <span className="text-xs">Matches</span>
          </Button>
        </div>
      </nav>
    </div>
  );
}