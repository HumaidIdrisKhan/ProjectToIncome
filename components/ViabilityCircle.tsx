type Props = {
    score: number;
};

export default function ViabilityCircle({ score }: Props) {
    const radius = 50;
    const stroke = 8;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    const progress = (score / 100) * circumference;
    const strokeDashoffset = circumference - progress;

    // Color logic
    const getColor = () => {
        if (score < 40) return "#ef4444"; // red
        if (score < 70) return "#f59e0b"; // yellow
        return "#22c55e"; // green
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <svg height={radius * 2} width={radius * 2}>
                {/* Background circle */}
                <circle
                    stroke="#1f2937"
                    fill="transparent"
                    strokeWidth={stroke}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />

                {/* Progress circle */}
                <circle
                    stroke={getColor()}
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeDasharray={circumference + " " + circumference}
                    style={{ strokeDashoffset, transition: "stroke-dashoffset 0.5s ease" }}
                    strokeLinecap="round"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />

                {/* Text */}
                <text
                    x="50%"
                    y="50%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fill="white"
                    fontSize="18"
                    fontWeight="bold"
                >
                    {score}
                </text>
            </svg>

            <p className="text-sm text-muted-foreground mt-2">
                Viability Score
            </p>
        </div>
    );
}