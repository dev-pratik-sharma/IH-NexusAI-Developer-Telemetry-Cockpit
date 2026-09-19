const { GoogleGenAI } = require('@google/genai');
const { Task, Project } = require('../models');

// Initialize the official Google GenAI instance safely with your environment variable
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

exports.generateSummary = async (req, res) => {
  try {
    // 1. Fetch only the logged-in user's tasks from PostgreSQL to maintain data privacy
    const userTasks = await Task.findAll({
      include: {
        model: Project,
        where: { user_id: req.userId }, // FIXED: Changed UserId to user_id to resolve the database crash
        attributes: []
      }
    });

    if (!userTasks || userTasks.length === 0) {
      return res.status(200).json({
        summary: "💡 Cognitive Engine Idle: No active task parameters detected in your isolated workspace. Inject some tasks on your dashboard first!"
      });
    }

    // 2. Format the user's live database data into a clean text block for the AI prompt
    const tasksListString = userTasks.map((t, idx) => 
      `${idx + 1}. Title: "${t.title}" | Status: [${t.status}] | Priority: [${t.priority}]`
    ).join('\n');

    const promptMessage = `
      You are an expert engineering management AI embedded within the NEXUS AI dashboard.
      Analyze the following live developer task queue and generate a crisp, professional, high-impact executive summary (under 4-5 short bullet points).
      Highlight the most critical high-priority bottlenecks, project skew, and provide one clear actionable recommendation for the day. Keep the tone sharp, technical, and data-driven.

      LIVE TASK QUEUE DATASET:
      ${tasksListString}
    `;

    // 3. Call the real Gemini model
    const aiResponse = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: promptMessage,
    });

    res.status(200).json({ summary: aiResponse.text });
  } catch (error) {
    res.status(500).json({ error: 'AI Processing Crash', message: error.message });
  }
};
