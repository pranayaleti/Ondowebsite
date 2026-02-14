import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { companyInfo } from "../constants/companyInfo";

const SCRIPT_ID = "calendly-inline-widget-js";
const SCRIPT_SRC = "https://assets.calendly.com/assets/external/widget.js";

const defaultEmbedUrl = companyInfo.calendlyEmbedUrl || companyInfo.calendlyUrl;

/**
 * Calendly inline embed. Use an event-type URL (e.g. .../30min) so the calendar and time slots show.
 */
const CalendlyEmbed = ({
  url = defaultEmbedUrl,
  utmParams = {},
  height = 700,
  className = "",
  title = "Schedule time with our team",
  description = "Pick a slot without leaving this page.",
}) => {
  const containerRef = useRef(null);
  const [scriptReady, setScriptReady] = useState(false);

  const widgetUrl = useMemo(() => {
    try {
      const [base, query] = url.split("?");
      const search = new URLSearchParams(query || "");

      Object.entries(utmParams).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        const stringValue = `${value}`.trim();
        if (stringValue) {
          search.set(key, stringValue);
        }
      });

      const qs = search.toString();
      return `${base}${qs ? `?${qs}` : ""}`;
    } catch (error) {
      // Fallback to provided URL if parsing fails
      return url;
    }
  }, [url, utmParams]);

  const initWidget = useCallback(() => {
    if (typeof window === "undefined") return;
    if (!window.Calendly || !containerRef.current) return;

    const parent = containerRef.current;
    parent.innerHTML = "";

    // Defer so the container has layout (min-width/height); avoids blank calendar
    const schedule = window.requestAnimationFrame || ((fn) => setTimeout(fn, 0));
    schedule(() => {
      window.Calendly.initInlineWidget({
        url: widgetUrl,
        parentElement: parent,
        prefill: {},
        utm: {},
        textColor: "#0f172a",
        color: "#f97316",
      });
    });
  }, [widgetUrl]);

  const markScriptReady = useCallback(() => setScriptReady(true), []);

  const loadScript = useCallback(() => {
    if (typeof window === "undefined" || scriptReady) return;

    // If Calendly already loaded, mark ready immediately
    if (window.Calendly) {
      setScriptReady(true);
      return;
    }

    // If script tag exists, wait for it to finish loading
    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      existing.addEventListener("load", markScriptReady, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = markScriptReady;
    document.body.appendChild(script);
  }, [markScriptReady, scriptReady]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const node = containerRef.current;
    if (!node) return;

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            loadScript();
            observer.disconnect();
          }
        },
        { rootMargin: "200px 0px" }
      );
      observer.observe(node);
      return () => observer.disconnect();
    }
    loadScript();
  }, [loadScript]);

  useEffect(() => {
    if (scriptReady) {
      initWidget();
    }
  }, [scriptReady, initWidget]);

  return (
    <div
      className={`rounded-2xl border border-neutral-800 bg-neutral-900/80 p-4 shadow-lg shadow-orange-500/10 ${className}`}
    >
      <div className="mb-3">
        <p className="text-lg font-semibold text-white">{title}</p>
        <p className="text-sm text-gray-400">{description}</p>
      </div>

      <div className="relative" style={{ minWidth: 320 }}>
        <div
          ref={containerRef}
          className="w-full rounded-xl bg-white"
          style={{ minWidth: 320, height }}
          aria-label="Calendly scheduler"
        />

        {!scriptReady && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-neutral-900/70">
            <div className="text-center">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-orange-500 border-t-transparent mx-auto mb-3" />
              <p className="text-sm text-gray-300">Loading availability…</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendlyEmbed;
