export interface Character {
    id:       number;
    name:     string;
    status:   Status;
    species:  Species;
    type:     string;
    gender:   Gender;
    origin:   Location;
    location: Location;
    image:    string;
    episode:  string[];
    url:      string;
    created:  Date;
}

interface Location {
    name: string;
    url:  string;
}

type Gender = "Female" | "Male" | "unknown"

type Species = "Alien" | "Human"

type Status = "Alive" | "Dead" | "unknown"

