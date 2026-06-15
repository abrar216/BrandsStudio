import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx",
    ],

    theme: {
        extend: {
            colors: {
                brand: {
                    bg: "#0a0f0d", // Template dark bg
                    surface: "#0d1a14",
                    accent: "#059669", // Emerald
                    emerald: "#059669",
                    "emerald-light": "#34d399",
                    gold: "#d4a574",
                    "gold-light": "#e8c9a0",
                    amber: "#b45309",
                    coral: "#e07a5f",
                    slate: "#475569",
                    success: "#22c55e",
                    danger: "#dc2626",
                    warning: "#eab308",
                    info: "#0ea5e9",
                    border: "rgba(255, 255, 255, 0.1)",
                },
                soft: {
                    mint: "#d1fae5",
                    lavender: "#ede9fe",
                    peach: "#fef3c7",
                    lime: "#ecfccb",
                    sky: "#e0f2fe",
                },
            },
            fontFamily: {
                sans: ["Inter", ...defaultTheme.fontFamily.sans],
            },
        },
    },

    plugins: [forms],
};
