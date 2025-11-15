import React from "react";
import Card from "./Card";

interface HandProps {
    cards: any[];        
    title: string;
    handValue: number;
}


export default function Hand({cards, title,handValue} : HandProps)
{
    return(
        <div className="p-4">
            <h2 className="text-2xl mb-2">
                {title}:{handValue}
            </h2>
            <div className="flex flex-col sm:flex-row gap-1">
                {cards.map((card, index) => (
                    <Card key = {index} card ={card} />
                ))}
            </div>
        </div>
    );
}
