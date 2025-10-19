# Animations Library

Collection d'effets d'animation réutilisables pour Studio UB.

## CRTEffect

Un composant wrapper qui applique un effet de télévision CRT vintage à son contenu (scanlines, bruit VCR, effet neige, vignette).

### Usage

```tsx
import { CRTEffect } from '@/lib/animations';

// Usage basique (tous les effets activés par défaut)
<CRTEffect>
  <div>Contenu avec effet CRT</div>
</CRTEffect>

// Avec effets personnalisés
<CRTEffect
  effects={{
    scanlines: true,    // Lignes de balayage horizontales
    vignette: true,     // Assombrissement des bords
    vcr: true,          // Bruit de tracking VCR
    snow: true,         // Effet neige statique
    wobble: true,       // Léger tremblement vertical
  }}
  intensity={{
    vcrOpacity: 0.6,    // Opacité du bruit VCR (0-1)
    snowOpacity: 0.2,   // Opacité de la neige (0-1)
    vcrTracking: 220,   // Position du bruit de tracking (0-400)
    vcrTapeAge: 70,     // Intensité du bruit (âge de la bande)
    vcrBlur: 1,         // Flou du bruit VCR (pixels)
    vcrFps: 60,         // FPS de l'animation VCR
  }}
  className="w-full h-full"
>
  <img src="/image.jpg" alt="Image vintage" />
</CRTEffect>
```

### Props

#### `children` (required)
Le contenu à afficher avec l'effet CRT. Peut être n'importe quel élément React.

#### `className` (optional)
Classes CSS supplémentaires pour le conteneur.

#### `effects` (optional)
Objet permettant d'activer/désactiver les différents effets:
- `scanlines` (default: true): Lignes de balayage horizontales
- `vignette` (default: true): Assombrissement des bords style CRT
- `vcr` (default: true): Bruit de tracking VCR
- `snow` (default: true): Effet neige statique
- `wobble` (default: true): Léger tremblement vertical

#### `intensity` (optional)
Objet permettant de contrôler l'intensité des effets:
- `vcrOpacity` (default: 0.6): Opacité du bruit VCR (0-1)
- `snowOpacity` (default: 0.2): Opacité de la neige (0-1)
- `vcrTracking` (default: 220): Position du bruit de tracking (0-400)
- `vcrTapeAge` (default: 70): Nombre d'artefacts de bruit (1-100)
- `vcrBlur` (default: 1): Flou du bruit VCR en pixels
- `vcrFps` (default: 60): Images par seconde de l'animation VCR

### Exemples

#### Effet CRT complet pour une image
```tsx
import { CRTEffect } from '@/lib/animations';
import Image from 'next/image';

export default function VintageGallery() {
  return (
    <CRTEffect className="w-96 h-96">
      <Image
        src="/photos/vintage.jpg"
        alt="Photo vintage"
        fill
        className="object-cover"
      />
    </CRTEffect>
  );
}
```

#### Effet CRT sur un formulaire (comme la page de connexion)
```tsx
import { CRTEffect } from '@/lib/animations';

export default function SignInForm() {
  return (
    <CRTEffect
      effects={{
        scanlines: true,
        vcr: true,
        snow: false,  // Pas de neige pour plus de lisibilité
        vignette: true,
        wobble: false,
      }}
      intensity={{
        vcrOpacity: 0.4,  // Bruit moins intense
        vcrTracking: 250,
      }}
    >
      <form>
        {/* Contenu du formulaire */}
      </form>
    </CRTEffect>
  );
}
```

#### Effet CRT léger pour du texte
```tsx
import { CRTEffect } from '@/lib/animations';

export default function VintageText() {
  return (
    <CRTEffect
      effects={{
        scanlines: true,
        vcr: false,
        snow: false,
        vignette: false,
        wobble: true,
      }}
    >
      <h1 className="text-4xl">Texte avec effet CRT</h1>
    </CRTEffect>
  );
}
```

### Notes techniques

- Le composant utilise des canvas HTML5 pour les effets animés (VCR et neige)
- Les canvas sont automatiquement redimensionnés lors du resize de la fenêtre
- Les animations utilisent `requestAnimationFrame` pour des performances optimales
- Tous les éléments d'effet ont `pointer-events: none` pour ne pas interférer avec les interactions
- L'effet est entièrement responsive et s'adapte à la taille de son conteneur
- Compatible avec tous les types de contenu (images, texte, formulaires, composants complexes)
