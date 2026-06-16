import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OperationList from "../OperationList";

vi.mock("../OperationModal", () => ({
  default: ({ onClose }) => (
    <div data-testid="modal">
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

const OPERATIONS = [
  { id: 1, label: "Salaire", amount: "2500.00", category: "Salary", date: "2024-06-01T00:00:00+00:00" },
  { id: 2, label: "Loyer",   amount: "-900.00", category: "Housing", date: "2024-06-05T00:00:00+00:00" },
];

const mockGET = () =>
  fetch.mockResolvedValueOnce({ ok: true, json: async () => OPERATIONS });

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
  vi.stubGlobal("confirm", vi.fn(() => true));
  vi.stubGlobal("alert", vi.fn());
});

describe("OperationList", () => {
  it("affiche le spinner pendant le chargement", () => {
    fetch.mockReturnValueOnce(new Promise(() => {}));
    render(<OperationList operations={[]} setOperations={vi.fn()} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("affiche les opérations", async () => {
    mockGET();
    render(<OperationList operations={OPERATIONS} setOperations={vi.fn()} />);
    await waitFor(() => {
      expect(screen.getByText("Salaire")).toBeInTheDocument();
      expect(screen.getByText("Loyer")).toBeInTheDocument();
    });
  });

  it("affiche l'état vide", async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => [] });
    render(<OperationList operations={[]} setOperations={vi.fn()} />);
    await waitFor(() => expect(screen.getByText(/no operations yet/i)).toBeInTheDocument());
  });

  it("affiche une erreur si le fetch échoue", async () => {
    fetch.mockResolvedValueOnce({ ok: false });
    render(<OperationList operations={[]} setOperations={vi.fn()} />);
    await waitFor(() => expect(screen.getByText(/failed to load/i)).toBeInTheDocument());
  });

  it("ouvre et ferme la modal d'édition", async () => {
    mockGET();
    render(<OperationList operations={OPERATIONS} setOperations={vi.fn()} />);
    await waitFor(() => screen.getByText("Salaire"));

    await userEvent.click(screen.getAllByTitle("Edit")[0]);
    expect(screen.getByTestId("modal")).toBeInTheDocument();

    await userEvent.click(screen.getByText("Close"));
    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });

  it("envoie un DELETE après confirmation", async () => {
    mockGET();
    fetch.mockResolvedValueOnce({ ok: true }); // DELETE
    render(<OperationList operations={OPERATIONS} setOperations={vi.fn()} />);
    await waitFor(() => screen.getByText("Salaire"));

    await userEvent.click(screen.getAllByTitle("Delete")[0]);
    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/operations/1"),
        expect.objectContaining({ method: "DELETE" })
      )
    );
  });
});