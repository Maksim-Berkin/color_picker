import React, { useMemo, useState, useEffect } from "react";
import "./index.css";

export default function ColorPickerApp() {
    // Базовая палитра цветов
    const basePalette = useMemo(
        () => [
            { name: "Red", hex: "#EF4444", isCustom: false },
            { name: "Orange", hex: "#F97316", isCustom: false },
            { name: "Amber", hex: "#F59E0B", isCustom: false },
            { name: "Yellow", hex: "#EAB308", isCustom: false },
            { name: "Lime", hex: "#84CC16", isCustom: false },
            { name: "Green", hex: "#22C55E", isCustom: false },
            { name: "Emerald", hex: "#10B981", isCustom: false },
            { name: "Teal", hex: "#14B8A6", isCustom: false },
            { name: "Cyan", hex: "#06B6D4", isCustom: false },
            { name: "Sky", hex: "#0EA5E9", isCustom: false },
            { name: "Blue", hex: "#3B82F6", isCustom: false },
            { name: "Indigo", hex: "#6366F1", isCustom: false },
            { name: "Violet", hex: "#8B5CF6", isCustom: false },
            { name: "Purple", hex: "#A855F7", isCustom: false },
            { name: "Fuchsia", hex: "#D946EF", isCustom: false },
            { name: "Pink", hex: "#EC4899", isCustom: false },
            { name: "Rose", hex: "#F43F5E", isCustom: false },
            { name: "Brown", hex: "#92400E", isCustom: false },
            { name: "Slate", hex: "#64748B", isCustom: false },
            { name: "Gray", hex: "#6B7280", isCustom: false },
            { name: "Black", hex: "#0F172A", isCustom: false },
            { name: "White", hex: "#FFFFFF", isCustom: false },
        ],
        []
    );

    // Состояние для пользовательских цветов
    const [customColors, setCustomColors] = useState([]);
    const [selected, setSelected] = useState(null);
    const [copied, setCopied] = useState(false);
    const [filter, setFilter] = useState("");
    const [customHex, setCustomHex] = useState("");
    const [customName, setCustomName] = useState("");
    const [showSaveDialog, setShowSaveDialog] = useState(false);

    // Загрузка сохраненных цветов при монтировании компонента
    useEffect(() => {
        const savedColors = localStorage.getItem('userCustomColors');
        if (savedColors) {
            try {
                const parsed = JSON.parse(savedColors);
                setCustomColors(parsed);
            } catch (err) {
                console.error('Error loading saved colors:', err);
            }
        }
    }, []);

    // Сохранение пользовательских цветов в localStorage при их изменении
    useEffect(() => {
        if (customColors.length > 0) {
            localStorage.setItem('userCustomColors', JSON.stringify(customColors));
        }
    }, [customColors]);

    // Объединение базовой палитры и пользовательских цветов
    const allColors = useMemo(() => {
        return [...basePalette, ...customColors];
    }, [basePalette, customColors]);

    // Фильтрация цветов
    const filtered = useMemo(() => {
        const q = filter.trim().toLowerCase();
        if (!q) return allColors;
        return allColors.filter(
            (c) => c.name.toLowerCase().includes(q) || c.hex.toLowerCase().includes(q)
        );
    }, [filter, allColors]);

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
        if (!isValidHex(v)) return alert("Enter HEX in the format #RRGGBB or #RGB");

        // Проверка, не существует ли уже такой цвет
        const hexUpperCase = v.toUpperCase();
        if (allColors.some(c => c.hex.toUpperCase() === hexUpperCase)) {
            alert("This color already exists in the palette.!");
            return;
        }

        setShowSaveDialog(true);
    }

    function saveCustomColor() {
        const v = customHex.trim();
        const name = customName.trim() || `Custom ${v}`;

        const newColor = {
            name,
            hex: v.toUpperCase(),
            isCustom: true
        };

        setCustomColors([...customColors, newColor]);
        setSelected(newColor);
        setCustomHex("");
        setCustomName("");
        setShowSaveDialog(false);
    }

    function deleteCustomColor(colorToDelete) {
        setCustomColors(customColors.filter(c => c.hex !== colorToDelete.hex));
        if (selected?.hex === colorToDelete.hex) {
            setSelected(null);
        }
    }

    function clearAllCustomColors() {
        if (confirm("Are you sure you want to delete all saved colors??")) {
            setCustomColors([]);
            localStorage.removeItem('userCustomColors');
            setSelected(null);
        }
    }

    return (
        <div className="app">
            {/* Левая карточка: Превью */}
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
                        <div style={{ fontSize: "0.9rem", color: "#666" }}>
                            Selected color:
                        </div>
                        <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                            {selected.name}
                        </div>
                        <div style={{ fontSize: "1rem", color: "#333", marginTop: "0.25rem" }}>
                            {selected.hex}
                        </div>
                        <button
                            onClick={copyHex}
                            disabled={!selected}
                            style={{ marginTop: "0.75rem" }}
                        >
                            {copied ? "✓ Copied!" : "Copy HEX"}
                        </button>
                    </div>
                ) : (
                    <div style={{ marginTop: "1rem", color: "#666" }}>
                        Select a color from the palette on the right
                    </div>
                )}

                {/* Добавление пользовательского цвета */}
                <div style={{ marginTop: "1.5rem", borderTop: "1px solid #eee", paddingTop: "1rem" }}>
                    <h3 style={{ marginBottom: "0.75rem" }}>Add your own color</h3>
                    <input
                        value={customHex}
                        onChange={(e) => setCustomHex(e.target.value)}
                        placeholder="HEX: #34D399 или #3D9"
                        style={{ width: "100%", marginBottom: "0.5rem" }}
                    />
                    <button
                        onClick={addCustom}
                        style={{ width: "100%", background: "#3B82F6", color: "white" }}
                    >
                        Add to palette
                    </button>
                </div>

                {/* Управление пользовательскими цветами */}
                {customColors.length > 0 && (
                    <div style={{ marginTop: "1rem" }}>
                        <button
                            onClick={clearAllCustomColors}
                            style={{
                                width: "100%",
                                background: "#EF4444",
                                color: "white",
                                fontSize: "0.9rem"
                            }}
                        >
                            Delete all saved ({customColors.length})
                        </button>
                    </div>
                )}
            </div>

            {/* Правая карточка: Палитра */}
            <div className="card">
                <h2>Color palette</h2>
                <input
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder="Search by name or HEX"
                    style={{ marginTop: "0.5rem", width: "100%" }}
                />

                {customColors.length > 0 && (
                    <div style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>
                        <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
                            My colors ({customColors.length})
                        </h3>
                        <div className="colors">
                            {customColors.map((c) => (
                                <div key={c.hex} style={{ position: "relative" }}>
                                    <button
                                        onClick={() => setSelected(c)}
                                        className="color-btn"
                                        style={{
                                            backgroundColor: c.hex,
                                            border: selected?.hex === c.hex ? "2px solid #3B82F6" : "1px solid #ddd"
                                        }}
                                    >
                                        <span>{c.name}</span>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteCustomColor(c);
                                        }}
                                        style={{
                                            position: "absolute",
                                            top: "-5px",
                                            right: "-5px",
                                            width: "20px",
                                            height: "20px",
                                            borderRadius: "50%",
                                            border: "1px solid #ddd",
                                            background: "white",
                                            color: "#EF4444",
                                            padding: 0,
                                            fontSize: "12px",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div style={{ marginTop: "1rem" }}>
                    <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
                        Standard colors
                    </h3>
                    <div className="colors">
                        {filtered.filter(c => !c.isCustom).map((c) => (
                            <button
                                key={c.hex}
                                onClick={() => setSelected(c)}
                                className="color-btn"
                                style={{
                                    backgroundColor: c.hex,
                                    border: selected?.hex === c.hex ? "2px solid #3B82F6" : "1px solid #ddd"
                                }}
                            >
                                <span>{c.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {filtered.length === 0 && (
                    <div style={{ marginTop: "1rem", color: "#666" }}>
                        Colors not found
                    </div>
                )}
            </div>

            {/* Диалог сохранения цвета */}
            {showSaveDialog && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0,0,0,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000
                }}>
                    <div style={{
                        background: "white",
                        padding: "2rem",
                        borderRadius: "1rem",
                        maxWidth: "400px",
                        width: "90%"
                    }}>
                        <h3>Preserve color</h3>
                        <div
                            style={{
                                width: "100%",
                                height: "60px",
                                backgroundColor: customHex,
                                borderRadius: "0.5rem",
                                marginTop: "1rem",
                                marginBottom: "1rem",
                                border: "1px solid #ddd"
                            }}
                        />
                        <p style={{ marginBottom: "0.5rem" }}>HEX: {customHex}</p>
                        <input
                            value={customName}
                            onChange={(e) => setCustomName(e.target.value)}
                            placeholder="Color name (optional)"
                            style={{ width: "100%", marginBottom: "1rem" }}
                            autoFocus
                        />
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button
                                onClick={saveCustomColor}
                                style={{ flex: 1, background: "#22C55E", color: "white" }}
                            >
                                Сохранить
                            </button>
                            <button
                                onClick={() => {
                                    setShowSaveDialog(false);
                                    setCustomName("");
                                }}
                                style={{ flex: 1 }}
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}