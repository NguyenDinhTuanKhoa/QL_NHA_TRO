import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaPaperPlane, FaUser, FaPlus, FaTimes, FaSearch } from 'react-icons/fa';
import { messageAPI, landlordAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Messages.css';

const Messages = () => {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const [conversations, setConversations] = useState([]);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [showNewChat, setShowNewChat] = useState(false);
    const [tenants, setTenants] = useState([]);
    const [searchTenant, setSearchTenant] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchConversations();
        // Nếu là chủ trọ, lấy danh sách người thuê
        if (user?.vaiTro === 'landlord') {
            fetchTenants();
        }
    }, [user]);

    // Xử lý khi có partner từ URL
    useEffect(() => {
        const partnerId = searchParams.get('partner');
        if (partnerId && partnerId !== 'undefined') {
            // Tìm trong conversations hoặc tạo mới
            const existingConv = conversations.find(c => c.partnerId === partnerId);
            if (existingConv) {
                setSelectedPartner(existingConv);
            } else {
                // Tạo conversation mới với partner
                loadPartnerInfo(partnerId);
            }
        }
    }, [searchParams, conversations]);

    const loadPartnerInfo = async (partnerId) => {
        try {
            const response = await messageAPI.getMessages(partnerId);
            if (response.data.data.partner) {
                setSelectedPartner({
                    partnerId: response.data.data.partner.maNguoiDung,
                    partnerName: response.data.data.partner.tenNguoiDung,
                    partnerRole: response.data.data.partner.vaiTro
                });
                setMessages(response.data.data.messages || []);
            }
        } catch (error) {
            console.error('Error loading partner:', error);
        }
    };

    // Lấy danh sách người đã gửi yêu cầu thuê (cho chủ trọ)
    const fetchTenants = async () => {
        try {
            const response = await landlordAPI.getYeuCau();
            // Lọc unique người thuê
            const uniqueTenants = [];
            const seen = new Set();
            response.data.data.forEach(req => {
                if (!seen.has(req.maNguoiThue)) {
                    seen.add(req.maNguoiThue);
                    uniqueTenants.push({
                        maNguoiDung: req.maNguoiThue,
                        tenNguoiDung: req.tenNguoiDung,
                        sdtNguoiDung: req.sdtNguoiDung
                    });
                }
            });
            setTenants(uniqueTenants);
        } catch (error) {
            console.error('Error fetching tenants:', error);
        }
    };

    const startNewChat = (tenant) => {
        setSelectedPartner({
            partnerId: tenant.maNguoiDung,
            partnerName: tenant.tenNguoiDung,
            partnerRole: 'user'
        });
        setShowNewChat(false);
        setSearchTenant('');
    };

    const filteredTenants = tenants.filter(t => 
        t.tenNguoiDung.toLowerCase().includes(searchTenant.toLowerCase()) ||
        t.sdtNguoiDung?.includes(searchTenant)
    );

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
            {/* Modal chọn người nhắn tin */}
            {showNewChat && (
                <div className="new-chat-modal">
                    <div className="new-chat-content">
                        <div className="new-chat-header">
                            <h3>Chọn người nhắn tin</h3>
                            <button onClick={() => setShowNewChat(false)}><FaTimes /></button>
                        </div>
                        <div className="new-chat-search">
                            <FaSearch />
                            <input
                                type="text"
                                placeholder="Tìm theo tên hoặc SĐT..."
                                value={searchTenant}
                                onChange={(e) => setSearchTenant(e.target.value)}
                            />
                        </div>
                        <div className="tenant-list">
                            {filteredTenants.length === 0 ? (
                                <p className="no-tenant">Không tìm thấy người thuê</p>
                            ) : (
                                filteredTenants.map(tenant => (
                                    <div 
                                        key={tenant.maNguoiDung} 
                                        className="tenant-item"
                                        onClick={() => startNewChat(tenant)}
                                    >
                                        <div className="tenant-avatar"><FaUser /></div>
                                        <div className="tenant-info">
                                            <strong>{tenant.tenNguoiDung}</strong>
                                            <small>{tenant.sdtNguoiDung}</small>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="chat-container">
                <div className="conversations-list">
                    <div className="conv-header">
                        <h3>Tin nhắn</h3>
                        {user?.vaiTro === 'landlord' && (
                            <button className="btn-new-chat" onClick={() => setShowNewChat(true)}>
                                <FaPlus />
                            </button>
                        )}
                    </div>
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
