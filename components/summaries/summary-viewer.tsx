'use client'

import {
    Card,
} from "@/components/ui/card"
import { useState, useMemo } from "react";
import { NavigationControls } from "./navigation-controls";
import ProgressBar from "./progress-bar";
import { parseSection } from "@/utils/summary-helper";
import ContentSection from "./content-section";
import { MotionDiv } from "../common/motion-wrapper";
import { easeInOut } from "motion/react";

const SectionTitle = ({ title }: { title: string }) => {
    return (
        <div className="flex flex-col gap-2 mb-6 sticky top-0 pt-2 pb-4 bg-emerald-50/80 backdrop-blur-xs z-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-center flex items-center justify-center gap-2 text-emerald-700">{title}</h2>
        </div>
    );
};

export default function SummaryViewer({ summary }: { summary: string }) {
    const sections = useMemo(() => 
        summary
            .split('\n#')
            .map(s => s.trim())
            .filter(Boolean)
            .map(parseSection)
    , [summary]);

    const [currentSection, setCurrentSection] = useState(0);

    if (sections.length === 0) {
        return (
            <Card className="p-4 text-center text-emerald-400">
                No summary sections available.
            </Card>
        );
    }

    const handleNext = () =>
        setCurrentSection(prev => Math.min(prev + 1, sections.length - 1));

    const handlePrevious = () =>
        setCurrentSection(prev => Math.max(prev - 1, 0));

    return (
        <Card
            className="
                relative px-2
                h-[500px] sm:h-[600px] lg:h-[700px]
                w-full xl:w-[600px]
                overflow-hidden
                bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50
                backdrop-blur-lg shadow-2xl rounded-3xl
                border border-emerald-300
            "
        >
            <ProgressBar sections={sections} currentSection={currentSection} />

            <MotionDiv
                key={currentSection}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: easeInOut }}
                className="h-full overflow-y-auto scrollbar-hide pt-12 sm:pt-16 pb-20 sm:pb-24"
            >
                <div className="px-4 sm:px-6">
                    <SectionTitle title={sections[currentSection]?.title} />
                    <ContentSection 
                        title={sections[currentSection]?.title || ''} 
                        points={sections[currentSection]?.points || []} 
                    />
                </div>
            </MotionDiv>

            <NavigationControls
                currentSection={currentSection}
                totalSections={sections.length}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onSectionSelect={setCurrentSection}
            />
        </Card>
    );
}
