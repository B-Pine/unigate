import { PublicLayout } from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate(user.role === "admin" ? "/admin" : "/", { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(loginEmail, loginPassword);
    } catch (err: any) {
      toast({ title: "Login failed", description: err.message || "Invalid credentials", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await register(signupName, signupEmail, signupPassword);
    } catch (err: any) {
      toast({ title: "Registration failed", description: err.message || "Could not create account", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <div className="uni-page-header">
        <div className="uni-container">
          <h1>Student Portal</h1>
          <p>Sign in or create an account to access premium features.</p>
        </div>
      </div>

      <div className="uni-page-content">
        <div className="uni-auth-container" style={{ padding: "40px 24px 60px" }}>
          <div className="uni-auth-logo">
            <img src="/logo.png" alt="Unigate" />
            <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>UNIGATE</div>
          </div>

          <div className="uni-auth-card">
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2 mb-5 h-9" style={{ borderRadius: 6 }}>
                <TabsTrigger value="login" className="text-xs" style={{ borderRadius: 5 }}>
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="text-xs" style={{ borderRadius: 5 }}>
                  Create Account
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email" className="text-xs font-medium" style={{ color: "#4b5563" }}>
                      Email Address
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="h-9 text-sm mt-1.5"
                      style={{ borderColor: "#e5e7eb", borderRadius: 6 }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password" className="text-xs font-medium" style={{ color: "#4b5563" }}>
                      Password
                    </Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="h-9 text-sm mt-1.5"
                      style={{ borderColor: "#e5e7eb", borderRadius: 6 }}
                    />
                  </div>
                  <Button
                    type="submit"
                    size="sm"
                    className="w-full h-9"
                    style={{ borderRadius: 6 }}
                    disabled={submitting}
                  >
                    {submitting ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-name" className="text-xs font-medium" style={{ color: "#4b5563" }}>
                      Full Name
                    </Label>
                    <Input
                      id="signup-name"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="John Doe"
                      required
                      className="h-9 text-sm mt-1.5"
                      style={{ borderColor: "#e5e7eb", borderRadius: 6 }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-email" className="text-xs font-medium" style={{ color: "#4b5563" }}>
                      Email Address
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="h-9 text-sm mt-1.5"
                      style={{ borderColor: "#e5e7eb", borderRadius: 6 }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-password" className="text-xs font-medium" style={{ color: "#4b5563" }}>
                      Password
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Create a password (min 6 characters)"
                      required
                      minLength={6}
                      className="h-9 text-sm mt-1.5"
                      style={{ borderColor: "#e5e7eb", borderRadius: 6 }}
                    />
                  </div>
                  <Button
                    type="submit"
                    size="sm"
                    className="w-full h-9"
                    style={{ borderRadius: 6 }}
                    disabled={submitting}
                  >
                    {submitting ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Auth;
