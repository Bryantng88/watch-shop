"use client";
import { useEffect, useState } from "react";
import { Palette } from "lucide-react";
import styles from "./BenChat.module.css";

const tones = [
  { id: "graphite", label: "Graphite" },
  { id: "midnight", label: "Midnight" },
  { id: "steel", label: "Steel · sáng" },
] as const;
type BenTone = (typeof tones)[number]["id"];
function isTone(value: unknown): value is BenTone {
  return tones.some(tone => tone.id === value);
}

export function useBenTone(userId: string) {
  const key = `watchshop:ben-tone:v1:${userId}`;
  const [tone, setTone] = useState<BenTone>("graphite");
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      setTone(isTone(saved) ? saved : "graphite");
    } catch {
      setTone("graphite");
    }
  }, [key]);
  function changeTone(value: BenTone) {
    setTone(value);
    try { localStorage.setItem(key, value); } catch { /* Keep the selection in memory. */ }
  }
  return [tone, changeTone] as const;
}

export default function BenTonePicker({ tone, onChange }: {
  tone: BenTone;
  onChange: (tone: BenTone) => void;
}) {
  return <label className={styles.tonePicker} title="Đổi tông màu Ben">
    <Palette size={15} aria-hidden="true" />
    <select aria-label="Tông màu Ben" value={tone} onChange={event => {
      if (isTone(event.target.value)) onChange(event.target.value);
    }}>
      {tones.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}
    </select>
  </label>;
}
