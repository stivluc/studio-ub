'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

type ProfileUpdateFormProps = {
  firstName: string;
};

export default function ProfileUpdateForm({ firstName: initialFirstName }: ProfileUpdateFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState(initialFirstName);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const supabase = createClient();

      // Mise à jour des métadonnées de l'utilisateur
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          first_name: firstName,
        },
      });

      if (updateError) throw updateError;

      setSuccess(true);
      router.refresh();

      // Réinitialiser le message de succès après 3 secondes
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-xl">
          Profil mis à jour avec succès
        </div>
      )}

      <Input
        label="Prénom"
        type="text"
        required
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="Votre prénom"
      />

      <Button type="submit" disabled={loading}>
        {loading ? 'Mise à jour...' : 'Mettre à jour le profil'}
      </Button>
    </form>
  );
}
