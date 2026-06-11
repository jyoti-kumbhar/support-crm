import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function CreateTicket() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    subject: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await api.post("/tickets", formData);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl">
        <Link
          to="/"
          className="text-indigo-600 hover:text-indigo-700 font-medium"
        >
          ← Back to Dashboard
        </Link>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 mt-4 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-6 text-white">
            <h1 className="text-3xl font-bold">
              Create Support Ticket
            </h1>

            <p className="mt-2 text-indigo-100">
              Record a new customer issue and track its progress.
            </p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Customer Name
                  </label>

                  <input
                    type="text"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Customer Email
                  </label>

                  <input
                    type="email"
                    name="customer_email"
                    value={formData.customer_email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject
                </label>

                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Login issue, payment issue..."
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>

                <textarea
                  rows={4}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Describe the issue in detail..."
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-3 rounded-xl font-semibold shadow-lg transition disabled:opacity-70"
              >
                {loading ? "Creating Ticket..." : "Create Ticket"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}