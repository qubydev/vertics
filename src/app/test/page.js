import React from "react";
import { WorldMap } from "@/components/world-map";

export default function Page() {
    return (
        <div className="w-200 m-8">
            <WorldMap
                heatMap={{
                    IN: 100,
                    US: 75,
                    BR: 60,
                    RU: 40,
                    AU: 85,
                    ZA: 30,
                    CA: 55,
                    GB: 65,
                    AD: 90,
                    AE: 45
                }}
            />
        </div>
    );
}