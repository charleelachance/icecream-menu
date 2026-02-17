import FlavorItem from "./FlavorItem";

function FlavorLibrary({
    flavors,
    isLoading,
    workingMenu,
    onAdd,
    onRemove,
    showDescriptions,
}) {
    if (isLoading) return <div>Loading flavors...</div>;
    return (
        <div>
            {flavors.length === 0 && (
                <div style={{ color: "#888" }}>No flavors found.</div>
            )}
            {flavors.map((flavor, idx) => (
                <div key={flavor.id} style={{ marginBottom: 12 }}>
                    <FlavorItem
                        flavor={flavor}
                        inMenu={!!workingMenu.find((f) => f.id === flavor.id)}
                        onAdd={() => onAdd(flavor)}
                        onRemove={() => onRemove(flavor.id)}
                    />
                    {showDescriptions && flavor.description && (
                        <div
                            style={{
                                color: "#888",
                                fontStyle: "italic",
                                fontSize: "0.95em",
                                marginLeft: 24,
                                marginTop: 2,
                            }}
                        >
                            {flavor.description}
                        </div>
                    )}
                    {idx < flavors.length - 1 && (
                        <hr
                            style={{
                                border: 0,
                                borderTop: "1px solid #eee",
                                margin: "10px 0",
                            }}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}

export default FlavorLibrary;
