import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import CreateUserForm from "./pages/login/CreateUserForm";
import EventForm from "./pages/eventos/EventForm";
import EventTable from "./pages/eventos/EventTable";
import ListaDeAjuda from "./organisms/ListaDeAjuda";
import LoginForm from "./pages/login/LoginForm";
import Menu from "./molecules/Menu";
import PaginaDeDoacao from "./pages/paginaDeDoacao/PaginaDeDoacao";
import TabelaDeItens from "./organisms/TabelaDeItens";
import { AuthProvider } from "./context/AuthContext";
import ThemeProvider from "./utils/theme";

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
