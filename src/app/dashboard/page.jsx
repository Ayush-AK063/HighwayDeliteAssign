'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch('/api/auth/dashboard');
      const data = await res.json();

      if (res.ok && data.user) {
        setUser(data.user);
        setNotes(data.notes || []);
      } else {
        router.push('/signin');
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/signin');
  };

  const handleCreateNote = () => {
    const newNote = `Note ${notes.length + 1}`;
    setNotes([...notes, newNote]);
  };

  const handleDeleteNote = (index) => {
    const updatedNotes = [...notes];
    updatedNotes.splice(index, 1);
    setNotes(updatedNotes);
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="min-h-screen flex justify-center items-start bg-white px-4 py-6">
      <div className="w-full sm:w-1/2 max-w-md">

        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 animate-spin border-2 border-blue-500 border-t-transparent rounded-full"></div>
            <h1 className="font-semibold">Dashboard</h1>
          </div>
          <button onClick={handleLogout} className="text-blue-600 text-sm hover:underline">
            Sign Out
          </button>
        </div>

        {/* Welcome Card */}
        <div className="bg-gray-50 p-4 rounded shadow mb-4">
          <h2 className="text-lg font-semibold">Welcome, {user?.name || 'User'} !</h2>
          <p className="text-gray-500 text-sm">Email: {user?.email || 'xxxxx@xxxx.com'}</p>
        </div>

        {/* Create Note Button */}
        <button
          onClick={handleCreateNote}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-4"
        >
          Create Note
        </button>

        {/* Notes List */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Notes</h3>
          <div className="space-y-2">
            {notes.map((note, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-100 p-3 rounded shadow"
              >
                <span>{note}</span>
                <button
                  onClick={() => handleDeleteNote(index)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
