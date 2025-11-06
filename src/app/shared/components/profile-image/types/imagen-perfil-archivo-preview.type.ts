import { SafeResourceUrl } from "@angular/platform-browser";

export type ImagenPerfileArchivoPreview = {
  file: File;
  url?: string | SafeResourceUrl; // <- actualiza esto
  nombre: string;
  tipo: string;
  extension: string;
  peso: string;
};
