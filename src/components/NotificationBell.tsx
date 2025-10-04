import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
}

export const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadNotifications();
    subscribeToNotifications();
  }, []);

  const loadNotifications = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Carregar agendamentos de hoje como notificações
    const today = new Date().toISOString().split('T')[0];
    const { data: todayAppointments } = await supabase
      .from("agendamentos")
      .select(`
        id,
        hora,
        servico,
        created_at,
        clientes (nome)
      `)
      .eq("user_id", user.id)
      .eq("data", today)
      .eq("status", "agendado");

    if (todayAppointments) {
      const notifs: Notification[] = todayAppointments.map(apt => ({
        id: apt.id,
        title: "Agendamento Hoje",
        message: `${apt.clientes?.nome} às ${apt.hora} - ${apt.servico || 'Serviço'}`,
        created_at: apt.created_at,
        read: false
      }));
      
      setNotifications(notifs);
      setUnreadCount(notifs.length);
    }
  };

  const subscribeToNotifications = () => {
    const channel = supabase
      .channel('agendamentos-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'agendamentos'
        },
        (payload) => {
          toast.success("Novo agendamento criado!");
          loadNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const markAsRead = () => {
    setUnreadCount(0);
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen && unreadCount > 0) {
              markAsRead();
            }
          }}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-white text-xs flex items-center justify-center font-bold">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Notificações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3 rounded-lg border ${
                    notif.read ? 'bg-muted/30' : 'bg-primary/5 border-primary/30'
                  }`}
                >
                  <p className="font-semibold text-sm text-foreground">{notif.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground text-sm py-4">
                Nenhuma notificação
              </p>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};