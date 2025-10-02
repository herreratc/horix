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
import logo from "@/assets/logo.png";

export default function Auth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
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
    setLoading(true);

    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
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
        <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 -right-4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative w-full max-w-md animate-fade-in-up">
        <Card className="border-2 border-border/50 backdrop-blur-xl bg-card/50 shadow-2xl">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="flex justify-center mb-4">
              <img 
                src={logo} 
                alt="Horix" 
                className="h-48 w-auto drop-shadow-2xl hover:scale-110 transition-transform duration-300 cursor-pointer"
              />
            </div>
            <h1 className="text-5xl font-black bg-gradient-primary bg-clip-text text-transparent mb-2">
              HORIX
            </h1>
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
                  className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white"
                >
                  Entrar
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white"
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
