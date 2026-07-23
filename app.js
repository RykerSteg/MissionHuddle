const {
  useState,
  useEffect,
  useRef
} = React;

// ---------- constants (mirrors CPCS "Drop Down Lists" tab) ----------

const WARDS = ["La Verkin 1", "La Verkin 2", "La Verkin 3", "La Verkin 4", "La Verkin 6", "La Verkin 7", "Toquerville 1", "Toquerville 2", "Toquerville 3", "Virgin River"];
const CATEGORIES = ["Person Being Taught", "New Member", "Recent Member"];
const ORGANIZATIONS = ["Missionaries", "Ward Mission Leader", "Elders Quorum", "Relief Society", "Young Men", "Young Women", "Primary", "Bishopric", "Member Family", "Ministering Bro's", "Ministering Sis's"];
const ASSIGNMENT_STATUS = ["Not Assigned", "Assigned", "In Progress", "Completed", "Follow Up Needed"];
const VISIT_OUTCOMES = ["", "No Contact", "Phone Call", "Text Message", "Home Visit", "Church Visit", "Activity Visit", "Lesson Taught"];
const SACRAMENT_OPTIONS = ["", "Attended", "Did Not Attend", "Unknown"];
const LESSON_TYPES = ["", "Restoration", "Plan of Salvation", "Gospel of Jesus Christ", "Commandments", "Church of Jesus Christ", "Temple Preparation", "Fellowship Visit", "Ministering Visit", "Family History", "Other"];
const COVENANT_PATH_STEPS = ["Initial Contact", "Learning the Gospel", "Attending Sacrament", "Keeping Commitments", "Preparing for Baptism", "Baptized", "Confirmed", "New Member Fellowship", "Ministering Support", "Temple Preparation", "Temple Recommend", "Family Name to the Temple", "Temple Attendance"];
const ACTIVE_STATUSES = ["Active", "Inactive", "Archived"];
const ATTENDANCE_GROUPS = ["Primary", "Young Women", "Young Men", "Relief Society", "Elders Quorum", "Ward Missionaries", "Full-Time Missionaries"];
const STATUS_META = {
  "Not Assigned": {
    color: "#6B6A64",
    bg: "#F0EFEA"
  },
  "Assigned": {
    color: "#2F4858",
    bg: "#E7EDEF"
  },
  "In Progress": {
    color: "#2F4858",
    bg: "#E7EDEF"
  },
  "Completed": {
    color: "#4B7355",
    bg: "#E9F0E9"
  },
  "Follow Up Needed": {
    color: "#B5533C",
    bg: "#F5E7E2"
  }
};
const STORAGE_KEY = "wmh-state-v1";
const uid = () => Math.random().toString(36).slice(2, 10);
const todayStr = () => new Date().toLocaleDateString(undefined, {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric"
});

// ---------- small UI pieces ----------

function Trail({
  step
}) {
  const idx = Math.max(0, COVENANT_PATH_STEPS.indexOf(step));
  const pct = idx / (COVENANT_PATH_STEPS.length - 1) * 100;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 4,
      background: "#E3E0D6",
      borderRadius: 999,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      width: `${pct}%`,
      background: "#B8892B",
      borderRadius: 999,
      transition: "width .3s"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: "#6B6A64"
    }
  }, "Step ", idx + 1, " of ", COVENANT_PATH_STEPS.length), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "#2B2A28",
      fontWeight: 600
    }
  }, step)));
}
function Chip({
  active,
  onClick,
  children
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      padding: "8px 12px",
      borderRadius: 999,
      border: `1px solid ${active ? "#2F4858" : "#DDD9CE"}`,
      background: active ? "#2F4858" : "#FFFFFF",
      color: active ? "#FFFFFF" : "#2B2A28",
      fontSize: 13,
      fontWeight: 600,
      whiteSpace: "nowrap"
    }
  }, children);
}
function StatusPill({
  status
}) {
  const m = STATUS_META[status] || STATUS_META["Not Assigned"];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: m.color,
      background: m.bg,
      padding: "3px 8px",
      borderRadius: 999
    }
  }, status);
}
const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #DDD9CE",
  fontSize: 16,
  background: "#FFFFFF",
  color: "#2B2A28",
  boxSizing: "border-box"
};
const labelStyle = {
  fontSize: 12,
  fontWeight: 700,
  color: "#6B6A64",
  marginBottom: 4,
  display: "block",
  textTransform: "uppercase",
  letterSpacing: 0.4
};

// ---------- person form (add / edit) ----------

function PersonForm({
  initial,
  onSave,
  onCancel
}) {
  const [name, setName] = useState(initial?.name || "");
  const [category, setCategory] = useState(initial?.category || CATEGORIES[0]);
  const [covenantPathStep, setCovenantPathStep] = useState(initial?.covenantPathStep || COVENANT_PATH_STEPS[0]);
  const [currentGoal, setCurrentGoal] = useState(initial?.currentGoal || "");
  const [supportingOrg, setSupportingOrg] = useState(initial?.supportingOrg || ORGANIZATIONS[0]);
  const [assignedPerson, setAssignedPerson] = useState(initial?.assignedPerson || "");
  const [nextStep, setNextStep] = useState(initial?.nextStep || "");
  const [activeStatus, setActiveStatus] = useState(initial?.activeStatus || "Active");
  const [notes, setNotes] = useState(initial?.notes || "");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#FBFAF7",
      border: "1px solid #DDD9CE",
      borderRadius: 14,
      padding: 14,
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: labelStyle
  }, "Name"), /*#__PURE__*/React.createElement("input", {
    style: inputStyle,
    value: name,
    onChange: e => setName(e.target.value),
    placeholder: "Full name"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: labelStyle
  }, "Category"), /*#__PURE__*/React.createElement("select", {
    style: inputStyle,
    value: category,
    onChange: e => setCategory(e.target.value)
  }, CATEGORIES.map(c => /*#__PURE__*/React.createElement("option", {
    key: c,
    value: c
  }, c)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: labelStyle
  }, "Current Covenant Path Step"), /*#__PURE__*/React.createElement("select", {
    style: inputStyle,
    value: covenantPathStep,
    onChange: e => setCovenantPathStep(e.target.value)
  }, COVENANT_PATH_STEPS.map(s => /*#__PURE__*/React.createElement("option", {
    key: s,
    value: s
  }, s)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: labelStyle
  }, "Current Goal"), /*#__PURE__*/React.createElement("input", {
    style: inputStyle,
    value: currentGoal,
    onChange: e => setCurrentGoal(e.target.value),
    placeholder: "e.g. Build trust, invite to church"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: labelStyle
  }, "Supporting Organization"), /*#__PURE__*/React.createElement("select", {
    style: inputStyle,
    value: supportingOrg,
    onChange: e => setSupportingOrg(e.target.value)
  }, ORGANIZATIONS.map(o => /*#__PURE__*/React.createElement("option", {
    key: o,
    value: o
  }, o)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: labelStyle
  }, "Assigned Person"), /*#__PURE__*/React.createElement("input", {
    style: inputStyle,
    value: assignedPerson,
    onChange: e => setAssignedPerson(e.target.value),
    placeholder: "Who owns this?"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: labelStyle
  }, "Next Step (this week)"), /*#__PURE__*/React.createElement("input", {
    style: inputStyle,
    value: nextStep,
    onChange: e => setNextStep(e.target.value),
    placeholder: "e.g. Visit and invite to sacrament meeting"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: labelStyle
  }, "Active Status"), /*#__PURE__*/React.createElement("select", {
    style: inputStyle,
    value: activeStatus,
    onChange: e => setActiveStatus(e.target.value)
  }, ACTIVE_STATUSES.map(s => /*#__PURE__*/React.createElement("option", {
    key: s,
    value: s
  }, s)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: labelStyle
  }, "Notes"), /*#__PURE__*/React.createElement("textarea", {
    style: {
      ...inputStyle,
      minHeight: 60,
      resize: "vertical"
    },
    value: notes,
    onChange: e => setNotes(e.target.value),
    placeholder: "Context for the auxiliary rep"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => name.trim() && onSave({
      id: initial?.id || uid(),
      individualId: initial?.individualId || null,
      name: name.trim(),
      category,
      covenantPathStep,
      currentGoal,
      supportingOrg,
      assignedPerson,
      nextStep,
      activeStatus,
      notes,
      status: initial?.status || "Not Assigned",
      progressThisWeek: initial?.progressThisWeek || "",
      visitOutcome: initial?.visitOutcome || "",
      sacramentAttended: initial?.sacramentAttended || "",
      lessonType: initial?.lessonType || "",
      createdAt: initial?.createdAt || Date.now(),
      updatedAt: Date.now()
    }),
    style: {
      flex: 1,
      background: "#2F4858",
      color: "#fff",
      border: "none",
      borderRadius: 10,
      padding: "12px",
      fontWeight: 700,
      fontSize: 15
    }
  }, "💾 Save"), /*#__PURE__*/React.createElement("button", {
    onClick: onCancel,
    style: {
      padding: "12px 16px",
      borderRadius: 10,
      border: "1px solid #DDD9CE",
      background: "#fff",
      color: "#6B6A64",
      fontWeight: 600
    }
  }, "Cancel")));
}

// ---------- person card (huddle follow-up view) ----------

function PersonCard({
  person,
  onUpdate,
  onDelete
}) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    nextStep: person.nextStep,
    assignedPerson: person.assignedPerson,
    progressThisWeek: person.progressThisWeek,
    notes: person.notes
  });
  if (editing) {
    return /*#__PURE__*/React.createElement(PersonForm, {
      initial: person,
      onSave: p => {
        onUpdate(p);
        setEditing(false);
        setExpanded(true);
      },
      onCancel: () => setEditing(false)
    });
  }
  const set = (field, value) => setDraft(d => ({
    ...d,
    [field]: value
  }));
  const commit = field => onUpdate({
    ...person,
    [field]: draft[field]
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#FFFFFF",
      border: "1px solid #E3E0D6",
      borderRadius: 14,
      padding: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      cursor: "pointer"
    },
    onClick: () => setExpanded(!expanded)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'Fraunces', serif",
      fontSize: 17,
      fontWeight: 600,
      color: "#2B2A28"
    }
  }, person.name), /*#__PURE__*/React.createElement(StatusPill, {
    status: person.status
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "#6B6A64",
      marginTop: 2
    }
  }, person.category, " · ", person.supportingOrg, person.assignedPerson ? ` (${person.assignedPerson})` : "")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setExpanded(!expanded),
    style: {
      background: "none",
      border: "none",
      color: "#6B6A64",
      fontSize: 16
    }
  }, expanded ? "▲" : "▼")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement(Trail, {
    step: person.covenantPathStep
  })), expanded && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, person.currentGoal && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "#6B6A64"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      color: "#2B2A28"
    }
  }, "Goal: "), person.currentGoal), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: labelStyle
  }, "Next Step"), /*#__PURE__*/React.createElement("input", {
    style: inputStyle,
    value: draft.nextStep,
    placeholder: "What needs to happen this week?",
    onChange: e => set("nextStep", e.target.value),
    onBlur: () => commit("nextStep")
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: labelStyle
  }, "Assigned Person"), /*#__PURE__*/React.createElement("input", {
    style: inputStyle,
    value: draft.assignedPerson,
    placeholder: "Who owns this?",
    onChange: e => set("assignedPerson", e.target.value),
    onBlur: () => commit("assignedPerson")
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: labelStyle
  }, "Progress This Week"), /*#__PURE__*/React.createElement("input", {
    style: inputStyle,
    value: draft.progressThisWeek,
    placeholder: "What happened since last huddle?",
    onChange: e => set("progressThisWeek", e.target.value),
    onBlur: () => commit("progressThisWeek")
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: labelStyle
  }, "Visit Outcome"), /*#__PURE__*/React.createElement("select", {
    style: inputStyle,
    value: person.visitOutcome,
    onChange: e => onUpdate({
      ...person,
      visitOutcome: e.target.value
    })
  }, VISIT_OUTCOMES.map(v => /*#__PURE__*/React.createElement("option", {
    key: v,
    value: v
  }, v || "—")))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: labelStyle
  }, "Sacrament"), /*#__PURE__*/React.createElement("select", {
    style: inputStyle,
    value: person.sacramentAttended,
    onChange: e => onUpdate({
      ...person,
      sacramentAttended: e.target.value
    })
  }, SACRAMENT_OPTIONS.map(v => /*#__PURE__*/React.createElement("option", {
    key: v,
    value: v
  }, v || "—"))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: labelStyle
  }, "Lesson Type"), /*#__PURE__*/React.createElement("select", {
    style: inputStyle,
    value: person.lessonType,
    onChange: e => onUpdate({
      ...person,
      lessonType: e.target.value
    })
  }, LESSON_TYPES.map(v => /*#__PURE__*/React.createElement("option", {
    key: v,
    value: v
  }, v || "—")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: labelStyle
  }, "Notes"), /*#__PURE__*/React.createElement("textarea", {
    style: {
      ...inputStyle,
      minHeight: 50
    },
    value: draft.notes,
    placeholder: "Context, concerns, next steps",
    onChange: e => set("notes", e.target.value),
    onBlur: () => commit("notes")
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      flexWrap: "wrap"
    }
  }, ASSIGNMENT_STATUS.map(s => {
    const m = STATUS_META[s];
    const active = person.status === s;
    return /*#__PURE__*/React.createElement("button", {
      key: s,
      onClick: () => onUpdate({
        ...person,
        status: s,
        updatedAt: Date.now()
      }),
      style: {
        fontSize: 12,
        fontWeight: 700,
        padding: "6px 10px",
        borderRadius: 999,
        border: active ? `1px solid ${m.color}` : "1px solid #DDD9CE",
        background: active ? m.bg : "#fff",
        color: active ? m.color : "#6B6A64"
      }
    }, s);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setEditing(true),
    style: {
      flex: 1,
      padding: "10px",
      borderRadius: 10,
      border: "1px solid #DDD9CE",
      background: "#fff",
      color: "#2B2A28",
      fontWeight: 600,
      fontSize: 13
    }
  }, "✎ Edit details"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.confirm(`Remove ${person.name} from the roster?`)) onDelete(person.id);
    },
    style: {
      padding: "10px 12px",
      borderRadius: 10,
      border: "1px solid #F0DCD4",
      background: "#fff",
      color: "#B5533C",
      fontWeight: 600,
      fontSize: 13
    }
  }, "🗑"))));
}

// ---------- main app ----------

function App() {
  const [loaded, setLoaded] = useState(false);
  const [wardName, setWardName] = useState("");
  const [roster, setRoster] = useState([]);
  const [history, setHistory] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [ftNotes, setFtNotes] = useState("");
  const [stakeEmail, setStakeEmail] = useState("joey@churchconstructionllc.com");
  const [lastFinishedSummary, setLastFinishedSummary] = useState(null);
  const [tab, setTab] = useState("huddle");
  const [adding, setAdding] = useState(false);
  const [copyLabel, setCopyLabel] = useState("Copy Summary");
  const firstLoad = useRef(true);

  // Load from this device's browser storage (no account or login needed)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        setWardName(data.wardName || "");
        setRoster(data.roster || []);
        setHistory(data.history || []);
        setAttendance(data.attendance || {});
        setFtNotes(data.ftNotes || "");
        setStakeEmail(data.stakeEmail || "joey@churchconstructionllc.com");
      }
    } catch (e) {
      // no saved state yet, or storage unavailable
    }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        wardName,
        roster,
        history,
        attendance,
        ftNotes,
        stakeEmail
      }));
    } catch (e) {
      console.error("Save failed", e);
    }
  }, [wardName, roster, history, attendance, ftNotes, stakeEmail, loaded]);
  const updatePerson = updated => {
    setLastFinishedSummary(null);
    setRoster(r => r.map(p => p.id === updated.id ? updated : p));
  };
  const deletePerson = id => {
    setLastFinishedSummary(null);
    setRoster(r => r.filter(p => p.id !== id));
  };
  const addPerson = p => {
    setLastFinishedSummary(null);
    setRoster(r => [...r, p]);
    setAdding(false);
  };
  const toggleAttendance = g => {
    setLastFinishedSummary(null);
    setAttendance(a => ({
      ...a,
      [g]: !a[g]
    }));
  };
  const buildSummary = () => {
    const lines = [];
    lines.push(`WARD MISSION HUDDLE — ${wardName || "Ward"}`);
    lines.push(todayStr());
    lines.push("");
    const present = ATTENDANCE_GROUPS.filter(g => attendance[g]);
    lines.push(`Present: ${present.length ? present.join(", ") : "none recorded"}`);
    lines.push("");
    CATEGORIES.forEach(cat => {
      const people = roster.filter(p => p.category === cat && p.activeStatus !== "Archived");
      if (!people.length) return;
      lines.push(`${cat.toUpperCase()} (${people.length})`);
      people.forEach(p => {
        lines.push(`- ${p.name} — ${p.covenantPathStep} — ${p.status} — Org: ${p.supportingOrg}`);
        if (p.nextStep) lines.push(`    Next Step: ${p.nextStep}${p.assignedPerson ? ` (${p.assignedPerson})` : ""}`);
        if (p.progressThisWeek) lines.push(`    Progress: ${p.progressThisWeek}`);
        if (p.visitOutcome || p.sacramentAttended || p.lessonType) {
          lines.push(`    Visit: ${[p.visitOutcome, p.sacramentAttended && `Sacrament: ${p.sacramentAttended}`, p.lessonType && `Lesson: ${p.lessonType}`].filter(Boolean).join(" | ")}`);
        }
        if (p.notes) lines.push(`    Notes: ${p.notes}`);
      });
      lines.push("");
    });
    if (ftNotes.trim()) {
      lines.push("FULL-TIME MISSIONARY COORDINATION");
      lines.push(ftNotes.trim());
      lines.push("");
    }
    const followUpNeeded = roster.filter(p => p.status === "Follow Up Needed");
    if (followUpNeeded.length) {
      lines.push(`⚠ FOLLOW UP NEEDED: ${followUpNeeded.map(p => p.name).join(", ")}`);
    }
    return lines.join("\n");
  };
  const finishHuddle = () => {
    const summary = buildSummary();
    setHistory(h => [{
      id: uid(),
      date: Date.now(),
      wardName,
      text: summary
    }, ...h]);
    setLastFinishedSummary(summary);
    setAttendance({});
    setFtNotes("");
    setRoster(r => r.map(p => ({
      ...p,
      nextStep: p.status === "Completed" ? "" : p.nextStep,
      status: p.status === "Completed" ? "Not Assigned" : p.status,
      progressThisWeek: "",
      visitOutcome: "",
      sacramentAttended: "",
      lessonType: ""
    })));
    setTab("summary");
  };
  const mailtoUrl = (text, dateLabel) => {
    const subject = `Ward Mission Huddle — ${wardName || "Ward"} — ${dateLabel}`;
    return `mailto:${encodeURIComponent(stakeEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
  };
  const followUpPeople = roster.filter(p => p.status !== "Completed" && p.activeStatus !== "Archived").sort((a, b) => {
    const order = {
      "Follow Up Needed": 0,
      "In Progress": 1,
      "Assigned": 2,
      "Not Assigned": 3
    };
    return (order[a.status] ?? 4) - (order[b.status] ?? 4);
  });
  const wrap = {
    maxWidth: 480,
    margin: "0 auto",
    minHeight: "100vh",
    background: "#EEF1EE",
    fontFamily: "'Inter', sans-serif",
    paddingBottom: 40
  };
  if (!loaded) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        ...wrap,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#6B6A64"
      }
    }, "Loading huddle…"));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: wrap
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#2F4858",
      padding: "22px 20px 18px",
      color: "#fff"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Fraunces', serif",
      fontStyle: "italic",
      fontSize: 13,
      opacity: 0.75,
      marginBottom: 2
    }
  }, "Sunday Coordination · CPCS"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Fraunces', serif",
      fontSize: 26,
      fontWeight: 600,
      lineHeight: 1.15
    }
  }, "Ward Mission Huddle"), /*#__PURE__*/React.createElement("select", {
    value: wardName,
    onChange: e => setWardName(e.target.value),
    style: {
      marginTop: 8,
      background: "rgba(255,255,255,0.12)",
      border: "1px solid rgba(255,255,255,0.25)",
      borderRadius: 8,
      padding: "8px 10px",
      color: "#fff",
      fontSize: 14,
      width: "100%",
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "",
    style: {
      color: "#2B2A28"
    }
  }, "Select your ward"), WARDS.map(w => /*#__PURE__*/React.createElement("option", {
    key: w,
    value: w,
    style: {
      color: "#2B2A28"
    }
  }, w)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      padding: "14px 16px 0"
    }
  }, [["huddle", "Huddle"], ["roster", "Roster"], ["summary", "Summary"]].map(([key, label]) => /*#__PURE__*/React.createElement("button", {
    key: key,
    onClick: () => setTab(key),
    style: {
      flex: 1,
      padding: "10px 0",
      borderRadius: 10,
      border: "none",
      background: tab === key ? "#FFFFFF" : "transparent",
      color: tab === key ? "#2F4858" : "#6B6A64",
      fontWeight: 700,
      fontSize: 14,
      boxShadow: tab === key ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
    }
  }, label))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, tab === "huddle" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: labelStyle
  }, "Who's Here"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      flexWrap: "wrap"
    }
  }, ATTENDANCE_GROUPS.map(g => /*#__PURE__*/React.createElement(Chip, {
    key: g,
    active: !!attendance[g],
    onClick: () => toggleAttendance(g)
  }, g)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: labelStyle
  }, "Follow-Up (", followUpPeople.length, ")"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setAdding(true),
    style: {
      background: "none",
      border: "none",
      color: "#2F4858",
      fontWeight: 700,
      fontSize: 13
    }
  }, "+ Add Person")), adding && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(PersonForm, {
    onSave: addPerson,
    onCancel: () => setAdding(false)
  })), followUpPeople.length === 0 && !adding && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#FBFAF7",
      border: "1px dashed #DDD9CE",
      borderRadius: 14,
      padding: 20,
      textAlign: "center",
      color: "#6B6A64",
      fontSize: 14
    }
  }, "No one waiting on an assignment. Tap \"Add Person\" to bring someone into the huddle."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, followUpPeople.map(p => /*#__PURE__*/React.createElement(PersonCard, {
    key: p.id,
    person: p,
    onUpdate: updatePerson,
    onDelete: deletePerson
  })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: labelStyle
  }, "Full-Time Missionary Coordination"), /*#__PURE__*/React.createElement("textarea", {
    value: ftNotes,
    onChange: e => {
      setLastFinishedSummary(null);
      setFtNotes(e.target.value);
    },
    placeholder: "Referrals, teaching pool updates, requests for the ward to support",
    style: {
      width: "100%",
      minHeight: 70,
      padding: "10px 12px",
      borderRadius: 10,
      border: "1px solid #DDD9CE",
      fontSize: 15,
      boxSizing: "border-box",
      background: "#fff"
    }
  })), /*#__PURE__*/React.createElement("button", {
    onClick: finishHuddle,
    style: {
      background: "#B8892B",
      color: "#fff",
      border: "none",
      borderRadius: 12,
      padding: "14px",
      fontWeight: 700,
      fontSize: 15,
      marginTop: 4
    }
  }, "Finish Huddle & Save Summary →")), tab === "roster" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: labelStyle
  }, "Full Roster (", roster.length, ")"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setAdding(true),
    style: {
      background: "none",
      border: "none",
      color: "#2F4858",
      fontWeight: 700,
      fontSize: 13
    }
  }, "+ Add Person")), adding && /*#__PURE__*/React.createElement(PersonForm, {
    onSave: addPerson,
    onCancel: () => setAdding(false)
  }), roster.length === 0 && !adding && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#FBFAF7",
      border: "1px dashed #DDD9CE",
      borderRadius: 14,
      padding: 20,
      textAlign: "center",
      color: "#6B6A64",
      fontSize: 14
    }
  }, "Your roster is empty. Add everyone currently being taught or fellowshipped to start tracking them."), ORGANIZATIONS.map(org => {
    const people = roster.filter(p => p.supportingOrg === org);
    if (!people.length) return null;
    return /*#__PURE__*/React.createElement("div", {
      key: org
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 700,
        color: "#2F4858",
        margin: "10px 0 8px"
      }
    }, org, " (", people.length, ")"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 10
      }
    }, people.map(p => /*#__PURE__*/React.createElement(PersonCard, {
      key: p.id,
      person: p,
      onUpdate: updatePerson,
      onDelete: deletePerson
    }))));
  })), tab === "summary" && (() => {
    const displayText = lastFinishedSummary ?? buildSummary();
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        background: "#FFFFFF",
        border: "1px solid #E3E0D6",
        borderRadius: 14,
        padding: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: labelStyle
    }, lastFinishedSummary ? "This Week's Report" : "Live Preview"), /*#__PURE__*/React.createElement("pre", {
      style: {
        whiteSpace: "pre-wrap",
        fontSize: 13,
        lineHeight: 1.6,
        color: "#2B2A28",
        fontFamily: "'Inter', sans-serif",
        margin: 0,
        maxHeight: 320,
        overflowY: "auto"
      }
    }, displayText), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: labelStyle
    }, "Send Reports To"), /*#__PURE__*/React.createElement("input", {
      value: stakeEmail,
      onChange: e => setStakeEmail(e.target.value),
      placeholder: "stake mission leader's email",
      type: "email",
      style: inputStyle
    })), /*#__PURE__*/React.createElement("a", {
      href: mailtoUrl(displayText, todayStr()),
      style: {
        marginTop: 10,
        width: "100%",
        background: stakeEmail ? "#B8892B" : "#DDD9CE",
        color: "#fff",
        border: "none",
        borderRadius: 10,
        padding: "13px",
        fontWeight: 700,
        fontSize: 15,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        textDecoration: "none",
        boxSizing: "border-box"
      }
    }, "Review in Mail & Send →"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: "#6B6A64",
        marginTop: 6,
        textAlign: "center"
      }
    }, "Opens your Mail app with the report ready — you'll do the final send there."), /*#__PURE__*/React.createElement("button", {
      onClick: async () => {
        try {
          await navigator.clipboard.writeText(displayText);
          setCopyLabel("Copied ✓");
          setTimeout(() => setCopyLabel("Copy Summary"), 1800);
        } catch (e) {
          setCopyLabel("Couldn't copy");
          setTimeout(() => setCopyLabel("Copy Summary"), 1800);
        }
      },
      style: {
        marginTop: 10,
        width: "100%",
        background: "#fff",
        border: "1px solid #DDD9CE",
        color: "#2F4858",
        borderRadius: 10,
        padding: "11px",
        fontWeight: 700,
        fontSize: 13
      }
    }, "📋 ", copyLabel), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 16,
        paddingTop: 14,
        borderTop: "1px solid #E3E0D6"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...labelStyle,
        marginBottom: 6
      }
    }, "Backup"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: "#6B6A64",
        marginBottom: 8,
        lineHeight: 1.5
      }
    }, "Your roster is saved on this phone only. Download a backup file occasionally so nothing is lost if you clear your browser or switch phones."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        const payload = {
          version: 1,
          exportedAt: new Date().toISOString(),
          wardName,
          roster,
          history,
          attendance,
          ftNotes,
          stakeEmail
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], {
          type: "application/json"
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `huddle-backup-${(wardName || "ward").replace(/\s+/g, "-")}-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      },
      style: {
        flex: 1,
        background: "#fff",
        border: "1px solid #DDD9CE",
        color: "#2F4858",
        borderRadius: 10,
        padding: "11px",
        fontWeight: 700,
        fontSize: 13
      }
    }, "⬇ Download Backup"), /*#__PURE__*/React.createElement("label", {
      style: {
        flex: 1,
        background: "#fff",
        border: "1px solid #DDD9CE",
        color: "#2F4858",
        borderRadius: 10,
        padding: "11px",
        fontWeight: 700,
        fontSize: 13,
        textAlign: "center",
        cursor: "pointer"
      }
    }, "⬆ Restore", /*#__PURE__*/React.createElement("input", {
      type: "file",
      accept: "application/json,.json",
      style: {
        display: "none"
      },
      onChange: e => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const d = JSON.parse(reader.result);
            if (!d || !Array.isArray(d.roster)) throw new Error("bad file");
            if (!window.confirm("Replace everything currently in this app with the backup file? This cannot be undone.")) return;
            setLastFinishedSummary(null);
            setWardName(d.wardName || "");
            setRoster(d.roster || []);
            setHistory(d.history || []);
            setAttendance(d.attendance || {});
            setFtNotes(d.ftNotes || "");
            if (d.stakeEmail) setStakeEmail(d.stakeEmail);
            window.alert("Backup restored.");
          } catch (err) {
            window.alert("That file couldn't be read as a huddle backup.");
          }
        };
        reader.readAsText(file);
        e.target.value = "";
      }
    }))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        ...labelStyle,
        margin: "8px 0"
      }
    }, "Past Huddles (", history.length, ")"), history.length === 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        color: "#6B6A64",
        fontSize: 13
      }
    }, "Finish a huddle to start building your history."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 8
      }
    }, history.map(h => /*#__PURE__*/React.createElement("details", {
      key: h.id,
      style: {
        background: "#FFFFFF",
        border: "1px solid #E3E0D6",
        borderRadius: 12,
        padding: 12
      }
    }, /*#__PURE__*/React.createElement("summary", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: "#2B2A28",
        cursor: "pointer"
      }
    }, "📅 ", new Date(h.date).toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    })), /*#__PURE__*/React.createElement("pre", {
      style: {
        whiteSpace: "pre-wrap",
        fontSize: 12,
        color: "#6B6A64",
        marginTop: 8,
        fontFamily: "'Inter', sans-serif"
      }
    }, h.text), /*#__PURE__*/React.createElement("a", {
      href: mailtoUrl(h.text, new Date(h.date).toLocaleDateString()),
      style: {
        marginTop: 8,
        fontSize: 12,
        fontWeight: 700,
        color: stakeEmail ? "#2F4858" : "#B8B6AC",
        background: "none",
        border: "none",
        display: "inline-block",
        textDecoration: "none"
      }
    }, "→ Resend this report"))))));
  })()));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));