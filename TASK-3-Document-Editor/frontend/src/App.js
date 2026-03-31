import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { io } from "socket.io-client";


const socket = io("http://localhost:5002");

function App() {
  const [value, setValue] = useState("");
  const [docId] = useState("test123");

  // Load document
  useEffect(() => {
    socket.emit("get-document", docId);

    socket.once("load-document", (data) => {
      setValue(data);
    });

    socket.on("receive-changes", (data) => {
  setValue((prev) => {
    if (prev === data) return prev; // avoid unnecessary updates
    return data;
  });
});

    return () => {
      socket.off("receive-changes");
    };
  }, [docId]);

  // Auto-save every 2 sec
  useEffect(() => {
    const interval = setInterval(() => {
      socket.emit("save-document", value);
    }, 2000);

    return () => clearInterval(interval);
  }, [value]);

  const handleChange = (content, delta, source) => {
  setValue(content);

  // Only send changes if USER typed
  if (source === "user") {
    socket.emit("send-changes", content);
  }
};

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📝 Real-Time Collaborative Editor</h1>

      <div style={styles.editorBox}>
        <ReactQuill
          theme="snow"
          value={value}
          onChange={handleChange}
          style={{ height: "70vh" }}
        />
      </div>

      <p style={styles.footer}>
        Document ID: {docId}
      </p>
    </div>
  );
}

const styles = {
  container: {
    background: "#eef2f7",
    height: "100vh",
    padding: "20px",
  },
  title: {
    textAlign: "center",
    color: "#333",
  },
  editorBox: {
    background: "#fff",
    padding: "10px",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
  },
  footer: {
    textAlign: "center",
    marginTop: "10px",
    color: "#666",
  },
};

export default App;