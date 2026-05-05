import { useState, useEffect } from 'react';
import type { Character } from '../../types';
import { useEncounterStore } from '../../store/encounterStore';

interface Props {
  character: Character;
  className?: string;
}

const TYPE_RING: Record<string, string> = {
  pc: 'ring-verdant/50',
  npc: 'ring-amber/50',
  monster: 'ring-blood/50',
};

async function imageFileToDataUrl(file: File, maxPx = 400): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(maxPx / img.width, maxPx / img.height, 1);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.src = url;
  });
}

export function CharacterAvatar({ character, className = '' }: Props) {
  const updateCharacter = useEncounterStore((s) => s.updateCharacter);
  const [awaitingPaste, setAwaitingPaste] = useState(false);

  useEffect(() => {
    if (!awaitingPaste) return;

    const pasteHandler = async (e: ClipboardEvent) => {
      const items = Array.from(e.clipboardData?.items ?? []);
      const imageItem = items.find((i) => i.type.startsWith('image/'));
      if (!imageItem) return;
      e.preventDefault();
      const file = imageItem.getAsFile();
      if (!file) return;
      const dataUrl = await imageFileToDataUrl(file);
      updateCharacter(character.id, { imageUrl: dataUrl });
      setAwaitingPaste(false);
    };

    const cancelHandler = () => setAwaitingPaste(false);

    window.addEventListener('paste', pasteHandler);
    // cancel on next click anywhere
    const timer = setTimeout(() => window.addEventListener('click', cancelHandler), 100);

    return () => {
      window.removeEventListener('paste', pasteHandler);
      clearTimeout(timer);
      window.removeEventListener('click', cancelHandler);
    };
  }, [awaitingPaste, character.id, updateCharacter]);

  const ring = TYPE_RING[character.type] ?? 'ring-slate/30';

  return (
    <button
      onClick={(e) => { e.stopPropagation(); setAwaitingPaste(true); }}
      onContextMenu={(e) => {
        e.preventDefault();
        if (character.imageUrl) updateCharacter(character.id, { imageUrl: undefined });
      }}
      className={`relative flex-shrink-0 rounded overflow-hidden ring-1 transition-all ${ring} ${awaitingPaste ? 'ring-2 ring-amber/80 animate-pulse' : 'hover:ring-2'} ${className}`}
      title={character.imageUrl ? 'Click to replace · Right-click to remove' : 'Click then paste image (Ctrl+V)'}
    >
      {character.imageUrl ? (
        <img src={character.imageUrl} alt={character.name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-obsidian/60 flex items-center justify-center">
          {awaitingPaste ? (
            <span className="text-amber text-[7px] font-display tracking-wider uppercase leading-tight text-center px-0.5">
              Paste<br />Now
            </span>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-1/2 h-1/2 text-ash/25">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          )}
        </div>
      )}
    </button>
  );
}
