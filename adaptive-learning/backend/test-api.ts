import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

async function runTests() {
  try {
    console.log('Testing Health...');
    const health = await axios.get(`${API_URL}/health`);
    console.log('Health:', health.data);

    console.log('\nTesting Login...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      username: 'student',
      password: 'password123'
    });
    const token = loginRes.data.token;
    console.log('Token received:', token.substring(0, 20) + '...');

    const headers = { Authorization: `Bearer ${token}` };

    console.log('\nTesting Subjects...');
    const subjects = await axios.get(`${API_URL}/subjects`, { headers });
    console.log(`Found ${subjects.data.length} subjects.`);

    const algebraTopic = subjects.data[0].topics[0];
    
    console.log(`\nStarting Quiz for Topic ${algebraTopic.name} (ID: ${algebraTopic.id})...`);
    const startRes = await axios.post(`${API_URL}/quiz/start`, { topicId: algebraTopic.id }, { headers });
    const quizAttemptId = startRes.data.quizAttemptId;
    let currentQuestion = startRes.data.question;
    console.log(`Started attempt ${quizAttemptId}. First question: ${currentQuestion.content} (Level ${currentQuestion.difficultyLevel})`);

    // Simulate answering correctly and fast
    console.log('\nSubmitting correct answer...');
    const next1 = await axios.post(`${API_URL}/quiz/next-question`, {
      quizAttemptId,
      questionId: currentQuestion.id,
      isCorrect: true,
      timeTakenMs: 5000 // fast
    }, { headers });
    currentQuestion = next1.data.question;
    console.log(`Next question (expected harder): ${currentQuestion.content} (Level ${currentQuestion.difficultyLevel})`);

    // Submit quiz
    console.log('\nSubmitting quiz...');
    const submit = await axios.post(`${API_URL}/quiz/submit`, { quizAttemptId }, { headers });
    console.log('Quiz results:', submit.data);

    console.log('\nTesting Student Dashboard...');
    const dash = await axios.get(`${API_URL}/dashboard/student`, { headers });
    console.log('Dashboard Data:', JSON.stringify(dash.data, null, 2));

    console.log('\nAll tests passed successfully!');

  } catch (error: any) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

runTests();
