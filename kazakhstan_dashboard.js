// Kazakhstan Market Data
const kazakhstanData = {
    travelQueries: {
        '2023': [4.18, 3.22, 3.63, 3.40, 3.10, 3.17, 4.19, 4.20, 3.59, 4.40, 4.32, 4.23],
        '2024': [6.20, 5.45, 4.33, 3.66, 3.99, 3.49, 4.82, 4.61, 5.01, 5.31, 4.27, 3.72],
        '2025': {
            'moderate': [4.42, 3.97, 6.08, 4.45, 5.63, 3.95, 7.51, 6.89, 8.11, 9.16, 5.89, 4.48],
            'conservative': [4.42, 3.97, 5.76, 4.19, 5.20, 3.74, 7.11, 6.52, 7.68, 8.69, 5.58, 4.24],
            'ambitious': [4.42, 3.97, 6.41, 4.72, 6.07, 4.17, 7.92, 7.27, 8.56, 9.65, 6.21, 4.72]
        }
    },
    impressions: {
        '2023': [0, 0, 0, 21595079, 17798768, 9884237, 1064614, 1251655, 7331765, 28887622, 46896860, 29432903],
        '2024': [0, 0, 0, 21595079, 17798768, 9884237, 1064614, 1251655, 7331765, 28887622, 46896860, 29432903],
        '2025': [43041083, 26302884, 58098094, 29802238, 143388850, 78482214, 76826671, 60600012, 13575579, 21801603, 92592898, 69246680]
    },
    flightSearches: {
        '2023': [1059, 807, 1262, 725, 512, 1044, 1020, 1296, 833, 817, 1018, 908],
        '2024': [1785, 1587, 1045, 991, 1047, 925, 1068, 717, 846, 917, 754, 759]
    },
    hotelGuests: {
        '2023': [4742, 2951, 5257, 3304, 4249, 3076, 3169, 4427, 3595, 5891, 5089, 5542],
        '2024': [6280, 5450, 8229, 5348, 6812, 5807, 4869, 5367, 5318, 7671, 5296, 5684]
    }
};

// Months labels
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Chart instances
let queriesChart, impressionsChart, flightsChart, hotelChart;

// Chart configuration
const chartConfig = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
        mode: 'index',
        intersect: false
    },
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                usePointStyle: true,
                padding: 15,
                font: {
                    family: "'Inter', sans-serif",
                    size: 12
                }
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleFont: {
                family: "'Inter', sans-serif",
                weight: 'bold',
                size: 13
            },
            bodyFont: {
                family: "'Inter', sans-serif",
                size: 13
            },
            padding: 12,
            cornerRadius: 8,
            displayColors: true,
            usePointStyle: true,
            titleColor: '#ffffff',
            bodyColor: '#e0e0e0',
            callbacks: {
                label: function(context) {
                    let label = context.dataset.label || '';
                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.y !== null) {
                        if (context.parsed.y > 1000000) {
                            label += (context.parsed.y / 1000000).toFixed(1) + 'M';
                        } else if (context.parsed.y > 1000) {
                            label += (context.parsed.y / 1000).toFixed(1) + 'K';
                        } else {
                            label += context.parsed.y.toLocaleString();
                        }
                    }
                    return label;
                }
            }
        }
    },
    scales: {
        x: {
            grid: {
                color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
                font: {
                    family: "'Inter', sans-serif",
                    size: 12
                },
                padding: 10
            }
        },
        y: {
            beginAtZero: true,
            grid: {
                color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
                font: {
                    family: "'Inter', sans-serif",
                    size: 12
                },
                padding: 10
            }
        }
    },
    elements: {
        line: {
            tension: 0.3
        },
        point: {
            radius: 3,
            hoverRadius: 6
        }
    },
    animation: {
        duration: 1000,
        easing: 'easeOutQuart'
    }
};

// Calculate Media Elasticity (Travel Queries / Media Impressions)
function calculateMediaElasticity() {
    // Calculate total impressions for 2024 and 2025
    const totalImpressions2024 = kazakhstanData.impressions['2024'].reduce((sum, val) => sum + val, 0);
    const totalImpressions2025 = kazakhstanData.impressions['2025'].reduce((sum, val) => sum + val, 0);
    
    // Calculate average travel queries for 2024 and moderate 2025 forecast
    const avgQueries2024 = kazakhstanData.travelQueries['2024'].reduce((sum, val) => sum + val, 0) / 12;
    const avgQueries2025 = kazakhstanData.travelQueries['2025']['moderate'].reduce((sum, val) => sum + val, 0) / 12;
    
    // Calculate percentage changes
    const impressionsPercentChange = (totalImpressions2025 - totalImpressions2024) / totalImpressions2024;
    const queriesPercentChange = (avgQueries2025 - avgQueries2024) / avgQueries2024;
    
    // Calculate elasticity
    const elasticity = queriesPercentChange / impressionsPercentChange;
    
    return {
        elasticity: elasticity.toFixed(2),
        impressionsChange: (impressionsPercentChange * 100).toFixed(1) + '%',
        queriesChange: (queriesPercentChange * 100).toFixed(1) + '%',
        totalImpressions2024: totalImpressions2024,
        totalImpressions2025: totalImpressions2025,
        avgQueries2024: avgQueries2024.toFixed(2),
        avgQueries2025: avgQueries2025.toFixed(2)
    };
}

// Initialize charts
document.addEventListener('DOMContentLoaded', function() {
    initCharts();
    setupTabSwitching();
    setupScenarioButtons();
    setupPrintButton();
    displayMediaElasticity();
});

// Display Media Elasticity
function displayMediaElasticity() {
    const elasticityData = calculateMediaElasticity();
    
    // Get the elasticity container in the advanced insights tab
    const elasticityContainer = document.querySelector('#advanced-insights-tab #elasticity-container');
    
    if (elasticityContainer) {
        elasticityContainer.innerHTML = `
            <div class="elasticity-box">
                <h3>Media Elasticity (Travel Queries / Impressions)</h3>
                <div class="elasticity-value">${elasticityData.elasticity}</div>
                <div class="elasticity-details">
                    <p>Impressions Change (2024-2025): ${elasticityData.impressionsChange}</p>
                    <p>Travel Queries Change (2024-2025): ${elasticityData.queriesChange}</p>
                    <p>Total Impressions 2024: ${(elasticityData.totalImpressions2024 / 1000000).toFixed(1)}M</p>
                    <p>Total Impressions 2025: ${(elasticityData.totalImpressions2025 / 1000000).toFixed(1)}M</p>
                    <p>Avg Travel Queries 2024: ${elasticityData.avgQueries2024}</p>
                    <p>Avg Travel Queries 2025: ${elasticityData.avgQueries2025}</p>
                </div>
            </div>
        `;
    }
    
    // Update the elasticity value in the Statistical Insights section
    const elasticityValueStat = document.getElementById('elasticity-value-stat');
    if (elasticityValueStat) {
        elasticityValueStat.textContent = elasticityData.elasticity;
    }
}

function initCharts() {
    // Travel Queries Chart
    const queriesCtx = document.getElementById('queries-chart').getContext('2d');
    queriesChart = new Chart(queriesCtx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: '2024 Actual',
                    data: kazakhstanData.travelQueries['2024'],
                    borderColor: 'rgba(255, 159, 64, 1)',
                    backgroundColor: 'rgba(255, 159, 64, 0.1)',
                    borderWidth: 2,
                    fill: false
                },
                {
                    label: '2025 Moderate',
                    data: kazakhstanData.travelQueries['2025']['moderate'],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.1)',
                    borderWidth: 2,
                    fill: false
                }
            ]
        },
        options: {
            ...chartConfig,
            plugins: {
                ...chartConfig.plugins,
                title: {
                    display: true,
                    text: 'Kazakhstan Travel Queries Forecast',
                    font: {
                        family: "'Inter', sans-serif",
                        size: 16,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    }
                }
            },
            scales: {
                ...chartConfig.scales,
                y: {
                    ...chartConfig.scales.y,
                    title: {
                        display: true,
                        text: 'Travel Queries Index',
                        font: {
                            family: "'Inter', sans-serif",
                            weight: 'bold',
                            size: 13
                        },
                    }
                },
                x: {
                    ...chartConfig.scales.x,
                    title: {
                        display: true,
                        text: 'Month',
                        font: {
                            family: "'Inter', sans-serif",
                            weight: 'bold',
                            size: 13
                        },
                    }
                }
            }
        }
    });
    
    // Impressions Chart
    const impressionsCtx = document.getElementById('impressions-chart').getContext('2d');
    impressionsChart = new Chart(impressionsCtx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: '2024',
                    data: kazakhstanData.impressions['2024'],
                    borderColor: 'rgba(255, 206, 86, 1)',
                    backgroundColor: 'rgba(255, 206, 86, 0.1)',
                    borderWidth: 2,
                    fill: false
                },
                {
                    label: '2025 (Planned)',
                    data: kazakhstanData.impressions['2025'],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.1)',
                    borderWidth: 2,
                    fill: false
                }
            ]
        },
        options: {
            ...chartConfig,
            plugins: {
                ...chartConfig.plugins,
                title: {
                    display: true,
                    text: 'Kazakhstan Media Impressions',
                    font: {
                        family: "'Inter', sans-serif",
                        size: 16,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    }
                }
            },
            scales: {
                ...chartConfig.scales,
                y: {
                    ...chartConfig.scales.y,
                    title: {
                        display: true,
                        text: 'Impressions',
                        font: {
                            family: "'Inter', sans-serif",
                            weight: 'bold',
                            size: 13
                        }
                    },
                    ticks: {
                        callback: function(value) {
                            if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
                            if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
                            return value;
                        }
                    }
                },
                x: {
                    ...chartConfig.scales.x,
                    title: {
                        display: true,
                        text: 'Month',
                        font: {
                            family: "'Inter', sans-serif",
                            weight: 'bold',
                            size: 13
                        }
                    }
                }
            }
        }
    });
    
    // Initialize Flight Searches Chart
    const flightsCtx = document.getElementById('flights-chart').getContext('2d');
    flightsChart = new Chart(flightsCtx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: '2023',
                    data: kazakhstanData.flightSearches['2023'],
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.1)',
                    borderWidth: 2,
                    fill: false
                },
                {
                    label: '2024',
                    data: kazakhstanData.flightSearches['2024'],
                    borderColor: 'rgba(255, 159, 64, 1)',
                    backgroundColor: 'rgba(255, 159, 64, 0.1)',
                    borderWidth: 2,
                    fill: false
                }
            ]
        },
        options: {
            ...chartConfig,
            plugins: {
                ...chartConfig.plugins,
                title: {
                    display: true,
                    text: 'Flight Searches (2023-2024)',
                    font: {
                        family: "'Inter', sans-serif",
                        size: 16,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    }
                }
            },
            scales: {
                ...chartConfig.scales,
                y: {
                    ...chartConfig.scales.y,
                    title: {
                        display: true,
                        text: 'Flight Searches',
                        font: {
                            family: "'Inter', sans-serif",
                            weight: 'bold',
                            size: 13
                        },
                    }
                }
            }
        }
    });
    
    // Initialize Hotel Guests Chart
    const hotelCtx = document.getElementById('hotel-chart').getContext('2d');
    hotelChart = new Chart(hotelCtx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: '2023',
                    data: kazakhstanData.hotelGuests['2023'],
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.1)',
                    borderWidth: 2,
                    fill: false
                },
                {
                    label: '2024',
                    data: kazakhstanData.hotelGuests['2024'],
                    borderColor: 'rgba(255, 159, 64, 1)',
                    backgroundColor: 'rgba(255, 159, 64, 0.1)',
                    borderWidth: 2,
                    fill: false
                }
            ]
        },
        options: {
            ...chartConfig,
            plugins: {
                ...chartConfig.plugins,
                title: {
                    display: true,
                    text: 'Hotel Guests (2023-2024)',
                    font: {
                        family: "'Inter', sans-serif",
                        size: 16,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    }
                }
            },
            scales: {
                ...chartConfig.scales,
                y: {
                    ...chartConfig.scales.y,
                    title: {
                        display: true,
                        text: 'Hotel Guests',
                        font: {
                            family: "'Inter', sans-serif",
                            weight: 'bold',
                            size: 13
                        },
                    }
                }
            }
        }
    });
}

function setupScenarioButtons() {
    const scenarioButtons = document.querySelectorAll('.scenario-btn');
    scenarioButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            scenarioButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update chart based on selected scenario
            updateQueriesChart(this.getAttribute('data-scenario'));
        });
    });
}

function updateQueriesChart(scenario) {
    // Clear existing datasets
    queriesChart.data.datasets = [];
    
    if (scenario === 'actual') {
        // Show 2023 and 2024 actual data
        queriesChart.data.datasets.push({
            label: '2023 Actual',
            data: kazakhstanData.travelQueries['2023'],
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            borderWidth: 2,
            fill: false
        });
        
        queriesChart.data.datasets.push({
            label: '2024 Actual',
            data: kazakhstanData.travelQueries['2024'],
            borderColor: 'rgba(255, 159, 64, 1)',
            backgroundColor: 'rgba(255, 159, 64, 0.1)',
            borderWidth: 2,
            fill: false
        });
    } else {
        // Show 2024 actual and 2025 forecast for selected scenario
        queriesChart.data.datasets.push({
            label: '2024 Actual',
            data: kazakhstanData.travelQueries['2024'],
            borderColor: 'rgba(255, 159, 64, 1)',
            backgroundColor: 'rgba(255, 159, 64, 0.1)',
            borderWidth: 2,
            fill: false
        });
        
        queriesChart.data.datasets.push({
            label: `2025 ${scenario.charAt(0).toUpperCase() + scenario.slice(1)}`,
            data: kazakhstanData.travelQueries['2025'][scenario],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            borderWidth: 2,
            fill: false
        });
    }
    
    // Update chart
    queriesChart.update();
}

function setupTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
}

function setupPrintButton() {
    const printButton = document.querySelector('.print-btn');
    if (printButton) {
        printButton.addEventListener('click', function() {
            window.print();
        });
    }
}
