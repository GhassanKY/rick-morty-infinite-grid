import { getPhotos } from '../../app/actions/getPhotos';
import api from '../../app/services/axios';
import { Character } from '../../app/intefaces/character';
import { ApiResponse, EMPTY_API_RESPONSE } from '../../app/intefaces/apiResponse';

jest.mock('../../app/services/axios', () => ({
  get: jest.fn(),
  isAxiosError: jest.fn().mockReturnValue(false)
}));

jest.mock('axios', () => ({
  isAxiosError: jest.fn()
}));

describe('getPhotos Action', () => {
  
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
    (console.warn as jest.Mock).mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockCharacter: Character = {
    id: 1,
    name: "Rick",
    status: "Alive",
    species: "Human",
    type: "",
    gender: "Male",
    origin: { name: "", url: "" },
    location: { name: "", url: "" },
    image: "",
    episode: [],
    url: "",
    created: new Date()
  };

  const mockApiResponse: ApiResponse = {
    info: { count: 1, pages: 1, next: null, prev: null },
    results: [mockCharacter]
  };

  it('should fetch photos successfully', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockApiResponse });

    const result = await getPhotos(1);

    expect(api.get).toHaveBeenCalledWith('/character', {
      params: { page: 1 },
    });
    expect(result).toEqual(mockApiResponse);
  });

  it('should return EMPTY_API_RESPONSE if data schema is invalid (fails isValidResponse hook)', async () => {
    const mockCorruptData = { results: "Not an array of characters" };
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockCorruptData });

    const result = await getPhotos(1);

    expect(api.get).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
    expect(result).toEqual(EMPTY_API_RESPONSE); 
  });

  it('should catch API errors, log them, and return EMPTY_API_RESPONSE', async () => {
    const mockError = new Error('API Timeout');
    (api.get as jest.Mock).mockRejectedValueOnce(mockError);

    const result = await getPhotos(1);

    expect(console.error).toHaveBeenCalled();
    expect(result).toEqual(EMPTY_API_RESPONSE);
  });
});
