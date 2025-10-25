'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

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

      <Input
        label="Titre (FR) *"
        required
        value={formData.title_fr}
        onChange={(e) => setFormData({ ...formData, title_fr: e.target.value })}
        size="lg"
        className="bg-[var(--color-pine)]/50 placeholder:text-[var(--color-cream)]/30"
      />

      <Input
        label="Titre (EN) *"
        required
        value={formData.title_en}
        onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
        size="lg"
        className="bg-[var(--color-pine)]/50 placeholder:text-[var(--color-cream)]/30"
      />

      <Input
        label="Sous-titre (FR)"
        value={formData.subtitle_fr}
        onChange={(e) => setFormData({ ...formData, subtitle_fr: e.target.value })}
        size="lg"
        className="bg-[var(--color-pine)]/50 placeholder:text-[var(--color-cream)]/30"
      />

      <Input
        label="Sous-titre (EN)"
        value={formData.subtitle_en}
        onChange={(e) => setFormData({ ...formData, subtitle_en: e.target.value })}
        size="lg"
        className="bg-[var(--color-pine)]/50 placeholder:text-[var(--color-cream)]/30"
      />

      <Textarea
        label="Description (FR)"
        rows={6}
        value={formData.description_fr}
        onChange={(e) => setFormData({ ...formData, description_fr: e.target.value })}
        size="lg"
        className="bg-[var(--color-pine)]/50 placeholder:text-[var(--color-cream)]/30"
      />

      <Textarea
        label="Description (EN)"
        rows={6}
        value={formData.description_en}
        onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
        size="lg"
        className="bg-[var(--color-pine)]/50 placeholder:text-[var(--color-cream)]/30"
      />

      <Input
        label="Date"
        type="date"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        className="bg-[var(--color-pine)]/50"
      />

      <Input
        label="Slug (URL) *"
        required
        value={formData.slug}
        onChange={(e) =>
          setFormData({
            ...formData,
            slug: e.target.value
              .toLowerCase()
              .replace(/\s+/g, '-')
              .replace(/[^a-z0-9-]/g, ''),
          })
        }
        placeholder="mon-projet"
        className="bg-[var(--color-pine)]/50 placeholder:text-[var(--color-cream)]/30"
      />
      <p className="text-[var(--color-cream)]/50 text-sm -mt-2">
        Utilisé dans l&apos;URL : /portfolio/{formData.slug || 'mon-projet'}
      </p>

      <Input
        label="Ordre d'affichage"
        type="number"
        value={formData.order}
        onChange={(e) => setFormData({ ...formData, order: Number.parseInt(e.target.value, 10) || 0 })}
        className="bg-[var(--color-pine)]/50"
      />

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
                  <Input
                    label="Texte alternatif"
                    placeholder="Texte alternatif"
                    size="sm"
                    value={img.alt_text || ''}
                    onChange={(e) => {
                      const newImages = [...images];
                      newImages[index].alt_text = e.target.value;
                      setImages(newImages);
                    }}
                    wrapperClassName="mt-2"
                    labelClassName="text-[var(--color-cream)]/70 text-xs font-medium"
                    className="bg-[var(--color-pine)]/30 text-sm"
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

      <div className="flex items-center justify-between gap-4 pt-6 border-t border-[var(--color-cream)]/20 flex-wrap">
        <div className="flex flex-wrap gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            liftOnHover={false}
            onClick={() => router.back()}
          >
            Annuler
          </Button>
        </div>

        {project?.id && (
          <Button
            type="button"
            variant="danger"
            size="sm"
            liftOnHover={false}
            onClick={handleDelete}
            disabled={loading}
            className="whitespace-nowrap"
          >
            Supprimer le projet
          </Button>
        )}
      </div>
    </form>
  );
}
