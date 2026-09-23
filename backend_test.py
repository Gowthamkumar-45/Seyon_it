#!/usr/bin/env python3
"""
Backend API Test Suite for Seyon IT Solutions
Tests all backend endpoints as per requirements
"""

import requests
import json
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

# Base URL from environment
BASE_URL = "http://localhost:3000/api"

# Test results tracking
test_results = {
    "passed": [],
    "failed": [],
    "warnings": []
}

def log_pass(test_name):
    print(f"✅ PASS: {test_name}")
    test_results["passed"].append(test_name)

def log_fail(test_name, reason):
    print(f"❌ FAIL: {test_name}")
    print(f"   Reason: {reason}")
    test_results["failed"].append(f"{test_name}: {reason}")

def log_warning(test_name, reason):
    print(f"⚠️  WARNING: {test_name}")
    print(f"   Reason: {reason}")
    test_results["warnings"].append(f"{test_name}: {reason}")

print("=" * 80)
print("SEYON IT SOLUTIONS - BACKEND API TEST SUITE")
print("=" * 80)
print()

# ============================================================================
# TEST 1: PUBLIC GET ENDPOINTS
# ============================================================================
print("\n" + "=" * 80)
print("TEST 1: PUBLIC GET ENDPOINTS")
print("=" * 80)

# Test 1.1: GET /api/projects - should return exactly 7 seeded projects
print("\n[1.1] Testing GET /api/projects...")
try:
    response = requests.get(f"{BASE_URL}/projects", timeout=10)
    if response.status_code == 200:
        projects = response.json()
        if not isinstance(projects, list):
            log_fail("GET /api/projects", f"Expected array, got {type(projects)}")
        elif len(projects) != 7:
            log_fail("GET /api/projects", f"Expected 7 projects, got {len(projects)}")
        else:
            # Check structure and no _id leak
            has_id_leak = False
            missing_fields = []
            for p in projects:
                if "_id" in p:
                    has_id_leak = True
                required = ["id", "slug", "name", "category", "tagline", "description", "features"]
                for field in required:
                    if field not in p:
                        missing_fields.append(field)
                        break
            
            if has_id_leak:
                log_fail("GET /api/projects", "Mongo _id leaked in response")
            elif missing_fields:
                log_fail("GET /api/projects", f"Missing required fields: {missing_fields}")
            else:
                log_pass("GET /api/projects returns 7 projects with correct structure")
    else:
        log_fail("GET /api/projects", f"Status {response.status_code}: {response.text}")
except Exception as e:
    log_fail("GET /api/projects", str(e))

# Test 1.2: GET /api/projects/:slug - valid slug
print("\n[1.2] Testing GET /api/projects/ccmc-dialysis-care...")
try:
    response = requests.get(f"{BASE_URL}/projects/ccmc-dialysis-care", timeout=10)
    if response.status_code == 200:
        project = response.json()
        if "_id" in project:
            log_fail("GET /api/projects/:slug", "Mongo _id leaked")
        elif "slug" not in project or project["slug"] != "ccmc-dialysis-care":
            log_fail("GET /api/projects/:slug", f"Wrong project returned: {project.get('slug')}")
        else:
            log_pass("GET /api/projects/ccmc-dialysis-care returns correct project")
    else:
        log_fail("GET /api/projects/ccmc-dialysis-care", f"Status {response.status_code}")
except Exception as e:
    log_fail("GET /api/projects/ccmc-dialysis-care", str(e))

# Test 1.3: GET /api/projects/:slug - invalid slug (404)
print("\n[1.3] Testing GET /api/projects/does-not-exist (should 404)...")
try:
    response = requests.get(f"{BASE_URL}/projects/does-not-exist", timeout=10)
    if response.status_code == 404:
        log_pass("GET /api/projects/does-not-exist returns 404")
    else:
        log_fail("GET /api/projects/does-not-exist", f"Expected 404, got {response.status_code}")
except Exception as e:
    log_fail("GET /api/projects/does-not-exist", str(e))

# Test 1.4: GET /api/services - should return 6 services
print("\n[1.4] Testing GET /api/services...")
try:
    response = requests.get(f"{BASE_URL}/services", timeout=10)
    if response.status_code == 200:
        services = response.json()
        if not isinstance(services, list):
            log_fail("GET /api/services", f"Expected array, got {type(services)}")
        elif len(services) != 6:
            log_fail("GET /api/services", f"Expected 6 services, got {len(services)}")
        elif any("_id" in s for s in services):
            log_fail("GET /api/services", "Mongo _id leaked")
        else:
            log_pass("GET /api/services returns 6 services")
    else:
        log_fail("GET /api/services", f"Status {response.status_code}")
except Exception as e:
    log_fail("GET /api/services", str(e))

# Test 1.5: GET /api/testimonials - should return 3
print("\n[1.5] Testing GET /api/testimonials...")
try:
    response = requests.get(f"{BASE_URL}/testimonials", timeout=10)
    if response.status_code == 200:
        testimonials = response.json()
        if not isinstance(testimonials, list):
            log_fail("GET /api/testimonials", f"Expected array, got {type(testimonials)}")
        elif len(testimonials) != 3:
            log_fail("GET /api/testimonials", f"Expected 3 testimonials, got {len(testimonials)}")
        elif any("_id" in t for t in testimonials):
            log_fail("GET /api/testimonials", "Mongo _id leaked")
        else:
            log_pass("GET /api/testimonials returns 3 testimonials")
    else:
        log_fail("GET /api/testimonials", f"Status {response.status_code}")
except Exception as e:
    log_fail("GET /api/testimonials", str(e))

# Test 1.6: GET /api/stats - should return array of 4 counters
print("\n[1.6] Testing GET /api/stats...")
try:
    response = requests.get(f"{BASE_URL}/stats", timeout=10)
    if response.status_code == 200:
        stats = response.json()
        if not isinstance(stats, list):
            log_fail("GET /api/stats", f"Expected array, got {type(stats)}")
        elif len(stats) != 4:
            log_fail("GET /api/stats", f"Expected 4 stats, got {len(stats)}")
        else:
            log_pass("GET /api/stats returns 4 counters")
    else:
        log_fail("GET /api/stats", f"Status {response.status_code}")
except Exception as e:
    log_fail("GET /api/stats", str(e))

# Test 1.7: GET /api/company - should return object
print("\n[1.7] Testing GET /api/company...")
try:
    response = requests.get(f"{BASE_URL}/company", timeout=10)
    if response.status_code == 200:
        company = response.json()
        if not isinstance(company, dict):
            log_fail("GET /api/company", f"Expected object, got {type(company)}")
        elif "name" not in company:
            log_fail("GET /api/company", "Missing 'name' field")
        else:
            log_pass("GET /api/company returns company object")
    else:
        log_fail("GET /api/company", f"Status {response.status_code}")
except Exception as e:
    log_fail("GET /api/company", str(e))

# Test 1.8: Concurrent requests to test connection race fix
print("\n[1.8] Testing concurrent requests (connection race fix)...")
try:
    def fetch_projects():
        return requests.get(f"{BASE_URL}/projects", timeout=10)
    
    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = [executor.submit(fetch_projects) for _ in range(10)]
        results = [f.result() for f in as_completed(futures)]
    
    failed_requests = [r for r in results if r.status_code != 200]
    if failed_requests:
        log_fail("Concurrent requests", f"{len(failed_requests)} out of 10 requests failed")
    else:
        log_pass("Concurrent requests - no connection race issues")
except Exception as e:
    log_fail("Concurrent requests", str(e))

# ============================================================================
# TEST 2: CONTACT + NEWSLETTER
# ============================================================================
print("\n" + "=" * 80)
print("TEST 2: CONTACT + NEWSLETTER ENDPOINTS")
print("=" * 80)

# Test 2.1: POST /api/contact - valid submission
print("\n[2.1] Testing POST /api/contact with valid data...")
try:
    payload = {
        "name": "John Smith",
        "email": "john.smith@example.com",
        "message": "I'm interested in your web development services for our healthcare project."
    }
    response = requests.post(f"{BASE_URL}/contact", json=payload, timeout=10)
    if response.status_code == 200:
        data = response.json()
        if "id" not in data:
            log_fail("POST /api/contact", "Response missing 'id' field")
        elif "_id" in data:
            log_fail("POST /api/contact", "Mongo _id leaked")
        else:
            log_pass("POST /api/contact with valid data")
    else:
        log_fail("POST /api/contact", f"Status {response.status_code}: {response.text}")
except Exception as e:
    log_fail("POST /api/contact", str(e))

# Test 2.2: POST /api/contact - missing message (should 400)
print("\n[2.2] Testing POST /api/contact without message (should 400)...")
try:
    payload = {
        "name": "Jane Doe",
        "email": "jane@example.com"
    }
    response = requests.post(f"{BASE_URL}/contact", json=payload, timeout=10)
    if response.status_code == 400:
        log_pass("POST /api/contact without message returns 400")
    else:
        log_fail("POST /api/contact validation", f"Expected 400, got {response.status_code}")
except Exception as e:
    log_fail("POST /api/contact validation", str(e))

# Test 2.3: POST /api/newsletter - valid email
print("\n[2.3] Testing POST /api/newsletter with valid email...")
try:
    payload = {"email": "subscriber@example.com"}
    response = requests.post(f"{BASE_URL}/newsletter", json=payload, timeout=10)
    if response.status_code == 200:
        data = response.json()
        if data.get("ok") == True:
            log_pass("POST /api/newsletter with valid email")
        else:
            log_fail("POST /api/newsletter", f"Expected {{ok:true}}, got {data}")
    else:
        log_fail("POST /api/newsletter", f"Status {response.status_code}")
except Exception as e:
    log_fail("POST /api/newsletter", str(e))

# Test 2.4: POST /api/newsletter - missing email (should 400)
print("\n[2.4] Testing POST /api/newsletter without email (should 400)...")
try:
    payload = {}
    response = requests.post(f"{BASE_URL}/newsletter", json=payload, timeout=10)
    if response.status_code == 400:
        log_pass("POST /api/newsletter without email returns 400")
    else:
        log_fail("POST /api/newsletter validation", f"Expected 400, got {response.status_code}")
except Exception as e:
    log_fail("POST /api/newsletter validation", str(e))

# ============================================================================
# TEST 3: ADMIN AUTH
# ============================================================================
print("\n" + "=" * 80)
print("TEST 3: ADMIN AUTHENTICATION")
print("=" * 80)

admin_token = None

# Test 3.1: POST /api/admin/login - valid credentials
print("\n[3.1] Testing POST /api/admin/login with valid credentials...")
try:
    payload = {
        "email": "admin@seyonit.com",
        "password": "Seyon@2025"
    }
    response = requests.post(f"{BASE_URL}/admin/login", json=payload, timeout=10)
    if response.status_code == 200:
        data = response.json()
        if "token" not in data:
            log_fail("POST /api/admin/login", "Response missing 'token' field")
        else:
            admin_token = data["token"]
            log_pass("POST /api/admin/login with valid credentials")
    else:
        log_fail("POST /api/admin/login", f"Status {response.status_code}: {response.text}")
except Exception as e:
    log_fail("POST /api/admin/login", str(e))

# Test 3.2: POST /api/admin/login - wrong password (should 401)
print("\n[3.2] Testing POST /api/admin/login with wrong password (should 401)...")
try:
    payload = {
        "email": "admin@seyonit.com",
        "password": "WrongPassword123"
    }
    response = requests.post(f"{BASE_URL}/admin/login", json=payload, timeout=10)
    if response.status_code == 401:
        log_pass("POST /api/admin/login with wrong password returns 401")
    else:
        log_fail("POST /api/admin/login auth", f"Expected 401, got {response.status_code}")
except Exception as e:
    log_fail("POST /api/admin/login auth", str(e))

# Test 3.3: GET /api/admin/messages without token (should 401)
print("\n[3.3] Testing GET /api/admin/messages without Authorization (should 401)...")
try:
    response = requests.get(f"{BASE_URL}/admin/messages", timeout=10)
    if response.status_code == 401:
        log_pass("GET /api/admin/messages without token returns 401")
    else:
        log_fail("Protected route without auth", f"Expected 401, got {response.status_code}")
except Exception as e:
    log_fail("Protected route without auth", str(e))

# Test 3.4: GET /api/admin/messages with token (should 200)
print("\n[3.4] Testing GET /api/admin/messages with Authorization...")
if admin_token:
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/admin/messages", headers=headers, timeout=10)
        if response.status_code == 200:
            messages = response.json()
            if isinstance(messages, list):
                log_pass("GET /api/admin/messages with token returns array")
            else:
                log_fail("GET /api/admin/messages", f"Expected array, got {type(messages)}")
        else:
            log_fail("GET /api/admin/messages", f"Status {response.status_code}")
    except Exception as e:
        log_fail("GET /api/admin/messages", str(e))
else:
    log_fail("GET /api/admin/messages", "No admin token available")

# ============================================================================
# TEST 4: ADMIN OVERVIEW
# ============================================================================
print("\n" + "=" * 80)
print("TEST 4: ADMIN OVERVIEW")
print("=" * 80)

print("\n[4.1] Testing GET /api/admin/overview...")
if admin_token:
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/admin/overview", headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            required_keys = ["counts", "byCategory", "recentMessages"]
            missing = [k for k in required_keys if k not in data]
            if missing:
                log_fail("GET /api/admin/overview", f"Missing keys: {missing}")
            else:
                counts = data["counts"]
                expected_counts = ["projects", "services", "testimonials", "messages", "unread", "subscribers"]
                missing_counts = [k for k in expected_counts if k not in counts]
                if missing_counts:
                    log_fail("GET /api/admin/overview", f"Missing count keys: {missing_counts}")
                else:
                    log_pass("GET /api/admin/overview returns complete data")
        else:
            log_fail("GET /api/admin/overview", f"Status {response.status_code}")
    except Exception as e:
        log_fail("GET /api/admin/overview", str(e))
else:
    log_fail("GET /api/admin/overview", "No admin token available")

# ============================================================================
# TEST 5: ADMIN CRUD - PROJECTS
# ============================================================================
print("\n" + "=" * 80)
print("TEST 5: ADMIN CRUD - PROJECTS")
print("=" * 80)

created_project_id = None

# Test 5.1: POST /api/admin/projects - create new project
print("\n[5.1] Testing POST /api/admin/projects (create)...")
if admin_token:
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        payload = {
            "name": "Test Healthcare Portal",
            "category": "Healthcare",
            "client": "City Medical Center",
            "tagline": "Modern patient management system",
            "description": "A comprehensive healthcare portal for managing patient records and appointments.",
            "features": ["Patient Records", "Appointment Scheduling", "Billing Integration"]
        }
        response = requests.post(f"{BASE_URL}/admin/projects", json=payload, headers=headers, timeout=10)
        if response.status_code == 200:
            project = response.json()
            if "id" not in project or "slug" not in project:
                log_fail("POST /api/admin/projects", "Missing id or slug in response")
            elif "_id" in project:
                log_fail("POST /api/admin/projects", "Mongo _id leaked")
            else:
                created_project_id = project["id"]
                log_pass("POST /api/admin/projects creates project with generated slug")
        else:
            log_fail("POST /api/admin/projects", f"Status {response.status_code}: {response.text}")
    except Exception as e:
        log_fail("POST /api/admin/projects", str(e))
else:
    log_fail("POST /api/admin/projects", "No admin token available")

# Test 5.2: PUT /api/admin/projects/:id - edit project
print("\n[5.2] Testing PUT /api/admin/projects/:id (edit)...")
if admin_token and created_project_id:
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        payload = {
            "tagline": "Updated tagline for healthcare portal"
        }
        response = requests.put(f"{BASE_URL}/admin/projects/{created_project_id}", json=payload, headers=headers, timeout=10)
        if response.status_code == 200:
            project = response.json()
            if project.get("tagline") == "Updated tagline for healthcare portal":
                log_pass("PUT /api/admin/projects/:id updates project")
            else:
                log_fail("PUT /api/admin/projects/:id", f"Tagline not updated: {project.get('tagline')}")
        else:
            log_fail("PUT /api/admin/projects/:id", f"Status {response.status_code}")
    except Exception as e:
        log_fail("PUT /api/admin/projects/:id", str(e))
else:
    log_fail("PUT /api/admin/projects/:id", "No admin token or project ID")

# Test 5.3: Verify GET /api/projects reflects changes
print("\n[5.3] Testing GET /api/projects reflects changes...")
try:
    response = requests.get(f"{BASE_URL}/projects", timeout=10)
    if response.status_code == 200:
        projects = response.json()
        # Should now have 8 projects (7 seeded + 1 created)
        if len(projects) == 8:
            log_pass("GET /api/projects reflects new project (8 total)")
        else:
            log_fail("GET /api/projects after create", f"Expected 8 projects, got {len(projects)}")
    else:
        log_fail("GET /api/projects after create", f"Status {response.status_code}")
except Exception as e:
    log_fail("GET /api/projects after create", str(e))

# Test 5.4: DELETE /api/admin/projects/:id
print("\n[5.4] Testing DELETE /api/admin/projects/:id...")
if admin_token and created_project_id:
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.delete(f"{BASE_URL}/admin/projects/{created_project_id}", headers=headers, timeout=10)
        if response.status_code == 200:
            # Verify deletion
            response = requests.get(f"{BASE_URL}/projects", timeout=10)
            if response.status_code == 200:
                projects = response.json()
                if len(projects) == 7:
                    log_pass("DELETE /api/admin/projects/:id removes project")
                else:
                    log_fail("DELETE /api/admin/projects/:id", f"Expected 7 projects after delete, got {len(projects)}")
        else:
            log_fail("DELETE /api/admin/projects/:id", f"Status {response.status_code}")
    except Exception as e:
        log_fail("DELETE /api/admin/projects/:id", str(e))
else:
    log_fail("DELETE /api/admin/projects/:id", "No admin token or project ID")

# ============================================================================
# TEST 6: ADMIN CRUD - SERVICES
# ============================================================================
print("\n" + "=" * 80)
print("TEST 6: ADMIN CRUD - SERVICES")
print("=" * 80)

created_service_id = None

# Test 6.1: POST /api/admin/services
print("\n[6.1] Testing POST /api/admin/services (create)...")
if admin_token:
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        payload = {
            "title": "Test Service",
            "icon": "TestIcon",
            "description": "This is a test service"
        }
        response = requests.post(f"{BASE_URL}/admin/services", json=payload, headers=headers, timeout=10)
        if response.status_code == 200:
            service = response.json()
            if "id" in service:
                created_service_id = service["id"]
                log_pass("POST /api/admin/services creates service")
            else:
                log_fail("POST /api/admin/services", "Missing id in response")
        else:
            log_fail("POST /api/admin/services", f"Status {response.status_code}")
    except Exception as e:
        log_fail("POST /api/admin/services", str(e))
else:
    log_fail("POST /api/admin/services", "No admin token")

# Test 6.2: PUT /api/admin/services/:id
print("\n[6.2] Testing PUT /api/admin/services/:id (edit)...")
if admin_token and created_service_id:
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        payload = {"title": "Updated Test Service"}
        response = requests.put(f"{BASE_URL}/admin/services/{created_service_id}", json=payload, headers=headers, timeout=10)
        if response.status_code == 200:
            log_pass("PUT /api/admin/services/:id updates service")
        else:
            log_fail("PUT /api/admin/services/:id", f"Status {response.status_code}")
    except Exception as e:
        log_fail("PUT /api/admin/services/:id", str(e))
else:
    log_fail("PUT /api/admin/services/:id", "No admin token or service ID")

# Test 6.3: DELETE /api/admin/services/:id
print("\n[6.3] Testing DELETE /api/admin/services/:id...")
if admin_token and created_service_id:
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.delete(f"{BASE_URL}/admin/services/{created_service_id}", headers=headers, timeout=10)
        if response.status_code == 200:
            log_pass("DELETE /api/admin/services/:id removes service")
        else:
            log_fail("DELETE /api/admin/services/:id", f"Status {response.status_code}")
    except Exception as e:
        log_fail("DELETE /api/admin/services/:id", str(e))
else:
    log_fail("DELETE /api/admin/services/:id", "No admin token or service ID")

# ============================================================================
# TEST 7: ADMIN CRUD - TESTIMONIALS
# ============================================================================
print("\n" + "=" * 80)
print("TEST 7: ADMIN CRUD - TESTIMONIALS")
print("=" * 80)

created_testimonial_id = None

# Test 7.1: POST /api/admin/testimonials
print("\n[7.1] Testing POST /api/admin/testimonials (create)...")
if admin_token:
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        payload = {
            "quote": "Excellent service and support!",
            "author": "Test Client",
            "role": "CEO, Test Company"
        }
        response = requests.post(f"{BASE_URL}/admin/testimonials", json=payload, headers=headers, timeout=10)
        if response.status_code == 200:
            testimonial = response.json()
            if "id" in testimonial:
                created_testimonial_id = testimonial["id"]
                log_pass("POST /api/admin/testimonials creates testimonial")
            else:
                log_fail("POST /api/admin/testimonials", "Missing id in response")
        else:
            log_fail("POST /api/admin/testimonials", f"Status {response.status_code}")
    except Exception as e:
        log_fail("POST /api/admin/testimonials", str(e))
else:
    log_fail("POST /api/admin/testimonials", "No admin token")

# Test 7.2: PUT /api/admin/testimonials/:id
print("\n[7.2] Testing PUT /api/admin/testimonials/:id (edit)...")
if admin_token and created_testimonial_id:
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        payload = {"quote": "Updated testimonial quote"}
        response = requests.put(f"{BASE_URL}/admin/testimonials/{created_testimonial_id}", json=payload, headers=headers, timeout=10)
        if response.status_code == 200:
            log_pass("PUT /api/admin/testimonials/:id updates testimonial")
        else:
            log_fail("PUT /api/admin/testimonials/:id", f"Status {response.status_code}")
    except Exception as e:
        log_fail("PUT /api/admin/testimonials/:id", str(e))
else:
    log_fail("PUT /api/admin/testimonials/:id", "No admin token or testimonial ID")

# Test 7.3: DELETE /api/admin/testimonials/:id
print("\n[7.3] Testing DELETE /api/admin/testimonials/:id...")
if admin_token and created_testimonial_id:
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.delete(f"{BASE_URL}/admin/testimonials/{created_testimonial_id}", headers=headers, timeout=10)
        if response.status_code == 200:
            log_pass("DELETE /api/admin/testimonials/:id removes testimonial")
        else:
            log_fail("DELETE /api/admin/testimonials/:id", f"Status {response.status_code}")
    except Exception as e:
        log_fail("DELETE /api/admin/testimonials/:id", str(e))
else:
    log_fail("DELETE /api/admin/testimonials/:id", "No admin token or testimonial ID")

# ============================================================================
# TEST 8: ADMIN SETTINGS (STATS & COMPANY)
# ============================================================================
print("\n" + "=" * 80)
print("TEST 8: ADMIN SETTINGS - STATS & COMPANY")
print("=" * 80)

# Test 8.1: PUT /api/admin/stats
print("\n[8.1] Testing PUT /api/admin/stats...")
if admin_token:
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        payload = {
            "value": [
                {"label": "Projects", "value": "100+"},
                {"label": "Clients", "value": "50+"},
                {"label": "Years", "value": "10+"},
                {"label": "Team", "value": "25+"}
            ]
        }
        response = requests.put(f"{BASE_URL}/admin/stats", json=payload, headers=headers, timeout=10)
        if response.status_code == 200:
            # Verify with GET
            response = requests.get(f"{BASE_URL}/stats", timeout=10)
            if response.status_code == 200:
                stats = response.json()
                if len(stats) == 4 and stats[0].get("label") == "Projects":
                    log_pass("PUT /api/admin/stats updates stats")
                else:
                    log_fail("PUT /api/admin/stats", "Stats not updated correctly")
            else:
                log_fail("PUT /api/admin/stats", "Failed to verify with GET")
        else:
            log_fail("PUT /api/admin/stats", f"Status {response.status_code}")
    except Exception as e:
        log_fail("PUT /api/admin/stats", str(e))
else:
    log_fail("PUT /api/admin/stats", "No admin token")

# Test 8.2: PUT /api/admin/company
print("\n[8.2] Testing PUT /api/admin/company...")
if admin_token:
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        payload = {
            "value": {
                "name": "Seyon IT Solutions Pvt Ltd",
                "address": "Coimbatore, Tamil Nadu, India",
                "email": "contact@seyonit.com",
                "tagline": "Innovative IT Solutions"
            }
        }
        response = requests.put(f"{BASE_URL}/admin/company", json=payload, headers=headers, timeout=10)
        if response.status_code == 200:
            # Verify with GET
            response = requests.get(f"{BASE_URL}/company", timeout=10)
            if response.status_code == 200:
                company = response.json()
                if company.get("name") == "Seyon IT Solutions Pvt Ltd":
                    log_pass("PUT /api/admin/company updates company info")
                else:
                    log_fail("PUT /api/admin/company", "Company info not updated correctly")
            else:
                log_fail("PUT /api/admin/company", "Failed to verify with GET")
        else:
            log_fail("PUT /api/admin/company", f"Status {response.status_code}")
    except Exception as e:
        log_fail("PUT /api/admin/company", str(e))
else:
    log_fail("PUT /api/admin/company", "No admin token")

# ============================================================================
# TEST 9: ADMIN MESSAGES MANAGEMENT
# ============================================================================
print("\n" + "=" * 80)
print("TEST 9: ADMIN MESSAGES MANAGEMENT")
print("=" * 80)

# We already created a message in Test 2.1, let's get it
message_id = None

print("\n[9.1] Testing GET /api/admin/messages to find test message...")
if admin_token:
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/admin/messages", headers=headers, timeout=10)
        if response.status_code == 200:
            messages = response.json()
            if len(messages) > 0:
                message_id = messages[0]["id"]
                log_pass("GET /api/admin/messages retrieves messages")
            else:
                log_warning("GET /api/admin/messages", "No messages found")
        else:
            log_fail("GET /api/admin/messages", f"Status {response.status_code}")
    except Exception as e:
        log_fail("GET /api/admin/messages", str(e))
else:
    log_fail("GET /api/admin/messages", "No admin token")

# Test 9.2: PUT /api/admin/messages/:id (mark as read)
print("\n[9.2] Testing PUT /api/admin/messages/:id (mark as read)...")
if admin_token and message_id:
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        payload = {"read": True}
        response = requests.put(f"{BASE_URL}/admin/messages/{message_id}", json=payload, headers=headers, timeout=10)
        if response.status_code == 200:
            log_pass("PUT /api/admin/messages/:id marks message as read")
        else:
            log_fail("PUT /api/admin/messages/:id", f"Status {response.status_code}")
    except Exception as e:
        log_fail("PUT /api/admin/messages/:id", str(e))
else:
    log_fail("PUT /api/admin/messages/:id", "No admin token or message ID")

# Test 9.3: DELETE /api/admin/messages/:id
print("\n[9.3] Testing DELETE /api/admin/messages/:id...")
if admin_token and message_id:
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.delete(f"{BASE_URL}/admin/messages/{message_id}", headers=headers, timeout=10)
        if response.status_code == 200:
            log_pass("DELETE /api/admin/messages/:id removes message")
        else:
            log_fail("DELETE /api/admin/messages/:id", f"Status {response.status_code}")
    except Exception as e:
        log_fail("DELETE /api/admin/messages/:id", str(e))
else:
    log_fail("DELETE /api/admin/messages/:id", "No admin token or message ID")

# ============================================================================
# TEST 10: ADMIN PASSWORD CHANGE
# ============================================================================
print("\n" + "=" * 80)
print("TEST 10: ADMIN PASSWORD CHANGE")
print("=" * 80)

# Test 10.1: Change password to new one
print("\n[10.1] Testing POST /api/admin/password (change to new password)...")
if admin_token:
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        payload = {
            "current": "Seyon@2025",
            "next": "NewPass123"
        }
        response = requests.post(f"{BASE_URL}/admin/password", json=payload, headers=headers, timeout=10)
        if response.status_code == 200:
            log_pass("POST /api/admin/password changes password")
        else:
            log_fail("POST /api/admin/password", f"Status {response.status_code}: {response.text}")
    except Exception as e:
        log_fail("POST /api/admin/password", str(e))
else:
    log_fail("POST /api/admin/password", "No admin token")

# Test 10.2: Login with new password
print("\n[10.2] Testing login with new password...")
try:
    payload = {
        "email": "admin@seyonit.com",
        "password": "NewPass123"
    }
    response = requests.post(f"{BASE_URL}/admin/login", json=payload, timeout=10)
    if response.status_code == 200:
        new_token = response.json().get("token")
        log_pass("Login with new password works")
        admin_token = new_token  # Update token for next test
    else:
        log_fail("Login with new password", f"Status {response.status_code}")
except Exception as e:
    log_fail("Login with new password", str(e))

# Test 10.3: Change password back to default
print("\n[10.3] Testing POST /api/admin/password (change back to default)...")
if admin_token:
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        payload = {
            "current": "NewPass123",
            "next": "Seyon@2025"
        }
        response = requests.post(f"{BASE_URL}/admin/password", json=payload, headers=headers, timeout=10)
        if response.status_code == 200:
            log_pass("POST /api/admin/password changes back to default")
        else:
            log_fail("POST /api/admin/password (revert)", f"Status {response.status_code}")
    except Exception as e:
        log_fail("POST /api/admin/password (revert)", str(e))
else:
    log_fail("POST /api/admin/password (revert)", "No admin token")

# ============================================================================
# TEST 11: AI ENDPOINTS (EXPECTED 503)
# ============================================================================
print("\n" + "=" * 80)
print("TEST 11: AI ENDPOINTS (EXPECTED 503 - NOT CONFIGURED)")
print("=" * 80)

# Test 11.1: POST /api/ai/chat
print("\n[11.1] Testing POST /api/ai/chat (should return 503)...")
try:
    payload = {
        "messages": [{"role": "user", "content": "Hello"}]
    }
    response = requests.post(f"{BASE_URL}/ai/chat", json=payload, timeout=10)
    if response.status_code == 503:
        data = response.json()
        if "error" in data and "not configured" in data["error"].lower():
            log_pass("POST /api/ai/chat returns 503 with proper error message")
        else:
            log_fail("POST /api/ai/chat", f"503 but wrong error message: {data}")
    else:
        log_fail("POST /api/ai/chat", f"Expected 503, got {response.status_code}")
except Exception as e:
    log_fail("POST /api/ai/chat", str(e))

# Test 11.2: POST /api/ai/polish
print("\n[11.2] Testing POST /api/ai/polish (should return 503)...")
try:
    payload = {"text": "Test message"}
    response = requests.post(f"{BASE_URL}/ai/polish", json=payload, timeout=10)
    if response.status_code == 503:
        data = response.json()
        if "error" in data and "not configured" in data["error"].lower():
            log_pass("POST /api/ai/polish returns 503 with proper error message")
        else:
            log_fail("POST /api/ai/polish", f"503 but wrong error message: {data}")
    else:
        log_fail("POST /api/ai/polish", f"Expected 503, got {response.status_code}")
except Exception as e:
    log_fail("POST /api/ai/polish", str(e))

# Test 11.3: POST /api/admin/ai/project
print("\n[11.3] Testing POST /api/admin/ai/project (should return 503)...")
if admin_token:
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        payload = {
            "name": "Test Project",
            "category": "Healthcare",
            "notes": "Some notes"
        }
        response = requests.post(f"{BASE_URL}/admin/ai/project", json=payload, headers=headers, timeout=10)
        if response.status_code == 503:
            data = response.json()
            if "error" in data and "not configured" in data["error"].lower():
                log_pass("POST /api/admin/ai/project returns 503 with proper error message")
            else:
                log_fail("POST /api/admin/ai/project", f"503 but wrong error message: {data}")
        else:
            log_fail("POST /api/admin/ai/project", f"Expected 503, got {response.status_code}")
    except Exception as e:
        log_fail("POST /api/admin/ai/project", str(e))
else:
    log_fail("POST /api/admin/ai/project", "No admin token")

# Test 11.4: POST /api/admin/ai/reply
print("\n[11.4] Testing POST /api/admin/ai/reply (should return 503)...")
if admin_token:
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        payload = {
            "name": "Test User",
            "message": "Test message"
        }
        response = requests.post(f"{BASE_URL}/admin/ai/reply", json=payload, headers=headers, timeout=10)
        if response.status_code == 503:
            data = response.json()
            if "error" in data and "not configured" in data["error"].lower():
                log_pass("POST /api/admin/ai/reply returns 503 with proper error message")
            else:
                log_fail("POST /api/admin/ai/reply", f"503 but wrong error message: {data}")
        else:
            log_fail("POST /api/admin/ai/reply", f"Expected 503, got {response.status_code}")
    except Exception as e:
        log_fail("POST /api/admin/ai/reply", str(e))
else:
    log_fail("POST /api/admin/ai/reply", "No admin token")

# ============================================================================
# FINAL SUMMARY
# ============================================================================
print("\n" + "=" * 80)
print("TEST SUMMARY")
print("=" * 80)
print(f"\n✅ PASSED: {len(test_results['passed'])} tests")
print(f"❌ FAILED: {len(test_results['failed'])} tests")
print(f"⚠️  WARNINGS: {len(test_results['warnings'])} tests")

if test_results['failed']:
    print("\n" + "=" * 80)
    print("FAILED TESTS:")
    print("=" * 80)
    for failure in test_results['failed']:
        print(f"  • {failure}")

if test_results['warnings']:
    print("\n" + "=" * 80)
    print("WARNINGS:")
    print("=" * 80)
    for warning in test_results['warnings']:
        print(f"  • {warning}")

print("\n" + "=" * 80)
print("TEST EXECUTION COMPLETE")
print("=" * 80)

# Exit with appropriate code
exit(0 if len(test_results['failed']) == 0 else 1)
