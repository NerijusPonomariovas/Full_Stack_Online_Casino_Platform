import React from "react";
import Card from "./Card";
import { motion } from "framer-motion";
import backCard from "../assets/Cards/BackCard.svg";

interface HandProps {
    cards: any[];
    title: string;
    handValue: number;
    hideFirstCard?: boolean;
    status?: "win" | "lose" | "neutral" | "tie";
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

export default function Hand({
    cards,
    title,
    handValue,
    hideFirstCard = false,
    status = "neutral",
}: HandProps) {
    return (
        <div className="p-4 rounded-xl">
            <h2 className="text-2xl mb-2">
                {title}:{handValue}
            </h2>

            <motion.div
                className="flex flex-row"
                variants={handVariants}
                initial="hidden"
                animate="visible"
            >
                {cards.map((card, index) => {
                    // ❗ Nakładanie i opadanie kart robimy na style, nie Tailwind
                    const style: React.CSSProperties = {
                        marginLeft: index === 0 ? 0 : -24, // -24px overlap (zwiększ do -32/-40 jeśli chcesz większe nachodzenie)
                        marginTop: index * 6,              // każda kolejna o 6px niżej
                    };

                    if (hideFirstCard && index === 0) {
                        // zakryta pierwsza karta dealera
                        return (
                            <motion.img
                                key={`hidden-${index}`}
                                src={backCard}
                                alt="Hidden card"
                                className="w-[80px] h-[120px] rounded-lg"
                                style={style}
                            />
                        );
                    }

                    // zwykła karta
                    return (
                        <div key={index} style={style}>
                            <Card card={card} status={status} />
                        </div>
                    );
                })}
            </motion.div>
        </div>
    );
}
