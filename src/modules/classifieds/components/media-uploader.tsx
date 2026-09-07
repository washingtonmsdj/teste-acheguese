'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

type MediaItem = {
  id: string;
  storageKey: string;
  signedUrl: string | null;
  position: number;
};

type MediaUploaderProps = {
  classifiedId: string;
  ownerId: string;
  title: string;
  initialMedia: MediaItem[];
};

const mimeExtensions: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
};

const MAX_FILES = 10;
const MAX_BYTES = 8 * 1024 * 1024;

export function ClassifiedMediaUploader({
  classifiedId,
  ownerId,
  title,
  initialMedia,
}: MediaUploaderProps) {
  const router = useRouter();
  const [media, setMedia] = useState(
    initialMedia.slice().sort((a, b) => a.position - b.position),
  );
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function uploadSelected(files: FileList | null) {
    if (!files?.length || busy) return;

    const remaining = MAX_FILES - media.length;
    const selected = Array.from(files).slice(0, Math.max(remaining, 0));

    if (!selected.length) {
      setFeedback('Você já atingiu o limite de 10 imagens.');
      return;
    }

    setBusy(true);
    setFeedback(null);
    const supabase = createSupabaseBrowserClient();
    const nextMedia = [...media];

    try {
      for (const file of selected) {
        const extension = mimeExtensions[file.type];

        if (!extension) {
          throw new Error('Formato de imagem não permitido.');
        }

        if (file.size > MAX_BYTES) {
          throw new Error('Cada imagem pode ter no máximo 8 MB.');
        }

        const used = new Set(nextMedia.map((item) => item.position));
        let position: number | null = null;

        for (let index = 0; index < MAX_FILES; index += 1) {
          if (!used.has(index)) {
            position = index;
            break;
          }
        }

        if (position === null) break;

        const storageKey =
          `${ownerId}/${classifiedId}/${crypto.randomUUID()}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from('classified-media')
          .upload(storageKey, file, {
            cacheControl: '3600',
            contentType: file.type,
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data: inserted, error: insertError } = await supabase
          .from('classified_media')
          .insert({
            classified_id: classifiedId,
            storage_key: storageKey,
            alt: title,
            position,
          })
          .select('id, storage_key, position')
          .single();

        if (insertError) {
          await supabase.storage.from('classified-media').remove([storageKey]);
          throw insertError;
        }

        const { data: signed } = await supabase.storage
          .from('classified-media')
          .createSignedUrl(storageKey, 3600);

        nextMedia.push({
          id: inserted.id,
          storageKey: inserted.storage_key,
          signedUrl: signed?.signedUrl ?? null,
          position: inserted.position,
        });
      }

      nextMedia.sort((a, b) => a.position - b.position);
      setMedia(nextMedia);
      setFeedback('Imagens atualizadas.');
      router.refresh();
    } catch (error) {
      setFeedback(
        error instanceof Error
          ? error.message
          : 'Não foi possível enviar a imagem.',
      );
    } finally {
      setBusy(false);
    }
  }

  async function removeMedia(item: MediaItem) {
    if (busy) return;

    setBusy(true);
    setFeedback(null);
    const supabase = createSupabaseBrowserClient();

    try {
      const { error: rowError } = await supabase
        .from('classified_media')
        .delete()
        .eq('id', item.id)
        .eq('classified_id', classifiedId);

      if (rowError) throw rowError;

      const { error: storageError } = await supabase.storage
        .from('classified-media')
        .remove([item.storageKey]);

      setMedia((current) => current.filter((entry) => entry.id !== item.id));
      setFeedback(
        storageError
          ? 'Imagem removida do anúncio; o arquivo será limpo depois.'
          : 'Imagem removida.',
      );
      router.refresh();
    } catch (error) {
      setFeedback(
        error instanceof Error
          ? error.message
          : 'Não foi possível remover a imagem.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mediaEditor">
      <div className="mediaEditorHeader">
        <div>
          <h2>Fotos</h2>
          <p>Adicione de 1 a 10 imagens. JPG, PNG, WebP ou AVIF, até 8 MB cada.</p>
        </div>
        <span>{media.length}/10</span>
      </div>

      {media.length > 0 && (
        <div className="mediaGrid">
          {media.map((item) => (
            <article className="mediaCard" key={item.id}>
              {item.signedUrl ? (
                <Image
                  src={item.signedUrl}
                  alt={title}
                  fill
                  sizes="(min-width: 720px) 220px, 45vw"
                />
              ) : (
                <div className="mediaPlaceholder">Imagem</div>
              )}
              <button
                type="button"
                className="mediaRemove"
                onClick={() => removeMedia(item)}
                disabled={busy}
              >
                Remover
              </button>
            </article>
          ))}
        </div>
      )}

      <label className="mediaUploadButton">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          disabled={busy || media.length >= MAX_FILES}
          onChange={(event) => {
            void uploadSelected(event.target.files);
            event.currentTarget.value = '';
          }}
        />
        <span>{busy ? 'Processando…' : 'Adicionar fotos'}</span>
      </label>

      {feedback && <p className="mediaFeedback">{feedback}</p>}
    </section>
  );
}
