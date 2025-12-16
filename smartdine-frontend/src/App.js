import { AppShell, AppShellHeader, AppShellMain } from "@mantine/core";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SearchPage from "./pages/SearchPage"
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./components/Layout";
import HistoryPage from "./pages/Historypage";


function App() {
  return (
    <AppShell
      header={null}
      padding="0"
    >

      <AppShellMain>
        <Layout>

        <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/search" element={<SearchPage />} />
  <Route path="/history" element={<HistoryPage />} />
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
</Routes>
        </Layout>

      </AppShellMain>
    </AppShell>
  );
}

export default App;
