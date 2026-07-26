import axios from 'axios';
import assert from 'assert';

const API_URL = 'http://localhost:3001/api';

async function runQA() {
  console.log('--- Starting QA End-to-End Verification ---');
  let teacherToken = '';
  let studentToken = '';
  let topicId = 1; // Assuming 1 is Algebra from seed

  try {
    // 1. Teacher Signup
    console.log('1. Testing Teacher Signup...');
    await axios.post(`${API_URL}/auth/register`, {
      username: 'qa_teacher',
      password: 'password123',
      role: 'TEACHER'
    }).catch(() => {}); // ignore if exists
    const tLogin = await axios.post(`${API_URL}/auth/login`, {
      username: 'qa_teacher',
      password: 'password123'
    });
    teacherToken = tLogin.data.token;
    assert(teacherToken, 'Teacher token should exist');
    console.log('✅ Teacher Signup & Login successful');

    // 2. Student Signup
    console.log('2. Testing Student Signup...');
    await axios.post(`${API_URL}/auth/register`, {
      username: 'qa_student',
      password: 'password123',
      role: 'STUDENT'
    }).catch(() => {});
    const sLogin = await axios.post(`${API_URL}/auth/login`, {
      username: 'qa_student',
      password: 'password123'
    });
    studentToken = sLogin.data.token;
    assert(studentToken, 'Student token should exist');
    console.log('✅ Student Signup & Login successful');

    // 3. Student fetches topics
    console.log('3. Fetching subjects for student...');
    const subjects = await axios.get(`${API_URL}/subjects`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    assert(subjects.data.length > 0, 'Subjects should not be empty');
    topicId = subjects.data[0].topics[0].id;
    console.log('✅ Subjects fetched successfully');

    // 4. Student starts quiz
    console.log('4. Starting quiz session...');
    const startQuiz = await axios.post(`${API_URL}/quiz/start`, { topicId }, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const quizAttemptId = startQuiz.data.quizAttemptId;
    const firstQuestion = startQuiz.data.question;
    assert(quizAttemptId, 'Quiz attempt should exist');
    assert(firstQuestion, 'First question should exist');
    console.log(`✅ Quiz started (Attempt ID: ${quizAttemptId}, Question Lvl: ${firstQuestion.difficultyLevel})`);

    // 5. Simulating a timeout on the first question (handleAnswer(-1) equivalent)
    // The frontend submits -1 for isCorrect = false, timeTakenMs = 30000
    console.log('5. Simulating question timeout (Slow + Incorrect)...');
    const q1Res = await axios.post(`${API_URL}/quiz/next-question`, {
      quizAttemptId,
      questionId: firstQuestion.id,
      isCorrect: false,
      timeTakenMs: 30000
    }, { headers: { Authorization: `Bearer ${studentToken}` } });
    
    assert(q1Res.data.question, 'Next question should exist');
    console.log(`✅ Next question fetched. New Mastery: ${q1Res.data.currentMasteryScore}`);

    // 6. Submitting a correct, fast answer for the second question
    console.log('6. Simulating fast, correct answer...');
    const secondQuestion = q1Res.data.question;
    const q2Res = await axios.post(`${API_URL}/quiz/next-question`, {
      quizAttemptId,
      questionId: secondQuestion.id,
      isCorrect: true,
      timeTakenMs: 5000
    }, { headers: { Authorization: `Bearer ${studentToken}` } });
    console.log(`✅ Next question fetched. New Mastery: ${q2Res.data.currentMasteryScore}`);

    // 7. Teacher views dashboard
    console.log('7. Teacher fetching student analytics...');
    const tDash = await axios.get(`${API_URL}/dashboard/teacher`, {
      headers: { Authorization: `Bearer ${teacherToken}` }
    });
    assert(tDash.data.recentActivity, 'Teacher dashboard should have recentActivity data');
    console.log('✅ Teacher dashboard fetched successfully');

    console.log('--- ALL QA TESTS PASSED ---');
  } catch (error: any) {
    console.error('❌ QA Test Failed:', error.response?.data || error.message);
  }
}

runQA();
