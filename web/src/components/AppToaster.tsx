import { Toaster } from "react-hot-toast";

export function AppToaster() {
    return (
        <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={10}
            toastOptions={{
                duration: 4000,
                style: {
                    background: "rgba(13, 23, 42, 0.92)",
                    color: "#fff",
                    borderRadius: "16px",
                    border: "1px solid rgba(95, 163, 255, 0.25)",
                    boxShadow: "0 20px 50px rgba(8, 75, 167, 0.25)",
                    backdropFilter: "blur(12px)",
                    padding: "12px 16px",
                    fontSize: "14px",
                    fontWeight: 500,
                    maxWidth: "380px",
                },
                success: {
                    style: {
                        border: "1px solid rgba(211, 246, 37, 0.35)",
                        boxShadow: "0 20px 50px rgba(211, 246, 37, 0.15)",
                    },
                    iconTheme: {
                        primary: "#d3f625",
                        secondary: "#0d172a",
                    },
                },
                error: {
                    style: {
                        border: "1px solid rgba(229, 72, 77, 0.35)",
                        boxShadow: "0 20px 50px rgba(229, 72, 77, 0.15)",
                    },
                    iconTheme: {
                        primary: "#ff6b6f",
                        secondary: "#0d172a",
                    },
                },
                loading: {
                    iconTheme: {
                        primary: "#5fa3ff",
                        secondary: "#0d172a",
                    },
                },
            }}
        />
    );
}