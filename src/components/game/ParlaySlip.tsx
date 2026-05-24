import { useState } from "react";
import { Badge, Button, Drawer, message, Tag, Tooltip } from "antd";
import { CloseOutlined, DeleteOutlined } from "@ant-design/icons";
import { useParlayCart } from "../../context/ParlayCartContext";
import { apiFetch } from "../../lib/api";
import { API_ROUTES } from "../../lib/routes";

function americanToDecimal(american: number): number {
  if (american > 0) return american / 100 + 1;
  return 100 / Math.abs(american) + 1;
}

function combinedOdds(legs: { odds: number | null }[]): string {
  const known = legs.filter((l) => l.odds != null);
  if (known.length === 0) return "—";
  const decimal = known.reduce((acc, l) => acc * americanToDecimal(l.odds!), 1);
  const american = decimal >= 2 ? Math.round((decimal - 1) * 100) : Math.round(-100 / (decimal - 1));
  return american > 0 ? `+${american}` : String(american);
}

export default function ParlaySlip() {
  const { legs, removeLeg, clear } = useParlayCart();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (legs.length === 0) return null;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await apiFetch(API_ROUTES.submitParlay, {
        method: "POST",
        body: JSON.stringify({
          legs: legs.map((l) => ({
            pickable_id: l.straight_id,
            pickable_type: "Straight",
            game_id: l.game_id,
          })),
        }),
      });
      message.success("Parlay submitted!");
      clear();
      setOpen(false);
    } catch {
      // error handled by apiFetch
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <Badge count={legs.length} color="var(--accent)">
          <Button
            type="primary"
            size="large"
            onClick={() => setOpen(true)}
            style={{ borderRadius: 24, paddingLeft: 20, paddingRight: 20 }}
          >
            Parlay Slip
          </Button>
        </Badge>
      </div>

      <Drawer
        title={`Parlay Slip (${legs.length} leg${legs.length !== 1 ? "s" : ""})`}
        placement="right"
        open={open}
        onClose={() => setOpen(false)}
        width={360}
        extra={
          <Tooltip title="Clear all">
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
              onClick={clear}
            />
          </Tooltip>
        }
        footer={
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--text-secondary)" }}>
              <span>Combined odds</span>
              <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{combinedOdds(legs)}</span>
            </div>
            <Button
              type="primary"
              block
              loading={submitting}
              disabled={legs.length < 2}
              onClick={handleSubmit}
            >
              Submit Parlay
            </Button>
            {legs.length < 2 && (
              <div style={{ fontSize: 12, color: "var(--text-secondary)", textAlign: "center" }}>
                Add at least 2 legs to submit
              </div>
            )}
          </div>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {legs.map((leg) => (
            <div
              key={leg.straight_id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                padding: "10px 12px",
                background: "var(--card-bg)",
                borderRadius: 8,
                border: "1px solid var(--border)",
                gap: 8,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, wordBreak: "break-word" }}>
                  {leg.display}
                </div>
                {leg.odds != null && (
                  <Tag style={{ marginTop: 4, fontSize: 11 }}>
                    {leg.odds > 0 ? `+${leg.odds}` : leg.odds}
                  </Tag>
                )}
              </div>
              <Button
                icon={<CloseOutlined />}
                size="small"
                type="text"
                danger
                onClick={() => removeLeg(leg.straight_id)}
              />
            </div>
          ))}
        </div>
      </Drawer>
    </>
  );
}
