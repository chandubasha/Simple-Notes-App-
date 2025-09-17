'use client';

import { useEffect, useMemo, useState } from 'react';

type Note = {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function loadNotes() {
    setLoading(true);
    try {
      const res = await fetch('/api/notes', { cache: 'no-store' });
  
      if (!res.ok) {
        const msg = await getErrorMessage(res);
        console.error('GET /api/notes failed:', msg);
        setNotes([]); // don’t crash UI
        return;
      }
  
      const body = await readJsonSafe(res);
      if (Array.isArray(body)) {
        setNotes(body);
      } else {
        console.error('GET /api/notes returned non-JSON:', body?._nonJson);
        setNotes([]);
      }
    } catch (e) {
      console.error(e);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }
  

  async function readJsonSafe(res: Response) {
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      return await res.json();
    }
    const text = await res.text(); // HTML or empty
    return { _nonJson: text };
  }
  
  async function getErrorMessage(res: Response) {
    try {
      const body = await readJsonSafe(res);
      if (body && typeof body === 'object' && 'error' in body) return String((body as any).error);
      if (body && (body as any)._nonJson) return (body as any)._nonJson.slice(0, 200);
    } catch {}
    return `${res.status} ${res.statusText}`;
  }

  
  useEffect(() => {
    // apply saved theme
    const saved = localStorage.getItem('theme');
    if (saved) document.documentElement.classList.toggle('dark', saved === 'dark');
    loadNotes();
  }, []);

  

  function startEdit(n: Note) {
    setEditingId(n._id);
    setTitle(n.title);
    setContent(n.content);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function remove(id: string) {
    if (!confirm('Delete this note?')) return;
    try {
      const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const msg = await getErrorMessage(res);
        throw new Error(msg || 'Delete failed');
      }
      // consume JSON if present; ignore otherwise
      try { await res.clone().json(); } catch {}
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (e) {
      alert('Delete failed. See console for details.');
      console.error(e);
    }
  }
  

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return notes;
    return notes.filter((n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q));
  }, [search, notes]);


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    const payload = { title: title.trim(), content };
  
    try {
      let res: Response;
      if (editingId) {
        res = await fetch(`/api/notes/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
  
      if (!res.ok) {
        const msg = await getErrorMessage(res);
        throw new Error(msg || 'Request failed');
      }
  
      // try to consume JSON if available; ignore if empty
      try { await res.clone().json(); } catch {}
  
      setTitle('');
      setContent('');
      setEditingId(null);
      await loadNotes();
    } catch (err: any) {
      setError(err?.message || 'Something went wrong');
    }
  }
  

  return (
    <main>
      <form onSubmit={handleSubmit} className="space-y-3 border p-4 rounded-2xl">
        <h2 className="font-semibold text-lg">{editingId ? 'Edit Note' : 'New Note'}</h2>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title *"
          className="w-full border rounded-xl px-3 py-2 bg-transparent"
          maxLength={140}
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          className="w-full border rounded-xl px-3 py-2 min-h-[120px] bg-transparent"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-xl px-4 py-2 border font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {editingId ? 'Update' : 'Create'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => { setEditingId(null); setTitle(''); setContent(''); }}
              className="rounded-xl px-4 py-2 border hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-6 flex items-center justify-between gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notes..."
          className="flex-1 border rounded-xl px-3 py-2 bg-transparent"
        />
        <span className="text-sm opacity-70">{filtered.length} / {notes.length}</span>
      </div>

      <ul className="mt-4 space-y-3">
        {loading ? <li>Loading...</li> : filtered.length === 0 ? <li>No notes yet.</li> : filtered.map((n) => (
          <li key={n._id} className="border rounded-2xl p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold">{n.title}</h3>
                {n.content && <p className="opacity-80 whitespace-pre-wrap">{n.content}</p>}
                <p className="text-xs opacity-60 mt-1">Updated {new Date(n.updatedAt).toLocaleString()}</p>
              </div>
              <div className="shrink-0 flex gap-2">
                <button onClick={() => startEdit(n)} className="rounded-xl px-3 py-1 border text-sm hover:bg-gray-100 dark:hover:bg-gray-800">Edit</button>
                <button onClick={() => remove(n._id)} className="rounded-xl px-3 py-1 border text-sm hover:bg-gray-100 dark:hover:bg-gray-800">Delete</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
