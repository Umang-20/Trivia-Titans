/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import axios from "axios";
import QuestionItem from "./QuestionItem"; 

const QuestionPage = () => {
  const [questions, setQuestions] = useState([]);
  const [editData, setEditData] = useState({
    question: "",
    category: "",
    difficulty: "",
    a: "",
    b: "",
    c: "",
    d: "",
    correct: "",
    explanation: "",
  });

  const fetchQuestions = async () => {
    const res = await axios.get("https://jf4usar55g.execute-api.us-east-1.amazonaws.com/default/questions");
    const modifiedData = res.data.map(question => ({ ...question, isEditing: false }));
    setQuestions(modifiedData);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const addQuestion = async () => {
    await axios.post("https://jf4usar55g.execute-api.us-east-1.amazonaws.com/default/questions", {
      question: editData.question,
      category: editData.category,
      difficulty: editData.difficulty,
      a: editData.a,
      b: editData.b,
      c: editData.c,
      d: editData.d,
      correct: editData.correct,
      explanation: editData.explanation,
    });
    fetchQuestions();
  };

  const deleteQuestion = async (id) => {
    await axios.delete(`https://jf4usar55g.execute-api.us-east-1.amazonaws.com/default/questions/${id}`);
    fetchQuestions();
  };

  const startEditing = (id) => {
    setQuestions(questions.map(question => {
      if (question.id !== id) return question;
      return { ...question, isEditing: true, tempData: { ...question } };
    }));
  };

  const updateQuestion = async (updatedQuestion) => {

    await axios.put(`https://jf4usar55g.execute-api.us-east-1.amazonaws.com/default/questions/${updatedQuestion.id}`, updatedQuestion);
    fetchQuestions(); 
    setQuestions(questions.map(question => {
      if (question.id !== updatedQuestion.id) return question;
      return { ...question, isEditing: false };
    }));
  };

  const saveChanges = async (id) => {
    const updatedQuestionObject = questions.find(question => question.id === id);
    if (updatedQuestionObject) {
      const updatedQuestion = updatedQuestionObject.tempData;
      await axios.put(`https://jf4usar55g.execute-api.us-east-1.amazonaws.com/default/questions/${id}`, updatedQuestion);
      fetchQuestions();
    } else {

      console.error(`Question with id ${id} not found`);
    }
  };

  const handleInputChange = (id, name, value) => {
    setQuestions(questions.map(question => {
      if (question.id !== id) return question;
      return { ...question, tempData: { ...question.tempData, [name]: value } };
    }));
  };

  const handleEditInputChange = (name, value) => {
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ margin: "0 auto", width: "80%" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Trivia Question Manager</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: '20px' }}>
        <input
          style={{ width: '30%', marginBottom: '10px' }}
          type="text"
          value={editData.question}
          onChange={(e) => handleEditInputChange("question", e.target.value)}
          placeholder="Enter Question"
        />
        <input
          style={{ width: '20%', marginBottom: '10px' }}
          type="text"
          value={editData.category}
          onChange={(e) => handleEditInputChange("category", e.target.value)}
          placeholder="Enter Category"
        />
        <select
          style={{ width: '20%', marginBottom: '10px' }}
          value={editData.difficulty}
          onChange={(e) => handleEditInputChange("difficulty", e.target.value)}
        >
          <option value="">Enter Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="difficult">Difficult</option>
        </select>
        <input
          style={{ width: "20%", marginBottom: '10px' }}
          type="text"
          value={editData.a}
          onChange={(e) => handleEditInputChange("a", e.target.value)}
          placeholder="Option A"
        />
        <input
          style={{ width: "20%", marginBottom: '10px' }}
          type="text"
          value={editData.b}
          onChange={(e) => handleEditInputChange("b", e.target.value)}
          placeholder="Option B"
        />
        <input
          style={{ width: "20%", marginBottom: '10px' }}
          type="text"
          value={editData.c}
          onChange={(e) => handleEditInputChange("c", e.target.value)}
          placeholder="Option C"
        />
        <input
          style={{ width: "20%", marginBottom: '10px' }}
          type="text"
          value={editData.d}
          onChange={(e) => handleEditInputChange("d", e.target.value)}
          placeholder="Option D"
        />
        <select
          style={{ width: "20%", marginBottom: '10px' }}
          value={editData.correct}
          onChange={(e) => handleEditInputChange("correct", e.target.value)}
        >
          <option value="">Correct Option</option>
          <option value="a">A</option>
          <option value="b">B</option>
          <option value="c">C</option>
          <option value="d">D</option>
        </select>
        <textarea
          style={{ width: "100%", marginBottom: '10px' }}
          value={editData.explanation}
          onChange={(e) => handleEditInputChange("explanation", e.target.value)}
          placeholder="Explanation for the Correct Answer"
        />
        {/* End of new fields */}
        <button onClick={addQuestion}>Add Question</button>
      </div>
      <h1 style={{ textAlign: "center" }}>Question List</h1>
      {questions.map((question) => (
        <QuestionItem
          key={question.id}
          question={question}
          handleInputChange={handleInputChange}
          saveChanges={saveChanges}
          startEditing={startEditing}
          deleteQuestion={deleteQuestion}
          updateQuestion={updateQuestion}
        />
      ))}
    </div>
  );
};

export default QuestionPage;
