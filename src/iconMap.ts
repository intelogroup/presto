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

// Always returns a valid LucideIcon — unknown names fall back to Zap (never returns undefined)
export function resolveIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Zap;
}

// Valid icon name strings for use in JSON inputProps
export const VALID_ICON_NAMES = Object.keys(ICON_MAP) as string[];
