import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OperationModal from "../OperationModal";

const onClose   = vi.fn();
const onCreated = vi.fn();
const onUpdated = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal("fetch", vi.fn());
});

describe("OperationModal", () => {
  it("affiche le titre 'New operation' par défaut", () => {
    render(<OperationModal onClose={onClose} onCreated={onCreated} />);
    expect(screen.getByText("New operation")).toBeInTheDocument();
  });

  it("affiche le titre 'Edit operation' en mode édition", () => {
    const op = { id: 1, label: "Salaire", amount: "2500", date: "2024-06-01", category: "Salary" };
    render(<OperationModal operation={op} onClose={onClose} onUpdated={onUpdated} />);
    expect(screen.getByText("Edit operation")).toBeInTheDocument();
  });

  it("pré-remplit les champs en mode édition", () => {
    const op = { id: 1, label: "Loyer", amount: "-900", date: "2024-06-05", category: "Housing" };
    render(<OperationModal operation={op} onClose={onClose} onUpdated={onUpdated} />);
    expect(screen.getByDisplayValue("Loyer")).toBeInTheDocument();
    expect(screen.getByDisplayValue("-900")).toBeInTheDocument();
  });

  it("appelle onClose au clic sur Cancel", async () => {
    render(<OperationModal onClose={onClose} onCreated={onCreated} />);
    await userEvent.click(screen.getByText("Cancel"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("appelle onClose au clic sur le bouton ×", async () => {
    render(<OperationModal onClose={onClose} onCreated={onCreated} />);
    await userEvent.click(screen.getByText("×"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("envoie un POST et appelle onCreated", async () => {
    const result = { id: 99, label: "Courses", amount: "-50", date: "2024-06-10", category: "Food" };
    fetch.mockResolvedValueOnce({ ok: true, json: async () => result });

    render(<OperationModal onClose={onClose} onCreated={onCreated} />);

    await userEvent.type(screen.getByPlaceholderText("Grocery store"), "Courses");
    await userEvent.type(screen.getByPlaceholderText("-12.50"), "-50");
    await userEvent.click(screen.getByText("Create"));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/operations"),
        expect.objectContaining({ method: "POST" })
      );
      expect(onCreated).toHaveBeenCalledWith(result);
    });
  });

  it("envoie un PUT et appelle onUpdated en mode édition", async () => {
    const op     = { id: 1, label: "Salaire", amount: "2500", date: "2024-06-01", category: "Salary" };
    const result = { ...op, label: "Salaire mis à jour" };
    fetch.mockResolvedValueOnce({ ok: true, json: async () => result });

    render(<OperationModal operation={op} onClose={onClose} onUpdated={onUpdated} />);
    await userEvent.click(screen.getByText("Save changes"));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/operations/1"),
        expect.objectContaining({ method: "PUT" })
      );
      expect(onUpdated).toHaveBeenCalledWith(result);
    });
  });

  it("affiche une erreur si le fetch échoue", async () => {
    fetch.mockResolvedValueOnce({ ok: false, json: async () => ({ error: "Server error" }) });

    render(<OperationModal onClose={onClose} onCreated={onCreated} />);
    await userEvent.type(screen.getByPlaceholderText("Grocery store"), "Test");
    await userEvent.type(screen.getByPlaceholderText("-12.50"), "10");
    await userEvent.click(screen.getByText("Create"));

    await waitFor(() => expect(screen.getByText("Server error")).toBeInTheDocument());
  });

  it("n'envoie pas le formulaire si label ou amount est vide", async () => {
    render(<OperationModal onClose={onClose} onCreated={onCreated} />);
    await userEvent.click(screen.getByText("Create"));
    expect(fetch).not.toHaveBeenCalled();
  });
});