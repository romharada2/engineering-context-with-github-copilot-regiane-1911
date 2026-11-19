import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TagAutocomplete } from "@/components/upload/TagAutocomplete";

const availableTags = ["portrait", "wedding", "wildlife"];

function ControlledTagAutocomplete() {
  const [value, setValue] = useState("");

  return (
    <TagAutocomplete
      availableTags={availableTags}
      label="Tags"
      onChange={setValue}   
      value={value}
    />
  );
}

describe("tag autocomplete", () => {
  it("suggests and selects a tag after a comma, ignoring query case", async () => {
    const user = userEvent.setup();
    render(<ControlledTagAutocomplete />);

    const input = screen.getByRole("combobox", { name: "Tags" });
    await user.type(input, "portrait, WI");

    await user.click(screen.getByRole("option", { name: "wildlife" }));

    expect(input).toHaveValue("portrait, wildlife");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("closes the suggestion list when the query has no matches", async () => {
    const user = userEvent.setup();
    render(<ControlledTagAutocomplete />);

    const input = screen.getByRole("combobox", { name: "Tags" });
    await user.type(input, "w");

    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getAllByRole("option").length).toBeGreaterThan(0);

    await user.type(input, "zzz");

    expect(input).toHaveValue("wzzz");
    expect(screen.queryByRole("option")).not.toBeInTheDocument();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});