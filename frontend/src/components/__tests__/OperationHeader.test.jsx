import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OperationsHeader from "../OperationHeader";

vi.mock("../OperationModal", () => ({
  default: ({ onClose, onCreated }) => (
    <div data-testid="modal">
      <button onClick={onClose}>Close</button>
      <button onClick={() => onCreated({ id: 99, label: "Test" })}>Save</button>
    </div>
  ),
}));

beforeEach(() => vi.clearAllMocks());

describe("OperationsHeader", () => {
  it("affiche le titre et le sous-titre", () => {
    render(<OperationsHeader />);
    expect(screen.getByText("Operations")).toBeInTheDocument();
    expect(screen.getByText(/track every cent/i)).toBeInTheDocument();
  });

  it("affiche le bouton New Operation", () => {
    render(<OperationsHeader />);
    expect(screen.getByText("New Operation")).toBeInTheDocument();
  });

  it("ouvre la modal au clic sur New Operation", async () => {
    render(<OperationsHeader />);
    await userEvent.click(screen.getByText("New Operation"));
    expect(screen.getByTestId("modal")).toBeInTheDocument();
  });

  it("ferme la modal au clic sur Close", async () => {
    render(<OperationsHeader />);
    await userEvent.click(screen.getByText("New Operation"));
    await userEvent.click(screen.getByText("Close"));
    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });

  it("appelle onOperationCreated et ferme la modal après Save", async () => {
    const onOperationCreated = vi.fn();
    render(<OperationsHeader onOperationCreated={onOperationCreated} />);

    await userEvent.click(screen.getByText("New Operation"));
    await userEvent.click(screen.getByText("Save"));

    expect(onOperationCreated).toHaveBeenCalledWith({ id: 99, label: "Test" });
  });
});