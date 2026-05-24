import { useState } from "react";
import { Button, Input, Modal, Select, notification } from "antd";
import { apiFetch } from "../../lib/api";
import { API_ROUTES } from "../../lib/routes";

const { TextArea } = Input;

const TYPE_OPTIONS = [
  { value: "bug",     label: "Bug Report" },
  { value: "feature", label: "Feature Request" },
  { value: "other",   label: "General" },
];

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<string>("bug");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setType("bug");
    setMessage("");
    setEmail("");
  };

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setSubmitting(true);
    try {
      await apiFetch(API_ROUTES.feedback, {
        method: "POST",
        body: JSON.stringify({ type, message: message.trim(), email: email.trim() || undefined }),
      });
      notification.success({ message: "Feedback submitted — thanks!" });
      setOpen(false);
      reset();
    } catch {
      notification.error({ message: "Failed to submit feedback. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--text-secondary)",
          fontSize: 14,
          padding: "4px 8px",
        }}
      >
        Feedback
      </button>

      <Modal
        title="Send Feedback"
        open={open}
        onCancel={() => { setOpen(false); reset(); }}
        onOk={handleSubmit}
        okText="Submit"
        confirmLoading={submitting}
        okButtonProps={{ disabled: !message.trim() }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
          <Select
            value={type}
            onChange={setType}
            options={TYPE_OPTIONS}
            style={{ width: "100%" }}
          />
          <TextArea
            rows={4}
            placeholder="Describe the issue or idea..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Input
            placeholder="your@email.com (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </Modal>
    </>
  );
}
