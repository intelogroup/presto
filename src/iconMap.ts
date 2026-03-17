// src/iconMap.ts
import {
  Zap, Globe, Video as VideoIcon, Cpu, BarChart3, Users,
  Rocket, Shield, TrendingUp, Layers, Clock, Star,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
  Zap, Globe, VideoIcon, Cpu, BarChart3, Users,
  Rocket, Shield, TrendingUp, Layers, Clock, Star,
};

export type IconName = keyof typeof ICON_MAP;

export function resolveIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Zap; // Zap as safe fallback
}
