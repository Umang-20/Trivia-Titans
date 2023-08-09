/* eslint-disable prettier/prettier */
import React, { useState } from "react";

const QuestionItem = ({ question, updateQuestion, deleteQuestion }) => {
  const [currentQuestion, setCurrentQuestion] = useState({ ...question });
  const [editingQuestion, setEditingQuestion] = useState({ ...question });
  const [editing, setEditing] = useState(false);

  const handleInputChange = (name, value) => {
    setEditingQuestion((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setCurrentQuestion(editingQuestion);
    updateQuestion(editingQuestion);
    setEditing(false);
  };

  const startEditing = () => {
    setEditing(true);
    setEditingQuestion(currentQuestion);
  };

  const cancelButton = () => {
    setEditing(false);
  };

  if (editing) {
    return (
      <div style={{ border: "1px solid gray", padding: "10px", marginBottom: "10px" }}>
        <input
          style={{ width: "20%" }}
          type="text"
          value={editingQuestion.question}
          onChange={(e) => handleInputChange("question", e.target.value)}
          placeholder="Update Question"
        />
        <input
          style={{ width: "20%" }}
          type="text"
          value={editingQuestion.category}
          onChange={(e) => handleInputChange("category", e.target.value)}
          placeholder="Update Category"
        />
        <select
          style={{ width: "20%" }}
          value={editingQuestion.difficulty}
          onChange={(e) => handleInputChange("difficulty", e.target.value)}
        >
          <option value="">Update Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="difficult">Difficult</option>
        </select>

        {/* New fields */}
        <input
          style={{ width: "20%" }}
          type="text"
          value={editingQuestion.a}
          onChange={(e) => handleInputChange("a", e.target.value)}
          placeholder="Option A"
        />
        <input
          style={{ width: "20%" }}
          type="text"
          value={editingQuestion.b}
          onChange={(e) => handleInputChange("b", e.target.value)}
          placeholder="Option B"
        />
        <input
          style={{ width: "20%" }}
          type="text"
          value={editingQuestion.c}
          onChange={(e) => handleInputChange("c", e.target.value)}
          placeholder="Option C"
        />
        <input
          style={{ width: "20%" }}
          type="text"
          value={editingQuestion.d}
          onChange={(e) => handleInputChange("d", e.target.value)}
          placeholder="Option D"
        />
        <select
          style={{ width: "20%" }}
          value={editingQuestion.correct}
          onChange={(e) => handleInputChange("correct", e.target.value)}
        >
          <option value="">Correct Option</option>
          <option value="a">A</option>
          <option value="b">B</option>
          <option value="c">C</option>
          <option value="d">D</option>
        </select>
        <textarea
          style={{ width: "100%" }}
          value={editingQuestion.explanation}
          onChange={(e) => handleInputChange("explanation", e.target.value)}
          placeholder="Explanation for the Correct Answer"
        />
        {/* End of new fields */}
        <button onClick={handleEdit}>Save</button>
        <button onClick={cancelButton}>Cancel</button>
      </div>
    );
  } else {
    return (
      <div style={{ border: "1px solid gray", padding: "10px", marginBottom: "10px" }}>
        <h3>
          {currentQuestion.question} - {currentQuestion.category} - {currentQuestion.difficulty}
        </h3>
        {/* Displaying the new fields */}
        <p>Option A: {currentQuestion.a}</p>
        <p>Option B: {currentQuestion.b}</p>
        <p>Option C: {currentQuestion.c}</p>
        <p>Option D: {currentQuestion.d}</p>
        <p>Correct Option: {currentQuestion.correct}</p>
        <p>Explanation: {currentQuestion.explanation}</p>
        {/* End of new fields */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button onClick={startEditing}>Edit</button>
          <button onClick={() => deleteQuestion(currentQuestion.id)}>Delete</button>
        </div>
      </div>
    );
  }
};

export default QuestionItem;
