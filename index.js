import express from "express";

const app = express();
app.use(express.json());

// GPA grading function
function grade(score) {
  if (score >= 80) return 4.00;
  else if (score >= 75) return 3.75;
  else if (score >= 70) return 3.50;
  else if (score >= 65) return 3.25;
  else if (score >= 60) return 3.00;
  else if (score >= 55) return 2.75;
  else if (score >= 50) return 2.50;
  else if (score >= 45) return 2.25;
  else return 0.00;
}

// API endpoint
app.post("/calculate", (req, res) => {
  const students = req.body.students; // expect an array of students
  if (!students || !Array.isArray(students)) {
    return res.status(400).json({ error: "Invalid input, expected students array" });
  }

  const results = students.map(student => {
    let totalCredit = 0;
    let creditXgpa = 0;

    const subjects = student.subjects.map(subj => {
      const g = grade(subj.obtained_score);
      totalCredit += subj.credit;
      creditXgpa += g * subj.credit;
      return { ...subj, gpa: g };
    });

    const gpa = totalCredit > 0 ? (creditXgpa / totalCredit).toFixed(2) : 0;

    return {
      name: student.name,
      reg_no: student.reg_no,
      dept: student.dept,
      subjects,
      gpa
    };
  });

  res.json(results);
});

// Vercel expects a default export
export default app;
