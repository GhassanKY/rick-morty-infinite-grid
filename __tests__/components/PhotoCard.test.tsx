import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PhotoCard from '../../app/components/PhotoCard';
import { Character, Status, Species, Gender } from '../../app/intefaces/character';

jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, initial, animate, exit, transition, layout, ...props }: any) =>
            <div {...props}>{children}</div>,
    },
}));

describe('PhotoCard Component', () => {
    const mockCharacter: Character = {
        id: 101,
        name: "Rick Sanchez",
        status: Status.Alive,
        species: Species.Human,
        type: "",
        gender: Gender.Male,
        origin: { name: "Earth", url: "" },
        location: { name: "Earth", url: "" },
        image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
        episode: [],
        url: "",
        created: new Date("2017-11-04T18:48:46.250Z")
    };

    const mockOnDelete = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render the correct character name', () => {
        render(<PhotoCard character={mockCharacter} onDelete={mockOnDelete} />);

        const titleElement = screen.getByText("Rick Sanchez");
        expect(titleElement).toBeInTheDocument();
    });

    it('should pass down the onDelete callback to the SmartImage component', async () => {
        const user = userEvent.setup();

        render(<PhotoCard character={mockCharacter} onDelete={mockOnDelete} />);

        const deleteButton = screen.getByRole('button', { name: `Eliminar imagen de ${mockCharacter.name}` });

        await user.click(deleteButton);

        expect(mockOnDelete).toHaveBeenCalledTimes(1);
        expect(mockOnDelete).toHaveBeenCalledWith(101);
    });
});
