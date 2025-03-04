'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Section {
  id: string;
  path: string;
}

interface ScrollTriggerNavigatorProps {
  section: Section;
}

export default function ScrollTriggerNavigator({ section }: ScrollTriggerNavigatorProps) {
    const router = useRouter();
    const [currentSection, setCurrentSection] = useState<string | null>(null);
  
    useEffect(() => {
      const handleScroll = () => {
        const element = document.getElementById(section.id);
        if (!element) return;
  
        const rect = element.getBoundingClientRect();
        const visibleRatio = Math.max(0, (window.innerHeight - rect.top) / window.innerHeight);
  
        if (visibleRatio > 0.5 && section.path !== currentSection) {
          setCurrentSection(section.path);
          router.push(section.path);
        }
      };
  
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, [section, currentSection, router]);
  
    return null;
  }