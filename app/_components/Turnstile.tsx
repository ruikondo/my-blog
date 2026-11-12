"use client";

import Script from "next/script";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export type TurnstileHandle = { reset: () => void };

// Cloudflare Turnstile ウィジェット。フォーム内に置くと、
// 認証完了時に hidden input「cf-turnstile-response」へトークンが入る。
const Turnstile = forwardRef<TurnstileHandle, { siteKey: string }>(
  function Turnstile({ siteKey }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetId = useRef<string | null>(null);
    const [scriptReady, setScriptReady] = useState(
      () => typeof window !== "undefined" && !!window.turnstile,
    );

    const render = useCallback(() => {
      if (!containerRef.current || !window.turnstile || widgetId.current) return;
      widgetId.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme: "dark",
        language: "ja",
      });
    }, [siteKey]);

    useEffect(() => {
      if (scriptReady) render();
      return () => {
        if (widgetId.current && window.turnstile) {
          window.turnstile.remove(widgetId.current);
          widgetId.current = null;
        }
      };
    }, [scriptReady, render]);

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (widgetId.current && window.turnstile) {
          window.turnstile.reset(widgetId.current);
        }
      },
    }));

    return (
      <>
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onReady={() => setScriptReady(true)}
        />
        <div ref={containerRef} className="min-h-[65px]" />
      </>
    );
  },
);

export default Turnstile;
