"use client"
import React, { useState, useEffect } from "react";

import TicketCard from "./(components)/TicketCard";

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/Tickets", { cache: "no-store" });

        if (!res.ok) {
          throw new Error("Failed to fetch tickets");
        }

        const data = await res.json();
        setTickets(data.tickets);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (isLoading) {
    return <p>Loading tickets...</p>;
  }

  if (error) {
    // Display a proper error message to the user
    return <p>Error fetching tickets: {error.message}</p>;
  }

  if (!tickets?.length) {
    return <p>No tickets are available</p>;
  }

  const uniqueCategories = [
    ...new Set(tickets.map(({ category }) => category)),
  ];

  return (
    <div className="p-5">
      <div>
        {uniqueCategories.map((uniqueCategory, categoryIndex) => (
          <div key={categoryIndex} className="mb-4">
            <h2>{uniqueCategory}</h2>
            <div className="lg:grid grid-cols-2 xl:grid-cols-4">
              {tickets
                .filter((ticket) => ticket.category === uniqueCategory)
                .map((ticket, _index) => (
                  <TicketCard key={_index} ticket={ticket} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
