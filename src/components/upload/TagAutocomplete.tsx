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

  function selectTag(tag: string) {
    const prefix = tokens.length > 1 ? `${tokens.slice(0, -1).join(",")},` : "";
    const leadingWhitespace = currentToken.match(/^\s*/)?.[0] ?? "";
    onChange(`${prefix}${leadingWhitespace}${tag}`);
    setIsOpen(false);
  }

  return (
    <div className="tag-autocomplete">
      <label htmlFor={inputId}>{label}</label>
      <input
        aria-autocomplete="list"
        aria-controls={showSuggestions ? listboxId : undefined}
        aria-expanded={showSuggestions}
        id={inputId}
        name="tags"
        onBlur={() => setIsOpen(false)}
        onChange={(event) => {
          onChange(event.target.value);
          setIsOpen(true);
        }}
        placeholder="wedding, portrait, outdoor..."
        role="combobox"
        type="text"
        value={value}
      />
      {showSuggestions ? (
        <ul className="tag-suggestions" id={listboxId} role="listbox">
          {suggestions.map((tag) => (
            <li
              key={tag}
              onClick={() => selectTag(tag)}
              onMouseDown={(event) => event.preventDefault()}
              role="option"
              aria-selected={false}
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}