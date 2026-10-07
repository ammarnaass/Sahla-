"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "next-themes";
import { 
  Box, 
  Typography, 
  TextField, 
  Button as MuiButton, 
  IconButton, 
  InputAdornment, 
  Checkbox, 
  FormControlLabel,
  Card as MuiCard,
  CardContent,
  Chip
} from "@mui/material";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  Store,
  Crown,
  Sparkles,
  Printer,
  ShieldCheck,
  CreditCard,
  Sun,
  Moon,
  ArrowRight,
} from "lucide-react";

export function LoginClientView() {
  const router = useRouter();
  const { loginWithEmail } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? theme : "dark";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim()) {
      setErrorMsg("يرجى إدخال البريد الإلكتروني (جيميل)");
      return;
    }
    if (!password) {
      setErrorMsg("يرجى إدخال كلمة المرور");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await loginWithEmail(email.trim(), password);
      if (!res.success) {
        setErrorMsg(res.error || "البريد الإلكتروني أو كلمة المرور غير صحيحة");
        setIsSubmitting(false);
        return;
      }

      // Check role for redirection
      if (res.user?.role === "SUPER_ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setErrorMsg("تعذر الاتصال بخادم سهلة. يرجى المحاولة لاحقاً.");
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg("");
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100dvh', 
        bgcolor: 'background.default',
        color: 'text.primary',
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
        transition: 'background-color 0.3s ease'
      }}
    >
      {/* ─── Right Column: Auth Form ─── */}
      <Box 
        sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          px: { xs: 3, sm: 6, lg: 8 },
          py: 6,
          position: 'relative'
        }}
      >
        {/* Floating Theme & Return Switchers */}
        <Box sx={{ position: 'absolute', top: 24, right: 24, display: 'flex', gap: 1, alignItems: 'center' }}>
          <Link href="/" passHref>
            <MuiButton 
              variant="text" 
              color="inherit" 
              startIcon={<ArrowRight size={16} />}
              sx={{ fontWeight: 'bold', color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
            >
              الرئيسية
            </MuiButton>
          </Link>
          <IconButton 
            onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
            sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}
          >
            {currentTheme === "light" ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-slate-400" />}
          </IconButton>
        </Box>

        <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto', mt: { xs: 8, lg: 0 } }}>
          {/* Header & Logo */}
          <Box sx={{ mb: 4 }}>
            <Link href="/" className="inline-flex items-center gap-3 group mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-emerald-900/20 group-hover:scale-105 transition-transform">
                سـ
              </div>
              <div className="flex flex-col">
                <Typography variant="h6" fontWeight="900" sx={{ fontFamily: 'var(--font-cairo)', lineHeight: 1 }}>
                  سهلة · Sahla
                </Typography>
                <Typography variant="caption" fontWeight="bold" color="primary">
                  منظومة الأكشاك والمكتبات
                </Typography>
              </div>
            </Link>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="h5" fontWeight="900" sx={{ fontFamily: 'var(--font-cairo)' }}>
                تسجيل الدخول إلى المحل
              </Typography>
              <Chip label="كاونتر 2.0" color="primary" size="small" sx={{ fontWeight: 'bold', height: 20, fontSize: '0.65rem' }} />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'var(--font-cairo)' }}>
              أدخل بريدك الإلكتروني (جيميل) وكلمة المرور للوصول إلى لوحة التحكم وطابعاتك السحابية.
            </Typography>
          </Box>

          {/* Error Banner */}
          {errorMsg && (
            <Box 
              sx={{ 
                mb: 3, p: 2, borderRadius: 3, 
                bgcolor: 'error.main', 
                color: 'error.contrastText',
                display: 'flex', alignItems: 'center', gap: 1.5,
                background: currentTheme === 'dark' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              <AlertTriangle size={18} className="text-red-500" />
              <Typography variant="body2" fontWeight="bold" color="error.main">
                {errorMsg}
              </Typography>
            </Box>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                fullWidth
                variant="outlined"
                label="البريد الإلكتروني (جيميل)"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                dir="ltr"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail size={18} className="text-slate-400" />
                      </InputAdornment>
                    ),
                  }
                }}
              />

              <TextField
                fullWidth
                variant="outlined"
                label="كلمة المرور"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                dir="ltr"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={18} className="text-slate-400" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }
                }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: -1 }}>
                <FormControlLabel
                  control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} color="primary" />}
                  label={<Typography variant="body2" color="text.secondary">تذكرني على هذا الجهاز</Typography>}
                />
                <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                  دعم فني: 0550-00-00-00
                </Typography>
              </Box>

              <MuiButton
                type="submit"
                variant="contained"
                size="large"
                disabled={isSubmitting}
                sx={{ mt: 1, borderRadius: 3, py: 1.5, fontSize: '1rem', fontFamily: 'var(--font-cairo)' }}
              >
                {isSubmitting ? "جاري الدخول..." : "تسجيل الدخول إلى المحل"}
              </MuiButton>
            </Box>
          </form>

          {/* Quick Demo Credentials */}
          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" fontWeight="bold" color="text.secondary" align="center" sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <Sparkles size={16} className="text-amber-500" />
              حسابات تجريبية سريعة للتجربة الفورية:
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box 
                onClick={() => handleQuickFill("najah.kiosk@gmail.com", "Shop@2026!")}
                sx={{ 
                  p: 2, borderRadius: 4, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider',
                  cursor: 'pointer', transition: 'all 0.2s', '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main', fontWeight: 'bold', fontSize: '0.85rem' }}>
                  <Store size={16} /> صاحب كشك
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', display: 'block', mt: 0.5 }}>
                  najah.kiosk@gmail.com
                </Typography>
              </Box>

              <Box 
                onClick={() => handleQuickFill("admin@sahla.dz", "Admin@2026!")}
                sx={{ 
                  p: 2, borderRadius: 4, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider',
                  cursor: 'pointer', transition: 'all 0.2s', '&:hover': { borderColor: '#f59e0b', bgcolor: 'action.hover' }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#f59e0b', fontWeight: 'bold', fontSize: '0.85rem' }}>
                  <Crown size={16} /> مدير النظام الوطني
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', display: 'block', mt: 0.5 }}>
                  admin@sahla.dz
                </Typography>
              </Box>
            </Box>
          </Box>

          <Typography align="center" variant="body2" color="text.secondary" sx={{ mt: 4 }}>
            ليس لديك حساب بعد؟{" "}
            <Link href="/register" className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1">
              افتح حساب محلك مجاناً واحصل على 50 نقطة <Sparkles size={14} className="text-amber-500" />
            </Link>
          </Typography>
        </Box>
      </Box>

      {/* ─── Left Column: Value Prop Showcase ─── */}
      <Box 
        sx={{ 
          display: { xs: 'none', lg: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          flex: 1.2,
          p: { lg: 6, xl: 10 },
          position: 'relative',
          overflow: 'hidden',
          bgcolor: currentTheme === 'dark' ? 'rgba(15, 23, 42, 0.4)' : 'rgba(241, 245, 249, 0.4)',
          borderRight: '1px solid',
          borderColor: 'divider'
        }}
      >
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 0.5, borderRadius: 4, border: '1px solid', borderColor: 'primary.main', bgcolor: 'rgba(16, 185, 129, 0.1)', color: 'primary.main', fontWeight: 'bold', fontSize: '0.75rem', mb: 4 }}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            منظومة سهلة السحابية · إصدار الجيل الجديد 2026
          </Box>

          <Typography variant="h3" fontWeight="900" sx={{ fontFamily: 'var(--font-cairo)', mb: 2, lineHeight: 1.3 }}>
            المنصة السحابية الموحدة لإدارة الأكشاك ومراكز الطباعة في الجزائر 🇩🇿
          </Typography>

          <Typography variant="subtitle1" color="text.secondary" sx={{ fontFamily: 'var(--font-cairo)', mb: 6, maxWidth: 500, lineHeight: 1.6 }}>
            سهولة تامة في استقبال ملفات المواطنين عبر QR Code والطباعة اللاسلكية الحرارية، مع امتثال كامل للقانون الجزائري لحماية المعطيات الشخصية.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 500 }}>
            <MuiCard sx={{ borderRadius: 4, bgcolor: 'background.paper', display: 'flex', alignItems: 'flex-start', p: 2 }}>
              <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2, color: 'primary.main', flexShrink: 0 }}>
                <Printer size={24} />
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ fontFamily: 'var(--font-cairo)' }}>جسر طباعة حراري لاسلكي متزامن</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'var(--font-cairo)', mt: 0.5 }}>
                  بدون تعريفات أو كوابل معقدة، يستقبل الكاونتر مهام الطباعة تلقائياً وفورياً.
                </Typography>
              </Box>
            </MuiCard>

            <MuiCard sx={{ borderRadius: 4, bgcolor: 'background.paper', display: 'flex', alignItems: 'flex-start', p: 2 }}>
              <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: 'rgba(20, 184, 166, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2, color: '#0d9488', flexShrink: 0 }}>
                <ShieldCheck size={24} />
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ fontFamily: 'var(--font-cairo)' }}>مطابقة القانون 18-07 لحماية المعطيات</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'var(--font-cairo)', mt: 0.5 }}>
                  تشفير آمن للوثائق وحذف تلقائي نهائي بعد انقضاء المدة المحددة (24 إلى 72 ساعة).
                </Typography>
              </Box>
            </MuiCard>

            <MuiCard sx={{ borderRadius: 4, bgcolor: 'background.paper', display: 'flex', alignItems: 'flex-start', p: 2 }}>
              <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2, color: '#d97706', flexShrink: 0 }}>
                <CreditCard size={24} />
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ fontFamily: 'var(--font-cairo)' }}>نظام شحن نقاط بالجملة وبالدفع الإلكتروني</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'var(--font-cairo)', mt: 0.5 }}>
                  شحن رصيد المحل ببطاقات الخدش من الموزعين أو بالبطاقة الذهبية / CIB في ثوانٍ.
                </Typography>
              </Box>
            </MuiCard>
          </Box>
        </Box>

        {/* Live Network Metric */}
        <Box sx={{ position: 'relative', zIndex: 1, mt: 8, pt: 4, borderTop: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <Typography variant="caption" fontWeight="bold" color="text.primary">شبكة سهلة نشطة عبر 58 ولاية</Typography>
          </Box>
          <Typography variant="caption" fontWeight="bold" color="primary.main" fontFamily="monospace">1,240+ محل تجاري مسجل</Typography>
        </Box>
      </Box>
    </Box>
  );
}
