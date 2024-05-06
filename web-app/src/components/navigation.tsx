import React from "react";

interface NavigationBarProps {
  children?: React.ReactNode;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ children }) => {
  return (
    <nav
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ul
        style={{
          listStyleType: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "row",
          gap: "1rem",
          paddingBottom: "2.4rem",
        }}
      >
        <li>
          <a
            href="/"
            style={{
              color: "white",
              textDecoration: "none",
              border: "1px solid white",
              borderRadius: "5px",
              padding: "0.5rem",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#4169E1";
              e.currentTarget.style.borderColor = "#4169E1";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "white";
              e.currentTarget.style.borderColor = "white";
            }}
          >
            Order
          </a>
        </li>
        <li>
          <a
            href="/admin/articles"
            style={{
              color: "white",
              textDecoration: "none",
              border: "1px solid white",
              borderRadius: "5px",
              padding: "0.5rem",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#4169E1";
              e.currentTarget.style.borderColor = "#4169E1";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "white";
              e.currentTarget.style.borderColor = "white";
            }}
          >
            Admin
          </a>
        </li>
      </ul>
      {children}
    </nav>
  );
};

export default NavigationBar;
