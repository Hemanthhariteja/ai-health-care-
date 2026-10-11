// Example: Using Healthcare Data Integrated Chatbot

// =======================
// EXAMPLE 1: Basic Chat with Auto Healthcare Context
// =======================

async function sendChatMessage(message) {
  try {
    const response = await fetch('/api/chat/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        message: message,
        language: localStorage.getItem('selectedLanguage') || 'en',
        sessionId: localStorage.getItem('chatSessionId')
      })
    });

    const data = await response.json();

    if (data.success) {
      // Bot response will now include healthcare statistics if condition detected
      console.log('Bot Response:', data.data.botResponse);
      // Example response:
      // "Diabetes management requires monitoring blood glucose levels regularly...
      // 
      // Based on our healthcare database:
      // - Average age of patients with diabetes: 52 years
      // - Total patients tracked: 250
      // - Average glucose level: 145.2
      // - Average cholesterol: 210.3"
      
      return data.data;
    } else {
      console.error('Chat error:', data.message);
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

// =======================
// EXAMPLE 2: Search Healthcare Data
// =======================

async function searchHealthcareData(condition, age = null, limit = 10) {
  try {
    let url = `/api/healthcare-data/search?condition=${condition}&limit=${limit}`;
    if (age) {
      url += `&age=${age}`;
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    const data = await response.json();

    if (data.success) {
      console.log(`Found ${data.data.count} patients with ${condition}`);
      console.log('Results:', data.data.results);
      
      // Example to display results
      displaySearchResults(data.data.results);
    }
  } catch (error) {
    console.error('Error searching:', error);
  }
}

// =======================
// EXAMPLE 3: Get Patient Statistics
// =======================

async function getMedicalConditionStats(condition) {
  try {
    const response = await fetch(`/api/healthcare-data/stats/${condition}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    const data = await response.json();

    if (data.success) {
      const stats = data.data;
      console.log(`Statistics for ${condition}:`);
      console.log(`- Total patients: ${stats.count}`);
      console.log(`- Average age: ${Math.round(stats.avgAge)} years`);
      console.log(`- Average BMI: ${stats.avgBMI ? Math.round(stats.avgBMI * 10) / 10 : 'N/A'}`);
      console.log(`- Average glucose: ${stats.avgGlucose ? Math.round(stats.avgGlucose) : 'N/A'}`);
      console.log(`- Gender: ${stats.maleCount} male, ${stats.femaleCount} female`);
      
      // Display stats in UI
      displayStatistics(stats);
    }
  } catch (error) {
    console.error('Error fetching stats:', error);
  }
}

// =======================
// EXAMPLE 4: Get Healthcare Insights
// =======================

async function getHealthcareInsights(condition = null) {
  try {
    let url = '/api/healthcare-data/insights';
    if (condition) {
      url += `?condition=${condition}`;
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    const data = await response.json();

    if (data.success) {
      const insights = data.data;
      
      console.log('Healthcare Insights:');
      console.log('Age Distribution:', insights.ageDistribution);
      console.log('Gender Distribution:', insights.genderDistribution);
      console.log('Top Hospitals:', insights.topHospitals);
      
      // Create charts/visualizations
      visualizeInsights(insights);
    }
  } catch (error) {
    console.error('Error fetching insights:', error);
  }
}

// =======================
// EXAMPLE 5: Get Database Statistics
// =======================

async function getDatabaseStatistics() {
  try {
    const response = await fetch('/api/healthcare-data/database-stats', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    const data = await response.json();

    if (data.success) {
      const stats = data.data;
      console.log('Database Overview:');
      console.log(`- Total records: ${stats.totalRecords}`);
      console.log(`- Unique conditions: ${stats.uniqueConditions}`);
      console.log(`- Unique hospitals: ${stats.uniqueHospitals}`);
      console.log('Top conditions:', stats.conditions.slice(0, 5));
      
      // Update dashboard
      updateDashboard(stats);
    }
  } catch (error) {
    console.error('Error fetching database stats:', error);
  }
}

// =======================
// EXAMPLE 6: Chat with Patient Context
// =======================

async function sendChatWithPatientContext(message, patientName) {
  try {
    const response = await fetch('/api/chat/send-with-context', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        message: message,
        patientName: patientName,
        language: localStorage.getItem('selectedLanguage') || 'en',
        sessionId: localStorage.getItem('chatSessionId')
      })
    });

    const data = await response.json();

    if (data.success) {
      const result = data.data;
      
      // Bot response enhanced with patient context
      console.log('Bot Response:', result.botResponse);
      
      // Patient context automatically loaded
      if (result.context) {
        console.log('Patient Context:', {
          name: result.context.patientName,
          condition: result.context.condition,
          age: result.context.age,
          glucose: result.context.glucose,
          bmi: result.context.bmi,
          cholesterol: result.context.cholesterol
        });
      }
      
      return result;
    }
  } catch (error) {
    console.error('Error sending contextual message:', error);
  }
}

// =======================
// UI Display Functions
// =======================

function displaySearchResults(results) {
  const html = results.map(patient => `
    <div class="patient-card">
      <h3>${patient.name}</h3>
      <p><strong>Age:</strong> ${patient.age}</p>
      <p><strong>Condition:</strong> ${patient.medical_condition}</p>
      <p><strong>Blood Type:</strong> ${patient.blood_type}</p>
      <p><strong>BMI:</strong> ${patient.bmi}</p>
      <p><strong>Glucose:</strong> ${patient.glucose}</p>
      <p><strong>Hospital:</strong> ${patient.hospital}</p>
      <p><strong>Doctor:</strong> ${patient.doctor}</p>
    </div>
  `).join('');
  
  document.getElementById('results-container').innerHTML = html;
}

function displayStatistics(stats) {
  const html = `
    <div class="stats-card">
      <h2>${stats._id} Statistics</h2>
      <div class="stat-row">
        <span>Total Patients:</span>
        <strong>${stats.count}</strong>
      </div>
      <div class="stat-row">
        <span>Average Age:</span>
        <strong>${Math.round(stats.avgAge)} years</strong>
      </div>
      <div class="stat-row">
        <span>Average BMI:</span>
        <strong>${stats.avgBMI ? Math.round(stats.avgBMI * 10) / 10 : 'N/A'}</strong>
      </div>
      <div class="stat-row">
        <span>Average Glucose:</span>
        <strong>${stats.avgGlucose ? Math.round(stats.avgGlucose) : 'N/A'} mg/dL</strong>
      </div>
      <div class="stat-row">
        <span>Average Cholesterol:</span>
        <strong>${stats.avgCholesterol ? Math.round(stats.avgCholesterol) : 'N/A'} mg/dL</strong>
      </div>
      <div class="gender-split">
        <span>Male: ${stats.maleCount}</span>
        <span>Female: ${stats.femaleCount}</span>
      </div>
    </div>
  `;
  
  document.getElementById('stats-container').innerHTML = html;
}

function visualizeInsights(insights) {
  // Example: Create a bar chart for age distribution
  if (insights.ageDistribution) {
    const ageData = insights.ageDistribution.map(item => ({
      label: item._id || 'Unknown',
      value: item.count
    }));
    
    // You can use Chart.js or any visualization library
    createBarChart('age-chart', ageData);
  }
  
  // Example: Create pie chart for gender distribution
  if (insights.genderDistribution) {
    const genderData = insights.genderDistribution.map(item => ({
      label: item._id || 'Unknown',
      value: item.count
    }));
    
    createPieChart('gender-chart', genderData);
  }
  
  // Example: Display top hospitals
  if (insights.topHospitals) {
    const hospitalList = insights.topHospitals.map(h => `
      <li>${h._id} - ${h.count} patients</li>
    `).join('');
    
    document.getElementById('hospitals-list').innerHTML = `<ul>${hospitalList}</ul>`;
  }
}

function updateDashboard(stats) {
  document.getElementById('total-records').textContent = stats.totalRecords.toLocaleString();
  document.getElementById('unique-conditions').textContent = stats.uniqueConditions;
  document.getElementById('unique-hospitals').textContent = stats.uniqueHospitals;
}

// =======================
// Placeholder Chart Functions
// =======================

function createBarChart(elementId, data) {
  // Implement using Chart.js or D3.js
  console.log('Creating bar chart:', data);
}

function createPieChart(elementId, data) {
  // Implement using Chart.js or D3.js
  console.log('Creating pie chart:', data);
}

// =======================
// Initialize on Page Load
// =======================

document.addEventListener('DOMContentLoaded', () => {
  // Load initial data
  getDatabaseStatistics();
  getHealthcareInsights();
  
  // Set up chat handlers
  setupChatHandlers();
});

function setupChatHandlers() {
  const chatInput = document.getElementById('chat-input');
  const sendButton = document.getElementById('send-button');
  
  if (sendButton) {
    sendButton.addEventListener('click', () => {
      const message = chatInput.value.trim();
      if (message) {
        sendChatMessage(message);
        chatInput.value = '';
      }
    });
  }
}

// =======================
// Export for use in other modules
// =======================

export {
  sendChatMessage,
  searchHealthcareData,
  getMedicalConditionStats,
  getHealthcareInsights,
  getDatabaseStatistics,
  sendChatWithPatientContext
};
