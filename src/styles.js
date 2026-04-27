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
  width: 100%;
  max-width: 100%;
  overflow-x: visible;
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
  margin: 0 0 6px;
}

.driving-route-summary {
  margin-top: 4px;
}

.driving-route-setting {
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 8px 0 8px;
}

.driving-route-setting input {
  width: 4.5em;
}

.driving-route-checkbox-setting {
  align-items: center;
}

.driving-route-checkbox-setting input {
  width: auto;
}

.driving-route-empty {
  margin: 8px 0 10px;
}

.driving-route-waypoints-list {
  display: block;
  width: 100%;
  max-width: 100%;
  margin: 6px 0 8px;
  overflow: visible;
}

.driving-route-waypoint-row {
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr) 42px 22px 22px 22px;
  gap: 2px;
  align-items: center;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow: visible;
}

.driving-route-waypoint-row + .driving-route-waypoint-row {
  margin-top: 2px;
}

.driving-route-waypoint-num,
.driving-route-waypoint-name-cell,
.driving-route-wait-cell,
.driving-route-row-action {
  min-width: 0;
  border: 0 !important;
  outline: 0 !important;
  background: transparent !important;
}

.driving-route-waypoint-num {
  width: 20px;
  text-align: center;
}

.driving-route-waypoint-name-cell {
  overflow: hidden;
}

.driving-route-wait-cell {
  width: 42px;
  text-align: center;
}

.driving-route-row-action {
  width: 22px;
  text-align: center;
  overflow: visible;
}

.driving-route-waypoint-name {
  display: block;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 0 !important;
  margin: 0 !important;
  border: 0 !important;
  outline: 0 !important;
  box-shadow: none !important;
  background: transparent !important;
  color: inherit !important;
  text-align: left;
  font-weight: bold;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
}

.driving-route-waypoint-name:hover,
.driving-route-waypoint-name:focus,
.driving-route-waypoint-name:active {
  border: 0 !important;
  outline: 0 !important;
  box-shadow: none !important;
  background: transparent !important;
  color: inherit !important;
}

.driving-route-wait-input {
  width: 42px;
  padding: 1px 2px;
}

.driving-route-row-button {
  width: 22px !important;
  min-width: 22px !important;
  max-width: 22px !important;
  height: 20px;
  min-height: 20px;
  padding: 0 !important;
  border: 0 !important;
  background: transparent !important;
  color: inherit !important;
  text-align: center;
  line-height: 20px;
  font-size: 14px !important;
  font-weight: bold !important;
}

.driving-route-row-button:disabled {
  opacity: 0.35;
}

.driving-route-remove-stop-button {
  color: #ff8080 !important;
}

.driving-route-stop-num,
.driving-route-stop-label span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  min-width: 16px;
  height: 16px;
  min-height: 16px;
  padding: 0;
  border-radius: 50%;
  background: #ffd800;
  color: #111;
  font-weight: bold;
  font-size: 10px;
  line-height: 16px;
}

button.driving-route-stop-num,
button.driving-route-waypoint-badge {
  width: 16px !important;
  min-width: 16px !important;
  height: 16px !important;
  min-height: 16px !important;
  padding: 0 !important;
  border: 0 !important;
  border-radius: 50% !important;
  background: #ffd800 !important;
  color: #111 !important;
  cursor: pointer;
  line-height: 16px !important;
}

.driving-route-leg {
  margin: 1px 0 3px 23px;
  padding-left: 5px;
  opacity: 0.85;
  font-size: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.driving-route-stale {
  margin-top: 4px;
  opacity: 0.85;
  font-size: 10px;
  font-style: italic;
}

.driving-route-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 8px;
}

.driving-route-footer-actions {
  justify-content: flex-end;
  border-top: 1px solid rgba(255, 255, 255, 0.25);
  margin-top: 10px;
  padding-top: 7px;
}

.driving-route-bottom-summary {
  margin-top: 8px;
  opacity: 0.9;
}

.driving-route-version {
  margin-top: 6px;
  opacity: 0.7;
  font-size: 10px;
  text-align: right;
}

.driving-route-totals {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-top: 8px;
}

.driving-route-totals div {
  padding: 5px;
  background: rgba(0, 0, 0, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.driving-route-totals span,
.driving-route-totals strong {
  display: block;
}

.driving-route-message {
  display: none;
  margin-top: 8px;
  padding: 7px;
  border: 1px solid #ffd800;
  background: rgba(0, 0, 0, 0.22);
}

.driving-route-message-visible {
  display: block;
}

.driving-route-busy {
  opacity: 0.82;
}

.driving-route-stop-tooltip,
.driving-route-stop-tooltip * {
  pointer-events: none;
}

.driving-route-stop-label {
  border: 0;
  background: transparent;
}

.driving-route-stop-label span {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.65);
}

.driving-route-segment-time-label {
  border: 0;
  background: transparent;
  pointer-events: none;
}

.driving-route-segment-time-label span {
  display: inline-block;
  padding: 2px 5px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.72);
  color: #fff;
  font-size: 10px;
  font-weight: bold;
  line-height: 1.2;
  white-space: nowrap;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.65);
}

.driving-route-stop-tooltip {
  font-size: 11px;
}

.driving-route-portal-action {
  margin-top: 8px;
}


.ui-dialog.driving-route-dialog {
  max-width: calc(100vw - 20px) !important;
}

.ui-dialog.driving-route-dialog .ui-dialog-content {
  box-sizing: border-box !important;
  overflow-x: visible !important;
}

.driving-route-waypoints-list,
.driving-route-waypoint-row,
.driving-route-waypoint-row > div,
.driving-route-waypoint-name-cell,
.driving-route-waypoint-name-cell * {
  border-color: transparent !important;
}

.driving-route-waypoint-name,
button.driving-route-waypoint-name,
.ui-dialog .driving-route-waypoint-name,
.ui-dialog button.driving-route-waypoint-name {
  border: none !important;
  border-width: 0 !important;
  outline: none !important;
  box-shadow: none !important;
  background: transparent !important;
  background-image: none !important;
}

@media (max-width: 640px) {
  .ui-dialog.driving-route-dialog {
    position: fixed !important;
    left: 8px !important;
    right: 8px !important;
    top: 50% !important;
    bottom: auto !important;
    width: auto !important;
    max-width: calc(100vw - 16px) !important;
    max-height: calc(100dvh - 24px) !important;
    transform: translateY(-50%) !important;
  }

  .ui-dialog.driving-route-dialog .ui-dialog-content {
    width: auto !important;
    max-height: calc(100dvh - 90px) !important;
    overflow-y: auto !important;
    overflow-x: visible !important;
    padding-left: 8px !important;
    padding-right: 8px !important;
    padding-bottom: 8px !important;
  }

  .driving-route-waypoint-row {
    grid-template-columns: 18px minmax(0, 1fr) 38px 20px 20px 20px;
    gap: 1px;
  }

  .driving-route-waypoint-num {
    width: 18px;
  }

  .driving-route-wait-cell {
    width: 38px;
  }

  .driving-route-wait-input {
    width: 38px;
  }

  .driving-route-row-action {
    width: 20px;
  }

  .driving-route-row-button {
    width: 20px !important;
    min-width: 20px !important;
    max-width: 20px !important;
  }

  .driving-route-leg {
    margin-left: 20px;
  }
}
`;
