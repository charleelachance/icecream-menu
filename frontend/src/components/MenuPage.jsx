import { useEffect, useState } from "react";
import { getMenu } from "../api";
import { useNavigate } from "react-router-dom";

function MenuPage() {
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);

    const today = new Date().toISOString().split("T")[0];
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                const menuRes = await getMenu(today);

                setMenu(menuRes.data.flavors);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div style={{ padding: "1rem 2rem 2rem 2rem" }}>
            <h1>Today's Menu ({today})</h1>
            <button onClick={() => navigate("/edit")}>Edit Today’s Menu</button>
            <h2>Menu Flavors</h2>
            {menu.length === 0 ? (
                <p>No flavors selected yet.</p>
            ) : (
                <ul>
                    {menu.map((flavor) => (
                        <li key={flavor.id}>
                            <strong>{flavor.name}</strong> —{" "}
                            {flavor.description} — ${flavor.price.toFixed(2)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default MenuPage;
