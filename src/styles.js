  dr.CSS = `
.driving-route-mini-control {
  margin-top: 10px;
}

.driving-route-mini-control a {
  text-align: center;
  font-size: 12px;
  font-weight: bold;
}

.driving-route-dialog-content {
  font-size: 11px;
  line-height: 1.25;
}

.driving-route-dialog-content button,
.driving-route-dialog-content input {
  font-size: 11px;
}

.driving-route-mini-control .driving-route-mini-remove {
  color: #c00000;
}

.driving-route-dialog-content * {
  box-sizing: border-box;
}

.driving-route-body p {
  margin: 0 0 8px;
}

.driving-route-summary {
  margin-top: 8px;
}

.driving-route-setting {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 12px 0 10px;
}

.driving-route-setting input {
  width: 4.5em;
}

.driving-route-empty {
  margin: 8px 0 12px;
}

.driving-route-compact-list {
  margin: 8px 0 10px;
}

.driving-route-compact-list div {
  margin: 4px 0;
}

.driving-route-stops {
  list-style: none;
  margin: 0;
  padding: 0;
}

.driving-route-stop {
  margin: 6px 0;
  padding: 6px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(0, 0, 0, 0.18);
}

.driving-route-stop-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
}

.driving-route-stop-num,
.driving-route-stop-label span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.4em;
  height: 1.4em;
  padding: 0 0.3em;
  border-radius: 0.7em;
  background: #ffd800;
  color: #111;
  font-weight: bold;
  font-size: 0.85em;
}

.driving-route-leg,
.driving-route-stop-meta {
  margin-top: 5px;
  opacity: 0.9;
}

.driving-route-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.driving-route-small-button:disabled {
  opacity: 0.45;
}

.driving-route-stop-actions {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
  margin-top: 8px;
}

.driving-route-footer-actions {
  justify-content: flex-end;
  border-top: 1px solid rgba(255, 255, 255, 0.25);
  margin-top: 10px;
  padding-top: 7px;
}

.driving-route-totals {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 10px;
}

.driving-route-totals div {
  padding: 6px;
  background: rgba(0, 0, 0, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.driving-route-totals span,
.driving-route-totals strong {
  display: block;
}

.driving-route-message {
  display: none;
  margin-top: 10px;
  padding: 8px;
  border: 1px solid #ffd800;
  background: rgba(0, 0, 0, 0.22);
}

.driving-route-message-visible {
  display: block;
}

.driving-route-busy {
  opacity: 0.82;
}

.driving-route-stop-label {
  border: 0;
  background: transparent;
}

.driving-route-portal-action {
  margin-top: 8px;
}
`;
