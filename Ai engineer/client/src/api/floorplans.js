import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
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

// Floorplan API functions
export const getFloorplans = async (params = {}) => {
  try {
    const response = await api.get('/floorplans', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch floorplans');
  }
};

export const getFloorplan = async (id) => {
  try {
    const response = await api.get(`/floorplans/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch floorplan');
  }
};

export const createFloorplan = async (floorplanData) => {
  try {
    const response = await api.post('/floorplans', floorplanData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create floorplan');
  }
};

export const updateFloorplan = async (id, updateData) => {
  try {
    const response = await api.put(`/floorplans/${id}`, updateData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update floorplan');
  }
};

export const deleteFloorplan = async (id) => {
  try {
    const response = await api.delete(`/floorplans/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete floorplan');
  }
};

export const duplicateFloorplan = async (id) => {
  try {
    const response = await api.post(`/floorplans/${id}/duplicate`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to duplicate floorplan');
  }
};

export const addCollaborator = async (id, collaboratorData) => {
  try {
    const response = await api.post(`/floorplans/${id}/collaborate`, collaboratorData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add collaborator');
  }
};

export const getPublicFloorplans = async (params = {}) => {
  try {
    const response = await api.get('/floorplans/public', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch public floorplans');
  }
};

// AI API functions
export const generateAISuggestions = async (floorplanData, prompt) => {
  try {
    const response = await api.post('/ai/suggestions', {
      floorplanData,
      prompt
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to generate AI suggestions');
  }
};

export const applyAISuggestion = async (floorplanId, suggestionId) => {
  try {
    const response = await api.post('/ai/apply-suggestion', {
      floorplanId,
      suggestionId
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to apply AI suggestion');
  }
};

export const generateInteriorDesign = async (roomData, style, referenceImage) => {
  try {
    const formData = new FormData();
    formData.append('roomData', JSON.stringify(roomData));
    formData.append('style', style);
    if (referenceImage) {
      formData.append('referenceImage', referenceImage);
    }

    const response = await api.post('/ai/interior-design', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to generate interior design');
  }
};

// Cost estimation API
export const calculateCostEstimate = async (floorplanData, settings) => {
  try {
    const response = await api.post('/ai/cost-estimate', {
      floorplanData,
      settings
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to calculate cost estimate');
  }
};

// Material marketplace API
export const getMaterials = async (category, filters = {}) => {
  try {
    const response = await api.get('/materials', {
      params: { category, ...filters }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch materials');
  }
};

export const getMaterialDetails = async (materialId) => {
  try {
    const response = await api.get(`/materials/${materialId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch material details');
  }
};

// Engineer directory API
export const getEngineers = async (location, specialty) => {
  try {
    const response = await api.get('/engineers', {
      params: { location, specialty }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch engineers');
  }
};

export const getEngineerProfile = async (engineerId) => {
  try {
    const response = await api.get(`/engineers/${engineerId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch engineer profile');
  }
};

export const contactEngineer = async (engineerId, message) => {
  try {
    const response = await api.post(`/engineers/${engineerId}/contact`, {
      message
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to contact engineer');
  }
};

// Payment API
export const createPaymentIntent = async (floorplanId, planType) => {
  try {
    const response = await api.post('/payments/create-intent', {
      floorplanId,
      planType
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create payment intent');
  }
};

export const confirmPayment = async (paymentIntentId) => {
  try {
    const response = await api.post('/payments/confirm', {
      paymentIntentId
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to confirm payment');
  }
};

// Export/Import API
export const exportFloorplan = async (floorplanId, format = 'json') => {
  try {
    const response = await api.get(`/floorplans/${floorplanId}/export`, {
      params: { format },
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to export floorplan');
  }
};

export const importFloorplan = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/floorplans/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to import floorplan');
  }
};

// 3D/360° rendering API
export const generate3DView = async (floorplanData) => {
  try {
    const response = await api.post('/render/3d', {
      floorplanData
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to generate 3D view');
  }
};

export const generate360View = async (floorplanData, roomId) => {
  try {
    const response = await api.post('/render/360', {
      floorplanData,
      roomId
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to generate 360° view');
  }
};

export default api;
