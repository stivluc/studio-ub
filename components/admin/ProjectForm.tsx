'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

type Project = {
  id?: string;
  title_fr: string;
  title_en: string;
  subtitle_fr?: string;
  subtitle_en?: string;
  description_fr?: string;
  description_en?: string;
  date?: string;
  slug: string;
  order?: number;
  project_images?: Array<{
    id: string;
    url: string;
    alt_text?: string;
    order: number;
  }>;
};

type ProjectFormProps = {
  project?: Project;
};

export default function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [formData, setFormData] = useState<Project>({
    title_fr: project?.title_fr || '',
    title_en: project?.title_en || '',
    subtitle_fr: project?.subtitle_fr || '',
    subtitle_en: project?.subtitle_en || '',
    description_fr: project?.description_fr || '',
    description_en: project?.description_en || '',
    date: project?.date || '',
    slug: project?.slug || '',
    order: project?.order || 0,
  });

  const [images, setImages] = useState<Array<{ url: string; alt_text?: string; id?: string }>>(
    project?.project_images?.sort((a, b) => a.order - b.order) || []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (project?.id) {
        // Mise à jour
        const { error: updateError } = await supabase
          .from('projects')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', project.id);

        if (updateError) throw updateError;

        // Mise à jour des images
        await updateProjectImages(project.id);

        router.push('/admin/portfolio');
        router.refresh();
      } else {
        // Création
        const { data: newProject, error: insertError } = await supabase
          .from('projects')
          .insert([formData])
          .select()
          .single();

        if (insertError) throw insertError;

        // Ajout des images
        if (newProject && images.length > 0) {
          await updateProjectImages(newProject.id);
        }

        router.push('/admin/portfolio');
        router.refresh();
      }
    } catch (err) {
      console.error('Error saving project:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const updateProjectImages = async (projectId: string) => {
    // Supprimer les anciennes images
    if (project?.id) {
      await supabase.from('project_images').delete().eq('project_id', projectId);
    }

    // Insérer les nouvelles
    if (images.length > 0) {
      const imagesToInsert = images.map((img, index) => ({
        project_id: projectId,
        url: img.url,
        alt_text: img.alt_text || null,
        order: index,
      }));

      const { error: imageError } = await supabase
        .from('project_images')
        .insert(imagesToInsert);

      if (imageError) throw imageError;
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    setError(null);

    try {
      const uploadedUrls: Array<{ url: string; alt_text?: string }> = [];

      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from('project-images').getPublicUrl(filePath);

        uploadedUrls.push({ url: publicUrl });
      }

      setImages([...images, ...uploadedUrls]);
    } catch (err) {
      console.error('Error uploading images:', err);
      setError(err instanceof Error ? err.message : "Erreur lors de l'upload des images");
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = async (index: number) => {
    const imageToRemove = images[index];

    // Si l'image a un ID, elle existe déjà en base
    if (imageToRemove.id && project?.id) {
      try {
        await supabase
          .from('project_images')
          .delete()
          .eq('id', imageToRemove.id);
      } catch (err) {
        console.error('Error deleting image:', err);
      }
    }

    // Supprimer du storage si possible
    try {
      const urlParts = imageToRemove.url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      await supabase.storage.from('project-images').remove([fileName]);
    } catch (err) {
      console.error('Error deleting from storage:', err);
    }

    setImages(images.filter((_, i) => i !== index));
  };

  const handleDelete = async () => {
    if (!project?.id) return;
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return;

    setLoading(true);
    try {
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', project.id);

      if (deleteError) throw deleteError;

      router.push('/admin/portfolio');
      router.refresh();
    } catch (err) {
      console.error('Error deleting project:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Titre FR */}
      <div>
        <label className="block text-[var(--color-cream)] font-medium mb-2">
          Titre (FR) *
        </label>
        <input
          type="text"
          required
          value={formData.title_fr}
          onChange={(e) => setFormData({ ...formData, title_fr: e.target.value })}
          className="w-full bg-[var(--color-dark)]/50 border border-[var(--color-cream)]/20 rounded-xl px-4 py-3 text-[var(--color-cream)] placeholder:text-[var(--color-cream)]/30 focus:outline-none focus:border-[var(--color-cream)]/60 focus:ring-2 focus:ring-[var(--color-cream)]/20 transition-all duration-200"
        />
      </div>

      {/* Titre EN */}
      <div>
        <label className="block text-[var(--color-cream)] font-medium mb-2">
          Titre (EN) *
        </label>
        <input
          type="text"
          required
          value={formData.title_en}
          onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
          className="w-full bg-[var(--color-dark)]/50 border border-[var(--color-cream)]/20 rounded-xl px-4 py-3 text-[var(--color-cream)] placeholder:text-[var(--color-cream)]/30 focus:outline-none focus:border-[var(--color-cream)]/60 focus:ring-2 focus:ring-[var(--color-cream)]/20 transition-all duration-200"
        />
      </div>

      {/* Sous-titre FR */}
      <div>
        <label className="block text-[var(--color-cream)] font-medium mb-2">
          Sous-titre (FR)
        </label>
        <input
          type="text"
          value={formData.subtitle_fr}
          onChange={(e) => setFormData({ ...formData, subtitle_fr: e.target.value })}
          className="w-full bg-[var(--color-dark)]/50 border border-[var(--color-cream)]/20 rounded-xl px-4 py-3 text-[var(--color-cream)] placeholder:text-[var(--color-cream)]/30 focus:outline-none focus:border-[var(--color-cream)]/60 focus:ring-2 focus:ring-[var(--color-cream)]/20 transition-all duration-200"
        />
      </div>

      {/* Sous-titre EN */}
      <div>
        <label className="block text-[var(--color-cream)] font-medium mb-2">
          Sous-titre (EN)
        </label>
        <input
          type="text"
          value={formData.subtitle_en}
          onChange={(e) => setFormData({ ...formData, subtitle_en: e.target.value })}
          className="w-full bg-[var(--color-dark)]/50 border border-[var(--color-cream)]/20 rounded-xl px-4 py-3 text-[var(--color-cream)] placeholder:text-[var(--color-cream)]/30 focus:outline-none focus:border-[var(--color-cream)]/60 focus:ring-2 focus:ring-[var(--color-cream)]/20 transition-all duration-200"
        />
      </div>

      {/* Description FR */}
      <div>
        <label className="block text-[var(--color-cream)] font-medium mb-2">
          Description (FR)
        </label>
        <textarea
          rows={6}
          value={formData.description_fr}
          onChange={(e) => setFormData({ ...formData, description_fr: e.target.value })}
          className="w-full bg-[var(--color-dark)]/50 border border-[var(--color-cream)]/20 rounded-xl px-4 py-3 text-[var(--color-cream)] placeholder:text-[var(--color-cream)]/30 focus:outline-none focus:border-[var(--color-cream)]/60 focus:ring-2 focus:ring-[var(--color-cream)]/20 transition-all duration-200"
        />
      </div>

      {/* Description EN */}
      <div>
        <label className="block text-[var(--color-cream)] font-medium mb-2">
          Description (EN)
        </label>
        <textarea
          rows={6}
          value={formData.description_en}
          onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
          className="w-full bg-[var(--color-dark)]/50 border border-[var(--color-cream)]/20 rounded-xl px-4 py-3 text-[var(--color-cream)] placeholder:text-[var(--color-cream)]/30 focus:outline-none focus:border-[var(--color-cream)]/60 focus:ring-2 focus:ring-[var(--color-cream)]/20 transition-all duration-200"
        />
      </div>

      {/* Date */}
      <div>
        <label className="block text-[var(--color-cream)] font-medium mb-2">
          Date
        </label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="w-full bg-[var(--color-dark)]/50 border border-[var(--color-cream)]/20 rounded-xl px-4 py-3 text-[var(--color-cream)] placeholder:text-[var(--color-cream)]/30 focus:outline-none focus:border-[var(--color-cream)]/60 focus:ring-2 focus:ring-[var(--color-cream)]/20 transition-all duration-200"
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-[var(--color-cream)] font-medium mb-2">
          Slug (URL) *
        </label>
        <input
          type="text"
          required
          value={formData.slug}
          onChange={(e) =>
            setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })
          }
          placeholder="mon-projet"
          className="w-full bg-[var(--color-dark)]/50 border border-[var(--color-cream)]/20 rounded-xl px-4 py-3 text-[var(--color-cream)] placeholder:text-[var(--color-cream)]/30 focus:outline-none focus:border-[var(--color-cream)]/60 focus:ring-2 focus:ring-[var(--color-cream)]/20 transition-all duration-200"
        />
        <p className="text-[var(--color-cream)]/50 text-sm mt-1">
          Utilisé dans l'URL : /portfolio/{formData.slug || 'mon-projet'}
        </p>
      </div>

      {/* Ordre */}
      <div>
        <label className="block text-[var(--color-cream)] font-medium mb-2">
          Ordre d'affichage
        </label>
        <input
          type="number"
          value={formData.order}
          onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
          className="w-full bg-[var(--color-dark)]/50 border border-[var(--color-cream)]/20 rounded-xl px-4 py-3 text-[var(--color-cream)] placeholder:text-[var(--color-cream)]/30 focus:outline-none focus:border-[var(--color-cream)]/60 focus:ring-2 focus:ring-[var(--color-cream)]/20 transition-all duration-200"
        />
      </div>

      {/* Images */}
      <div>
        <label className="block text-[var(--color-cream)] font-medium mb-2">Images</label>
        <div className="space-y-4">
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <div className="relative h-40 bg-[var(--color-dark)] rounded-lg overflow-hidden">
                    <Image src={img.url} alt={img.alt_text || ''} fill className="object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                  <input
                    type="text"
                    placeholder="Texte alternatif"
                    value={img.alt_text || ''}
                    onChange={(e) => {
                      const newImages = [...images];
                      newImages[index].alt_text = e.target.value;
                      setImages(newImages);
                    }}
                    className="w-full mt-2 bg-[var(--color-pine)]/30 border border-[var(--color-cream)]/20 rounded px-2 py-1 text-[var(--color-cream)] text-sm focus:outline-none focus:border-[var(--color-cream)]"
                  />
                </div>
              ))}
            </div>
          )}
          <div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImages}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="inline-block bg-[var(--color-cream)]/10 border border-[var(--color-cream)]/30 text-[var(--color-cream)] px-6 py-3 rounded-lg cursor-pointer hover:bg-[var(--color-cream)]/20 transition-colors"
            >
              {uploadingImages ? 'Upload en cours...' : '+ Ajouter des images'}
            </label>
          </div>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex items-center justify-between pt-6 border-t border-[var(--color-cream)]/20">
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-[var(--color-cream)] text-[var(--color-pine)] px-8 py-3 rounded-lg font-medium hover:bg-[var(--color-cream)]/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-[var(--color-pine)]/30 text-[var(--color-cream)] px-8 py-3 rounded-lg font-medium hover:bg-[var(--color-pine)]/50 transition-colors"
          >
            Annuler
          </button>
        </div>

        {project?.id && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="text-red-500 hover:text-red-400 font-medium transition-colors disabled:opacity-50"
          >
            Supprimer le projet
          </button>
        )}
      </div>
    </form>
  );
}
