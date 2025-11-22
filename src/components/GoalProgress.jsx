import React from 'react';
import './GoalProgress.css';

const GoalProgress = ({ percentage, radius = 30, stroke = 5 }) => {
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="goal-progress-circle" style={{ width: radius * 2, height: radius * 2 }}>
            <svg
                height={radius * 2}
                width={radius * 2}
                className="goal-progress-svg"
            >
                <circle
                    className="goal-progress-bg"
                    strokeWidth={stroke}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                <circle
                    className="goal-progress-fg"
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset }}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
            </svg>
            <div className="goal-progress-text">
                <span>{Math.round(percentage)}%</span>
            </div>
        </div>
    );
};

export default GoalProgress;
