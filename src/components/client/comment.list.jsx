import { useEffect, useState } from "react";
import { Input, Button } from "antd";

import SockJS from "sockjs-client";
import { over } from "stompjs";
import CommentItem from "./comment.post";
import { fecthCommentsAPI, postCommentAPI, reactCommentAPI, replyCommentAPI } from "@/config/api.handle";

const { TextArea } = Input;

let stompClient = null;

function CommentList({ seasonId, userId, username }) {
    const [comments, setComments] = useState([]);
    const [newContent, setNewContent] = useState("");

    // Load comment từ API
    const loadComments = async () => {
        const res = await fecthCommentsAPI(seasonId);
        setComments(res.data);
    };

    // Kết nối websocket
    useEffect(() => {
        loadComments();

        const socket = new SockJS("http://localhost:8083/ws");
        stompClient = over(socket);

        stompClient.connect({}, () => {
            // Nhận comment mới
            stompClient.subscribe(`/topic/movies/${seasonId}/comments`, (message) => {
                const newComment = JSON.parse(message.body);
                setComments(prev => [newComment, ...prev]);
            });

            // Nhận update like
            stompClient.subscribe(`/topic/comments/likes`, (message) => {
                const { commentId, likeCount } = JSON.parse(message.body);
                setComments(prev =>
                    prev.map(c =>
                        c.id === commentId ? { ...c, likeCount } : c
                    )
                );
            });
        });

        return () => {
            stompClient.disconnect();
        };
    }, [seasonId]);

    // Post comment mới
    const handlePost = async () => {
        if (!newContent.trim()) return;
        await postCommentAPI(seasonId, newContent);
        setNewContent("");
    };

    // Reply comment
    const handleReply = async (parentId, content) => {
        await replyCommentAPI(seasonId, parentId, content)
    };

    // Like comment
    const handleLike = async (commentId) => {
        await reactCommentAPI(commentId);
    };

    return (
        <div>
            <TextArea
                rows={3}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Write a comment..."
            />
            <Button type="primary" onClick={handlePost} style={{ marginTop: 8 }}>
                Bình luận
            </Button>
            <h3 style={{ color: "white" }}>Các Bình Luận Trước:</h3>

            <div style={{ marginTop: 16 }}>
                {comments.map(c => (
                    <CommentItem
                        key={c.id}
                        comment={c}
                        onReply={handleReply}
                        onLike={handleLike}
                    />
                ))}
            </div>
        </div>
    );
}

export default CommentList;