"use client";

import { useId, useState } from "react";

type TagAutocompleteProps = {
  availableTags: readonly string[];
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function TagAutocomplete({ availableTags, label, value, onChange }: TagAutocompleteProps) {
  const inputId = useId();
  const listboxId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [activeOptionIndex, setActiveOptionIndex] = useState<number | null>(null);
  const tokens = value.split(",");
  const currentToken = tokens.at(-1) ?? "";
  const query = currentToken.trim().toLowerCase();
  const selectedTags = new Set(tokens.slice(0, -1).map((tag) => tag.trim().toLowerCase()));
  const suggestions = query
    ? availableTags.filter((tag) => {
        const normalizedTag = tag.toLowerCase();
        return normalizedTag.startsWith(query) && !selectedTags.has(normalizedTag);
      })
    : [];
  const showSuggestions = isOpen && suggestions.length > 0;
  const activeOptionId = showSuggestions && activeOptionIndex !== null && activeOptionIndex < suggestions.length
    ? `${listboxId}-option-${activeOptionIndex}`
    : undefined;

  function selectTag(tag: string) {
    const prefix = tokens.length > 1 ? `${tokens.slice(0, -1).join(",")},` : "";
    const leadingWhitespace = currentToken.match(/^\s*/)?.[0] ?? "";
    onChange(`${prefix}${leadingWhitespace}${tag}`);
    setIsOpen(false);
    setActiveOptionIndex(null);
  }

  return (
    <div className="tag-autocomplete">
      <label htmlFor={inputId}>{label}</label>
      <input
        aria-autocomplete="list"
        aria-activedescendant={activeOptionId}
        aria-controls={showSuggestions ? listboxId : undefined}
        aria-expanded={showSuggestions}
        id={inputId}
        name="tags"
        onBlur={() => {
          setIsOpen(false);
          setActiveOptionIndex(null);
        }}
        onChange={(event) => {
          onChange(event.target.value);
          setIsOpen(true);
          setActiveOptionIndex(null);
        }}
        onKeyDown={(event) => {
          if (!showSuggestions) return;

          if (event.key === "ArrowDown") {
            event.preventDefault();
            setActiveOptionIndex((current) =>
              current === null ? 0 : Math.min(current + 1, suggestions.length - 1),
            );
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActiveOptionIndex((current) =>
              current === null ? suggestions.length - 1 : Math.max(current - 1, 0),
            );
          } else if (
            event.key === "Enter" &&
            activeOptionIndex !== null &&
            activeOptionIndex < suggestions.length
          ) {
            event.preventDefault();
            selectTag(suggestions[activeOptionIndex]);
          } else if (event.key === "Escape") {
            event.preventDefault();
            setIsOpen(false);
            setActiveOptionIndex(null);
          }
        }}
        placeholder="wedding, portrait, outdoor..."
        role="combobox"
        type="text"
        value={value}
      />
      {showSuggestions ? (
        <ul className="tag-suggestions" id={listboxId} role="listbox">
          {suggestions.map((tag, index) => (
            <li
              aria-selected={activeOptionIndex === index}
              id={`${listboxId}-option-${index}`}
              key={tag}
              onClick={() => selectTag(tag)}
              onMouseDown={(event) => event.preventDefault()}
              role="option"
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}