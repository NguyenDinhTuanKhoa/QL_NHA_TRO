import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor - thêm token vào header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - xử lý lỗi
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;

// API functions
export const phongtroAPI = {
    getAll: (params) => api.get('/phongtro', { params }),
    getById: (id) => api.get(`/phongtro/${id}`),
    addReview: (data) => api.post('/phongtro/review', data)
};

export const landlordAPI = {
    getStats: () => api.get('/landlord/stats'),
    getKhuTro: () => api.get('/landlord/khutro'),
    addKhuTro: (data) => api.post('/landlord/khutro', data),
    getPhongTro: () => api.get('/landlord/phongtro'),
    addPhongTro: (data) => api.post('/landlord/phongtro', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    updateStatus: (id, data) => api.patch(`/landlord/phongtro/${id}/status`, data),
    updatePaymentStatus: (id, data) => api.patch(`/landlord/phongtro/${id}/payment`, data),
    deletePhongTro: (id) => api.delete(`/landlord/phongtro/${id}`),
    getLoaiPhong: () => api.get('/landlord/loaiphong'),
    addLoaiPhong: (data) => api.post('/landlord/loaiphong', data),
    getYeuCau: () => api.get('/landlord/yeucau'),
    updateYeuCau: (id, data) => api.patch(`/landlord/yeucau/${id}`, data),
    extendRental: (id, data) => api.post(`/landlord/phongtro/${id}/extend`, data),
    checkExpired: () => api.post('/landlord/check-expired'),
    sendPaymentReminder: () => api.post('/landlord/send-payment-reminder')
};

export const notificationAPI = {
    getAll: () => api.get('/notification'),
    markAsRead: (id) => api.patch(`/notification/${id}/read`),
    markAllAsRead: () => api.patch('/notification/read-all'),
    checkPayment: () => api.post('/notification/check-payment')
};

export const messageAPI = {
    getConversations: () => api.get('/message/conversations'),
    getMessages: (partnerId) => api.get(`/message/${partnerId}`),
    sendMessage: (data) => api.post('/message/send', data),
    sendYeuCau: (data) => api.post('/message/yeucau', data),
    getMyYeuCau: () => api.get('/message/yeucau/my')
};

export const adminAPI = {
    getStats: () => api.get('/admin/stats'),
    getUsers: () => api.get('/admin/users'),
    addUser: (data) => api.post('/admin/users', data),
    updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
    updateUserStatus: (id, data) => api.patch(`/admin/users/${id}/status`, data),
    updateUserRole: (id, data) => api.patch(`/admin/users/${id}/role`, data),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
    getRooms: () => api.get('/admin/rooms'),
    updateRoomStatus: (id, data) => api.patch(`/admin/rooms/${id}/status`, data),
    deleteRoom: (id) => api.delete(`/admin/rooms/${id}`),
    getRequests: () => api.get('/admin/requests')
};
