/// <reference types="astro/client" />
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../.astro/types.d.ts" />

declare namespace App {
  interface Locals {
    session: import("lucia").Session | null;
    user: import("lucia").User | null;
  }
}
