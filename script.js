
        // ===================================
        // 1. CONFIGURATION
        // ===================================
        const CLASS_LAT = 7.800461; 
        const CLASS_LON = 3.913026;

        // Increased to 70 meters to handle "GPS Drift" inside buildings
        const ALLOWED_RADIUS = 500; 
        // ===================================

        // Verify code is running
        console.log("Attendance System Loaded");
        alert("System Loaded! Click Verify to start.");

        const statusEl = document.getElementById('status-message');
        const formContainer = document.getElementById('google-form-container');

        function checkLocation() {
            statusEl.className = 'loading';
            statusEl.innerText = "Checking GPS... Please wait.";

            if (!navigator.geolocation) {
                showError("Geolocation is not supported by your browser.");
                return;
            }

            navigator.geolocation.getCurrentPosition(success, error, {
                enableHighAccuracy: true,
                timeout: 30000,
                maximumAge: 0
            });
        }

        function success(position) {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;
            const distance = getDistance(CLASS_LAT, CLASS_LON, userLat, userLon);

            // Log for debugging
            console.log(`User is at: ${userLat}, ${userLon}. Distance: ${distance}m`);

            if (distance <= ALLOWED_RADIUS) {
                showSuccess(`Success! You are in class (${Math.round(distance)}m away).`);
                formContainer.style.display = "block"; 
            } else {
                showError(`Access Denied. You are ${Math.round(distance)}m away. You must be within ${ALLOWED_RADIUS}m.`);
                formContainer.style.display = "none";
            }
        }

        function error(err) {
            console.warn(`ERROR(${err.code}): ${err.message}`);
            let msg = "Unable to retrieve location.";
            if (err.code === 1) msg = "Location Access Denied. Please allow permissions.";
            if (err.code === 2) msg = "GPS Signal Unavailable.";
            if (err.code === 3) msg = "Location request timed out.";
            showError(msg);
        }

        function showSuccess(msg) {
            statusEl.className = 'success';
            statusEl.innerText = msg;
        }

        function showError(msg) {
            statusEl.className = 'error';
            statusEl.innerText = msg;
        }

        // Haversine Formula
        function getDistance(lat1, lon1, lat2, lon2) {
            const R = 6371e3; 
            const dLat = deg2rad(lat2 - lat1);
            const dLon = deg2rad(lon2 - lon1);
            const a = 
                Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            return R * c;
        }

        function deg2rad(deg) {
            return deg * (Math.PI/180);
        }
