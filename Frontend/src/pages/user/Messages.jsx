import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaUser } from 'react-icons/fa';
import { messageAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Messages.css';

const Messages = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (selectedPartner) {
            fetchMessages(selectedPartner.partnerId);
        }
    }, [selectedPartner]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchConversations = async () => {
        try {
            const response = await messageAPI.getConversations();
            setConversations(response.data.data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (partnerId) => {
        try {
            const response = await messageAPI.getMessages(partnerId);
            setMessages(response.data.data.messages);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedPartner) return;

        try {
            await messageAPI.sendMessage({
                maNguoiNhan: selectedPartner.partnerId,
                noiDung: newMessage
            });
            setNewMessage('');
            fetchMessages(selectedPartner.partnerId);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    if (loading) return <div className="loading">Đang tải...</div>;

    return (
        <div className="messages-page">
            <div className="chat-container">
                <div className="conversations-list">
                    <h3>Tin nhắn</h3>
                    {conversations.length === 0 ? (
                        <p className="no-conv">Chưa có tin nhắn</p>
                    ) : (
                        conversations.map(conv => (
                            <div
                                key={conv.partnerId}
                                className={`conv-item ${selectedPartner?.partnerId === conv.partnerId ? 'active' : ''}`}
                                onClick={() => setSelectedPartner(conv)}
                            >
                                <div className="conv-avatar"><FaUser /></div>
                                <div className="conv-info">
                                    <strong>{conv.partnerName}</strong>
                                    <p>{conv.lastMessage?.substring(0, 30)}...</p>
                                </div>
                                {conv.unreadCount > 0 && (
                                    <span className="unread-badge">{conv.unreadCount}</span>
                                )}
                            </div>
                        ))
                    )}
                </div>

                <div className="chat-main">
                    {selectedPartner ? (
                        <>
                            <div className="chat-header">
                                <div className="partner-avatar"><FaUser /></div>
                                <div className="partner-info">
                                    <strong>{selectedPartner.partnerName}</strong>
                                    <small>{selectedPartner.partnerRole === 'landlord' ? 'Chủ trọ' : 'Người dùng'}</small>
                                </div>
                            </div>

                            <div className="chat-messages">
                                {messages.map(msg => (
                                    <div
                                        key={msg.maTinNhan}
                                        className={`message ${msg.maNguoiGui === user.maNguoiDung ? 'sent' : 'received'}`}
                                    >
                                        <div className="message-content">
                                            <p>{msg.noiDung}</p>
                                            <small>{new Date(msg.thoiGian).toLocaleString('vi-VN')}</small>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            <form onSubmit={handleSend} className="chat-input">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Nhập tin nhắn..."
                                />
                                <button type="submit"><FaPaperPlane /></button>
                            </form>
                        </>
                    ) : (
                        <div className="no-chat-selected">
                            <p>Chọn một cuộc hội thoại để xem tin nhắn</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messages;
