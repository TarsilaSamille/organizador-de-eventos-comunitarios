import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TabelaDeItens from "./TabelaDeItens";
import ListaDeAjuda from "./ListaDeAjuda";
import PaginaDeDoacao from "./PaginaDeDoacao";
import EventTable from "./EventTable";
import EventForm from "./EventForm";
import Menu from "./Menu";
import ThemeProvider from "./theme";
import { AuthProvider } from "./context/AuthContext";
import LoginForm from "./LoginForm";
import CreateUserForm from "./CreateUserForm";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Menu />

            <div style={{ margin: "20px" }}>
              <Routes>
                <Route path="/tabelaDeItens" element={<TabelaDeItens />} />
                <Route path="/listaDeAjuda" element={<ListaDeAjuda />} />
                <Route path="/tabelaDeEventos" element={<EventTable />} />
                <Route path="/evento" element={<EventForm />} />
                <Route path="/evento/:id" element={<EventForm />} />
                <Route path="/" element={<EventTable />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/create-user" element={<CreateUserForm />} />

                <Route
                  path="/paginaDeDoacao/:eventoId/:grupoId?"
                  element={<PaginaDeDoacao />}
                />
              </Routes>
            </div>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
