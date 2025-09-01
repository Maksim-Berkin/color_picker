import React, { useMemo, useState } from "react";
import "./index.css";

export default function ColorPickerApp() {
    const palette = useMemo(
        () => [
            { name: "Red", hex: "#EF4444" },
            { name: "Orange", hex: "#F97316" },
            { name: "Amber", hex: "#F59E0B" },
            { name: "Yellow", hex: "#EAB308" },
            { name: "Lime", hex: "#84CC16" },
            { name: "Green", hex: "#22C55E" },
            { name: "Emerald", hex: "#10B981" },
            { name: "Teal", hex: "#14B8A6" },
            { name: "Cyan", hex: "#06B6D4" },
            { name: "Sky", hex: "#0EA5E9" },
            { name: "Blue", hex: "#3B82F6" },
            { name: "Indigo", hex: "#6366F1" },
            { name: "Violet", hex: "#8B5CF6" },
            { name: "Purple", hex: "#A855F7" },
            { name: "Fuchsia", hex: "#D946EF" },
            { name: "Pink", hex: "#EC4899" },
            { name: "Rose", hex: "#F43F5E" },
            { name: "Brown", hex: "#92400E" },
            { name: "Slate", hex: "#64748B" },
            { name: "Gray", hex: "#6B7280" },
            { name: "Black", hex: "#0F172A" },
            { name: "White", hex: "#FFFFFF" },
        ],
        []
    );

    const [selected, setSelected] = useState(null);
    const [copied, setCopied] = useState(false);
    const [filter, setFilter] = useState("");
    const [customHex, setCustomHex] = useState("");

    const filtered = useMemo(() => {
        const q = filter.trim().toLowerCase();
        if (!q) return palette;
        return palette.filter(
            (c) => c.name.toLowerCase().includes(q) || c.hex.toLowerCase().includes(q)
        );
    }, [filter, palette]);

    function isValidHex(v) {
        return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v.trim());
    }

    async function copyHex() {
        if (!selected) return;
        try {
            await navigator.clipboard.writeText(selected.hex);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        } catch (err) {
            console.error(err);
            alert("Failed to copy HEX");
        }
    }

    function addCustom() {
        const v = customHex.trim();
        if (!isValidHex(v)) return alert("Enter HEX like #RRGGBB or #RGB");
        const name = `Custom ${v}`;
        setSelected({ name, hex: v });
    }

    return (
        <div className="app">
            {/* Left: Preview card */}
            <div className="card">
                <h1>Color Picker</h1>

                <div
                    className="preview"
                    style={{
                        background: selected?.hex || "linear-gradient(135deg,#f8fafc,#e2e8f0)",
                    }}
                />

                {selected ? (
                    <div style={{ marginTop: "1rem" }}>
                        <div>Selected Color:</div>
                        <div>
                            {selected.name} <span>{selected.hex}</span>
                        </div>
                        <button onClick={copyHex} disabled={!selected}>
                            {copied ? "Copied!" : "Copy HEX"}
                        </button>
                    </div>
                ) : (
                    <div style={{ marginTop: "1rem", color: "#666" }}>
                        Click any square on the right to pick a color.
                    </div>
                )}

                {/* Custom HEX input */}
                <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
                    <input
                        value={customHex}
                        onChange={(e) => setCustomHex(e.target.value)}
                        placeholder="#34D399 or #3D9"
                    />
                    <button onClick={addCustom}>Apply HEX</button>
                </div>
            </div>

            {/* Right: Palette grid */}
            <div className="card">
                <h2>Palette</h2>
                <input
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder="Search by name or #hex"
                    style={{ marginTop: "0.5rem", width: "100%" }}
                />

                <div className="colors">
                    {filtered.map((c) => (
                        <button
                            key={c.hex}
                            onClick={() => setSelected(c)}
                            className="color-btn"
                            style={{ backgroundColor: c.hex }}
                        >
                            <span>{c.name}</span>
                        </button>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div style={{ marginTop: "1rem", color: "#666" }}>No colors found.</div>
                )}
            </div>
        </div>
    );
}
