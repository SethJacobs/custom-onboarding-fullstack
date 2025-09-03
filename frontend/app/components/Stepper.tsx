'use client';
import React from 'react';

export default function Stepper({ step }: { step: number }) {
  const steps = ['Account', 'Profile', 'Finish'];
  return (
    <div className="flex items-center justify-between mb-6">
      {steps.map((label, i) => {
        const idx = i + 1;
        const active = step === idx;
        return (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full grid place-items-center border ${active ? 'bg-white text-black' : 'text-white/60 border-white/20'}`}>
              {idx}
            </div>
            <div className={active ? 'step-active' : 'step-inactive'}>{label}</div>
            {idx < steps.length && <div className="w-16 h-px mx-3 bg-white/20"></div>}
          </div>
        )
      })}
    </div>
  )
}
