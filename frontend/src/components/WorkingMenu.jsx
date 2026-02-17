function WorkingMenu({ flavors, onRemove }) {
    if (!flavors || flavors.length === 0)
        return (
            <div style={{ color: "grey" }}>
                <i>Search the Flavor Library to add flavors to today's menu</i>
            </div>
        );
    return (
        <ul style={{ listStyle: "none", padding: 0 }}>
            {flavors.map((flavor) => (
                <li
                    key={flavor.id}
                    style={{
                        marginBottom: 8,
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <span style={{ flex: 1 }}>{flavor.name}</span>
                    <button
                        onClick={() => onRemove(flavor.id)}
                        style={{ marginLeft: 8 }}
                    >
                        Remove
                    </button>
                </li>
            ))}
        </ul>
    );
}

export default WorkingMenu;
