import React from "react";
import Card from "./Card";
import { motion } from "framer-motion";
import backCard from "../assets/Cards/BackCard.svg";

interface HandProps {
    cards: any[];        
    title: string;
    handValue: number;
    hideFirstCard?: boolean;
}


const handVariants = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.07,
            when: "beforeChildren",
        },
    },
};

export default function Hand({cards, title,handValue, hideFirstCard = false} : HandProps)
{
    console.log("backCard =", backCard);
    return(
        <div className="p-4">
            <h2 className="text-2xl mb-2">
                {title}:{handValue}
            </h2>
            <motion.div
                className="flex flex-row gap-2"
                variants={handVariants}
                initial="hidden"
                animate="visible"
            >
            {cards.map((card, index) => {
                if (hideFirstCard && index === 0) {
                    return (
                        <motion.img
                            key={`hidden-${index}`}
                            src={backCard}
                            alt="Hidden card"
                            className="w-[80px] h-[120px] rounded-lg"
                        />
                    );
                }
                    return <Card key={index} card={card} />;
                })}
            </motion.div>
        </div>
    );
}
