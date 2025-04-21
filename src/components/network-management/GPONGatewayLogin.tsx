
import React, { useState } from "react";

interface GPONGatewayLoginProps {
  isOpen: boolean;
  onSuccess: () => void;
}

const BACKGROUND_COLOR = "#61929B";
const BORDER_RADIUS = "3px";

export const GPONGatewayLogin: React.FC<GPONGatewayLoginProps> = ({
  isOpen,
  onSuccess,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation (you may want to improve this!)
    if (!username || !password) {
      setError("Please enter username and password.");
      return;
    }

    // For mock: accept anything as login
    setError(null);
    onSuccess();
  };

  const handleReset = () => {
    setUsername("");
    setPassword("");
    setError(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="flex flex-col items-center min-w-[360px]"
        style={{
          background: BACKGROUND_COLOR,
          borderRadius: BORDER_RADIUS,
          boxShadow: "0 4px 30px rgba(0,0,0,0.10)",
          padding: "0",
        }}
      >
        <div
          className="w-full py-2 font-bold text-center text-lg text-white"
          style={{
            background: BACKGROUND_COLOR,
            borderTopLeftRadius: BORDER_RADIUS,
            borderTopRightRadius: BORDER_RADIUS,
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: "20px",
            boxSizing: "border-box",
            borderBottom: "1px solid #50828A",
            letterSpacing: "0.5px",
          }}
        >
          GPON Home Gateway
        </div>
        <form
          className="flex flex-col items-center px-8 py-6"
          onSubmit={handleSubmit}
          style={{
            background: "white",
            borderBottomLeftRadius: BORDER_RADIUS,
            borderBottomRightRadius: BORDER_RADIUS,
            minWidth: "320px",
          }}
        >
          <div className="flex flex-row items-center justify-between w-full mb-2" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
            <label className="mr-3 min-w-[80px]" htmlFor="username">
              Username
            </label>
            <input
              style={{
                border: "1px solid #333",
                height: "24px",
                padding: "2px 8px",
                minWidth: "120px",
                fontFamily: "monospace",
                background: "white"
              }}
              id="username"
              name="username"
              type="text"
              value={username}
              autoComplete="username"
              autoFocus
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div className="flex flex-row items-center justify-between w-full mb-4" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
            <label className="mr-3 min-w-[80px]" htmlFor="password">
              Password
            </label>
            <input
              style={{
                border: "1px solid #333",
                height: "24px",
                padding: "2px 8px",
                minWidth: "120px",
                fontFamily: "monospace",
                background: "white"
              }}
              id="password"
              name="password"
              type="password"
              value={password}
              autoComplete="current-password"
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <div className="text-red-600 text-xs mb-2" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>{error}</div>
          )}
          <div className="flex flex-row gap-4">
            <button
              type="submit"
              style={{
                background: "#A8A8A8",
                border: "1.5px solid #333",
                borderRadius: "2px",
                padding: "2px 24px",
                fontWeight: "bold",
                fontFamily: "Arial, Helvetica, sans-serif",
                fontSize: "14px",
                color: "black",
                outline: "none",
                cursor: "pointer"
              }}
            >
              Login
            </button>
            <button
              type="button"
              onClick={handleReset}
              style={{
                background: "#A8A8A8",
                border: "1.5px solid #333",
                borderRadius: "2px",
                padding: "2px 24px",
                fontWeight: "bold",
                fontFamily: "Arial, Helvetica, sans-serif",
                fontSize: "14px",
                color: "black",
                outline: "none",
                cursor: "pointer"
              }}
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
