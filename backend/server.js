const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// In-memory state - no file dependency for better deployment
const state = {
  teacherSocketId: null,
  students: new Map(), // socketId -> { name }
  latestPollId: null,
  poll: null, // { id, question, options: [{id,text,count,isCorrect}], endsAt, revealed, answers: Map(name->optionId) }
  history: [], // Start with empty history, will persist in memory during session
};

// Helpers
function canAskNewQuestion() {
  if (!state.poll) return true;
  const total = state.students.size;
  const answered = state.poll ? state.poll.answers.size : 0;
  const noActive = Date.now() > (state.poll?.endsAt || 0);
  return (
    (state.poll.revealed && (total === 0 || answered >= total)) ||
    (noActive && state.poll.revealed)
  );
}

function toPublicSnapshot() {
  const poll = state.poll
    ? {
        id: state.poll.id,
        question: state.poll.question,
        options: state.poll.options.map((o) => ({
          id: o.id,
          text: o.text,
          count: o.count,
        })),
        endsAt: state.poll.endsAt,
        revealed: state.poll.revealed,
      }
    : null;

  const snapshot = {
    students: Array.from(state.students.values()).map((s) => s.name),
    poll,
    history: state.history.map((h) => ({
      id: h.id,
      question: h.question,
      options: h.options.map((o) => ({
        id: o.id,
        text: o.text,
        count: o.count,
      })),
    })),
  };

  console.log("=== SENDING SNAPSHOT ===");
  console.log("History in snapshot:", snapshot.history.length, "items");
  console.log(
    "History questions:",
    snapshot.history.map((h) => h.question)
  );

  return snapshot;
}

function broadcastSnapshot() {
  io.emit("snapshot", toPublicSnapshot());
}

function endPollIfDue() {
  if (state.poll && !state.poll.revealed && Date.now() >= state.poll.endsAt) {
    revealResults();
  }
}

function revealResults(manual = false) {
  if (!state.poll || state.poll.revealed) return;
  state.poll.revealed = true;
  // push to history
  const historyItem = {
    id: state.poll.id,
    question: state.poll.question,
    options: state.poll.options.map((o) => ({
      id: o.id,
      text: o.text,
      count: o.count,
    })),
  };
  state.history.unshift(historyItem);
  // History now persists in memory only - better for deployment

  console.log("New poll added:", historyItem);
  console.log("Total history length:", state.history.length);
  console.log(
    "All history items:",
    state.history.map((h) => ({ id: h.id, question: h.question }))
  );
  console.log("============================");

  io.emit("revealed", { pollId: state.poll.id, manual });
  broadcastSnapshot();
}

setInterval(endPollIfDue, 500);

io.on("connection", (socket) => {
  // role handshake
  socket.on("join", ({ role, name }) => {
    console.log("=== JOIN EVENT ===");
    console.log("Role:", role);
    console.log("Name:", name);
    console.log("Socket ID:", socket.id);

    if (role === "teacher") {
      state.teacherSocketId = socket.id;
      console.log("Teacher socket ID set to:", state.teacherSocketId);
      socket.emit("joined", { role });
    } else {
      if (!name) return socket.emit("error_msg", "Name required");
      // Enforce uniqueness per active session
      const nameTaken = Array.from(state.students.values()).some(
        (s) => s.name.toLowerCase() === name.toLowerCase()
      );
      if (nameTaken) return socket.emit("error_msg", "Name already taken");
      state.students.set(socket.id, { name });
      socket.emit("joined", { role, name });
      io.emit(
        "student_list",
        Array.from(state.students.values()).map((s) => s.name)
      );
    }
    socket.emit("snapshot", toPublicSnapshot());
    broadcastSnapshot();
  });

  socket.on("create_poll", ({ question, options, durationSec = 60 }) => {
    if (socket.id !== state.teacherSocketId) return;
    // Cap at 60 seconds as per requirement
    const dur = Math.max(5, Math.min(60, Number(durationSec) || 60));
    if (!canAskNewQuestion())
      return socket.emit("error_msg", "Cannot ask new question yet");
    const opts = (options || [])
      .filter((t) => t && t.trim())
      .slice(0, 6)
      .map((t) => ({ id: uuidv4(), text: t.trim(), count: 0 }));
    if (!question || opts.length < 2)
      return socket.emit(
        "error_msg",
        "Provide question and at least two options"
      );
    state.poll = {
      id: uuidv4(),
      question: question.trim(),
      options: opts,
      endsAt: Date.now() + dur * 1000,
      revealed: false,
      answers: new Map(),
    };
    io.emit("poll_started", { id: state.poll.id });
    broadcastSnapshot();
  });

  socket.on("answer", ({ optionId }) => {
    const s = state.students.get(socket.id);
    if (
      !s ||
      !state.poll ||
      state.poll.revealed ||
      Date.now() >= state.poll.endsAt
    )
      return;
    if (state.poll.answers.has(s.name)) return; // one submission
    const opt = state.poll.options.find((o) => o.id === optionId);
    if (!opt) return;
    state.poll.answers.set(s.name, optionId);
    opt.count += 1;
    broadcastSnapshot();

    // Auto reveal if everyone answered
    const total = state.students.size;
    const answered = state.poll.answers.size;
    if (total > 0 && answered >= total) revealResults();
  });

  socket.on("reveal_now", () => {
    if (socket.id !== state.teacherSocketId) return;
    revealResults(true);
  });

  socket.on("kick", ({ name }) => {
    console.log("=== BACKEND KICK EVENT ===");
    console.log("Kick request received for:", name);
    console.log("Request from socket:", socket.id);
    console.log("Teacher socket ID:", state.teacherSocketId);
    console.log("Is teacher?", socket.id === state.teacherSocketId);
    console.log(
      "Current students:",
      Array.from(state.students.entries()).map(([id, s]) => ({
        id,
        name: s.name,
      }))
    );

    if (socket.id !== state.teacherSocketId) {
      console.log("ERROR: Not authorized - not teacher socket");
      return;
    }

    let studentFound = false;
    for (const [sid, s] of state.students.entries()) {
      console.log(`Comparing: "${s.name}" with "${name}"`);
      if (s.name.toLowerCase().trim() === name.toLowerCase().trim()) {
        console.log("Student found! Sending kick event to socket:", sid);
        io.to(sid).emit("kicked");
        state.students.delete(sid);
        studentFound = true;
        console.log("Student removed from state");
        break;
      }
    }

    if (!studentFound) {
      console.log("ERROR: Student not found in state");
    }

    console.log("Broadcasting snapshot...");
    broadcastSnapshot();
    console.log("=========================");
  });

  socket.on("disconnect", () => {
    if (socket.id === state.teacherSocketId) {
      state.teacherSocketId = null;
    }
    if (state.students.has(socket.id)) {
      state.students.delete(socket.id);
      io.emit(
        "student_list",
        Array.from(state.students.values()).map((s) => s.name)
      );
    }
    broadcastSnapshot();
  });
});

app.get("/health", (req, res) => res.json({ ok: true }));

// Add API endpoints for better deployment compatibility
app.get("/api/poll-history", (req, res) => {
  res.json({ history: state.history });
});

app.get("/api/current-poll", (req, res) => {
  res.json({ poll: state.poll });
});

app.get("/api/students", (req, res) => {
  res.json({
    students: Array.from(state.students.values()).map((s) => s.name),
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log("Server listening on " + PORT);
  console.log("API endpoints available:");
  console.log("- GET /api/poll-history");
  console.log("- GET /api/current-poll");
  console.log("- GET /api/students");
});
