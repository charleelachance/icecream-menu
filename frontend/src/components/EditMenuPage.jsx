import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getFlavors, getMenu, putMenu } from "../api";
import WorkingMenu from "./WorkingMenu";
import FlavorLibrary from "./FlavorLibrary";

function EditMenuPage() {
    const navigate = useNavigate();

    const [allFlavors, setAllFlavors] = useState([]);
    const [workingMenu, setWorkingMenu] = useState([]);
    const [originalMenu, setOriginalMenu] = useState([]);
    const [isLoadingFlavors, setIsLoadingFlavors] = useState(true);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [showInStockOnly, setShowInStockOnly] = useState(false);
    const [autoPopulated, setAutoPopulated] = useState(false);
    const [sort, setSort] = useState("popularity");
    const [showDescriptions, setShowDescriptions] = useState(true);

    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000)
        .toISOString()
        .split("T")[0];

    // Load all flavors and today's menu
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setIsLoadingFlavors(true);
            setError(null);
            try {
                const [flavorsRes, menuRes] = await Promise.all([
                    getFlavors(sort),
                    getMenu(today),
                ]);
                setAllFlavors(flavorsRes.data);
                if (menuRes.data.flavors.length > 0) {
                    setWorkingMenu(menuRes.data.flavors);
                    setOriginalMenu(menuRes.data.flavors);
                    setAutoPopulated(false);
                } else {
                    // If today's menu is empty, try to load yesterday's
                    const yestMenuRes = await getMenu(yesterday);
                    setWorkingMenu(yestMenuRes.data.flavors);
                    setOriginalMenu([]); // No original menu for today
                    setAutoPopulated(yestMenuRes.data.flavors.length > 0);
                }
            } catch (err) {
                setError("Failed to load data");
            } finally {
                setLoading(false);
                setIsLoadingFlavors(false);
            }
        }
        fetchData();
    }, [sort, today, yesterday]);

    function handleAddFlavor(flavor) {
        if (!workingMenu.find((f) => f.id === flavor.id)) {
            setWorkingMenu([...workingMenu, flavor]);
            setAutoPopulated(false);
        }
    }

    function handleRemoveFlavor(flavorId) {
        setWorkingMenu(workingMenu.filter((f) => f.id !== flavorId));
        setAutoPopulated(false);
    }

    function handleClearAll() {
        setWorkingMenu([]);
        setAutoPopulated(false);
    }

    async function handleSave() {
        setSaving(true);
        setError(null);
        try {
            await putMenu(today, { flavorIds: workingMenu.map((f) => f.id) });
            setOriginalMenu(workingMenu); // Update originalMenu after successful save
        } catch (err) {
            setError("Failed to save menu");
        } finally {
            setSaving(false);
        }
    }

    const filteredFlavors = allFlavors.filter(
        (f) =>
            (!showInStockOnly || f.in_stock) &&
            (f.name.toLowerCase().includes(search.toLowerCase()) ||
                f.description?.toLowerCase().includes(search.toLowerCase()))
    );

    const hasChanges = useMemo(() => {
        function areMenusEqual(menuA, menuB) {
            if (menuA.length !== menuB.length) return false;
            const idsA = menuA.map((f) => f.id).sort();
            const idsB = menuB.map((f) => f.id).sort();
            return idsA.every((id, i) => id === idsB[i]);
        }
        return !areMenusEqual(workingMenu, originalMenu);
    }, [workingMenu, originalMenu]);

    return (
        <div
            style={{
                padding: "2rem",
                position: "relative",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "2rem",
                }}
            >
                <h1 style={{ margin: 0 }}>Editing Today's Menu ({today})</h1>
            </div>
            <main style={{ display: "flex", gap: "2rem" }}>
                <div style={{ flex: "0 0 auto", minWidth: 0 }}>
                    <h2>Working Menu</h2>
                    {autoPopulated && (
                        <div style={{ color: "#888", marginBottom: 8 }}>
                            <i>Auto-populated with yesterday's flavor list</i>
                        </div>
                    )}
                    <div
                        style={{
                            width: "250px",
                            maxHeight: "calc(100vh - 250px)",
                            overflowY: "auto",
                            marginBottom: 16,
                            border: "1px solid #eee",
                            borderRadius: 8,
                            background: "#fafafa",
                            padding: 8,
                        }}
                    >
                        <WorkingMenu
                            flavors={workingMenu}
                            onRemove={handleRemoveFlavor}
                        />
                    </div>
                    <button
                        onClick={handleClearAll}
                        disabled={workingMenu.length === 0}
                    >
                        Clear All Flavors
                    </button>
                </div>
                <div
                    style={{ flex: "1 1 auto", minWidth: 0, maxWidth: "550px" }}
                >
                    <h2>Flavor Library</h2>
                    <input
                        type="text"
                        placeholder="Search flavors..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            width: "100%",
                            marginBottom: 8,
                            height: "25px",
                            paddingLeft: "10px",
                        }}
                    />
                    <button onClick={() => setShowInStockOnly((v) => !v)}>
                        {showInStockOnly ? "Show All" : "Show In-Stock Only"}
                    </button>
                    <button
                        style={{ marginLeft: 8 }}
                        onClick={() => setShowDescriptions((v) => !v)}
                    >
                        {showDescriptions
                            ? "Hide Descriptions"
                            : "Show Descriptions"}
                    </button>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        style={{
                            marginLeft: 8,
                            borderRadius: "8px",
                            border: "1px solid transparent",
                            padding: "0.6em 1.2em",
                            fontSize: "1em",
                            fontWeight: 500,
                            fontFamily: "inherit",
                            cursor: "pointer",
                        }}
                    >
                        <option value="popularity">Most Popular</option>
                        <option value="name">A-Z</option>
                        <option value="least_popular">Least Popular</option>
                    </select>
                    <div
                        style={{
                            maxHeight: "calc(100vh - 350px)",
                            overflowY: "auto",
                            marginTop: 8,
                            border: "1px solid #eee",
                            borderRadius: 8,
                            background: "#fafafa",
                            padding: 8,
                        }}
                    >
                        <FlavorLibrary
                            flavors={filteredFlavors}
                            isLoading={isLoadingFlavors}
                            workingMenu={workingMenu}
                            onAdd={handleAddFlavor}
                            onRemove={handleRemoveFlavor}
                            showDescriptions={showDescriptions}
                        />
                    </div>
                </div>
            </main>
            <div
                style={{
                    position: "fixed",
                    bottom: 24,
                    right: 24,
                    display: "flex",
                    gap: "1rem",
                }}
            >
                <button onClick={() => navigate("/")}>
                    {hasChanges ? "Cancel" : "Back"}
                </button>
                <button
                    onClick={handleSave}
                    disabled={saving || !hasChanges}
                    style={{
                        backgroundColor:
                            saving || !hasChanges ? undefined : "#646cff",
                        color: saving || !hasChanges ? undefined : "white",
                    }}
                >
                    {saving ? "Saving..." : "Save Menu"}
                </button>
                {error && <div style={{ color: "red" }}>{error}</div>}
            </div>
            {loading && (
                <div style={{ position: "fixed", top: 24, left: 24 }}>
                    Loading...
                </div>
            )}
        </div>
    );
}

export default EditMenuPage;
