// Global state
let currentUser = null;
// let webinars = [];
// let mentorshipRequests = [];

const API_URL = 'http://localhost:5000/api';

// Fetch initial data
async function fetchWebinars() {
    try {
        const response = await fetch(`${API_URL}/webinars`);
        const webinars = await response.json();
        renderWebinars(webinars);
    } catch (error) {
        console.error('Error fetching webinars:', error);
    }
}

async function fetchMentorshipRequests() {
    try {
        const response = await fetch(`${API_URL}/mentorship`);
        const requests = await response.json();
        renderMentorshipRequests(requests);
    } catch (error) {
        console.error('Error fetching mentorship requests:', error);
    }
}

function renderWebinars(webinars) {
    const allWebinarsContainer = document.getElementById('all-webinars');
    const studentWebinarsContainer = document.getElementById('student-webinars');
    const alumniWebinarsContainer = document.getElementById('alumni-webinars');

    allWebinarsContainer.innerHTML = '';
    studentWebinarsContainer.innerHTML = '';
    alumniWebinarsContainer.innerHTML = '';

    webinars.forEach(webinar => {
        const eventItem = `
            <div class="event-item">
                <div class="event-date">${formatDate(webinar.date)} - ${webinar.time}</div>
                <h4>${webinar.title}</h4>
                <p>${webinar.description}</p>
                <p><strong>Presenter:</strong> ${webinar.presenter}</p>
                <button class="btn" onclick="viewEventDetails('${webinar._id}')">View Details</button>
            </div>
        `;
        allWebinarsContainer.innerHTML += eventItem;

        if (currentUser && currentUser.userType === 'student') {
             studentWebinarsContainer.innerHTML += eventItem;
        }

        if (currentUser && currentUser.userType === 'alumni' && webinar.presenter === 'Sarah Johnson') { // Demo condition
            alumniWebinarsContainer.innerHTML += `
                <div class="event-item">
                    <div class="event-date">${formatDate(webinar.date)} - ${webinar.time}</div>
                    <h4>${webinar.title}</h4>
                    <p>${webinar.description}</p>
                    <p><strong>Registered:</strong> 0 students</p>
                </div>
            `;
        }
    });
}

function renderMentorshipRequests(requests) {
    const studentRequestsContainer = document.getElementById('student-requests');
    const alumniRequestsContainer = document.getElementById('alumni-requests');

    studentRequestsContainer.innerHTML = '';
    alumniRequestsContainer.innerHTML = '';

    requests.forEach(request => {
        if (currentUser && currentUser.userType === 'student' && request.student === 'John Doe') { // Demo condition
            studentRequestsContainer.innerHTML += `
                <div class="mentorship-requests">
                    <p><strong>Request to:</strong> ${request.mentor}</p>
                    <p><strong>Status:</strong> ${request.status}</p>
                    <p><strong>Message:</strong> "${request.message}"</p>
                </div>
            `;
        }

        if (currentUser && currentUser.userType === 'alumni' && request.mentor === 'Sarah Johnson') { // Demo condition
            alumniRequestsContainer.innerHTML += `
                <div class="mentorship-requests">
                    <p><strong>From:</strong> ${request.student}</p>
                    <p><strong>Message:</strong> "${request.message}"</p>
                    <div class="request-actions">
                        <button class="btn btn-success" onclick="respondToRequest('${request._id}', 'accepted')">Accept</button>
                        <button class="btn btn-secondary" onclick="respondToRequest('${request._id}', 'declined')">Decline</button>
                    </div>
                </div>
            `;
        }
    });
}


// Tab management
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

// Login handling
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const userType = document.getElementById('userType').value;
    
    // Demo login validation
    if ((email === 'student@example.com' && userType === 'student') || 
        (email === 'alumni@example.com' && userType === 'alumni')) {
        if (password === 'password') {
            currentUser = { email, userType, name: userType === 'student' ? 'John Doe' : 'Sarah Johnson' };
            
            // Show appropriate dashboard
            if (userType === 'student') {
                document.getElementById('student-tab').style.display = 'block';
                showTab('student-dashboard');
                document.querySelector('[onclick="showTab(\'student-dashboard\')"]').classList.add('active');
            } else {
                document.getElementById('alumni-tab').style.display = 'block';
                showTab('alumni-dashboard');
                document.querySelector('[onclick="showTab(\'alumni-dashboard\')"]').classList.add('active');
            }
            
            await fetchWebinars();
            await fetchMentorshipRequests();
            showNotification('Login successful!', 'success');
        } else {
            showNotification('Invalid password!', 'error');
        }
    } else {
        showNotification('Invalid credentials!', 'error');
    }
}

// Logout
function logout() {
    currentUser = null;
    document.getElementById('student-tab').style.display = 'none';
    document.getElementById('alumni-tab').style.display = 'none';
    showTab('login');
    document.querySelector('[onclick="showTab(\'login\')"]').classList.add('active');
    showNotification('Logged out successfully!', 'info');
}

// Webinar management
async function createWebinar(event) {
    event.preventDefault();
    
    const title = document.getElementById('webinar-title').value;
    const description = document.getElementById('webinar-description').value;
    const date = document.getElementById('webinar-date').value;
    const time = document.getElementById('webinar-time').value;
    const link = document.getElementById('webinar-link').value;
    
    const webinar = {
        title,
        description,
        date,
        time,
        link,
        presenter: currentUser.name,
        company: 'Google' // Demo data
    };

    try {
        const response = await fetch(`${API_URL}/webinars`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(webinar)
        });
        const newWebinar = await response.json();
        
        // Add to alumni's webinar list
        const alumniWebinars = document.getElementById('alumni-webinars');
        const eventDiv = document.createElement('div');
        eventDiv.className = 'event-item';
        eventDiv.innerHTML = `
            <div class="event-date">${formatDate(newWebinar.date)} - ${newWebinar.time}</div>
            <h4>${newWebinar.title}</h4>
            <p>${newWebinar.description}</p>
            <p><strong>Registered:</strong> 0 students</p>
        `;
        alumniWebinars.appendChild(eventDiv);
        
        // Reset form
        event.target.reset();
        
        showNotification('Webinar created successfully!', 'success');
        await fetchWebinars();
    } catch (error) {
        console.error('Error creating webinar:', error);
        showNotification('Error creating webinar.', 'error');
    }
}

function registerForEvent(eventId) {
    showNotification('Successfully registered for the webinar!', 'success');
}

function viewEventDetails(eventId) {
    let eventDetails = '';
    
    switch(eventId) {
        case 'resume-prep':
            eventDetails = `
                <h2>Resume Preparation for IT Jobs</h2>
                <p><strong>Date:</strong> December 25, 2025</p>
                <p><strong>Time:</strong> 3:00 PM - 4:30 PM</p>
                <p><strong>Presenter:</strong> Sarah Johnson (Software Engineer at Google)</p>
                <p><strong>Meeting Link:</strong> <a href="https://meet.google.com/example" target="_blank">Join Meeting</a></p>
                <hr>
                <h3>What You'll Learn:</h3>
                <ul>
                    <li>How to structure your resume for maximum impact</li>
                    <li>Key technical skills to highlight</li>
                    <li>Common mistakes to avoid</li>
                    <li>ATS-friendly formatting tips</li>
                    <li>Tailoring your resume for specific roles</li>
                </ul>
                <p><strong>Prerequisites:</strong> None - suitable for all levels</p>
                <button class="btn" onclick="registerForEvent('resume-prep'); closeModal('eventModal');">Register Now</button>
            `;
            break;
        case 'interview-skills':
            eventDetails = `
                <h2>Interview Skills Masterclass</h2>
                <p><strong>Date:</strong> December 28, 2025</p>
                <p><strong>Time:</strong> 2:00 PM - 4:00 PM</p>
                <p><strong>Presenter:</strong> Mike Chen (Senior Developer at Microsoft)</p>
                <p><strong>Meeting Link:</strong> <a href="https://meet.google.com/example2" target="_blank">Join Meeting</a></p>
                <hr>
                <h3>What You'll Learn:</h3>
                <ul>
                    <li>Technical interview preparation strategies</li>
                    <li>Behavioral interview techniques</li>
                    <li>How to approach coding challenges</li>
                    <li>Salary negotiation tips</li>
                    <li>Following up after interviews</li>
                </ul>
                <p><strong>Prerequisites:</strong> Basic programming knowledge recommended</p>
                <button class="btn" onclick="registerForEvent('interview-skills'); closeModal('eventModal');">Register Now</button>
            `;
            break;
        case 'career-paths':
            eventDetails = `
                <h2>Startup vs Corporate: Career Paths</h2>
                <p><strong>Date:</strong> January 5, 2026</p>
                <p><strong>Time:</strong> 4:00 PM - 5:00 PM</p>
                <p><strong>Presenter:</strong> Lisa Park (Former Startup Founder, now at Amazon)</p>
                <p><strong>Meeting Link:</strong> <a href="https://meet.google.com/example3" target="_blank">Join Meeting</a></p>
                <hr>
                <h3>What You'll Learn:</h3>
                <ul>
                    <li>Pros and cons of startup vs corporate environments</li>
                    <li>How to evaluate company culture fit</li>
                    <li>Career growth opportunities in different settings</li>
                    <li>Compensation structures comparison</li>
                    <li>Making strategic career decisions</li>
                </ul>
                <p><strong>Prerequisites:</strong> None - suitable for all students</p>
                <button class="btn" onclick="registerForEvent('career-paths'); closeModal('eventModal');">Register Now</button>
            `;
            break;
    }
    
    document.getElementById('event-details').innerHTML = eventDetails;
    document.getElementById('eventModal').style.display = 'block';
}

// Mentorship functions
function requestMentorship(mentorName) {
    document.getElementById('mentor-name').value = mentorName;
    document.getElementById('mentorshipModal').style.display = 'block';
}

async function sendMentorshipRequest(event) {
    event.preventDefault();
    
    const mentorName = document.getElementById('mentor-name').value;
    const message = document.getElementById('mentorship-message').value;
    
    const request = {
        mentor: mentorName,
        student: currentUser.name,
        message: message,
    };

    try {
        const response = await fetch(`${API_URL}/mentorship`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        });
        const newRequest = await response.json();

        // Add to student's requests
        const studentRequests = document.getElementById('student-requests');
        const requestDiv = document.createElement('div');
        requestDiv.className = 'mentorship-requests';
        requestDiv.innerHTML = `
            <p><strong>Request to:</strong> ${newRequest.mentor}</p>
            <p><strong>Status:</strong> ${newRequest.status}</p>
            <p><strong>Message:</strong> "${newRequest.message}"</p>
        `;
        studentRequests.appendChild(requestDiv);
        
        closeModal('mentorshipModal');
        document.getElementById('mentorship-message').value = '';
        showNotification('Mentorship request sent successfully!', 'success');
        await fetchMentorshipRequests();
    } catch (error) {
        console.error('Error sending mentorship request:', error);
        showNotification('Error sending request.', 'error');
    }
}

async function respondToRequest(requestId, action) {
    const status = action === 'accept' ? 'accepted' : 'declined';
    try {
        await fetch(`${API_URL}/mentorship/${requestId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });
        const message = `Mentorship request ${status}!`;
        const type = status === 'accepted' ? 'success' : 'info';
        showNotification(message, type);
        await fetchMentorshipRequests();
    } catch (error) {
        console.error('Error responding to request:', error);
        showNotification('Error responding to request.', 'error');
    }
}

// Alumni filtering
function filterAlumni() {
    const profession = document.getElementById('profession-filter').value;
    const alumniItems = document.querySelectorAll('.alumni-item');
    
    alumniItems.forEach(item => {
        if (profession === '' || item.dataset.profession === profession) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Resource functions
function downloadResource(filename) {
    showNotification(`Downloading ${filename}...`, 'info');
    // In a real application, this would trigger an actual download
}

function openExternalLink(url) {
    window.open(url, '_blank');
}

// Modal functions
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Utility functions
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Close modals when clicking outside
    window.onclick = function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    };
});

// Initialize the application
function initializeApp() {
    // Set minimum date for webinar creation to today
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('webinar-date');
    if (dateInput) {
        dateInput.min = today;
    }
}

// Run initialization when page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    fetchWebinars();
});
