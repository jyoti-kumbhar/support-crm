import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

export default function TicketDetail() {
  const { ticketId } = useParams();

  const [ticket, setTicket] = useState(null);
  const [notes, setNotes] = useState([]);
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);

  const refreshTicket = async () => {
    try {
      const response = await api.get(`/tickets/${ticketId}`);

      setTicket(response.data.ticket);
      setNotes(response.data.notes);
      setStatus(response.data.ticket.status);
    } catch (error) {
      console.error("Error loading ticket:", error);
    }
  };

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await api.get(`/tickets/${ticketId}`);

        setTicket(response.data.ticket);
        setNotes(response.data.notes);
        setStatus(response.data.ticket.status);
      } catch (error) {
        console.error("Error loading ticket:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId]);

  const handleUpdate = async () => {
    try {
      await api.put(`/tickets/${ticketId}`, {
        status,
        note,
      });

      alert("Ticket updated successfully");

      setNote("");

      await refreshTicket();
    } catch (error) {
      console.error(error);
      alert("Failed to update ticket");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold">
          Loading ticket...
        </h2>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold text-red-500">
          Ticket not found
        </h2>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50 px-4 py-8">
    <div className="max-w-6xl mx-auto">
      {/* Header */}

      <Link
        to="/"
        className="text-indigo-600 hover:text-indigo-700 font-medium"
      >
        ← Back to Dashboard
      </Link>

      {/* Main Ticket Card */}

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mt-4">
        {/* Banner */}

        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <p className="text-indigo-100 text-sm">
                Support Ticket
              </p>

              <h1 className="text-4xl font-bold mt-1">
                {ticket.ticket_id}
              </h1>

              <p className="text-indigo-100 mt-2">
                {ticket.subject}
              </p>
            </div>

            <span
              className={`px-5 py-2 rounded-full text-sm font-semibold bg-white ${
                ticket.status === "Open"
                  ? "text-green-600"
                  : ticket.status === "In Progress"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {ticket.status}
            </span>
          </div>
        </div>

        {/* Ticket Info */}

        <div className="p-8">
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div>
              <p className="text-sm text-gray-500">
                Customer Name
              </p>

              <p className="font-semibold text-gray-800 mt-1">
                {ticket.customer_name}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Customer Email
              </p>

              <p className="font-semibold text-gray-800 mt-1">
                {ticket.customer_email}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Created
              </p>

              <p className="font-semibold text-gray-800 mt-1">
                {new Date(
                  ticket.created_at
                ).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Updated
              </p>

              <p className="font-semibold text-gray-800 mt-1">
                {new Date(
                  ticket.updated_at
                ).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Description */}

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 mb-8">
            <h3 className="font-semibold text-lg mb-3">
              Description
            </h3>

            <p className="text-gray-700 leading-relaxed">
              {ticket.description}
            </p>
          </div>

          {/* Update + Notes */}

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Update Ticket */}

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-5">
                Update Ticket
              </h3>

              <div className="space-y-4">
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none"
                >
                  <option value="Open">
                    Open
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Closed">
                    Closed
                  </option>
                </select>

                <textarea
                  rows="5"
                  placeholder="Add note or comment..."
                  value={note}
                  onChange={(e) =>
                    setNote(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none resize-none"
                />

                <button
                  onClick={handleUpdate}
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-3 rounded-xl font-semibold shadow-lg transition"
                >
                  Save Changes
                </button>
              </div>
            </div>

            {/* Notes */}

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-5">
                Activity & Notes
              </h3>

              {notes.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  No notes added yet.
                </div>
              ) : (
                <div className="space-y-4 max-h-[450px] overflow-y-auto">
                  {notes.map((noteItem) => (
                    <div
                      key={noteItem.id}
                      className="border-l-4 border-indigo-500 bg-indigo-50 rounded-r-xl p-4"
                    >
                      <p className="text-gray-800">
                        {noteItem.note_text}
                      </p>

                      <p className="text-xs text-gray-500 mt-3">
                        {new Date(
                          noteItem.created_at
                        ).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}