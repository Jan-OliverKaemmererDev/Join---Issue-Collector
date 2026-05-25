/**
 * Generiert das HTML-Template für eine Task-Karte
 * @param {Object} task - Das Task-Objekt
 * @param {string} categoryClass - Die CSS-Klasse für die Kategorie
 * @param {string} categoryLabel - Das Label für die Kategorie
 * @param {string} progressHtml - Das HTML für den Fortschrittsbalken
 * @param {string} assigneesHtml - Das HTML für die zugewiesenen Benutzer
 * @param {string} priorityIcon - Das HTML für das Prioritäts-Icon
 * @returns {string} Das HTML-Template für die Task-Karte
 */
function getTaskCardTemplate(
  task,
  categoryClass,
  categoryLabel,
  progressHtml,
  assigneesHtml,
  priorityIcon,
) {
  return `
    <div class="task-card" draggable="true" data-task-id="${task.id}" ondragstart="startDragging(${task.id}, event)" ondragend="endDragging()" onclick="openTaskDetails(${task.id})">
      <div class="category-tag ${categoryClass}">${categoryLabel}</div>
      <h3 class="task-title">${task.title}</h3>
      <p class="task-description">${task.description}</p>
      ${progressHtml}
      <div class="task-footer">
        <div class="task-assignees">
          ${assigneesHtml}
        </div>
        <div class="task-priority">
          ${priorityIcon}
        </div>
      </div>
    </div>
  `;
}


/**
 * Generiert das HTML-Template für einen Fortschrittsbalken
 * @param {number} completed - Anzahl der abgeschlossenen Subtasks
 * @param {number} total - Gesamtanzahl der Subtasks
 * @returns {string} Das HTML-Template für den Fortschrittsbalken
 */
function getProgressBarTemplate(completed, total) {
  const percent = (completed / total) * 100;
  return `
    <div class="task-subtasks">
      <div class="progress-bar-container">
        <div class="progress-bar" style="width: ${percent}%"></div>
      </div>
      <span>${completed}/${total} Subtasks</span>
    </div>
  `;
}


/**
 * Generiert das HTML-Template für ein Assignee-Badge
 * @param {string} initials - Die Initialen des Assignees
 * @returns {string} Das HTML-Template für das Assignee-Badge
 */
function getAssigneeBadgeTemplate(initials, color) {
  const backgroundColor = color || "#00bee8";
  return `<div class="assignee-badge" style="background-color: ${backgroundColor};">${initials}</div>`;
}


/**
 * Generiert das HTML-Template für fehlende Tasks
 * @param {string} message - Die anzuzeigende Nachricht
 * @returns {string} Das HTML-Template für die Fehlmeldung
 */
function getNoTasksTemplate(message) {
  return `<div class="no-tasks">${message}</div>`;
}


/**
 * Generiert das HTML-Template für ein Subtask-Element in der Detailansicht
 * @param {number} taskId - Die ID des Tasks
 * @param {number} index - Der Index des Subtasks
 * @param {Object} st - Das Subtask-Objekt
 * @returns {string} Das HTML-Template für das Subtask-Element
 */
function getSubtaskItemDetailTemplate(taskId, index, st) {
  const checkedClass = st.completed ? "checked" : "";
  return `
    <div class="subtask-item-detail" onclick="toggleSubtask(${taskId}, ${index})">
      <div class="subtask-checkbox ${checkedClass}"></div>
      <span>${st.text}</span>
    </div>
  `;
}


/**
 * Generiert das HTML-Template für die Task-Detailansicht
 * @param {Object} task - Das Task-Objekt
 * @param {string} subtasksHtml - Das HTML für die Subtasks
 * @param {string} priorityIcon - Das HTML für das Prioritäts-Icon
 * @param {string} categoryClass - Die CSS-Klasse für die Kategorie
 * @param {string} categoryLabel - Das Label für die Kategorie
 * @param {string} assignedToHtml - Das HTML für die zugewiesenen Kontakte
 * @returns {string} Das HTML-Template für die Task-Details
 */
function getTaskDetailsTemplate(
  task,
  subtasksHtml,
  priorityIcon,
  categoryClass,
  categoryLabel,
  assignedToHtml,
) {
  return `
    <div class="task-details-header">
      <div class="category-tag ${categoryClass}">${categoryLabel}</div>
      <button class="task-details-close" onclick="closeTaskDetails()">
        <img src="./assets/icons/clear-X-icon.svg" alt="Close">
      </button>
    </div>
    <h1 class="task-details-title">${task.title}</h1>
    <p class="task-description task-description-full">${task.description}</p>
    <div class="task-details-info">
      <span class="task-details-label">Due date:</span>
      <span>${task.dueDate}</span>
    </div>
    <div class="task-details-info">
      <span class="task-details-label">Priority:</span>
      <div class="task-details-priority">
        <span>${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
        ${priorityIcon}
      </div>
    </div>
    <div class="task-details-info task-details-assignees">
      <span class="task-details-label">Assigned To:</span>
      <div class="assignee-details-list">${assignedToHtml}</div>
    </div>
    <div class="subtasks-section">
      <p class="subtasks-heading">Subtasks</p>
      <div class="subtasks-list-details">
        ${subtasksHtml}
      </div>
    </div>
    <div class="task-details-actions">
      <button onclick="deleteTask(${task.id})" class="task-action-btn">
        <img src="./assets/icons/delete.svg" alt="Delete">
        Delete
      </button>
      <div class="task-action-separator"></div>
      <button onclick="editTask(${task.id})" class="task-action-btn">
        <img src="./assets/icons/edit.svg" alt="Edit">
        Edit
      </button>
    </div>
  `;
}


/**
 * Generiert ein HTML-Template für einen zugewiesenen Kontakt in der Detailansicht
 * @param {string} initials - Initialen des Kontakts
 * @param {string} color - Hintergrundfarbe des Badges
 * @param {string} name - Vollständiger Name des Kontakts
 * @returns {string} Das HTML für den Kontakt-Eintrag
 */
function getAssignedToDetailItemTemplate(initials, color, name) {
  return `
    <div class="assignee-detail-item">
      <div class="assignee-badge" style="background-color: ${color};">${initials}</div>
      <span class="assignee-detail-name">${name}</span>
    </div>
  `;
}


/**
 * Generiert das HTML-Icon für hohe Priorität
 * @returns {string} Das HTML für das Urgent-Icon
 */
function getUrgentPriorityIcon() {
  return `<img src="./assets/icons/urgent-iconAddTask.png" alt="Urgent">`;
}


/**
 * Generiert das HTML-Icon für mittlere Priorität
 * @returns {string} Das HTML für das Medium-Icon
 */
function getMediumPriorityIcon() {
  return `<img src="./assets/icons/medium-iconAddTask.png" alt="Medium">`;
}


/**
 * Generiert das HTML-Icon für niedrige Priorität
 * @returns {string} Das HTML für das Low-Icon
 */
function getLowPriorityIcon() {
  return `<img src="./assets/icons/low-iconAddTask.png" alt="Low">`;
}
