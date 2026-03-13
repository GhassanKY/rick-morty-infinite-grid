'use client'
import { motion } from 'framer-motion';
import SmartImage from './SmartImage';
import { Character } from '../intefaces/character';

interface PhotoCardProps {
    character: Character;
    onDelete: (id: number) => void;
}

export default function PhotoCard({ character, onDelete }: PhotoCardProps) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
            <div className="flex flex-col gap-2">
                <div className="aspect-square relative overflow-hidden rounded-xl shadow-sm">
                    <SmartImage
                        src={character.image}
                        alt={character.name}
                        width={300}
                        height={300}
                        className="object-cover w-full h-full"
                        onDelete={() => onDelete(character.id)}
                    />
                </div>
                <p className="text-sm font-medium line-clamp-1 text-gray-700 dark:text-gray-300 px-1">
                    {character.name}
                </p>
            </div>
        </motion.div>
    );
}
