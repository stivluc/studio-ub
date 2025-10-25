'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function PasswordChangeForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Validation
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) throw updateError;

      setSuccess(true);
      setPassword('');
      setConfirmPassword('');

      // Réinitialiser le message de succès après 3 secondes
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating password:', err);
      setError(
        err instanceof Error ? err.message : 'Erreur lors de la mise à jour du mot de passe'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded">
          Mot de passe mis à jour avec succès
        </div>
      )}

      <div>
        <label className="block text-[var(--color-cream)] font-medium mb-2">
          Nouveau mot de passe
        </label>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-[var(--color-pine)]/30 border border-[var(--color-cream)]/20 rounded-lg px-4 py-3 text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-cream)]"
          placeholder="Minimum 6 caractères"
        />
      </div>

      <div>
        <label className="block text-[var(--color-cream)] font-medium mb-2">
          Confirmer le mot de passe
        </label>
        <input
          type="password"
          required
          minLength={6}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full bg-[var(--color-pine)]/30 border border-[var(--color-cream)]/20 rounded-lg px-4 py-3 text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-cream)]"
          placeholder="Confirmez le nouveau mot de passe"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-[var(--color-cream)] text-[var(--color-pine)] px-6 py-3 rounded-lg font-medium hover:bg-[var(--color-cream)]/90 transition-colors disabled:opacity-50"
      >
        {loading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
      </button>
    </form>
  );
}
