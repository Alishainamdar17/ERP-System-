// const BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";
// const DEFAULT_USER_ID = 1; // replace with real auth userId when JWT is added

// // ─── PROJECTS ───────────────────────────────────────────────
// export const getAllProjects = async (active) => {
//   const query = active !== undefined ? `?active=${active}` : "";
//   const res = await fetch(`${BASE}/api/cash/projects${query}`);
//   const json = await res.json();
//   if (!json.success) throw new Error(json.message);
//   return json.data;
// };

// export const getProjectById = async (id) => {
//   const res = await fetch(`${BASE}/api/cash/projects/${id}`);
//   const json = await res.json();
//   if (!json.success) throw new Error(json.message);
//   return json.data;
// };

// export const getProjects = async () => getAllProjects();

// export const createProject = async (payload, userId = DEFAULT_USER_ID) => {
//   const res = await fetch(`${BASE}/api/cash/projects?userId=${userId}`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });
//   const json = await res.json();
//   if (!json.success) throw new Error(json.message);
//   return json.data;
// };

// export const updateProject = async (id, payload, userId = DEFAULT_USER_ID) => {
//   const res = await fetch(`${BASE}/api/cash/projects/${id}?userId=${userId}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });
//   const json = await res.json();
//   if (!json.success) throw new Error(json.message);
//   return json.data;
// };

// export const deactivateProject = async (id, userId = DEFAULT_USER_ID) => {
//   const res = await fetch(`${BASE}/api/cash/projects/${id}?userId=${userId}`, {
//     method: "DELETE",
//   });
//   const json = await res.json();
//   if (!json.success) throw new Error(json.message);
//   return json.data;
// };

// // ─── USING PROJECTS ──────────────────────────────────────────
// export const getUsingProjects = async (fundingProjectId) => {
//   const res = await fetch(`${BASE}/api/cash/projects/${fundingProjectId}/using`);
//   const json = await res.json();
//   if (!json.success) throw new Error(json.message);
//   return json.data;
// };

// export const addUsingProject = async (fundingProjectId, payload, userId = DEFAULT_USER_ID) => {
//   const res = await fetch(`${BASE}/api/cash/projects/${fundingProjectId}/using?userId=${userId}`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });
//   const json = await res.json();
//   if (!json.success) throw new Error(json.message);
//   return json.data;
// };

// export const updateUsingProject = async (usingId, payload, userId = DEFAULT_USER_ID) => {
//   const res = await fetch(`${BASE}/api/cash/projects/using/${usingId}?userId=${userId}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });
//   const json = await res.json();
//   if (!json.success) throw new Error(json.message);
//   return json.data;
// };

// export const deleteUsingProject = async (usingId, userId = DEFAULT_USER_ID) => {
//   const res = await fetch(`${BASE}/api/cash/projects/using/${usingId}?userId=${userId}`, {
//     method: "DELETE",
//   });
//   const json = await res.json();
//   if (!json.success) throw new Error(json.message);
//   return json.data;
// };

// // ─── DEBT REASSIGNMENT  ← NEW ────────────────────────────────
// /**
//  * Moves selected sub-project debts from their current funder to a new funder.
//  *
//  * @param {number[]} usingProjectIds  - IDs of UsingProject rows to move
//  * @param {number}   newFundingProjectId - ID of the project that becomes the new funder
//  * @param {string}   [note]           - Optional note recorded in audit log
//  * @returns {Promise<ReassignResponse>}
//  *
//  * Example:
//  *   await reassignUsingProjects([5, 8], 3, "Raheja funded Aura; debts transferred")
//  */
// export const reassignUsingProjects = async (
//   usingProjectIds,
//   newFundingProjectId,
//   note = "",
//   userId = DEFAULT_USER_ID
// ) => {
//   const res = await fetch(
//     `${BASE}/api/cash/projects/using/reassign?userId=${userId}`,
//     {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ usingProjectIds, newFundingProjectId, note }),
//     }
//   );
//   const json = await res.json();
//   if (!json.success) throw new Error(json.message);
//   return json.data;
// };

// // ─── TRANSACTIONS ────────────────────────────────────────────
// export const getTransactionsByProject = async (projectId) => {
//   const res = await fetch(`${BASE}/api/cash/transactions/project/${projectId}`);
//   const json = await res.json();
//   if (!json.success) throw new Error(json.message);
//   return json.data;
// };

// export const getAllTransactions = async () => {
//   const projects = await getAllProjects();
//   const results = await Promise.all(
//     projects.map((p) => getTransactionsByProject(p.id))
//   );
//   return results.flat().sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));
// };

// export const createTransaction = async (payload, userId = DEFAULT_USER_ID) => {
//   const res = await fetch(`${BASE}/api/cash/transactions?userId=${userId}`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });
//   const json = await res.json();
//   if (!json.success) throw new Error(json.message);
//   return json.data;
// };

// export const deleteTransaction = async (id, userId = DEFAULT_USER_ID) => {
//   const res = await fetch(`${BASE}/api/cash/transactions/${id}?userId=${userId}`, {
//     method: "DELETE",
//   });
//   const json = await res.json();
//   if (!json.success) throw new Error(json.message);
//   return json.data;
// };

// // ─── TRANSFERS ───────────────────────────────────────────────
// export const getAllTransfers = async () => {
//   const res = await fetch(`${BASE}/api/cash/transfers`);
//   const json = await res.json();
//   if (!json.success) throw new Error(json.message);
//   return json.data;
// };

// export const createTransfer = async (payload, userId = DEFAULT_USER_ID) => {
//   const res = await fetch(`${BASE}/api/cash/transfers?userId=${userId}`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });
//   const json = await res.json();
//   if (!json.success) throw new Error(json.message);
//   return json.data;
// };

// export const getTransfersByProject = async (projectId) => {
//   const res = await fetch(`${BASE}/api/cash/transfers/project/${projectId}`);
//   const json = await res.json();
//   if (!json.success) throw new Error(json.message);
//   return json.data;
// };

// export const deleteProject = async (id, userId = DEFAULT_USER_ID) => deactivateProject(id, userId);

// // ─── DASHBOARD ───────────────────────────────────────────────
// export const getDashboard = async () => {
//   const res = await fetch(`${BASE}/api/cash/dashboard`);
//   const json = await res.json();
//   if (!json.success) throw new Error(json.message);
//   return json.data;
// };

const BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";
const DEFAULT_USER_ID = 1; // replace with real auth userId when JWT is added

// ─── PROJECTS ───────────────────────────────────────────────
export const getAllProjects = async (active) => {
  const query = active !== undefined ? `?active=${active}` : "";
  const res = await fetch(`${BASE}/api/cash/projects${query}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
};

export const getProjectById = async (id) => {
  const res = await fetch(`${BASE}/api/cash/projects/${id}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
};

export const getProjects = async () => getAllProjects();

export const createProject = async (payload, userId = DEFAULT_USER_ID) => {
  const res = await fetch(`${BASE}/api/cash/projects?userId=${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
};

export const updateProject = async (id, payload, userId = DEFAULT_USER_ID) => {
  const res = await fetch(`${BASE}/api/cash/projects/${id}?userId=${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
};

export const deactivateProject = async (id, userId = DEFAULT_USER_ID) => {
  const res = await fetch(`${BASE}/api/cash/projects/${id}?userId=${userId}`, {
    method: "DELETE",
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
};

// ─── USING PROJECTS ──────────────────────────────────────────
export const getUsingProjects = async (fundingProjectId) => {
  const res = await fetch(`${BASE}/api/cash/projects/${fundingProjectId}/using`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
};

export const addUsingProject = async (fundingProjectId, payload, userId = DEFAULT_USER_ID) => {
  const res = await fetch(`${BASE}/api/cash/projects/${fundingProjectId}/using?userId=${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
};

export const updateUsingProject = async (usingId, payload, userId = DEFAULT_USER_ID) => {
  const res = await fetch(`${BASE}/api/cash/projects/using/${usingId}?userId=${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
};

export const deleteUsingProject = async (usingId, userId = DEFAULT_USER_ID) => {
  const res = await fetch(`${BASE}/api/cash/projects/using/${usingId}?userId=${userId}`, {
    method: "DELETE",
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
};

// ─── USING PROJECT + AUTO TRANSACTION ────────────────────────
/**
 * Updates a using project AND automatically creates transactions
 * for any change in amountGiven or amountReturned.
 *
 * Logic:
 *   • newGiven > oldGiven     → EXPENSE transaction  (money went out from funding project)
 *   • newReturned > oldReturned → INCOME transaction (money came back to funding project)
 *
 * @param {number} usingId          - ID of the using project row
 * @param {object} oldValues        - { amountGiven, amountReturned } before edit
 * @param {object} newPayload       - { name, refNo, amountGiven, amountReturned }
 * @param {number} fundingProjectId - ID of the parent funding project (for transaction linkage)
 * @param {string} usingProjectName - Name of using project (used in transaction description)
 * @param {number} userId
 */
export const updateUsingProjectWithTransaction = async (
  usingId,
  oldValues,
  newPayload,
  fundingProjectId,
  usingProjectName,
  userId = DEFAULT_USER_ID
) => {
  // Step 1: Update the using project record
  await updateUsingProject(usingId, newPayload, userId);

  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
  const transactionPromises = [];

  const oldGiven    = Number(oldValues.amountGiven)    || 0;
  const oldReturned = Number(oldValues.amountReturned) || 0;
  const newGiven    = Number(newPayload.amountGiven)   || 0;
  const newReturned = Number(newPayload.amountReturned)|| 0;

  const givenDiff    = newGiven    - oldGiven;    // +ve = more money given out
  const returnedDiff = newReturned - oldReturned; // +ve = more money returned

  // Step 2a: If amountGiven increased → record EXPENSE
  if (givenDiff > 0) {
    transactionPromises.push(
      createTransaction(
        {
          projectId:       fundingProjectId,
          type:            "EXPENSE",
          amount:          givenDiff,
          transactionDate: today,
          description:     `Given to: ${usingProjectName}${newPayload.refNo ? ` (${newPayload.refNo})` : ""}`,
        },
        userId
      )
    );
  }

  // Step 2b: If amountGiven decreased → record a reversal INCOME
  if (givenDiff < 0) {
    transactionPromises.push(
      createTransaction(
        {
          projectId:       fundingProjectId,
          type:            "INCOME",
          amount:          Math.abs(givenDiff),
          transactionDate: today,
          description:     `Given amount reduced for: ${usingProjectName}${newPayload.refNo ? ` (${newPayload.refNo})` : ""} [correction]`,
        },
        userId
      )
    );
  }

  // Step 2c: If amountReturned increased → record INCOME
  if (returnedDiff > 0) {
    transactionPromises.push(
      createTransaction(
        {
          projectId:       fundingProjectId,
          type:            "INCOME",
          amount:          returnedDiff,
          transactionDate: today,
          description:     `Returned from: ${usingProjectName}${newPayload.refNo ? ` (${newPayload.refNo})` : ""}`,
        },
        userId
      )
    );
  }

  // Step 2d: If amountReturned decreased → record reversal EXPENSE
  if (returnedDiff < 0) {
    transactionPromises.push(
      createTransaction(
        {
          projectId:       fundingProjectId,
          type:            "EXPENSE",
          amount:          Math.abs(returnedDiff),
          transactionDate: today,
          description:     `Returned amount reduced for: ${usingProjectName}${newPayload.refNo ? ` (${newPayload.refNo})` : ""} [correction]`,
        },
        userId
      )
    );
  }

  // Step 3: Fire all transactions (don't block on partial failure)
  if (transactionPromises.length > 0) {
    await Promise.all(transactionPromises);
  }
};

/**
 * Adds a new using project AND auto-creates an EXPENSE transaction
 * if amountGiven > 0.
 */
export const addUsingProjectWithTransaction = async (
  fundingProjectId,
  payload,
  userId = DEFAULT_USER_ID
) => {
  // Step 1: Add the using project
  const created = await addUsingProject(fundingProjectId, payload, userId);

  const today = new Date().toISOString().split("T")[0];
  const givenAmt    = Number(payload.amountGiven)    || 0;
  const returnedAmt = Number(payload.amountReturned) || 0;

  const transactionPromises = [];

  // Step 2a: If given > 0 → EXPENSE
  if (givenAmt > 0) {
    transactionPromises.push(
      createTransaction(
        {
          projectId:       fundingProjectId,
          type:            "EXPENSE",
          amount:          givenAmt,
          transactionDate: today,
          description:     `Given to: ${payload.name}${payload.refNo ? ` (${payload.refNo})` : ""}`,
        },
        userId
      )
    );
  }

  // Step 2b: If returned > 0 → INCOME (unlikely on first add but handle it)
  if (returnedAmt > 0) {
    transactionPromises.push(
      createTransaction(
        {
          projectId:       fundingProjectId,
          type:            "INCOME",
          amount:          returnedAmt,
          transactionDate: today,
          description:     `Returned from: ${payload.name}${payload.refNo ? ` (${payload.refNo})` : ""}`,
        },
        userId
      )
    );
  }

  if (transactionPromises.length > 0) {
    await Promise.all(transactionPromises);
  }

  return created;
};

// ─── DEBT REASSIGNMENT ────────────────────────────────────────
export const reassignUsingProjects = async (
  usingProjectIds,
  newFundingProjectId,
  note = "",
  userId = DEFAULT_USER_ID
) => {
  const res = await fetch(
    `${BASE}/api/cash/projects/using/reassign?userId=${userId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usingProjectIds, newFundingProjectId, note }),
    }
  );
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
};

// ─── TRANSACTIONS ────────────────────────────────────────────
export const getTransactionsByProject = async (projectId) => {
  const res = await fetch(`${BASE}/api/cash/transactions/project/${projectId}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
};

export const getAllTransactions = async () => {
  const projects = await getAllProjects();
  const results = await Promise.all(
    projects.map((p) => getTransactionsByProject(p.id))
  );
  return results.flat().sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));
};

export const createTransaction = async (payload, userId = DEFAULT_USER_ID) => {
  const res = await fetch(`${BASE}/api/cash/transactions?userId=${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
};

export const deleteTransaction = async (id, userId = DEFAULT_USER_ID) => {
  const res = await fetch(`${BASE}/api/cash/transactions/${id}?userId=${userId}`, {
    method: "DELETE",
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
};

// ─── TRANSFERS ───────────────────────────────────────────────
export const getAllTransfers = async () => {
  const res = await fetch(`${BASE}/api/cash/transfers`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
};

export const createTransfer = async (payload, userId = DEFAULT_USER_ID) => {
  const res = await fetch(`${BASE}/api/cash/transfers?userId=${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
};

export const getTransfersByProject = async (projectId) => {
  const res = await fetch(`${BASE}/api/cash/transfers/project/${projectId}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
};

export const deleteProject = async (id, userId = DEFAULT_USER_ID) => deactivateProject(id, userId);

// ─── DASHBOARD ───────────────────────────────────────────────
export const getDashboard = async () => {
  const res = await fetch(`${BASE}/api/cash/dashboard`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
};
// ─── REASSIGNMENTS ───────────────────────────────────────────
export const getAllReassignments = async () => {
  const res = await fetch(`${BASE}/api/cash/projects/reassignments`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
};