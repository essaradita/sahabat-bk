// API Client untuk Vercel Full-Stack Serverless
// Production: API served from /api routes (same domain, no port)
// Development: localhost:3002 or environment variable
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
const API_URL = isLocalhost 
  ? (import.meta.env.VITE_API_URL || 'http://localhost:3002/api')
  : '/api' // Vercel production: relative path to serverless functions

console.log('🌐 API URL:', API_URL)
console.log('🌐 Environment:', import.meta.env.MODE)
console.log('🌐 Hostname:', window.location.hostname)
console.log('🌐 Using:', isLocalhost ? 'LOCALHOST' : 'NETWORK IP')

class APIClient {
  constructor() {
    this.token = localStorage.getItem('sahabatbk_token')
  }

  setToken(token) {
    this.token = token
    if (token) {
      localStorage.setItem('sahabatbk_token', token)
    } else {
      localStorage.removeItem('sahabatbk_token')
    }
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const url = `${API_URL}${endpoint}`
    console.log('🔄 API Request:', options.method || 'GET', url)

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30s timeout

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
        mode: 'cors'
      })

      clearTimeout(timeoutId)

      let data
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        const text = await response.text()
        console.error('❌ Non-JSON response:', text.substring(0, 200))
        throw new Error('Server mengembalikan response yang tidak valid. Pastikan backend jalan.')
      }

      if (!response.ok) {
        console.error('❌ API Error:', response.status, data.error || 'Request failed')
        throw new Error(data.error || `Request failed with status ${response.status}`)
      }

      console.log('✅ API Success:', endpoint)
      return data
    } catch (err) {
      if (err.name === 'AbortError') {
        console.error('❌ Request timeout:', url)
        throw new Error('Request timeout. Pastikan backend jalan dan network stabil.')
      }
      console.error('❌ Fetch Error:', err.message)
      
      // More specific error messages
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        throw new Error('Tidak dapat terhubung ke server. Pastikan backend jalan di ' + API_URL)
      }
      
      throw err
    }
  }

  // Auth
  async registerStudent(userData) {
    const data = await this.request('/auth/register/student', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
    this.setToken(data.token)
    return data
  }

  async registerTeacher(userData) {
    const data = await this.request('/auth/register/teacher', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
    this.setToken(data.token)
    return data
  }

  async loginStudent(username, password) {
    const data = await this.request('/auth/login/student', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    })
    this.setToken(data.token)
    return data
  }

  async loginTeacher(email, password) {
    const data = await this.request('/auth/login/teacher', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
    this.setToken(data.token)
    return data
  }

  async getProfile() {
    return await this.request('/auth/profile')
  }

  // Teacher endpoints
  async getStudents() {
    return await this.request('/teacher/students')
  }

  async addStudent(studentData) {
    return await this.request('/teacher/students', {
      method: 'POST',
      body: JSON.stringify(studentData)
    })
  }

  // Mission progress endpoints (Student)
  async getStudentMissions() {
    return await this.request('/student/missions')
  }

  async completeMission(missionId, score, xpReward, coinReward) {
    return await this.request('/student/missions/complete', {
      method: 'POST',
      body: JSON.stringify({ missionId, score, xpReward, coinReward })
    })
  }

  logout() {
    this.setToken(null)
    localStorage.removeItem('sahabatbk_session')
  }

  // ============================================================
  // MISSION MANAGEMENT (Teacher)
  // ============================================================

  async getMissions() {
    return await this.request('/teacher/missions')
  }

  async createMission(missionData) {
    return await this.request('/teacher/missions', {
      method: 'POST',
      body: JSON.stringify(missionData)
    })
  }

  async updateMission(missionId, missionData) {
    return await this.request(`/teacher/missions/${missionId}`, {
      method: 'PUT',
      body: JSON.stringify(missionData)
    })
  }

  async deleteMission(missionId) {
    return await this.request(`/teacher/missions/${missionId}`, {
      method: 'DELETE'
    })
  }

  // ============================================================
  // CASE STUDY MANAGEMENT (Teacher)
  // ============================================================

  async getCaseStudies() {
    return await this.request('/teacher/case-studies')
  }

  async createCaseStudy(caseData) {
    return await this.request('/teacher/case-studies', {
      method: 'POST',
      body: JSON.stringify(caseData)
    })
  }

  async updateCaseStudy(caseId, caseData) {
    return await this.request(`/teacher/case-studies/${caseId}`, {
      method: 'PUT',
      body: JSON.stringify(caseData)
    })
  }

  async deleteCaseStudy(caseId) {
    return await this.request(`/teacher/case-studies/${caseId}`, {
      method: 'DELETE'
    })
  }

  // ============================================================
  // CLASS MANAGEMENT (Teacher)
  // ============================================================

  async getClasses() {
    return await this.request('/teacher/classes')
  }

  async createClass(classData) {
    return await this.request('/teacher/classes', {
      method: 'POST',
      body: JSON.stringify(classData)
    })
  }

  async updateClass(classId, classData) {
    return await this.request(`/teacher/classes/${classId}`, {
      method: 'PUT',
      body: JSON.stringify(classData)
    })
  }

  async deleteClass(classId) {
    return await this.request(`/teacher/classes/${classId}`, {
      method: 'DELETE'
    })
  }

  // ============================================================
  // ATTENDANCE MANAGEMENT (Teacher)
  // ============================================================

  async getAttendanceStudents() {
    return await this.request('/teacher/attendance/students')
  }

  async addAttendanceStudent(data) {
    return await this.request('/teacher/attendance/students', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async deleteAttendanceStudent(studentId) {
    return await this.request(`/teacher/attendance/students/${studentId}`, {
      method: 'DELETE'
    })
  }

  async markAttendance(studentId, date, status) {
    return await this.request('/teacher/attendance/mark', {
      method: 'POST',
      body: JSON.stringify({ studentId, date, status })
    })
  }

  async getAttendanceRecords(date = null) {
    const query = date ? `?date=${date}` : ''
    return await this.request(`/teacher/attendance/records${query}`)
  }

  // ============================================================
  // QUESTION MANAGEMENT (Teacher)
  // ============================================================

  async getMissionQuestions(missionId) {
    return await this.request(`/teacher/missions/${missionId}/questions`)
  }

  async saveMissionQuestions(missionId, questions) {
    return await this.request(`/teacher/missions/${missionId}/questions`, {
      method: 'POST',
      body: JSON.stringify({ questions })
    })
  }

  async deleteMissionQuestion(missionId, questionId) {
    return await this.request(`/teacher/missions/${missionId}/questions/${questionId}`, {
      method: 'DELETE'
    })
  }

  // ============================================================
  // QUESTION FETCH (Student)
  // ============================================================

  async getStudentMissionQuestions(missionId) {
    return await this.request(`/student/missions/${missionId}/questions`)
  }

  // ============================================================
  // JOURNAL MANAGEMENT (Student)
  // ============================================================

  async getJournals() {
    return await this.request('/student/journals')
  }

  async createJournal(journalData) {
    return await this.request('/student/journals', {
      method: 'POST',
      body: JSON.stringify(journalData)
    })
  }

  async updateJournal(journalId, journalData) {
    return await this.request(`/student/journals/${journalId}`, {
      method: 'PUT',
      body: JSON.stringify(journalData)
    })
  }

  async deleteJournal(journalId) {
    return await this.request(`/student/journals/${journalId}`, {
      method: 'DELETE'
    })
  }
}

export const apiClient = new APIClient()
