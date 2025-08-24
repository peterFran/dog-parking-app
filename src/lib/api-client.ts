const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

interface ApiError {
  error: string;
  message?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    token?: string
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token is provided
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({ 
          error: `HTTP Error ${response.status}` 
        }));
        throw new Error(errorData.message || errorData.error || `HTTP Error ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  // Public endpoints (no auth required)
  async getVenues() {
    return this.request('/venues');
  }

  async getVenue(id: string) {
    return this.request(`/venues/${id}`);
  }

  async getVenueSlots(id: string) {
    return this.request(`/venues/${id}/slots`);
  }

  // Protected endpoints (auth required)
  async registerOwner(data: any, token: string) {
    return this.request('/owners/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token);
  }

  async getOwnerProfile(token: string) {
    return this.request('/owners/profile', {}, token);
  }

  async updateOwnerProfile(data: any, token: string) {
    return this.request('/owners/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }, token);
  }

  async getDogs(token: string) {
    return this.request('/dogs', {}, token);
  }

  async createDog(data: any, token: string) {
    return this.request('/dogs', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token);
  }

  async getDog(id: string, token: string) {
    return this.request(`/dogs/${id}`, {}, token);
  }

  async updateDog(id: string, data: any, token: string) {
    return this.request(`/dogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, token);
  }

  async deleteDog(id: string, token: string) {
    return this.request(`/dogs/${id}`, {
      method: 'DELETE',
    }, token);
  }

  async getBookings(token: string) {
    return this.request('/bookings', {}, token);
  }

  async createBooking(data: any, token: string) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token);
  }

  async getBooking(id: string, token: string) {
    return this.request(`/bookings/${id}`, {}, token);
  }

  async updateBooking(id: string, data: any, token: string) {
    return this.request(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, token);
  }

  async cancelBooking(id: string, token: string) {
    return this.request(`/bookings/${id}`, {
      method: 'DELETE',
    }, token);
  }
}

export const apiClient = new ApiClient();
export default apiClient;