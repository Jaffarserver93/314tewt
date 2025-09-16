'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function ScrollToPlansButton() {
    const scrollToPlans = () => {
        document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <Button
            size="lg"
            onClick={scrollToPlans}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/30 text-secondary-foreground px-6 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-sm sm:text-lg transition-all duration-300 transform hover:scale-105 group"
        >
            View Plans
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
    );
}
