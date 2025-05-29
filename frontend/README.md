# Country Search with Trie Data Structure

A fast and interactive country search application using **Trie data structure** to provide real-time suggestions as you type.



---

## 🚀 Project Overview

This project demonstrates how the Trie (Prefix Tree) data structure can be used to implement an efficient auto-suggestion feature — commonly seen in search bars, IDEs, and large-scale applications.

**Key Features:**
- Real-time prefix search for country names.
- Instant suggestions with highlighted matching parts.
- Responsive and modern UI with smooth animations.
- "No matches found" friendly feedback.
- Built with React (Vite) for frontend and Node.js for backend API.

---

## 🛠️ Tech Stack

| Frontend | Backend  | Styling          | API              |
| -------- | -------- | ---------------- | ---------------- |
| React (Vite) | Node.js + Express | Tailwind CSS     | Custom Trie Search |

---

## ⚙️ How It Works

- **Trie Data Structure** stores all countries in a prefix tree.
- When user types, frontend calls backend with prefix query.
- Backend traverses the trie and returns all matching countries.
- Frontend displays suggestions with matched prefix highlighted.
- If no match found, a user-friendly message with illustration is shown.


