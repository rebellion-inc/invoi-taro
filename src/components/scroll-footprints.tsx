"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export function ScrollFootprints({ flip }: { flip?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative my-1 h-10 w-16"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      {[
        { className: "absolute left-0 -top-7", delay: 0 },
        { className: "absolute left-2 top-1", delay: 300 },
        { className: "absolute left-11 top-3", delay: 600 },
      ].map((item, i) => (
        <Image
          key={i}
          src="/lp/footprint.png"
          alt=""
          width={24}
          height={24}
          className={`${item.className} transition-opacity duration-500 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
          style={{
            transform: "rotate(99deg)",
            transitionDelay: visible ? `${item.delay}ms` : "0ms",
          }}
        />
      ))}
    </div>
  );
}
