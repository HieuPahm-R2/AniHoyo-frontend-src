import { Avatar, Tooltip, Button, Input } from "antd";
import { LikeOutlined, LikeFilled } from "@ant-design/icons";
import { Comment } from '@ant-design/compatible';
import { useState } from "react";

const { TextArea } = Input;

const CommentItem = ({ comment, onReply, onLike }) => {
    const [replying, setReplying] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [liked, setLiked] = useState(false);

    const handleReplySubmit = () => {
        if (replyContent.trim()) {
            onReply(comment.id, replyContent);
            setReplyContent("");
            setReplying(false);
        }
    };

    return (
        <Comment
            author={comment.fullName}
            avatar={<Avatar src={`${import.meta.env.VITE_BACKEND_URL}/storage/temp/user33.svg`} />}
            content={<p>{comment.content}</p>}
            datetime={comment.createdAt}
            actions={[
                <span onClick={() => { setLiked(!liked); onLike(comment.id); }}>
                    {liked ? <LikeFilled /> : <LikeOutlined />} {comment.likeCount}
                </span>,
                <span onClick={() => setReplying(!replying)}>Reply</span>
            ]}
        >
            {replying && (
                <div style={{ marginBottom: 8 }}>
                    <TextArea
                        rows={2}
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                    />
                    <Button type="primary" size="small" onClick={handleReplySubmit} style={{ marginTop: 4 }}>
                        Submit
                    </Button>
                </div>
            )}

            {/* Render replies (đệ quy) */}
            {comment.replies?.map(reply => (
                <CommentItem
                    key={reply.id}
                    comment={reply}
                    onReply={onReply}
                    onLike={onLike}
                />
            ))}
        </Comment>
    );
}

export default CommentItem