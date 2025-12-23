import React from 'react';
import './AdminCharts.css';

const AdminCharts = () => {
    // Mock Data for Demo
    const monthlyData = [45, 60, 75, 50, 80, 95, 110, 100, 120, 140, 130, 150];
    const yearlyData = [2000, 3500, 5000]; // 2023, 2024, 2025
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const maxMonthly = Math.max(...monthlyData);

    return (
        <div className="charts-container">
            <div className="chart-card">
                <h3>Monthly Revenue (2025)</h3>
                <div className="bar-chart">
                    {monthlyData.map((val, idx) => (
                        <div key={idx} className="bar-wrapper">
                            <div
                                className="bar"
                                style={{ height: `${(val / maxMonthly) * 100}%` }}
                                title={`₹${val}k`}
                            ></div>
                            <span className="label">{months[idx]}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="chart-card">
                <h3>Yearly Growth</h3>
                <div className="pie-chart-placeholder">
                    <div className="pie-segment"></div>
                    <div className="pie-overlay">
                        <span>+120%</span>
                        <small>Growth</small>
                    </div>
                </div>
                <div className="chart-legend">
                    <div className="legend-item"><span className="dot c1"></span> 2023</div>
                    <div className="legend-item"><span className="dot c2"></span> 2024</div>
                    <div className="legend-item"><span className="dot c3"></span> 2025</div>
                </div>
            </div>
        </div>
    );
};

export default AdminCharts;
