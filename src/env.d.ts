/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare global {
  interface Window {
    HSStaticMethods?: {
      autoInit: (collection?: string[]) => void;
    };
  }
}

export {};
