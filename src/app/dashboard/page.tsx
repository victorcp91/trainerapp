"use client";

import React from "react";
import { withAuth } from "@/utils/withAuth";

const DashboardPage = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <aside
        style={{ width: "20%", backgroundColor: "#f5f5f5", padding: "1rem" }}
      >
        <nav>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li style={{ marginBottom: "1rem" }}>Alunos</li>
            <li style={{ marginBottom: "1rem" }}>Mensagens</li>
            <li>Minha conta</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "2rem" }}>
        <header style={{ marginBottom: "2rem", textAlign: "center" }}>
          <div
            style={{
              width: "100px",
              height: "100px",
              backgroundColor: "#ddd",
              margin: "0 auto",
            }}
          />
          <h1>Dashboard</h1>
        </header>

        <section
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "2rem",
          }}
        >
          <div style={{ flex: 1, marginRight: "1rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  flex: 1,
                  marginRight: "1rem",
                  padding: "1rem",
                  border: "1px solid #ddd",
                  textAlign: "center",
                }}
              >
                <h2>Alunos</h2>
                <p style={{ fontSize: "2rem", fontWeight: "bold" }}>10</p>
              </div>
              <div
                style={{
                  flex: 1,
                  padding: "1rem",
                  border: "1px solid #ddd",
                  textAlign: "center",
                }}
              >
                <h2>Treinos</h2>
                <p style={{ fontSize: "2rem", fontWeight: "bold" }}>2</p>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                style={{
                  flex: 1,
                  marginRight: "1rem",
                  padding: "1rem",
                  backgroundColor: "#333",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                + Novo aluno
              </button>
              <button
                style={{
                  flex: 1,
                  padding: "1rem",
                  backgroundColor: "#333",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                + Novo treino
              </button>
            </div>
          </div>
          <div style={{ flex: 1, padding: "1rem", border: "1px solid #ddd" }}>
            <h2>Últimos Feedbacks</h2>
          </div>
        </section>
      </main>
    </div>
  );
};

export default withAuth(DashboardPage, false);
