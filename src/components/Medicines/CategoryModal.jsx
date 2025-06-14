import React, { useState } from 'react';
import Modal from './Modal';

export default function CategoryModal({ isOpen, onClose, onAdded }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/medicines/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category_name: name }),
      });
      if (res.ok) {
        const data = await res.json();
        onAdded(data);
        setName('');
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Category">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Category name"
          required
          className="w-full mb-4 px-3 py-2 border-gray-7w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-400"
        />
        <button
          type="submit"
          className="w-full bg-teal-700 text-white py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Category'}
        </button>
      </form>
    </Modal>
  );
}
