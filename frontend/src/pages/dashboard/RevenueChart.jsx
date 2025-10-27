import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    BarElement, 
    LineElement,
    PointElement,
    Title, 
    Tooltip, 
    Legend,
    Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale, 
    LinearScale, 
    BarElement, 
    LineElement,
    PointElement,
    Title, 
    Tooltip, 
    Legend,
    Filler
);

const RevenueChart = () => {
    const revenueData = [500, 700, 800, 600, 750, 900, 650, 870, 960, 1020, 1100, 1150];
    const ordersData = [45, 52, 48, 55, 58, 62, 54, 68, 72, 75, 78, 80];

    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Revenue (USD)',
                data: revenueData,
                backgroundColor: 'rgba(139, 92, 246, 0.7)',
                borderColor: 'rgba(139, 92, 246, 1)',
                borderWidth: 2,
                borderRadius: 6,
                borderSkipped: false,
            },
            {
                label: 'Orders',
                data: ordersData,
                backgroundColor: 'rgba(34, 197, 94, 0.7)',
                borderColor: 'rgba(34, 197, 94, 1)',
                borderWidth: 2,
                borderRadius: 6,
                borderSkipped: false,
                type: 'line',
                fill: false,
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        family: "'Inter', sans-serif",
                        size: 12
                    }
                }
            },
            title: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#1f2937',
                bodyColor: '#4b5563',
                borderColor: '#e5e7eb',
                borderWidth: 1,
                padding: 12,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                usePointStyle: true,
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            if (context.dataset.label.includes('Revenue')) {
                                label += new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD'
                                }).format(context.parsed.y);
                            } else {
                                label += context.parsed.y;
                            }
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(243, 244, 246, 1)',
                    drawBorder: false,
                },
                ticks: {
                    font: {
                        family: "'Inter', sans-serif"
                    },
                    callback: function(value) {
                        return '$' + value;
                    }
                }
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    font: {
                        family: "'Inter', sans-serif"
                    }
                }
            },
        },
        interaction: {
            intersect: false,
            mode: 'index',
        },
        animations: {
            tension: {
                duration: 1000,
                easing: 'linear',
                from: 1,
                to: 0,
                loop: true
            }
        },
    };

    return (
        <div className="w-full h-full">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
                    <p className="text-sm text-gray-500">Monthly revenue and orders performance</p>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                        <span className="text-gray-600">Revenue</span>
                    </div>
                    <div className="flex items-center ml-4">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-gray-600">Orders</span>
                    </div>
                </div>
            </div>
            <div className="h-64 md:h-72 lg:h-80">
                <Bar data={data} options={options} />
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Avg. Monthly Revenue</p>
                    <p className="text-lg font-semibold text-gray-900">$825</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-lg font-semibold text-gray-900">${revenueData.reduce((a, b) => a + b, 0)}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Growth Rate</p>
                    <p className="text-lg font-semibold text-green-600">+23.5%</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Peak Month</p>
                    <p className="text-lg font-semibold text-gray-900">Dec ($1,150)</p>
                </div>
            </div>
        </div>
    );
};

export default RevenueChart;