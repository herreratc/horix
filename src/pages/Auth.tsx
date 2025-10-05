import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import logo from "@/assets/logo.png";

const authSchema = z.object({
  email: z.string().trim().email("Email inválido").max(255, "Email muito longo"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres").max(100, "Senha muito longa"),
});

export default function Auth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    try {
      authSchema.parse({ email, password });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
        return;
      }
    }
    
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;
      
      toast.success("Conta criada! Fazendo login...");
      
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;
      navigate("/onboarding");
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    try {
      authSchema.parse({ email, password });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
        return;
      }
    }
    
    setLoading(true);

    try {
      // SECURITY: Rate limiting - check for recent failed login attempts
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { data: recentAttempts } = await supabase
        .from('audit_logs')
        .select('id')
        .eq('action', 'login_attempt')
        .eq('metadata->>email', email.toLowerCase())
        .gte('created_at', oneHourAgo);

      if (recentAttempts && recentAttempts.length >= 5) {
        toast.error('Muitas tentativas de login. Aguarde 1 hora e tente novamente.');
        setLoading(false);
        return;
      }

      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        // Log failed attempt
        await supabase.from('audit_logs').insert({
          action: 'login_attempt',
          table_name: 'auth.users',
          metadata: { email: email.toLowerCase(), success: false }
        });
        throw error;
      }
      
      // Log successful login
      await supabase.from('audit_logs').insert({
        action: 'login_attempt',
        table_name: 'auth.users',
        user_id: data.user?.id,
        metadata: { email: email.toLowerCase(), success: true }
      });
      
      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("profissao")
          .eq("id", data.user.id)
          .single();

        if (profile && profile.profissao === "Profissional") {
          navigate("/onboarding");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-background">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 -right-4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative w-full max-w-md animate-fade-in-up">
        <Card className="border-2 border-border/50 backdrop-blur-xl bg-card/50 shadow-2xl">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="flex justify-center mb-4">
              <img 
                src={logo} 
                alt="Logo" 
                className="h-48 w-auto drop-shadow-2xl hover:scale-110 transition-transform duration-300 cursor-pointer"
              />
            </div>
            <div className="space-y-2">
              <CardDescription className="text-base">
                Sistema Inteligente de Agendamentos
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="signin" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/50">
                <TabsTrigger 
                  value="signin"
                  className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground"
                >
                  Entrar
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground"
                >
                  Criar Conta
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-signin" className="text-sm font-medium">
                      E-mail
                    </Label>
                    <Input
                      id="email-signin"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 bg-background/50 border-border/50 focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signin" className="text-sm font-medium">
                      Senha
                    </Label>
                    <Input
                      id="password-signin"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 bg-background/50 border-border/50 focus:border-primary transition-colors"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-primary hover:opacity-90 transition-opacity text-base font-medium gap-2 shadow-lg" 
                    disabled={loading}
                  >
                    {loading ? "Entrando..." : "Entrar"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-signup" className="text-sm font-medium">
                      E-mail
                    </Label>
                    <Input
                      id="email-signup"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 bg-background/50 border-border/50 focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signup" className="text-sm font-medium">
                      Senha
                    </Label>
                    <Input
                      id="password-signup"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="h-12 bg-background/50 border-border/50 focus:border-primary transition-colors"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-primary hover:opacity-90 transition-opacity text-base font-medium gap-2 shadow-lg" 
                    disabled={loading}
                  >
                    {loading ? "Criando..." : "Criar Conta"}
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
                Ao continuar, você concorda com nossos Termos e Política de Privacidade
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
