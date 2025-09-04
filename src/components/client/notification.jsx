import { useEffect, useState } from "react";
import { Badge, Dropdown, List } from "antd";
import axios from "axios";
import SockJS from "sockjs-client";
import { over } from "stompjs";

let stompClient = null;

export default function NotificationBell({ userId }) {
    const [notifications, setNotifications] = useState([]);

    // Load từ API
    const loadNotifications = async () => {
        const res = await axios.get(`/api/notifications/user/${userId}`);
        setNotifications(res.data);
    };

    useEffect(() => {
        loadNotifications();

        const socket = new SockJS("http://localhost:8080/ws");
        stompClient = over(socket);

        stompClient.connect({}, () => {
            stompClient.subscribe(`/topic/notifications/${userId}`, (message) => {
                const newNoti = JSON.parse(message.body);
                setNotifications(prev => [newNoti, ...prev]);
            });
        });

        return () => {
            stompClient.disconnect();
        };
    }, [userId]);

    const markAsRead = async (id) => {
        await axios.put(`/api/notifications/${id}/read`);
        loadNotifications();
    };

    return (
        <Dropdown
            overlay={
                <List
                    dataSource={notifications}
                    renderItem={(n) => (
                        <List.Item
                            style={{ background: n.isRead ? "#fff" : "#e6f7ff" }}
                            onClick={() => markAsRead(n.id)}
                        >
                            <span>{n.message}</span>
                        </List.Item>
                    )}
                />
            }
            trigger={['click']}
        >
            <Badge count={notifications.filter(n => !n.isRead).length}>
                <span style={{ cursor: "pointer", fontSize: 20 }}>🔔</span>
            </Badge>
        </Dropdown>
    );
}