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
  overflow-x: hidden;
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

.driving-route-empty {
  margin: 8px 0 10px;
}

.driving-route-waypoints-table {
  width: 100%;
  max-width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  margin: 6px 0 8px;
  border: 0;
}

.driving-route-waypoints-table tr,
.driving-route-waypoints-table td {
  border: 0 !important;
  outline: 0 !important;
  background: transparent !important;
}

.driving-route-waypoints-table td {
  padding: 2px 2px;
  vertical-align: middle;
}

.driving-route-waypoint-num {
  width: 22px;
  text-align: center;
}

.driving-route-waypoint-name-cell {
  width: auto;
  min-width: 0;
}

.driving-route-wait-cell {
  width: 44px;
  text-align: center;
}

.driving-route-row-action {
  width: 23px;
  text-align: center;
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
  width: 21px;
  min-width: 21px;
  padding: 1px 0;
  border: 0 !important;
  background: transparent !important;
  color: inherit !important;
  text-align: center;
  line-height: 1.2;
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
  margin-top: 1px;
  opacity: 0.85;
  font-size: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  margin-top: 8px;
  opacity: 0.65;
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
  overflow-x: hidden !important;
}

.driving-route-waypoints-table,
.driving-route-waypoints-table tbody,
.driving-route-waypoints-table tr,
.driving-route-waypoints-table td,
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
    --driving-route-iitc-bottom-bar-height: 34px;
    --driving-route-mobile-bottom-gap: 6px;
    position: fixed !important;
    left: 0 !important;
    right: 0 !important;
    bottom: calc(
      var(--driving-route-iitc-bottom-bar-height) +
      var(--driving-route-mobile-bottom-gap) +
      env(safe-area-inset-bottom, 0px)
    ) !important;
    top: auto !important;
    width: 100vw !important;
    max-width: 100vw !important;
    max-height: calc(
      68dvh -
      var(--driving-route-iitc-bottom-bar-height) -
      var(--driving-route-mobile-bottom-gap) -
      env(safe-area-inset-bottom, 0px)
    );
  }

  .ui-dialog.driving-route-dialog .ui-dialog-content {
    width: auto !important;
    max-height: calc(
      68dvh -
      40px -
      var(--driving-route-iitc-bottom-bar-height) -
      var(--driving-route-mobile-bottom-gap) -
      env(safe-area-inset-bottom, 0px)
    ) !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    padding-left: 8px !important;
    padding-right: 8px !important;
    padding-bottom: 8px !important;
  }

  .driving-route-row-action {
    width: 26px;
  }

  .driving-route-row-button {
    width: 24px;
    min-width: 24px;
  }
}
`;
