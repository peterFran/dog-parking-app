import { components, operations } from '../types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

// Type aliases for convenience
export type Dog = components['schemas']['DogResponse'];
export type DogRequest = components['schemas']['DogRequest'];
export type DogListResponse = components['schemas']['DogListResponse'];
export type OwnerProfileRequest = components['schemas']['OwnerProfileRequest'];
export type OwnerProfileResponse = components['schemas']['OwnerProfileResponse'];
export type BookingRequest = components['schemas']['BookingRequest'];
export type BookingResponse = components['schemas']['BookingResponse'];
export type BookingListResponse = components['schemas']['BookingListResponse'];
export type BookingUpdateRequest = components['schemas']['BookingUpdateRequest'];
export type VenueResponse = components['schemas']['VenueResponse'];
export type VenueRequest = components['schemas']['VenueRequest'];
export type VenueListResponse = components['schemas']['VenueListResponse'];
export type VenueSlotsResponse = components['schemas']['VenueSlotsResponse'];
export type ServiceType = components['schemas']['ServiceType'];
export type OperatingHours = components['schemas']['OperatingHours'];
export type DayHours = components['schemas']['DayHours'];
export type ErrorResponse = components['schemas']['ErrorResponse'];

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
      console.log(`[API] ${options.method || 'GET'} ${url}`);
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json().catch(() => ({
          error: `HTTP Error ${response.status}`
        }));
        console.error(`[API] Error ${response.status} for ${url}:`, errorData);
        throw new Error(errorData.error || `HTTP Error ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`[API] Request failed for ${url}:`, error);
      throw error;
    }
  }

  // Public endpoints (no auth required)
  async getVenues(): Promise<VenueResponse[]> {
    const response = await this.request<VenueListResponse>('/venues');
    return response.venues;
  }

  async getVenue(id: string): Promise<VenueResponse> {
    return this.request<VenueResponse>(`/venues/${id}`);
  }

  async getVenueSlots(venueId: string, startDate: string, endDate?: string): Promise<VenueSlotsResponse> {
    const params = new URLSearchParams({ start_date: startDate });
    if (endDate) params.append('end_date', endDate);
    return this.request<VenueSlotsResponse>(`/slots/venue/${venueId}?${params.toString()}`);
  }

  async createVenue(data: VenueRequest, token: string): Promise<VenueResponse> {
    return this.request<VenueResponse>('/venues', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token);
  }

  // Protected endpoints (auth required)
  async registerOwner(data: OwnerProfileRequest, token: string): Promise<OwnerProfileResponse> {
    return this.request<OwnerProfileResponse>('/owners/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token);
  }

  async getOwnerProfile(token: string): Promise<OwnerProfileResponse> {
    return this.request<OwnerProfileResponse>('/owners/profile', {}, token);
  }

  async updateOwnerProfile(data: OwnerProfileRequest, token: string): Promise<OwnerProfileResponse> {
    return this.request<OwnerProfileResponse>('/owners/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }, token);
  }

  async getDogs(token: string): Promise<Dog[]> {
    const response = await this.request<DogListResponse>('/dogs', {}, token);
    return response.dogs;
  }

  async createDog(data: DogRequest, token: string): Promise<Dog> {
    return this.request<Dog>('/dogs', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token);
  }

  async getDog(id: string, token: string): Promise<Dog> {
    return this.request<Dog>(`/dogs/${id}`, {}, token);
  }

  async updateDog(id: string, data: Partial<DogRequest>, token: string): Promise<Dog> {
    return this.request<Dog>(`/dogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, token);
  }

  async deleteDog(id: string, token: string): Promise<void> {
    return this.request<void>(`/dogs/${id}`, {
      method: 'DELETE',
    }, token);
  }

  async getBookings(token: string): Promise<BookingResponse[]> {
    const response = await this.request<BookingListResponse>('/bookings', {}, token);
    return response.bookings;
  }

  async createBooking(data: BookingRequest, token: string): Promise<BookingResponse> {
    return this.request<BookingResponse>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token);
  }

  async getBooking(id: string, token: string): Promise<BookingResponse> {
    return this.request<BookingResponse>(`/bookings/${id}`, {}, token);
  }

  async updateBooking(id: string, data: BookingUpdateRequest, token: string): Promise<BookingResponse> {
    return this.request<BookingResponse>(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, token);
  }

  async cancelBooking(id: string, token: string): Promise<BookingResponse> {
    return this.request<BookingResponse>(`/bookings/${id}`, {
      method: 'DELETE',
    }, token);
  }
}

export const apiClient = new ApiClient();
export default apiClient;