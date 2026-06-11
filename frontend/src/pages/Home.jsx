import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Home() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  async function fetchTickets() {
    try {
      setLoading(true);

      const response = await api.get("/tickets", {
        params: {
          search,
          status,
        },
      });

      setTickets(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  fetchTickets();
}, [search, status]);

  const handleDelete = async (ticketId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this ticket?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/tickets/${ticketId}`);

      setTickets((prev) =>
        prev.filter(
          (ticket) => ticket.ticket_id !== ticketId
        )
      );
    } catch (error) {
      console.error(error);
      alert("Failed to delete ticket");
    }
  };

  const openCount = tickets.filter(
    (t) => t.status === "Open"
  ).length;

  const progressCount = tickets.filter(
    (t) => t.status === "In Progress"
  ).length;

  const closedCount = tickets.filter(
    (t) => t.status === "Closed"
  ).length;

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50 p-6">
    <div className="max-w-7xl mx-auto">
      
      {/* Hero Header */}

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-8 text-white">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold">
                Customer Support CRM
              </h1>

              <p className="text-indigo-100 mt-2">
                Manage, track and resolve customer support requests.
              </p>
            </div>

            <Link
              to="/create"
              className="bg-white text-indigo-700 px-5 py-3 rounded-xl font-semibold shadow-lg hover:bg-indigo-50 transition"
            >
              + Create Ticket
            </Link>
          </div>
        </div>
      </div>

      {/* Statistics */}

      <div className="grid md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">
                Open Tickets
              </p>

              <h2 className="text-4xl font-bold text-green-600 mt-2">
                {openCount}
              </h2>
            </div>

         
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">
                In Progress
              </p>

              <h2 className="text-4xl font-bold text-amber-500 mt-2">
                {progressCount}
              </h2>
            </div>

           
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">
                Closed Tickets
              </p>

              <h2 className="text-4xl font-bold text-red-500 mt-2">
                {closedCount}
              </h2>
            </div>

          </div>
        </div>
      </div>

      {/* Search & Filter */}

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search tickets..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none"
          />

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="border border-gray-300 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none"
          >
            <option value="">
              All Status
            </option>

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
        </div>
      </div>

      {/* Tickets Table */}
{/* Tickets List */}

<div className="space-y-4">
  {loading ? (
    <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
      <p className="text-gray-500">Loading tickets...</p>
    </div>
  ) : tickets.length === 0 ? (
    <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
      <h3 className="text-xl font-semibold text-gray-700">
        No Tickets Found
      </h3>

      <p className="text-gray-500 mt-2">
        Create a new ticket to get started.
      </p>
    </div>
  ) : (
    tickets.map((ticket) => (
      <div
        key={ticket.ticket_id}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Left Section */}

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-bold text-lg text-gray-800">
                {ticket.ticket_id}
              </h3>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  ticket.status === "Open"
                    ? "bg-green-100 text-green-700"
                    : ticket.status === "In Progress"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {ticket.status}
              </span>
            </div>

            <h4 className="font-semibold text-gray-800">
              {ticket.subject}
            </h4>

            <p className="text-gray-600 mt-1">
              {ticket.customer_name}
            </p>

            <p className="text-sm text-gray-400 mt-2">
              Created on{" "}
              {new Date(
                ticket.created_at
              ).toLocaleDateString()}
            </p>
          </div>

          {/* Right Section */}

          <div className="flex gap-3">
            <Link
              to={`/ticket/${ticket.ticket_id}`}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition"
            >
              View Details
            </Link>

            <button
              onClick={() =>
                handleDelete(ticket.ticket_id)
              }
              className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl font-medium hover:bg-red-100 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    ))
  )}
</div>
    </div>
  </div>
);
}