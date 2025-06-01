import axios from 'axios';
import { getCityGeocode, getWeatherForecast } from './mateoService.ts';
import { fetchWeatherApi } from 'openmeteo';

jest.spyOn(axios, 'get');

// Mock openmeteo's fetchWeatherApi
jest.mock('openmeteo', () => ({
  fetchWeatherApi: jest.fn(),
}));

const mockGeocodeResponse = {
  data: {
    results: [
      {
        latitude: 51.5074,
        longitude: -0.1278,
        name: 'London',
      },
    ],
  },
};

const mockErrorResponse = {
  error: 'Failed to fetch geocode data. Please try again later.',
};

describe('Mateo service functions', () => {
  describe('getCityGeocode', () => {
    test('should return geocode data for a valid city', async () => {
      // Arrange
      axios.get.mockResolvedValue(mockGeocodeResponse);

      // axios.get.mockResolvedValue(mockGeocodeResponse);
      const city = 'London';

      // Act
      const result = await getCityGeocode({ city });

      // Assert
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
      );
      expect(result).toEqual(mockGeocodeResponse.data.results[0]);
      expect(result.latitude).toBe(51.5074);
      expect(result.longitude).toBe(-0.1278);
      expect(result.name).toBe('London');
    });

    test('should return geocode data for a valid city', async () => {
      // Arrange
      axios.get.mockResolvedValue(mockGeocodeResponse);
      const city = 'London';

      // Act
      const result = await getCityGeocode({ city });

      // Assert
      expect(axios.get).toHaveBeenCalledWith(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
      );
      expect(result).toEqual(mockGeocodeResponse.data.results[0]);
      expect(result.latitude).toBe(51.5074);
      expect(result.longitude).toBe(-0.1278);
      expect(result.name).toBe('London');
    });

    test('should return error when city is not found', async () => {
      // Arrange
      axios.get.mockResolvedValue({ data: { results: [] } });
      const city = 'UnknownCity';

      // Act
      const result = await getCityGeocode({ city });

      // Assert
      expect(axios.get).toHaveBeenCalledWith(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
      );
      expect(result).toEqual({ error: `City "${city}" not found` });
    });

    test('should handle API errors', async () => {
      // Arrange
      axios.get.mockRejectedValue(new Error('Network error'));
      const city = 'London';

      // Act
      const result = await getCityGeocode({ city });

      // Assert
      expect(axios.get).toHaveBeenCalledWith(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
      );
      expect(result).toEqual(mockErrorResponse);
    });
  });
});