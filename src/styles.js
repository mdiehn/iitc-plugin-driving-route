  pr.CSS = `
.portal-route-mini-control {
  margin-top: 10px;
}

.portal-route-mini-control a {
  text-align: center;
  font-size: 12px;
  font-weight: bold;
}

.portal-route-dialog-content {
  width: 100%;
  max-width: 100%;
  overflow-x: visible;
  font-size: 11px;
  line-height: 1.25;
}

.portal-route-dialog-content button,
.portal-route-dialog-content input {
  font-size: 11px;
}

.portal-route-mini-control .portal-route-mini-remove {
  color: #c00000;
}

.portal-route-dialog-content * {
  box-sizing: border-box;
}

.portal-route-body p {
  margin: 0 0 6px;
}

.portal-route-summary {
  margin-top: 4px;
}

.portal-route-setting {
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 8px 0 8px;
}

.portal-route-setting input {
  width: 4.5em;
}

.portal-route-checkbox-setting {
  align-items: center;
}

.portal-route-checkbox-setting input {
  width: auto;
}

.portal-route-empty {
  margin: 8px 0 10px;
}

.portal-route-waypoints-list {
  display: block;
  width: 100%;
  max-width: 100%;
  margin: 6px 0 8px;
  overflow: visible;
}

.portal-route-waypoint-row {
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr) max-content 42px 22px 22px 22px;
  gap: 2px;
  align-items: center;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow: visible;
}

.portal-route-waypoint-row + .portal-route-waypoint-row {
  margin-top: 2px;
}

.portal-route-waypoint-num,
.portal-route-waypoint-name-cell,
.portal-route-leg-cell,
.portal-route-wait-cell,
.portal-route-row-action {
  min-width: 0;
  border: 0 !important;
  outline: 0 !important;
  background: transparent !important;
}

.portal-route-waypoint-num {
  width: 20px;
  text-align: center;
}

.portal-route-waypoint-name-cell {
  overflow: hidden;
}

.portal-route-leg-cell {
  min-width: max-content;
  padding-right: 14px;
  text-align: right;
  white-space: nowrap;
  overflow: visible;
}

.portal-route-wait-cell {
  width: 42px;
  text-align: center;
}

.portal-route-row-action {
  width: 22px;
  text-align: center;
  overflow: visible;
}

.portal-route-waypoint-name {
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

.portal-route-waypoint-name:hover,
.portal-route-waypoint-name:focus,
.portal-route-waypoint-name:active {
  border: 0 !important;
  outline: 0 !important;
  box-shadow: none !important;
  background: transparent !important;
  color: inherit !important;
}

.portal-route-wait-input {
  width: 42px;
  padding: 1px 2px;
}

.portal-route-row-button {
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

.portal-route-row-button:disabled {
  opacity: 0.35;
}

.portal-route-remove-stop-button {
  color: #ff8080 !important;
}

.portal-route-stop-num,
.portal-route-stop-label span {
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

button.portal-route-stop-num,
button.portal-route-waypoint-badge {
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

.portal-route-leg {
  display: block;
  width: max-content;
  overflow: visible;
  text-overflow: clip;
  color: inherit;
  opacity: 1;
  font: inherit;
  font-weight: bold;
}

.portal-route-leg-stale,
.portal-route-leg-empty {
  opacity: 0.45;
}

.portal-route-stale {
  margin-top: 4px;
  opacity: 0.85;
  font-size: 10px;
  font-style: italic;
}

.portal-route-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 8px;
}

.portal-route-footer-actions {
  justify-content: flex-end;
  border-top: 1px solid rgba(255, 255, 255, 0.25);
  margin-top: 10px;
  padding-top: 7px;
}

.portal-route-bottom-summary {
  margin-top: 8px;
  opacity: 0.9;
}

.portal-route-version {
  margin-top: 6px;
  opacity: 0.7;
  font-size: 10px;
  text-align: right;
}

.portal-route-totals {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-top: 8px;
}

.portal-route-totals div {
  padding: 5px;
  background: rgba(0, 0, 0, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.portal-route-totals span,
.portal-route-totals strong {
  display: block;
}

.portal-route-message {
  display: none;
  margin-top: 8px;
  padding: 7px;
  border: 1px solid #ffd800;
  background: rgba(0, 0, 0, 0.22);
}

.portal-route-message-visible {
  display: block;
}

.portal-route-busy {
  opacity: 0.82;
}

.portal-route-stop-tooltip,
.portal-route-stop-tooltip * {
  pointer-events: none;
}

.portal-route-stop-label {
  border: 0;
  background: transparent;
}

.portal-route-stop-label span {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.65);
}

.portal-route-segment-time-label {
  border: 0;
  background: transparent;
  pointer-events: none;
}

.portal-route-segment-time-label span {
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

.portal-route-stop-tooltip {
  font-size: 11px;
}

.portal-route-portal-action {
  margin-top: 8px;
}


.ui-dialog.portal-route-dialog {
  max-width: calc(100vw - 20px) !important;
}

.ui-dialog.portal-route-dialog .ui-dialog-content {
  box-sizing: border-box !important;
  overflow-x: visible !important;
}

.portal-route-waypoints-list,
.portal-route-waypoint-row,
.portal-route-waypoint-row > div,
.portal-route-waypoint-name-cell,
.portal-route-waypoint-name-cell * {
  border-color: transparent !important;
}

.portal-route-waypoint-name,
button.portal-route-waypoint-name,
.ui-dialog .portal-route-waypoint-name,
.ui-dialog button.portal-route-waypoint-name {
  border: none !important;
  border-width: 0 !important;
  outline: none !important;
  box-shadow: none !important;
  background: transparent !important;
  background-image: none !important;
}

@media (max-width: 640px) {
  .ui-dialog.portal-route-dialog {
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

  .ui-dialog.portal-route-dialog .ui-dialog-content {
    width: auto !important;
    max-height: calc(100dvh - 90px) !important;
    overflow-y: auto !important;
    overflow-x: visible !important;
    padding-left: 8px !important;
    padding-right: 8px !important;
    padding-bottom: 8px !important;
  }

  .portal-route-waypoint-row {
    grid-template-columns: 18px minmax(0, 1fr) max-content 38px 20px 20px 20px;
    gap: 1px;
  }

  .portal-route-waypoint-num {
    width: 18px;
  }

  .portal-route-leg-cell {
    padding-right: 9px;
  }

  .portal-route-wait-cell {
    width: 38px;
  }

  .portal-route-wait-input {
    width: 38px;
  }

  .portal-route-row-action {
    width: 20px;
  }

  .portal-route-row-button {
    width: 20px !important;
    min-width: 20px !important;
    max-width: 20px !important;
  }

}
`;
