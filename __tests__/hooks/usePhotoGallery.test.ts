import { renderHook, act, waitFor } from '@testing-library/react';
import { usePhotoGallery } from '../../app/hooks/usePhotoGallery';
import { getPhotos } from '../../app/actions/getPhotos';
import { Character } from '../../app/intefaces/character';
import { ApiResponse, EMPTY_API_RESPONSE } from '../../app/intefaces/apiResponse';
import { APP_CONFIG } from '../../app/constants/api';

jest.mock('../../app/actions/getPhotos', () => ({
  getPhotos: jest.fn(),
}));

const createMockCharacter = (id: number, name: string): Character => ({
    id,
    name,
    status: "Alive",
    species: "Human",
    type: "",
    gender: "Male",
    origin: { name: "Earth", url: "" },
    location: { name: "Earth", url: "" },
    image: `https://rickandmortyapi.com/api/character/avatar/${id}.jpeg`,
    episode: [],
    url: "",
    created: new Date()
});

const mockInitialData: Character[] = [
    createMockCharacter(1, 'Rick Sanchez'),
    createMockCharacter(2, 'Morty Smith'),
];

describe('usePhotoGallery Hook', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with provided initialData', () => {
    const { result } = renderHook(() => usePhotoGallery({ initialData: mockInitialData }));

    expect(result.current.photos).toEqual(mockInitialData);
    expect(result.current.hasMore).toBe(true);
  });

  it('should remove a photo correctly by id', () => {
    const { result } = renderHook(() => usePhotoGallery({ initialData: mockInitialData }));

    act(() => {
      result.current.handleDelete(1);
    });

    expect(result.current.photos).toHaveLength(1);
    expect(result.current.photos[0].id).toBe(2);
  });

  it(`should trigger loadMorePhotos automatically if initial photos are less than ${APP_CONFIG.MIN_ITEMS_THRESHOLD}`, async () => {
    const extraPhotos: Character[] = [createMockCharacter(3, 'Summer Smith')];
    const mockResponse: ApiResponse = { info: { count: 1, next: "next", pages: 1, prev: null}, results: extraPhotos };
    (getPhotos as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => usePhotoGallery({ initialData: mockInitialData }));

    await waitFor(() => {
      expect(result.current.isFetching).toBe(false);
      expect(getPhotos).toHaveBeenCalledWith(2);
    });
  });

  it('should fetch the next page correctly on successful call', async () => {
    const batch1: Character[] = [createMockCharacter(21, 'p3')];
    const response1: ApiResponse = { info: { count: 1, next: "next", pages: 2, prev: null}, results: batch1 };
    
    const batch2: Character[] = [createMockCharacter(22, 'p4')];
    const response2: ApiResponse = { info: { count: 1, next: "next", pages: 2, prev: null}, results: batch2 };
    
    (getPhotos as jest.Mock)
      .mockResolvedValueOnce(response1)
      .mockResolvedValueOnce(response2);

    const initialData = Array(APP_CONFIG.MIN_ITEMS_THRESHOLD + 1).fill(null).map((_, i) => createMockCharacter(i + 1, `Char ${i}`));
    const { result } = renderHook(() => usePhotoGallery({ initialData }));

    await act(async () => {
      await result.current.loadMorePhotos();
    });
    expect(getPhotos).toHaveBeenCalledWith(2);

    await act(async () => {
      await result.current.loadMorePhotos();
    });
    expect(getPhotos).toHaveBeenCalledWith(3);
  });

  it('should set hasMore to false when API returns an empty array', async () => {
    (getPhotos as jest.Mock).mockResolvedValue(EMPTY_API_RESPONSE);

    // Initial data < threshold triggers a fetch
    const { result } = renderHook(() => usePhotoGallery({ initialData: mockInitialData }));

    await waitFor(() => {
      expect(result.current.hasMore).toBe(false);
    });
    
    jest.clearAllMocks();
    
    await act(async () => {
      await result.current.loadMorePhotos();
    });
    expect(getPhotos).not.toHaveBeenCalled();
  });

  it('should prevent race conditions by ignoring duplicate calls while fetching', async () => {
    let resolveApi: (value: unknown) => void = () => {};
    (getPhotos as jest.Mock).mockReturnValue(new Promise((resolve) => { resolveApi = resolve; }));

    const initialData = Array(APP_CONFIG.MIN_ITEMS_THRESHOLD + 1).fill(null).map((_, i) => createMockCharacter(i + 1, `Char ${i}`));
    const { result } = renderHook(() => usePhotoGallery({ initialData }));

    await act(async () => {
      const p1 = result.current.loadMorePhotos();
      const p2 = result.current.loadMorePhotos();
      const mockResponse: ApiResponse = { info: { count: 1, next: "next", pages: 1, prev: null}, results: [createMockCharacter(99, 'new')] };
      resolveApi(mockResponse);
      await Promise.all([p1, p2]);
    });

    expect(getPhotos).toHaveBeenCalledTimes(1); 
  });

  it('should handle API errors gracefully and reset isFetching state', async () => {
    (getPhotos as jest.Mock).mockRejectedValue(new Error('500 Internal Server Error'));
    
    const initialData = Array(APP_CONFIG.MIN_ITEMS_THRESHOLD + 1).fill(null).map((_, i) => createMockCharacter(i + 1, `Char ${i}`));
    const { result } = renderHook(() => usePhotoGallery({ initialData }));

    expect(result.current.isFetching).toBe(false);

    await act(async () => {
      await result.current.loadMorePhotos();
    });

    expect(result.current.isFetching).toBe(false);
    expect(console.error).toHaveBeenCalled();
  });

  it('should toggle isFetching to true during API call and false when complete', async () => {
    let resolveApi: (value: unknown) => void = () => {};
    const promise = new Promise((resolve) => { resolveApi = resolve; });
    (getPhotos as jest.Mock).mockReturnValue(promise);

    const initialData = Array(APP_CONFIG.MIN_ITEMS_THRESHOLD + 1).fill(null).map((_, i) => createMockCharacter(i + 1, `Char ${i}`));
    const { result } = renderHook(() => usePhotoGallery({ initialData }));

    expect(result.current.isFetching).toBe(false);

    let loadPromise: Promise<void> | undefined;
    
    act(() => {
      loadPromise = result.current.loadMorePhotos();
    });

    expect(result.current.isFetching).toBe(true);

    await act(async () => {
      const mockResponse: ApiResponse = { info: { count: 1, next: "next", pages: 1, prev: null}, results: [createMockCharacter(99, 'new')] };
      resolveApi(mockResponse);
      await loadPromise;
    });

    expect(result.current.isFetching).toBe(false);
  });

  it(`should not automatically fetch if initial data has exactly or more than ${APP_CONFIG.MIN_ITEMS_THRESHOLD} photos`, async () => {
    const initialData = Array(APP_CONFIG.MIN_ITEMS_THRESHOLD).fill(null).map((_, i) => createMockCharacter(i + 1, `Char ${i}`));
    renderHook(() => usePhotoGallery({ initialData }));

    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
    });

    expect(getPhotos).not.toHaveBeenCalled();
  });
});
