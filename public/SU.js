
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Load current user from localStorage
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }
        this.updateUI();
    }

    // Get all users from localStorage
    getAllUsers() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    }

    // Save users to localStorage
    saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    
    // SIGN UP NEW USER

    signup(username, email, password) {
        const users = this.getAllUsers();
        
        // Validate input
        if (!username || !email || !password) {
            return { success: false, message: 'All fields are required!' };
        }

        if (username.length < 3) {
            return { success: false, message: 'Username must be at least 3 characters!' };
        }

        if (password.length < 6) {
            return { success: false, message: 'Password must be at least 6 characters!' };
        }

        // Check if user already exists
        if (users.some(u => u.username === username)) {
            return { success: false, message: 'Username already exists!' };
        }

        if (users.some(u => u.email === email)) {
            return { success: false, message: 'Email already registered!' };
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            username: username.trim(),
            email: email.trim(),
            password: password, // In production, this should be hashed!
            joinDate: new Date().toISOString(),
            membershipType: 'member'
        };

        users.push(newUser);
        this.saveUsers(users);

        // Auto login after signup
        this.currentUser = { ...newUser };
        delete this.currentUser.password; // Don't store password in session
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

        return { success: true, message: 'Account created successfully!', user: this.currentUser };
    }

    
    // LOGIN EXISTING USER
    
    login(username, password) {
        const users = this.getAllUsers();

        if (!username || !password) {
            return { success: false, message: 'Please enter username and password!' };
        }

        const user = users.find(u => u.username === username && u.password === password);

        if (!user) {
            return { success: false, message: 'Invalid username or password!' };
        }

        // Set current user (without password)
        this.currentUser = { ...user };
        delete this.currentUser.password;
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

        return { success: true, message: 'Login successful!', user: this.currentUser };
    }

    
    // LOGOUT USER
    
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.updateUI();
        return { success: true, message: 'Logged out successfully!' };
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Update UI based on auth state
    updateUI() {
        const authButton = document.getElementById('authButton');
        const userProfile = document.getElementById('userProfile');
        const userAvatar = document.getElementById('userAvatar');
        const username = document.getElementById('username');

        if (!authButton || !userProfile) return;

        if (this.isLoggedIn()) {
            // Show user profile
            authButton.style.display = 'none';
            userProfile.style.display = 'flex';
            
            // Set avatar (first letter of username)
            if (userAvatar) {
                userAvatar.textContent = this.currentUser.username.charAt(0).toUpperCase();
                userAvatar.style.background = this.getAvatarColor(this.currentUser.username);
            }
            
            // Set username
            if (username) {
                username.textContent = this.currentUser.username;
            }
        } else {
            // Show login/signup button
            authButton.style.display = 'block';
            userProfile.style.display = 'none';
        }
    }

    // Generate color based on username
    getAvatarColor(username) {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
            '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
            '#F8B195', '#F67280', '#C06C84', '#6C5B7B'
        ];
        let hash = 0;
        for (let i = 0; i < username.length; i++) {
            hash = username.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    }

    // Show/hide member-only content
    showMemberContent(show) {
        const memberContent = document.querySelectorAll('.member-only');
        const guestContent = document.querySelectorAll('.guest-only');

        memberContent.forEach(el => {
            el.style.display = show ? 'block' : 'none';
        });

        guestContent.forEach(el => {
            el.style.display = show ? 'none' : 'block';
        });
    }
}

// Initialize auth system
const auth = new AuthSystem();

// Make it globally accessible
window.auth = auth;

       // Tab Switching
        function switchTab(tab) {
            const loginForm = document.getElementById('loginForm');
            const signupForm = document.getElementById('signupForm');
            const buttons = document.querySelectorAll('.tab-button');
            const title = document.querySelector('.signup-title');

            if (tab === 'login') {
                loginForm.classList.add('active');
                signupForm.classList.remove('active');
                buttons[0].classList.add('active');
                buttons[1].classList.remove('active');
                title.textContent = 'LOGIN';
            } else {
                signupForm.classList.add('active');
                loginForm.classList.remove('active');
                buttons[1].classList.add('active');
                buttons[0].classList.remove('active');
                title.textContent = 'SIGN UP';
            }
            
            clearMessages();
        }

        function clearMessages() {
            document.getElementById('loginError').textContent = '';
            document.getElementById('signupError').textContent = '';
            document.getElementById('successMessage').classList.remove('show');
        }

        function showSuccess(message) {
            const successMsg = document.getElementById('successMessage');
            successMsg.textContent = message;
            successMsg.classList.add('show');
        }

        function showError(elementId, message) {
            const errorElement = document.getElementById(elementId);
            if (errorElement) {
                errorElement.textContent = message;
                setTimeout(() => {
                    errorElement.textContent = '';
                }, 3000);
            }
        }

        // Login Handler
        function handleLogin(event) {
            event.preventDefault();
            
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            const result = auth.login(username, password);

            if (result.success) {
                showSuccess('✅ Login successful! Redirecting...');
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 1500);
            } else {
                showError('loginError', result.message);
            }
        }

        // Signup Handler
        function handleSignup(event) {
            event.preventDefault();
            
            const username = document.getElementById('signupUsername').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupConfirmPassword').value;

            if (password !== confirmPassword) {
                showError('signupError', 'Passwords do not match!');
                return;
            }

            const result = auth.signup(username, email, password);

            if (result.success) {
                showSuccess('✅ Account created! Redirecting...');
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 1500);
            } else {
                showError('signupError', result.message);
            }
        }

        // Check if already logged in
        window.addEventListener('DOMContentLoaded', () => {
            if (auth.isLoggedIn()) {
                showSuccess('You are already logged in! Redirecting...');
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 1500);
            }
        });