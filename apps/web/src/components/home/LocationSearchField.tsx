"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  searchKakaoKeyword,
  type KakaoPlaceResult,
} from "@/lib/kakao/search-keyword";
import type { LocationData } from "@/types/location";

const SEARCH_DEBOUNCE_MS = 400;
const MIN_QUERY_LENGTH = 2;

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted"
    >
      {children}
    </label>
  );
}

function inputClassName() {
  return [
    "w-full rounded-xl border border-border bg-surface-elevated px-4 py-3.5",
    "text-base text-foreground placeholder:text-zinc-400",
    "outline-none transition-[border-color,box-shadow]",
    "focus:border-neon-yellow focus:shadow-[0_0_0_3px_var(--neon-yellow-glow)]",
  ].join(" ");
}

type LocationSearchFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  value: LocationData | null;
  onChange: (location: LocationData | null) => void;
};

export function LocationSearchField({
  id,
  label,
  placeholder,
  value,
  onChange,
}: LocationSearchFieldProps) {
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const skipDebounceRef = useRef(false);
  const [query, setQuery] = useState(value?.name ?? "");
  const [results, setResults] = useState<KakaoPlaceResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setQuery(value?.name ?? "");
  }, [value]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const runSearch = useCallback(async (searchQuery?: string) => {
    const keyword = (searchQuery ?? query).trim();
    if (!keyword || keyword.length < MIN_QUERY_LENGTH) {
      if (keyword && keyword.length < MIN_QUERY_LENGTH) {
        setError(`검색어를 ${MIN_QUERY_LENGTH}글자 이상 입력해주세요.`);
      }
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const places = await searchKakaoKeyword(keyword);
      setResults(places);
      setIsOpen(places.length > 0);

      if (places.length === 0) {
        setError("검색 결과가 없습니다.");
      }
    } catch (err) {
      setResults([]);
      setIsOpen(false);
      setError(
        err instanceof Error ? err.message : "장소 검색에 실패했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    if (skipDebounceRef.current) {
      skipDebounceRef.current = false;
      return;
    }

    const keyword = query.trim();
    if (!keyword) {
      setResults([]);
      setIsOpen(false);
      setError(null);
      return;
    }

    if (value && value.name === keyword) {
      return;
    }

    if (keyword.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = window.setTimeout(() => {
      void runSearch(keyword);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [query, value, runSearch]);

  const handleInputChange = (next: string) => {
    setQuery(next);
    setError(null);

    if (value && next !== value.name) {
      onChange(null);
    }
  };

  const handleSelect = (location: KakaoPlaceResult) => {
    skipDebounceRef.current = true;
    onChange({
      name: location.name,
      lat: location.lat,
      lng: location.lng,
    });
    setQuery(location.name);
    setResults([]);
    setIsOpen(false);
    setError(null);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      void runSearch();
    }
  };

  const displayValue = value?.name ?? query;

  return (
    <section ref={rootRef} className="relative">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="flex gap-2">
        <input
          id={id}
          name={id}
          type="search"
          value={displayValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={inputClassName()}
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-autocomplete="list"
        />
        <button
          type="button"
          onClick={() => void runSearch()}
          disabled={isLoading || query.trim().length < MIN_QUERY_LENGTH}
          className="shrink-0 rounded-xl border border-border bg-surface px-4 py-3.5 text-sm font-bold text-foreground transition-colors hover:border-zinc-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isLoading ? "…" : "검색"}
        </button>
      </div>

      {value ? (
        <p className="mt-1.5 text-xs text-neon-yellow">
          ✓ {value.name} 선택됨 ({value.lat.toFixed(5)}, {value.lng.toFixed(5)})
        </p>
      ) : null}

      {error ? (
        <p className="mt-1.5 text-xs text-neon-red" role="alert">
          {error}
        </p>
      ) : null}

      {isOpen && results.length > 0 ? (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute inset-x-0 top-full z-20 mt-1 max-h-64 overflow-y-auto rounded-xl border border-border bg-surface-elevated shadow-lg"
        >
          {results.map((place) => (
            <li
              key={`${place.name}-${place.lat}-${place.lng}`}
              role="option"
            >
              <button
                type="button"
                onClick={() => handleSelect(place)}
                className="flex w-full flex-col gap-0.5 border-b border-border px-4 py-3 text-left last:border-b-0 hover:bg-surface"
              >
                <span className="text-sm font-semibold text-foreground">
                  {place.name}
                </span>
                <span className="text-xs text-muted">{place.address}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
