'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Stepper from './components/Stepper';
import { api, User, Config } from './lib/api';

type RegisterForm = { email: string; password: string; }

type Comp = 'ABOUT_ME' | 'ADDRESS' | 'BIRTHDATE';

function ComponentCard({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="card space-y-2">
    <div className="text-sm uppercase tracking-wide text-white/70">{title}</div>
    {children}
  </div>
}

export default function OnboardingPage() {
  const [user, setUser] = useState<User | null>(null);
  const [cfg, setCfg] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form data state for current step
  const [formData, setFormData] = useState<Partial<User>>({});
  const [autosaveTimeout, setAutosaveTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const config = await api<Config>('/api/config');
        setCfg(config);
        const me = await api<User>('/api/users/me');
        setUser(me);
      } catch (e: any) {
        // no uid cookie yet
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const step = user?.currentStep || 1;

  async function handleRegister(f: RegisterForm): Promise<void> {
    setError(null);
    try {
      const u = await api<User>('/api/users/register', {
        method: 'POST',
        body: JSON.stringify(f)
      });
      // New user - advance to step 2, existing user continues from their step
      if (u.currentStep === 1) {
        const updated = await api<User>('/api/users/me', {
          method: 'PATCH',
          body: JSON.stringify({ currentStep: 2 })
        });
        setUser(updated);
      } else {
        setUser(u);
      }
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function saveAndNext(nextStep: number) {
    if (!user) return;
    try {
      const updated = await api<User>('/api/users/me', {
        method: 'PATCH',
        body: JSON.stringify({ ...formData, currentStep: nextStep })
      });
      setUser(updated);
      setFormData({}); // Clear form data after successful save
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function startOver() {
    if (!user) return;
    try {
      const updated = await api<User>('/api/users/me', {
        method: 'PATCH',
        body: JSON.stringify({
          aboutMe: '',
          street: '',
          city: '',
          state: '',
          zip: '',
          birthdate: '',
          currentStep: 2
        })
      });
      setUser(updated);
      setFormData({});
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function logout() {
    try {
      await api('/api/users/logout', { method: 'POST' });
      setUser(null);
      setFormData({});
    } catch (e: any) {
      setError(e.message);
    }
  }

  // Auto-save function (debounced)
  const autoSave = async (data: Partial<User>) => {
    if (!user) return;
    try {
      await api<User>('/api/users/me', {
        method: 'PATCH',
        body: JSON.stringify(data)
      });
    } catch (e: any) {
      console.error('Autosave failed:', e.message);
    }
  };

  // Update form data and trigger autosave
  const updateFormData = (newData: Partial<User>) => {
    const updatedData = { ...formData, ...newData };
    setFormData(updatedData);

    // Clear existing timeout
    if (autosaveTimeout) {
      clearTimeout(autosaveTimeout);
    }

    // Set new timeout for autosave
    const timeoutId = setTimeout(() => {
      autoSave(newData);
    }, 1000);

    setAutosaveTimeout(timeoutId);
  };


  const isStep2Valid = () => {
    if (!p2.length) return true;

    if (p2.includes('ABOUT_ME')) {
      const aboutMe = formData.aboutMe || user?.aboutMe || '';
      if (!aboutMe.trim()) return false;
    }

    if (p2.includes('ADDRESS')) {
      const street = formData.street || user?.street || '';
      const city = formData.city || user?.city || '';
      const state = formData.state || user?.state || '';
      const zip = formData.zip || user?.zip || '';
      if (!street.trim() || !city.trim() || !state.trim() || !zip.trim()) return false;
    }

    if (p2.includes('BIRTHDATE')) {
      const birthdate = formData.birthdate || user?.birthdate || '';
      if (!birthdate) return false;
    }

    return true;
  };

  const isStep3Valid = () => {
    if (!p3.length) return true;

    if (p3.includes('ABOUT_ME')) {
      const aboutMe = formData.aboutMe || user?.aboutMe || '';
      if (!aboutMe.trim()) return false;
    }

    if (p3.includes('ADDRESS')) {
      const street = formData.street || user?.street || '';
      const city = formData.city || user?.city || '';
      const state = formData.state || user?.state || '';
      const zip = formData.zip || user?.zip || '';
      if (!street.trim() || !city.trim() || !state.trim() || !zip.trim()) return false;
    }

    if (p3.includes('BIRTHDATE')) {
      const birthdate = formData.birthdate || user?.birthdate || '';
      if (!birthdate) return false;
    }

    return true;
  };

  const p2 = useMemo(() => {
    const list: Comp[] = [];
    if (cfg?.page2ComponentA) list.push(cfg.page2ComponentA);
    if (cfg?.page2ComponentB && cfg.page2ComponentB !== cfg.page2ComponentA) list.push(cfg.page2ComponentB);
    return list;
  }, [cfg]);

  const p3 = useMemo(() => {
    const list: Comp[] = [];
    if (cfg?.page3ComponentA) list.push(cfg.page3ComponentA);
    if (cfg?.page3ComponentB && cfg.page3ComponentB !== cfg.page3ComponentA) list.push(cfg.page3ComponentB);
    return list;
  }, [cfg]);

  if (loading) return <div>Loading…</div>;

  return (
    <div className="space-y-6">
      <Stepper step={step} />
      {error && <div className="text-red-400">{error}</div>}

      {step === 1 && (
        <div className="grid md:grid-cols-2 gap-6">
          <ComponentCard title="Login or Create an Account">
            <AccountForm onSubmit={handleRegister} />
          </ComponentCard>
          <div className="card">
            <p className="text-white/80">This wizard saves progress. If you return later,
              we’ll pick up where you left off.</p>
            <p className="text-white/60 text-sm mt-2"></p>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="grid md:grid-cols-2 gap-6">
          {p2.includes('ABOUT_ME') && <ComponentCard title="About Me"><AboutMe user={user} formData={formData} onChange={updateFormData} /></ComponentCard>}
          {p2.includes('ADDRESS') && <ComponentCard title="Address"><Address user={user} formData={formData} onChange={updateFormData} /></ComponentCard>}
          {p2.includes('BIRTHDATE') && <ComponentCard title="Birthdate"><Birth user={user} formData={formData} onChange={updateFormData} /></ComponentCard>}

          <div className="md:col-span-2 flex justify-end">
            <button
              className={`btn ${!isStep2Valid() ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => isStep2Valid() && saveAndNext(3)}
              disabled={!isStep2Valid()}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="grid md:grid-cols-2 gap-6">
          {p3.includes('ABOUT_ME') && <ComponentCard title="About Me"><AboutMe user={user} formData={formData} onChange={updateFormData} /></ComponentCard>}
          {p3.includes('ADDRESS') && <ComponentCard title="Address"><Address user={user} formData={formData} onChange={updateFormData} /></ComponentCard>}
          {p3.includes('BIRTHDATE') && <ComponentCard title="Birthdate"><Birth user={user} formData={formData} onChange={updateFormData} /></ComponentCard>}
          <div className="md:col-span-2 flex justify-between">
            <button className="btn" onClick={() => saveAndNext(2)}>Back</button>
            <button
              className={`btn ${!isStep3Valid() ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => isStep3Valid() && saveAndNext(4)}
              disabled={!isStep3Valid()}
            >
              Finish
            </button>
          </div>
        </div>
      )}

      {step >= 4 && (
        <div className="card text-center">
          <h2 className="text-2xl font-bold text-white mb-4">🎉 Onboarding Complete!</h2>
          <p className="text-white/80 mb-6">Thank you for completing your profile setup.</p>
          <p className="text-white/80 mb-6">Starting over will reset your profile</p>
          <div className="flex justify-center gap-4">
            <button className="btn" onClick={startOver}>Start Over</button>
            <button className="btn bg-red-600 hover:bg-red-700" onClick={logout}>Log Out</button>
          </div>
        </div>
      )}
    </div>
  )
}

function AccountForm({ onSubmit }: { onSubmit: (f: RegisterForm) => Promise<void> }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const isEmailValid = email.includes('@') && email.includes('.') && email.length > 5;
  const isPasswordValid = password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await onSubmit({ email, password });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <div className="label">Email</div>
        <div className="relative">
          <input 
            className={`input ${emailTouched ? (isEmailValid ? 'input-valid' : 'input-invalid') : ''}`}
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)}
            onBlur={() => setEmailTouched(true)}
            required 
            disabled={submitting} 
          />
          {emailTouched && (
            <div className="validation-icon">
              {isEmailValid ? (
                <span className="validation-valid">✓</span>
              ) : (
                <span className="validation-invalid">✗</span>
              )}
            </div>
          )}
        </div>
      </div>
      <div>
        <div className="label">Password</div>
        <div className="relative">
          <input 
            className={`input ${passwordTouched ? (isPasswordValid ? 'input-valid' : 'input-invalid') : ''}`}
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)}
            onBlur={() => setPasswordTouched(true)}
            required 
            minLength={6} 
            disabled={submitting} 
          />
          {passwordTouched && (
            <div className="validation-icon">
              {isPasswordValid ? (
                <span className="validation-valid">✓</span>
              ) : (
                <span className="validation-invalid">✗</span>
              )}
            </div>
          )}
        </div>
        {passwordTouched && !isPasswordValid && (
          <div className="text-xs text-red-400 mt-1">Password must be at least 6 characters</div>
        )}
      </div>
      <button className="btn" type="submit" disabled={submitting}>
        {submitting ? 'Saving...' : 'Save & Continue'}
      </button>
    </form>
  )
}

function AboutMe({ user, formData, onChange }: { user: User | null; formData: Partial<User>; onChange: (d: Partial<User>) => void }) {
  const currentValue = formData.aboutMe !== undefined ? formData.aboutMe : (user?.aboutMe || '');
  const isValid = currentValue.trim().length > 0;

  const handleChange = (value: string) => {
    onChange({ aboutMe: value });
  };

  return (
    <div className="space-y-3">
      <div className="label">About Me * {isValid && <span className="text-green-400">✓</span>}</div>
      <textarea
        className={`input h-40 ${!isValid ? 'border-red-400' : 'border-green-400'}`}
        value={currentValue}
        onChange={e => handleChange(e.target.value)}
        placeholder="Tell us about yourself…"
      />
      <div className="text-xs text-white/60">Auto-saved as you type</div>
    </div>
  )
}

function Address({ user, formData, onChange }: { user: User | null; formData: Partial<User>; onChange: (d: Partial<User>) => void }) {
  const street = formData.street !== undefined ? formData.street : (user?.street || '');
  const city = formData.city !== undefined ? formData.city : (user?.city || '');
  const state = formData.state !== undefined ? formData.state : (user?.state || '');
  const zip = formData.zip !== undefined ? formData.zip : (user?.zip || '');

  const isStreetValid = street.trim().length > 0;
  const isCityValid = city.trim().length > 0;
  const isStateValid = state.trim().length > 0;
  const isZipValid = zip.trim().length > 0;

  const handleChange = (field: string, value: string) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-3">
      <div>
        <div className="label">Street * {isStreetValid && <span className="text-green-400">✓</span>}</div>
        <div className="relative">
          <input 
            className={`input ${street ? (isStreetValid ? 'input-valid' : 'input-invalid') : ''}`}
            value={street} 
            onChange={e => handleChange('street', e.target.value)} 
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="label">City * {isCityValid && <span className="text-green-400">✓</span>}</div>
          <div className="relative">
            <input 
              className={`input ${city ? (isCityValid ? 'input-valid' : 'input-invalid') : ''}`}
              value={city} 
              onChange={e => handleChange('city', e.target.value)} 
            />
          </div>
        </div>
        <div>
          <div className="label">State * {isStateValid && <span className="text-green-400">✓</span>}</div>
          <div className="relative">
            <input 
              className={`input ${state ? (isStateValid ? 'input-valid' : 'input-invalid') : ''}`}
              value={state} 
              onChange={e => handleChange('state', e.target.value)} 
            />
          </div>
        </div>
      </div>
      <div>
        <div className="label">Zip * {isZipValid && <span className="text-green-400">✓</span>}</div>
        <div className="relative">
          <input 
            className={`input ${zip ? (isZipValid ? 'input-valid' : 'input-invalid') : ''}`}
            value={zip} 
            onChange={e => handleChange('zip', e.target.value)} 
          />
        </div>
      </div>
      <div className="text-xs text-white/60">Auto-saved as you type</div>
    </div>
  )
}

function Birth({ user, formData, onChange }: { user: User | null; formData: Partial<User>; onChange: (d: Partial<User>) => void }) {
  const currentValue = formData.birthdate !== undefined ? formData.birthdate : (user?.birthdate || '');
  const isValid = currentValue.length > 0;

  const handleChange = (value: string) => {
    onChange({ birthdate: value });
  };

  return (
    <div className="space-y-3">
      <div>
        <div className="label">Birthdate * {isValid && <span className="text-green-400">✓</span>}</div>
        <div className="relative">
          <input 
            className={`input ${currentValue ? (isValid ? 'input-valid' : 'input-invalid') : ''}`}
            type="date" 
            value={currentValue} 
            onChange={e => handleChange(e.target.value)} 
          />
        </div>
      </div>
      <div className="text-xs text-white/60">Auto-saved as you type</div>
    </div>
  )
}
