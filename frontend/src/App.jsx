import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import CreateTicket from "./pages/CreateTicket";
import TicketDetail from "./pages/TicketDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateTicket />} />
        <Route path="/ticket/:ticketId" element={<TicketDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;