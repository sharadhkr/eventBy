import { useState } from "react";
import { registerOrganiser } from "../api/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        organisationName: "",
        ownerName: "",
        email: "",
        phone: "",
        address: "",
        password: "",
    });

    const submit = async (e) => {
        e.preventDefault();
        try {
            await registerOrganiser(form);
            navigate("/login");
        } catch (err) {
            console.error("REGISTER ERROR:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Registration failed");
        }

    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form onSubmit={submit} className="w-96 space-y-3">
                <h1 className="text-2xl font-bold">Organiser Register</h1>

                {Object.keys(form).map((key) => (
                    <input
                        key={key}
                        placeholder={key}
                        type={key === "password" ? "password" : "text"}
                        className="input"
                        value={form[key]}
                        onChange={(e) =>
                            setForm({ ...form, [key]: e.target.value })
                        }
                    />
                ))}

                <button className="btn w-full">Register</button>
            </form>
        </div>
    );
};

export default Register;
