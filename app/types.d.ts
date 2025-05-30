/// <reference types="nativewind/types" />

declare module 'expo-router' {
  import type { LinkProps as OriginalLinkProps } from '@react-navigation/native';
  import type { ComponentProps } from 'react';

  export type LinkProps<T extends string> = Omit<
    OriginalLinkProps<T>,
    'to'
  > & {
    href: string;
  };

  export function Link<T extends string>(
    props: ComponentProps<typeof Link<T>>
  ): JSX.Element;

  export function useRouter(): {
    push: (href: string) => void;
    replace: (href: string) => void;
    back: () => void;
    canGoBack: () => boolean;
    setParams: (params: Record<string, string>) => void;
  };

  export function useSegments(): string[];

  export function useLocalSearchParams<T extends Record<string, string>>(): T;

  export function Stack(): JSX.Element;
  export function Slot(): JSX.Element;
  export function Tabs(): JSX.Element;
  export function Drawer(): JSX.Element;
}

declare const types: Record<string, never>;
export default types; 