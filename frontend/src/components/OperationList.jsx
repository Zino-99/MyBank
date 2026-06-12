import { useEffect, useState } from "react";
import { Pencil, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import OperationModal from "./OperationModal";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

const CATEGORY_COLORS = {
  Food:          "bg-orange-100 text-orange-700",
  Transport:     "bg-blue-100 text-blue-700",
  Health:        "bg-red-100 text-red-700",
  Housing:       "bg-purple-100 text-purple-700",
  Entertainment: "bg-pink-100 text-pink-700",
  Salary:        "bg-green-100 text-green-700",
  Tech:          "bg-teal-100 text-teal-700",
  Other:         "bg-gray-100 text-gray-600",
};

function OperationRow({ op, onEdit, onDelete }) {
  const isPositive = parseFloat(op.amount) >= 0;
  const colorClass = CATEGORY_COLORS[op.category] ?? CATEGORY_COLORS.Other;

  return (
    <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
      <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${isPositive ? "bg-green-100" : "bg-yellow-100"}`}>
        {isPositive
          ? <TrendingUp size={20} className="text-green-600" />
          : <TrendingDown size={20} className="text-yellow-600" />
        }
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-gray-900 text-base">{op.label}</span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
            {op.category}
          </span>
        </div>
        <p className="text-sm text-gray-400 mt-0.5">
          {new Date(op.date).toLocaleDateString("en-GB", {
            day: "2-digit", month: "short", year: "numeric",
          })}
        </p>
      </div>

      <span className={`text-lg font-bold tabular-nums shrink-0 ${isPositive ? "text-green-600" : "text-red-500"}`}>
        {isPositive ? "+" : "-"}$ {Math.abs(parseFloat(op.amount)).toFixed(2)}
      </span>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onEdit(op)}
          className="p-2 rounded-lg text-gray-400 hover:text-teal-700 hover:bg-teal-50 transition-colors"
          title="Edit"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => onDelete(op)}
          className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export default function OperationList({ operations, setOperations }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingOp, setEditingOp] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/operations`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load operations");
        return res.json();
      })
      .then((data) => setOperations(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [setOperations]);

  const handleEdit = (op) => setEditingOp(op);

  const handleDelete = async (op) => {
    if (!confirm(`Delete "${op.label}"?`)) return;
    try {
      const res = await fetch(`${API_BASE}/api/operations/${op.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Delete failed");
      setOperations((prev) => prev.filter((o) => o.id !== op.id));
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 text-gray-400 text-sm">
        Loading operations…
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-8 mt-6 rounded-xl bg-red-50 border border-red-200 px-5 py-4 text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="px-8 py-6">
        {operations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <span className="text-4xl mb-3">💸</span>
            <p className="text-base font-medium">No operations yet</p>
            <p className="text-sm mt-1">Click "New Operation" to add your first one.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {operations.map((op) => (
              <OperationRow
                key={op.id}
                op={op}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal d'édition — dans le return, pas en dehors */}
      {editingOp && (
        <OperationModal
          operation={editingOp}
          onClose={() => setEditingOp(null)}
          onUpdated={(updated) => {
            setOperations((prev) => prev.map((o) => o.id === updated.id ? updated : o));
            setEditingOp(null);
          }}
        />
      )}
    </>
  );
}