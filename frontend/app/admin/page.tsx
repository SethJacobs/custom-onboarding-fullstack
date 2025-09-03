'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { api, Config } from '../lib/api';

const options: Array<{label:string, value:'ABOUT_ME'|'ADDRESS'|'BIRTHDATE'}> = [
  {label:'About Me', value:'ABOUT_ME'},
  {label:'Address', value:'ADDRESS'},
  {label:'Birthdate', value:'BIRTHDATE'},
];

function SelectComp({label, value, onChange}:{label:string; value:string|undefined; onChange:(v:any)=>void}){
  return (
    <div className="space-y-1">
      <div className="label">{label}</div>
      <select className="input" value={value||''} onChange={e=> onChange(e.target.value || undefined)}>
        <option value="">(none)</option>
        {options.map(o=> <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export default function AdminPage(){
  const [cfg,setCfg] = useState<Config|null>(null);
  const [error,setError]=useState<string| null>(null);
  const [saved,setSaved]=useState(false);

  useEffect(()=>{(async()=>{
    const c = await api<Config>('/api/config');
    setCfg(c);
  })()},[]);

  const valid = useMemo(()=>{
    if (!cfg) return false;
    const p2 = cfg.page2ComponentA || cfg.page2ComponentB;
    const p3 = cfg.page3ComponentA || cfg.page3ComponentB;
    return Boolean(p2 && p3);
  },[cfg]);

  async function save(){
    if (!cfg) return;
    setSaved(false);
    try {
      const res = await api<Config>('/api/config', {
        method: 'PUT', body: JSON.stringify(cfg)
      });
      setCfg(res);
      setError(null);
      setSaved(true);
    } catch(e:any){
      setError(e.message);
    }
  }

  if (!cfg) return <div>Loading…</div>;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card space-y-3">
        <div className="text-lg font-semibold">Page 2 Components</div>
        <SelectComp label="Primary" value={cfg.page2ComponentA} onChange={v=> setCfg({...cfg, page2ComponentA: v})} />
        <SelectComp label="Secondary" value={cfg.page2ComponentB} onChange={v=> setCfg({...cfg, page2ComponentB: v})} />
        <p className="text-xs text-white/60">Each page must have at least one component.</p>
      </div>

      <div className="card space-y-3">
        <div className="text-lg font-semibold">Page 3 Components</div>
        <SelectComp label="Primary" value={cfg.page3ComponentA} onChange={v=> setCfg({...cfg, page3ComponentA: v})} />
        <SelectComp label="Secondary" value={cfg.page3ComponentB} onChange={v=> setCfg({...cfg, page3ComponentB: v})} />
      </div>

      <div className="md:col-span-2 flex items-center gap-4">
        <button className="btn" onClick={save} disabled={!valid}>Save</button>
        {!valid && <span className="text-amber-300 text-sm">Each page must have at least one component.</span>}
        {saved && <span className="text-green-300 text-sm">Saved ✓</span>}
        {error && <span className="text-red-300 text-sm">{error}</span>}
      </div>
    </div>
  )
}
