import React, { useState, useEffect } from 'react';
import TagInput from '../../components/input/TagInput';
import { MdClose } from 'react-icons/md';
import axiosInstance from '../../utils/axiosInstance';

const AddEditNotes = ({ noteData, type, getAllNotes, onClose, showToastMessage }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (type === 'edit' && noteData) {
      setTitle(noteData.title || '');
      setContent(noteData.content || '');
      setTags(noteData.tags || []);
    }
  }, [type, noteData]);

  const handleAddOrEditNote = async () => {
    if (!title.trim()) {
      setError('Please enter the title');
      return;
    }
    if (!content.trim()) {
      setError('Please enter the content');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const payload = {
        title: title.trim(),
        content: content.trim(),
        tags: tags || []
      };

      console.log('Sending payload:', payload);

      let response;
      if (type === 'edit') {
        const confirmed = window.confirm('Are you sure you want to update this note?');
        if (!confirmed) {
          setLoading(false);
          return;
        }
        response = await axiosInstance.put(`/edit-note/${noteData._id}`, payload);
      } else {
        response = await axiosInstance.post('/add-note', payload);
      }

      console.log('Received response:', response.data);

      if (response.data && !response.data.error) {
        showToastMessage(`Note ${type === 'edit' ? 'Updated' : 'Added'} Successfully`, 'success');
        getAllNotes();
        onClose();
      } else {
        setError(response.data.message || 'Operation failed');
        showToastMessage(response.data.message || 'Operation failed', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response) {
        setError(error.response.data.message || `Server error: ${error.response.status}`);
        showToastMessage(error.response.data.message || 'Server error', 'error');
      } else if (error.request) {
        setError('Network error. Please check your connection.');
        showToastMessage('Network error. Please check your connection.', 'error');
      } else {
        setError('An unexpected error occurred.');
        showToastMessage('An unexpected error occurred.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative p-4 bg-white rounded shadow w-full max-w-md mx-auto" aria-busy={loading}>
      <button
        className="absolute top-2 right-2 p-1 rounded hover:bg-slate-200"
        onClick={onClose}
        disabled={loading}
        aria-label="Close modal"
        title="Close"
      >
        <MdClose className="text-2xl text-slate-600" />
      </button>

      <h2 className="text-xl font-semibold mb-4">
        {type === 'edit' ? 'Edit Note' : 'Add New Note'}
      </h2>

      <div className="mb-3">
        <label className="block mb-1 text-sm font-medium text-slate-700">Title</label>
        <input
          type="text"
          className="w-full p-2 border rounded outline-none"
          placeholder="Enter note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="mb-3">
        <label className="block mb-1 text-sm font-medium text-slate-700">Content</label>
        <textarea
          className="w-full p-2 border rounded outline-none"
          placeholder="Enter note content"
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="mb-3">
        <label className="block mb-1 text-sm font-medium text-slate-700">Tags</label>
        <TagInput tags={tags} setTags={setTags} disabled={loading} />
      </div>

      {error && (
        <p className="text-red-500 text-sm mb-2">{error}</p>
      )}

      <button
        onClick={handleAddOrEditNote}
        disabled={loading}
        className={`w-full py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition ${
          loading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : type === 'edit' ? 'Update Note' : 'Add Note'}
      </button>
    </div>
  );
};

export default AddEditNotes;