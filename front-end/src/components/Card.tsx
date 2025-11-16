import React from "react";
import { motion, type Variants } from "framer-motion";

interface CardProps {
    card: {
        suit: string;
        rank: string;
    };
}

const cardVariants = {
    hidden: {
        opacity: 0,
        y: -25,
        scale: 0.9,
        rotate: -5,
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        rotate: 0,
        transition: {
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 0.25,
        }
    }
};

const Card: React.FC<CardProps> = ({ card }) => {
    const imgName = `${card.rank}_of_${card.suit}.svg`; 
    const imgPath = `/src/assets/Cards/${imgName}`;
    return (
         <motion.div
            className="card flex flex-col items-center"
            variants={cardVariants as any}
            initial="hidden"
            animate="visible"
        >
            <img
                src={imgPath}
                alt={`${card.rank} of ${card.suit}`}
                className="w-20 h-auto"
                onError={(e) => {
                    e.currentTarget.style.display = "none";
                }}
            />
        </motion.div>
    );
};

export default Card;
