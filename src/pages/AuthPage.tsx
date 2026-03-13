import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import logoIcon from "@/assets/obracerta-icon.png";
import { ArrowLeft, Eye, EyeOff, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type AuthView = "login" | "signup" | "forgot";

const AuthPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [view, setView] = useState<AuthView>("login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => localStorage.getItem("rememberMe") === "true");

  const [email, setEmail] = useState(() => rememberMe ? (localStorage.getItem("savedEmail") || "") : "");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const formatCpf = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 10) {
      return digits.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
    }
    return digits.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
  };

  const handleRememberMe = (checked: boolean) => {
    setRememberMe(checked);
    localStorage.setItem("rememberMe", String(checked));
    if (!checked) {
      localStorage.removeItem("savedEmail");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (view === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Email de recuperação enviado! Verifique sua caixa de entrada.");
        setView("login");
        return;
      }

      if (view === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (rememberMe) {
          localStorage.setItem("savedEmail", email);
        }
        toast.success("Login realizado com sucesso!");
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("profiles").update({
            phone: phone.replace(/\D/g, ""),
            cpf: cpf.replace(/\D/g, ""),
            full_name: fullName,
          }).eq("id", user.id);
        }

        if (rememberMe) {
          localStorage.setItem("savedEmail", email);
        }
        toast.success("Conta criada com sucesso!");
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) toast.error("Erro ao entrar com Google");
  };

  const getTitle = () => {
    switch (view) {
      case "login": return "Entre na sua conta";
      case "signup": return "Crie sua conta";
      case "forgot": return "Recuperar senha";
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="gradient-primary px-4 pt-4 pb-8 relative">
        <button
          onClick={() => view === "login" ? navigate("/") : setView("login")}
          className="text-primary-foreground mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <img src={logoIcon} alt="ObraCerta" className="w-10 h-10 rounded-full" />
          <div>
            <h1 className="text-xl font-extrabold text-primary-foreground">ObraCerta</h1>
            <p className="text-xs text-primary-foreground/80">{getTitle()}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="px-4 -mt-4">
        <div className="bg-card rounded-2xl p-5 shadow-elevated">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {view === "signup" && (
              <>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Nome completo</label>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Seu nome completo" required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Telefone</label>
                  <Input value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} placeholder="(11) 99999-9999" required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">CPF</label>
                  <Input value={cpf} onChange={(e) => setCpf(formatCpf(e.target.value))} placeholder="000.000.000-00" required />
                </div>
              </>
            )}

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required />
            </div>

            {view !== "forgot" && (
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Senha</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    minLength={6}
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Remember me + Forgot password */}
            {view === "login" && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => handleRememberMe(checked === true)}
                  />
                  <label htmlFor="remember" className="text-xs text-muted-foreground cursor-pointer">
                    Lembrar meu login
                  </label>
                </div>
                <button type="button" onClick={() => setView("forgot")} className="text-xs text-primary font-semibold">
                  Esqueci a senha
                </button>
              </div>
            )}

            <Button type="submit" className="w-full mt-2 gradient-primary text-primary-foreground font-bold" disabled={loading}>
              {loading
                ? "Aguarde..."
                : view === "login"
                  ? "Entrar"
                  : view === "signup"
                    ? "Criar conta"
                    : "Enviar link de recuperação"}
            </Button>
          </form>

          {view === "forgot" && (
            <p className="text-center text-[11px] text-muted-foreground mt-3 flex items-center justify-center gap-1">
              <Mail className="w-3 h-3" />
              Enviaremos um link para redefinir sua senha
            </p>
          )}

          {view !== "forgot" && (
            <>
              {/* Divider */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">ou</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Google */}
              <Button variant="outline" className="w-full font-semibold" onClick={handleGoogleLogin}>
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Entrar com Google
              </Button>
            </>
          )}

          {/* Toggle */}
          <p className="text-center text-xs text-muted-foreground mt-4">
            {view === "login" ? "Não tem conta? " : "Já tem conta? "}
            <button onClick={() => setView(view === "login" ? "signup" : "login")} className="text-primary font-bold">
              {view === "login" ? "Cadastre-se" : "Faça login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
