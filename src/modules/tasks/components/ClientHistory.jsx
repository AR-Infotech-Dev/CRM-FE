import React, { useState, useEffect } from 'react'
import { X, PhoneCall, PhoneOutgoing, CheckCheck } from "lucide-react";
import { formatDate } from "../../../utils/common";
import { makeRequest } from "../../../api/httpClient";
function ClientHistory({ client = {}, CLIENT_HISTORY_ITEMS }) {

    const [ticketList, setTicketList] = useState([]);
    const hasClient = Object.keys(client).length > 0;
    const { customer_id, name, created_date } = client;
    const displayName = name || (customer_id ? `Client #${customer_id}` : "Client");

    const getClientsTicket = async () => {
        try {
            const res = await makeRequest("tickets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    client_id: customer_id,
                    getAll: "Y"
                }),
            });

            if (res?.success) {
                setTicketList(res.data || []);
            } else {
                setTicketList([]);
            }
        } catch (error) {
            console.error("Failed to fetch tickets:", error);
            setTicketList([]);
        }
    }

    useEffect(() => {
        if (!customer_id) return;
        getClientsTicket();
    }, [customer_id])

    if (!hasClient) {
        return (
            <div className="h-full flex justify-center items-center text-slate-500">
                No Client Selected
            </div>
        );
    }

    return (
        <div className="client-history-panel">
            <div className="bg-white border border-slate-200 px-4 py-2 w-full max-w-md shadow-xs">
                {/* Header */}
                <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                        <PhoneCall size={16} className="text-white" />
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-slate-800">{displayName}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Enterprise Client • San Francisco, CA
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="border border-slate-200 rounded-lg px-3 py-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                            Member Since
                        </p>
                        <p className="text-sm font-semibold text-slate-800 mt-1">
                            {/* Jan 12, 2021 */}
                            {formatDate(created_date, "short")}
                        </p>
                    </div>

                    <div className="border border-slate-200 rounded-lg px-3 py-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                            Total Tickets
                        </p>
                        <p className="text-sm font-semibold text-slate-800 mt-1">
                            {ticketList.length || 0}
                        </p>
                    </div>
                </div>
            </div>

            <div className="histories ticket-scroll-pane px-2 space-y-2 mt-2">
                {ticketList.map((item) => (
                    <article key={item.ticket_id} className="rounded-sm border border-slate-200 bg-white px-4 py-2 shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                            <h4 className="text-xs font-semibold text-slate-800">{item.title}</h4>
                            <span className="rounded-full bg-slate-100 text-xs px-2.5 py-0.5 text-[0.55rem] font-medium text-slate-500">
                                {item?.ticket_status}
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-600">{item?.title}</p>
                    </article>
                ))}
            </div>
        </div>
    );
}
export default ClientHistory
