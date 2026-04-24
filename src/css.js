  dr.CSS = `
.driving-route-panel {
  position: fixed;
  right: 10px;
  bottom: 10px;
  width: min(380px, calc(100vw - 20px));
  max-height: min(520px, calc(100vh - 20px));
  overflow: auto;
  background: #1f1f1f;
  color: #eee;
  border: 1px solid #666;
  border-radius: 8px;
  z-index: 99999;
  box-shadow: 0 2px 12px rgba(0,0,0,0.5);
  font-size: 13px;
}

.driving-route-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-bottom: 1px solid #555;
}

.driving-route-header strong {
  flex: 1;
}

.driving-route-toggle,
.driving-route-actions button,
.driving-route-small-button {
  min-height: 36px;
  padding: 6px 10px;
}

.driving-route-body {
  padding: 8px;
}

.driving-route-panel-collapsed .driving-route-body {
  display: none;
}

.driving-route-setting {
  display: block;
  margin-bottom: 8px;
}

.driving-route-setting input {
  width: 4em;
}

.driving-route-stops {
  padding-left: 0;
  margin: 8px 0;
  list-style: none;
}

.driving-route-stop {
  border: 1px solid #555;
  border-radius: 6px;
  padding: 8px;
  margin-bottom: 8px;
  background: #2a2a2a;
}

.driving-route-stop-title {
  display: flex;
  gap: 6px;
  font-weight: bold;
}

.driving-route-stop-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  border-radius: 999px;
  background: #ff7f00;
  color: #111;
}

.driving-route-leg,
.driving-route-stop-meta {
  margin-top: 4px;
}

.driving-route-actions {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.driving-route-message {
  display: none;
  margin-top: 8px;
  padding: 6px;
  border: 1px solid #777;
  border-radius: 4px;
}

.driving-route-message-visible {
  display: block;
}

.driving-route-stop-label span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: #ff7f00;
  color: #111;
  font-weight: bold;
  border: 2px solid #111;
}
`;