import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import GuiaInicial from "./pages/GuiaInicial";
import Dashboard from "./pages/Dashboard";
import Assinatura from "./pages/Assinatura";
import Clientes from "./pages/Clientes";
import ClienteForm from "./pages/ClienteForm";
import Agenda from "./pages/Agenda";
import NovoAgendamento from "./pages/NovoAgendamento";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";
import Servicos from "./pages/Servicos";
import AgendamentoPublico from "./pages/AgendamentoPublico";
import Manual from "./pages/Manual";
import Templates from "./pages/Templates";
import Planos from "./pages/Planos";
import Sobre from "./pages/Sobre";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/guia-inicial" element={<GuiaInicial />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assinatura" element={<Assinatura />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/clientes/novo" element={<ClienteForm />} />
          <Route path="/clientes/editar/:id" element={<ClienteForm />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/novo-agendamento" element={<NovoAgendamento />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/servicos" element={<Servicos />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/manual" element={<Manual />} />
          <Route path="/planos" element={<Planos />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/agendamento/:userId" element={<AgendamentoPublico />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
