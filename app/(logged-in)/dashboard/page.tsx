import BgGradient from "@/components/common/bg-gradient";
import { MotionDiv, MotionH1, MotionP } from "@/components/common/motion-wrapper";
import EmptySummaryState from "@/components/summaries/empty-summary-state";
import SummaryCard from "@/components/summaries/summary-card";
import { Button } from "@/components/ui/button";
import { getSummaries } from "@/lib/summary-card";
import { hasReachedUploadLimits } from "@/lib/user";
import { itemVariants } from "@/utils/constants";
import { currentUser } from "@clerk/nextjs/server";
import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {

    const user = await currentUser();
    const userId = user?.id;
    if (!userId) {
        return redirect('/sign-in');
    }

    const { hasReachedLimit, uploadLimit } = await hasReachedUploadLimits(userId);

    const summaries = await getSummaries(userId);

    return (
        <main className="min-h-screen">
            <BgGradient className="from-emerald-200 via-emerald-300 to-indigo-200" />
            <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="container mx-auto flex flex-col gap-4">
                <div className="px-2 py-12 sm:py-24">
                    <div className="flex gap-4 mb-8 justify-between">
                        <div className="flex flex-col gap-2">
                            <MotionH1 variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="text-4xl font-bold tracking-tight bg-linear-to-r from-indigo-600 to-indigo-900 bg-clip-text text-transparent">
                                Your Summaries
                            </MotionH1>
                            <MotionP variants={itemVariants} initial="hidden" animate="visible" className="text-indigo-600">
                                Transform your PDFs into concise, actionable insights
                            </MotionP>
                        </div>
                        {!hasReachedLimit && (
                            <MotionDiv variants={itemVariants} initial="hidden" animate="visible" whileHover={{ scale: 1.05 }} className="self-start">
                                <Button
                                    variant={'link'}
                                    className="bg-linear-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 hover:scale-105 transition-all duration-300 group hover:no-underline"
                                >
                                    <Link href="/upload" className="flex items-center text-white">
                                        <Plus className="w-5 h-5 mr-2" />
                                        New Summary
                                    </Link>
                                </Button>
                            </MotionDiv>)}
                    </div>

                    {hasReachedLimit && (
                        <MotionDiv variants={itemVariants} initial="hidden" animate="visible" className="mb-6">
                            <div className="bg-emerald-50 rounded-lg border border-emerald-200 p-4 text-emerald-800">
                                <p className="text-sm">you've reached the limit of {uploadLimit} uploads on your basic plan {' '}
                                    <Link href="/pricing" className="text-emerald-800 underline font-medium underline-offset-4 inline-flex items-center hover:text-emerald-600">Click here to Upgrade to Pro {' '}
                                        <ArrowRight className="w-4 h-4 inline-block" />{' '}for unlimited uploads</Link>
                                </p>
                            </div>
                        </MotionDiv>
                    )}

                    {summaries.length === 0 ? <EmptySummaryState /> : <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg-grids-cols-3 sm:px-0">
                        {summaries.map((summary, index) => (
                            <SummaryCard key={index} summary={summary} />
                        ))}
                    </div>}

                </div>
            </MotionDiv>
        </main>
    );
}
