"use client";

import React, { useState } from "react";
import {
  TextField,
  Button as MuiButton,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Mail, Lock, Eye, EyeOff, PhoneCall } from "lucide-react";
import { siteConfig } from "@/config/site";

interface LoginFormProps {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  rememberMe: boolean;
  setRememberMe: (val: boolean) => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  rememberMe,
  setRememberMe,
  isSubmitting,
  onSubmit,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Email Input */}
      <div>
        <label className="block text-xs font-bold text-foreground mb-1.5 font-cairo">
          البريد الإلكتروني (جيميل)
        </label>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="example@gmail.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          dir="ltr"
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Mail size={16} className="text-muted-foreground" />
                </InputAdornment>
              ),
              sx: {
                borderRadius: "12px",
                bgcolor: "background.paper",
                "& fieldset": { borderColor: "divider" },
                "&:hover fieldset": { borderColor: "primary.main" },
              },
            },
          }}
        />
      </div>

      {/* Password Input */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-bold text-foreground font-cairo">
            كلمة المرور
          </label>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer">
            نسيت كلمة المرور؟
          </span>
        </div>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="••••••••"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          dir="ltr"
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Lock size={16} className="text-muted-foreground" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                    aria-label="إظهار كلمة المرور"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                borderRadius: "12px",
                bgcolor: "background.paper",
                "& fieldset": { borderColor: "divider" },
                "&:hover fieldset": { borderColor: "primary.main" },
              },
            },
          }}
        />
      </div>

      {/* Remember Me & Help Hotline */}
      <div className="flex items-center justify-between pt-1">
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              sx={{ color: "text.secondary", "&.Mui-checked": { color: "#10b981" } }}
            />
          }
          label={
            <span className="text-xs text-muted-foreground font-cairo">
              تذكرني على هذا الجهاز
            </span>
          }
        />
        <div className="text-[11px] text-muted-foreground font-mono flex items-center gap-1">
          <PhoneCall size={12} className="text-emerald-500" />
          <span>{siteConfig.supportPhone}</span>
        </div>
      </div>

      {/* Submit Button */}
      <MuiButton
        fullWidth
        type="submit"
        variant="contained"
        size="large"
        disabled={isSubmitting}
        disableElevation
        sx={{
          mt: 1,
          py: 1.4,
          borderRadius: "12px",
          fontWeight: 800,
          fontSize: "0.95rem",
          bgcolor: "#10b981",
          "&:hover": { bgcolor: "#059669" },
          boxShadow: "0 8px 20px -4px rgba(16, 185, 129, 0.35)",
        }}
      >
        {isSubmitting ? "جاري التحقق والربط..." : "تسجيل الدخول إلى المحل"}
      </MuiButton>
    </form>
  );
}
