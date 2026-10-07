"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button as MuiButton, Card as MuiCard, Typography, Container, Box, IconButton, AppBar, Toolbar } from "@mui/material";
import { Store, Printer, ShieldCheck, Sparkles, ArrowRight, Sun, Moon } from "lucide-react";

export function LandingClientView() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? theme : "dark";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300">
      <AppBar position="sticky" elevation={0} sx={{ 
        bgcolor: 'background.default', 
        borderBottom: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(12px)',
        backgroundColor: currentTheme === 'dark' ? 'rgba(2, 6, 23, 0.8)' : 'rgba(248, 250, 252, 0.8)',
      }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-900/20">
              سـ
            </div>
            <Typography variant="h6" fontWeight="900" sx={{ color: 'text.primary', fontFamily: 'var(--font-cairo)' }}>
              سهلة
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <IconButton 
              onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")} 
              sx={{ color: 'text.primary' }}
            >
              {currentTheme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </IconButton>
            <Link href="/login" passHref>
              <MuiButton variant="contained" disableElevation sx={{ borderRadius: '10px' }}>
                دخول المحل
              </MuiButton>
            </Link>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 12, position: 'relative', overflow: 'hidden' }}>
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-bold mb-8">
            <Sparkles size={16} />
            المنصة الأولى لإدارة الكيوسكات في الجزائر
          </div>
          
          <Typography variant="h2" fontWeight="900" gutterBottom sx={{ fontFamily: 'var(--font-cairo)', lineHeight: 1.2 }}>
            أنجز مهام زبائنك في ثوانٍ،
            <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-400">
              بدون تعقيدات.
            </span>
          </Typography>
          
          <Typography variant="h6" color="text.secondary" sx={{ mt: 3, mb: 6, maxWidth: 600, mx: 'auto', fontFamily: 'var(--font-cairo)', fontWeight: 500 }}>
            منظومة سحابية ذكية تتيح لك طباعة الوثائق لاسلكياً، وإدارة المخزون، وشحن الرصيد من مكان واحد.
          </Typography>

          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
            <Link href="/register" passHref>
              <MuiButton variant="contained" size="large" disableElevation endIcon={<ArrowRight size={20} />} sx={{ borderRadius: '12px', px: 4, py: 1.5, fontSize: '1.1rem' }}>
                افتح حساب مجاناً
              </MuiButton>
            </Link>
          </Box>
        </Container>

        <Container maxWidth="lg" sx={{ mt: 16, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
            <MuiCard sx={{ p: 4, borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', bgcolor: 'background.paper', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-5px)' } }}>
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <Printer className="text-emerald-600" size={32} />
              </div>
              <Typography variant="h5" fontWeight="800" gutterBottom sx={{ fontFamily: 'var(--font-cairo)' }}>طباعة سحابية</Typography>
              <Typography color="text.secondary" sx={{ fontFamily: 'var(--font-cairo)' }}>
                استقبل ملفات الزبائن مباشرة من هواتفهم عبر كود QR واطبعها بضغطة زر.
              </Typography>
            </MuiCard>
            
            <MuiCard sx={{ p: 4, borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', bgcolor: 'background.paper', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-5px)' } }}>
              <div className="w-16 h-16 rounded-2xl bg-teal-500/10 flex items-center justify-center mb-4">
                <Store className="text-teal-600" size={32} />
              </div>
              <Typography variant="h5" fontWeight="800" gutterBottom sx={{ fontFamily: 'var(--font-cairo)' }}>إدارة شاملة</Typography>
              <Typography color="text.secondary" sx={{ fontFamily: 'var(--font-cairo)' }}>
                نقطة بيع متكاملة مع جرد للمخزون، إحصائيات دقيقة، وحساب للأرباح يومياً.
              </Typography>
            </MuiCard>

            <MuiCard sx={{ p: 4, borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', bgcolor: 'background.paper', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-5px)' } }}>
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4">
                <ShieldCheck className="text-blue-600" size={32} />
              </div>
              <Typography variant="h5" fontWeight="800" gutterBottom sx={{ fontFamily: 'var(--font-cairo)' }}>أمان وموثوقية</Typography>
              <Typography color="text.secondary" sx={{ fontFamily: 'var(--font-cairo)' }}>
                مطابق لقوانين حماية المعطيات، مع تشفير لجميع الملفات والوثائق.
              </Typography>
            </MuiCard>
          </Box>
        </Container>
      </Box>
    </div>
  );
}
