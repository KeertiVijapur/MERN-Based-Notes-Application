import React from 'react';
import { MdOutlinePushPin, MdCreate, MdDelete } from 'react-icons/md';
import moment from 'moment';

const NoteCard = ({
  title,
  date,
  content,
  tags = [],  // default to empty array
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
}) => {
  return (
    <div className="border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out">
      <div className="flex items-center justify-between">
        <div>
          <h6 className="text-sm font-medium">{title}</h6>
          <span className="text-xs text-gray-500">
            {moment(date).format('Do MMM YYYY')}
          </span>
        </div>

        <MdOutlinePushPin
          className={`icon-btn cursor-pointer ${isPinned ? 'text-primary' : 'text-slate-300'}`}
          onClick={onPinNote}
          title={isPinned ? 'Unpin Note' : 'Pin Note'}
        />
      </div>

      <p className="text-xs text-slate-600 mt-2 line-clamp-2">
        {content}
      </p>

      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-gray-500 flex flex-wrap gap-1">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <span key={tag} className="bg-slate-100 px-1 rounded">
                {tag}
              </span>
            ))
          ) : (
            <span className="text-gray-400">No tags</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <MdCreate
            className="icon-btn cursor-pointer hover:text-green-600"
            onClick={onEdit}
            title="Edit Note"
          />
          <MdDelete
            className="icon-btn cursor-pointer hover:text-red-500"
            onClick={onDelete}
            title="Delete Note"
          />
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
