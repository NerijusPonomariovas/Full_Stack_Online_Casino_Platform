import React from "react";

interface CardProps {
    card: {
        suit: string;
        rank: string;
    };
}

const Card: React.FC<CardProps> = ({ card }) => {
    return (
        <div>
            <p>{card.rank} of {card.suit}</p>
        </div>
    );
};

export default Card;
