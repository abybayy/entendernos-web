import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles.css";
import { SettingsProvider } from "@/components/entendernos/SettingsContext";
import { FranjaProvider } from "@/components/entendernos/FranjaContext";
import { RootShell } from "@/components/entendernos/RootShell";

import Onboarding from "@/pages/Onboarding";
import Cartas from "@/pages/Cartas";
import MazoFisico from "@/pages/MazoFisico";
import Favoritos from "@/pages/Favoritos";
import MaterialApoyo from "@/pages/MaterialApoyo";
import Novedades from "@/pages/Novedades";
import Creditos from "@/pages/Creditos";
import Privacidad from "@/pages/Privacidad";
import Ajustes from "@/pages/Ajustes";
import NotFound from "@/pages/NotFound";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <FranjaProvider>
          <RootShell>
            <Routes>
              <Route path="/" element={<Onboarding />} />
              <Route path="/cartas" element={<Cartas />} />
              <Route path="/mazo-fisico" element={<MazoFisico />} />
              <Route path="/favoritos" element={<Favoritos />} />
              <Route path="/material-apoyo" element={<MaterialApoyo />} />
              <Route path="/novedades" element={<Novedades />} />
              <Route path="/creditos" element={<Creditos />} />
              <Route path="/privacidad" element={<Privacidad />} />
              <Route path="/ajustes" element={<Ajustes />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </RootShell>
        </FranjaProvider>
      </SettingsProvider>
    </BrowserRouter>
  </StrictMode>
);
