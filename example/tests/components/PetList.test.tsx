import { render, waitFor } from "@testing-library/react";
import { PetList } from "../../src/components/PetList";
import { describe, expect, it } from "vitest";

describe("PetList", () => {
  it("renders a list of pets", async () => {
    const { container, findAllByTestId } = render(<PetList />);
    await waitFor(() => findAllByTestId('pet-list'))
    expect(container.querySelectorAll("li").length).toEqual(4);
  });
});
