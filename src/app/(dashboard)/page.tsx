'use client'
import { Button } from '@/components/ui/button'
import { CornerUpRight } from 'lucide-react'

export default function DashboardHomePage() {
    return (
        <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
            <h1 className="text-2xl">Dashboard</h1>
            <Button variant="default" className="flex gap-[5px]">
                Default Button
                <CornerUpRight />
            </Button>
            <Button variant="default" className="flex gap-[5px]">
                <a href="/">Dashboard</a>
            </Button>
        </div>
    )
}
