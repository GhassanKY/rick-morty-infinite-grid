import { render, screen } from '@testing-library/react';
import PhotoGallery from '../../app/components/PhotoGallery';
import { usePhotoGallery } from '../../app/hooks/usePhotoGallery';
import { Character, Status, Species, Gender } from '../../app/intefaces/character';
import React, { ReactNode, ImgHTMLAttributes } from 'react';
import { ImageProps } from 'next/image';

jest.mock('../../app/hooks/usePhotoGallery', () => ({
    usePhotoGallery: jest.fn(),
}));

jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, initial, animate, exit, transition, layout, ...props }: any) =>
            <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

jest.mock('react-infinite-scroll-component', () => {
    return function MockInfiniteScroll({
        children,
        loader,
        endMessage,
        hasMore,
    }: {
        children: ReactNode;
        loader: ReactNode;
        endMessage: ReactNode;
        hasMore: boolean;
    }) {
        return (
            <div data-testid="infinite-scroll">
                {children}
                {hasMore ? loader : endMessage}
            </div>
        );
    };
});

jest.mock('next/image', () => {
    return function MockImage(props: ImageProps) {
        const imgProps = { ...props } as ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; unoptimized?: boolean };
        delete imgProps.fill;
        delete imgProps.unoptimized;

        return React.createElement('img', { ...imgProps, alt: props.alt || '' });
    };
});

describe('PhotoGallery Component', () => {

    const createMockCharacter = (id: number, name: string): Character => ({
        id,
        name,
        status: Status.Alive,
        species: Species.Human,
        type: "",
        gender: Gender.Male,
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

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render the gallery with the mocked photos', () => {
        (usePhotoGallery as jest.Mock).mockReturnValue({
            photos: mockInitialData,
            handleDelete: jest.fn(),
            loadMorePhotos: jest.fn(),
            hasMore: true,
            isFetching: false,
        });

        render(<PhotoGallery initialData={mockInitialData} />);

        expect(usePhotoGallery).toHaveBeenCalledWith({ initialData: mockInitialData });
        expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
        expect(screen.getByText('Morty Smith')).toBeInTheDocument();
        expect(screen.getByTestId('infinite-scroll')).toBeInTheDocument();
    });

    it('should display the EndMessage when hasMore is false', () => {
        (usePhotoGallery as jest.Mock).mockReturnValue({
            photos: mockInitialData,
            handleDelete: jest.fn(),
            loadMorePhotos: jest.fn(),
            hasMore: false,
            isFetching: false,
        });

        render(<PhotoGallery initialData={mockInitialData} />);

        const endMessage = screen.getByText('Has llegado al final de la galería.');
        expect(endMessage).toBeInTheDocument();
    });
});
