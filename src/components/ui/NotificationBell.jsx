import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { makeRequest } from "../../api/httpClient";
import { messageTone } from "../../../public/sounds";
import { formatRelativeTime } from "../../utils/common";
import { Bell } from "lucide-react";
export default function NotificationBell() {
    const navigate = useNavigate();

    const initialCount = Number(localStorage.getItem("notification_count")) || 0;

    const [count, setCount] = useState(initialCount);
    const [list, setList] = useState([]);
    const [open, setOpen] = useState(false);

    const audioRef = useRef(new Audio(messageTone));
    const prevCountRef = useRef(initialCount);

    /* ======================================
       GET UNREAD COUNT
    ====================================== */
    const getCount = useCallback(async () => {
        try {
            const res = await makeRequest("/notifications/unread-count");
            if (!res.success) return;
            const newCount = Number(res.total || 0);
            if (newCount > prevCountRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(() => { });
            }
            prevCountRef.current = newCount;
            setCount(newCount);
            localStorage.setItem("notification_count", newCount);
        } catch (error) {
            console.error(error);
        }
    }, []);

    /* ======================================
       GET NOTIFICATION LIST
    ====================================== */
    const getNotifications = useCallback(async () => {
        try {
            const res = await makeRequest(
                "/notifications",
                {
                    method: "POST",
                    body: {
                        page: 1,
                    },
                }
            );

            if (res.success) {
                setList(res.data || []);
            }

        } catch (error) {
            console.error(error);
        }
    }, []);

    /* ======================================
       MARK SINGLE READ
    ====================================== */
    const readNotification = async (notification_id) => {
        try {
            const res = await makeRequest(`/notifications/read/${notification_id}`, { method: "GET", });
            if (res.success) {
                getCount();
                setList((prev) =>
                    prev.map((item) =>
                        item.notification_id === notification_id ? {
                            ...item,
                            is_read: 'y',
                        }
                            : item
                    )
                );
            }

        } catch (error) {
            console.error(error);
        }
    };

    /* ======================================
       OPEN BELL
    ====================================== */
    const openBell = async () => {
        const nextState = !open;

        setOpen(nextState);

        if (nextState) {
            await getNotifications();
        }
    };

    /* ======================================
       HANDLE CLICK
    ====================================== */
    const handleNotificationClick = async (
        item
    ) => {
        setOpen(false);

        await readNotification(item.notification_id);

        switch (item.module_name) {
            case "ticket":
                navigate("/tickets", {
                    state: {
                        openTicket: { ticket_id: item.reference_id,},
                    },
                });
                break;

            default:
                break;
        }
    };

    /* ======================================
       AUTO REFRESH COUNT
    ====================================== */
    useEffect(() => {
        getCount();

        const timer = setInterval(
            getCount,
            10000
        );

        return () => clearInterval(timer);
    }, [getCount]);

    return (
        <div className="relative">

            {/* Bell */}
            <button onClick={openBell} className="topbar-utility topbar-utility-bell">
                <Bell size={15} />
                {count > 0 && (<span className="absolute -top-1 -right-1 min-w-3.75 h-3.75 px-1 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-semibold">{count > 99 ? "99+" : count}</span>)}
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 top-12 w-95 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-b-gray-50 bg-slate-100">
                        <h3 className="text-sm font-semibold text-gray-800"> Notifications </h3>
                        {count > 0 && (<span className="text-xs text-gray-500"> {count} unread </span>)}
                    </div>
                    {/* List */}
                    <div className="max-h-105 overflow-y-auto ">
                        {list.length > 0 ? (
                            list.map((item) => (
                                <div key={item.notification_id}
                                    onClick={() => handleNotificationClick(item)}
                                    className={`px-4 py-2 border-b border-b-gray-100 hover:bg-gray-50 cursor-pointer transition ${item.is_read == 'n' ? "bg-blue-50" : "bg-white"}`}
                                >
                                    <div className="relative flex items-start justify-between gap-2">
                                        <div className="flex-1 relative">
                                            <h4 className="text-sm font-semibold text-gray-800">
                                                {item.title}
                                            </h4>
                                            <p className="text-sm text-gray-600 mt-1 leading-5">
                                                {item.message}
                                            </p>
                                            <p className="absolute -top-3 right-2 text-xs text-gray-400 mt-2">
                                                {formatRelativeTime(item.created_date)}
                                            </p>
                                        </div>
                                        {item.is_read == 'n' && (
                                            <span className="absolute -right-3 -top-3 w-2 h-2 mt-2 rounded-full bg-blue-500"></span>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-6 text-center text-sm text-gray-500">
                                No notifications
                                found
                            </div>
                        )}

                    </div>

                    {/* Footer */}
                    <div className="px-4 py-3 bg-gray-50 border-t text-center">
                        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                            Mark all as read
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}