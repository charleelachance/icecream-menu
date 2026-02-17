function FlavorItem({ flavor, inMenu, onAdd, onRemove }) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                paddingLeft: "8px",
            }}
        >
            <span style={{ flex: 1 }}>
                {flavor.name}
                {flavor.in_stock === 0 && (
                    <span
                        style={{ color: "#b00", marginLeft: 8, fontSize: 12 }}
                    >
                        (Out of stock)
                    </span>
                )}
            </span>
            {inMenu ? (
                <button onClick={onRemove}>Remove</button>
            ) : (
                <button onClick={onAdd} disabled={flavor.in_stock === 0}>
                    Add
                </button>
            )}
        </div>
    );
}

export default FlavorItem;
